import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useContext, useEffect} from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import api from "../api/api";
import jwtDecode from "jwt-decode"

import { AuthContext } from "./context/context";

const Logout = () => {
  const {resetInputValue, globalSearch} = useContext(AuthContext)
  
  const navigation = useNavigation();
  const handleLogout = async() => {
    resetInputValue()
    globalSearch("")
    AsyncStorage.removeItem("token");
    const user_name = await AsyncStorage.getItem("name");
    const email = await AsyncStorage.getItem("email");
    api.get(`/proyect/logout?email=${email}`)
    await AsyncStorage.removeItem("name");
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("doc_empleado");
    navigation.navigate("Login");
  };

  //! se mantiene activa auqneu el token expire, al recargar ya no deja ingresar
  useEffect(() => {
    const checkTokenExpiration = async () => {
      const token = await AsyncStorage.getItem("token");
      const decodedToken = await jwtDecode(token)
      const currentTimestamp = Date.now();
      
      console.log(decodedToken.exp*1000, currentTimestamp)
      if (decodedToken.exp && currentTimestamp >= Number(decodedToken.exp*1000)) {
        console.log("se va a cerrar!!!!!!!!")
        handleLogout();
      }
    };

    checkTokenExpiration();
  }, []);

  //! la aplicacion se verifica cada cierto tiempo y se cierra
  // useEffect(() => {
  //   const checkTokenExpiration = async () => {
  //     const token = await AsyncStorage.getItem("token");
  //     const decodedToken = await jwtDecode(token);
  //     const currentTimestamp = Date.now();
  //     if (decodedToken.exp && currentTimestamp >= Number(decodedToken.exp * 1000)) {
  //       handleLogout();
  //     }
  //   };
  //   checkTokenExpiration();
  //   const intervalId = setInterval(checkTokenExpiration, 60000);
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  return (
    <TouchableOpacity onPress={handleLogout}>
      <Icon name="sign-out" size={40} color="black" style={styles.icon} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  icon: {
    marginRight: 10,
  },
});

export default Logout;

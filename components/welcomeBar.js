import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import logoCompleto from "./images/logo_creame.png"


import Logout from './logout';

const WelcomeBar = () => {
    const [info, setInfo] = useState({
        name : "Usuario",
        email: "Email"
    })

    useEffect(() => {
        const fetchToken = async () => {
          const name = await AsyncStorage.getItem("name")
          const email = await AsyncStorage.getItem("email")
          setInfo({
            name,
            email
          })
        };
      
        fetchToken();
      }, []);
      

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
              <Image source={logoCompleto} style={{ height: 45, width: 150}}></Image>
              <View style={styles.userinfo}>
                <Text style={styles.text} numberOfLines={2}>{info.name}</Text>
              </View>
              <Logout/>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: 'space-between',
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center"
    },
    userinfo: {
      textAlign: "left",
      width: "45%"
    },
    text: {
      fontSize: 14,
      fontWeight: 'bold',
      lineHeight: 20,
    },
    icon: {
      marginRight: 10,
    },
  });

export default WelcomeBar
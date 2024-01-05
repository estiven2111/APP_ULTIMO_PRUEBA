import React from "react";
import { ScrollView, View, StyleSheet, Text, Image } from "react-native";
import Constants from "expo-constants";
import Checklist from "./CheckList";
import SearchBar from "../../searchBar";
import LogoSync from "../../images/logo_syncroniza.png"

const Actividades = () => {
  return (
    <View style={styles.container}>
      <SearchBar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Checklist />
      </ScrollView>
      <View  style={styles.footer2}>
        <Text style={{fontSize:14}}>Powered by: </Text>
        <Image source={LogoSync} style={{ height: 30, width:80}} resizeMode="contain"/>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
  },
  footer2: {
    paddingRight: 5,
    flexDirection: "row",
    alignItems: "center",
    bottom: 0,
    backgroundColor: "white",
    width: "100%",
    justifyContent: "flex-end",
  }

});
export default Actividades;

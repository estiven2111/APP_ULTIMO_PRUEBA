// import React, { useRef } from 'react';
// import { WebView } from 'react-native-webview';
import axios from "axios";

import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import api from "../../../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sendOnedriveOcr from "../Onedrive/OcrOnedrive";

const MicrosoftLogin = ({ fillData,update }) => {
  const [res, setRes] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const webViewRef = useRef(null); // Add this line to create the webViewRef
  const [texto, setTexto] = useState("");
  const [ban, setBan] = useState(false);
  const [token, setToken] = useState(false);


useEffect(()=>{
 const execute = async () =>{
      // https://syncronizabackup-production.up.railway.app
        // https://appsyncroniza-production.up.railway.app
  const auth = await axios.get("https://syncronizabackup-production.up.railway.app/user/api/callback")
  let resp = auth.data.token
  if(resp===true){
    setToken(resp)
  }
 }
 console.log("useeffect")
 execute()
},[])


let funcionEjecutada = false;
const handleNavigationStateChange = async(navState) => {
   const currentUrl = navState.url;
   console.log("URL actual:", currentUrl);
  //  console.log("URL:", url);
  
    try {
        // https://syncronizabackup-production.up.railway.app
        // https://appsyncroniza-production.up.railway.app
       const response = await axios.get("https://syncronizabackup-production.up.railway.app/user/api/callback")
   if (response.data.token === true){
    funcionEjecutada = funcionEjecutada || update()
      closePopup()
      return
   }
    } catch (error) {
     console.log(error)
    }
  

}
  const openPopup = () => {
    setModalVisible(true);
    
  };

  const closePopup = () => {
    setModalVisible(false);
  };


  return (
    <View>
      <TouchableOpacity
        style={[
          styles.sendButton,
          !fillData ? { borderColor: "rgb(0,255,255)", borderWidth: 2 } : null,
        ]}
        onPress={openPopup}
        disabled={fillData}
      >
        <Text style={styles.text}>Autenticar</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={closePopup}
      >
        <WebView
          ref={webViewRef}
               // https://syncronizabackup-production.up.railway.app
        // https://appsyncroniza-production.up.railway.app
          source={{ uri: 'https://syncronizabackup-production.up.railway.app/user/api/callback' }}
         
          onNavigationStateChange={handleNavigationStateChange}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("Error cargando la página:", nativeEvent);
          }}
          style={styles.webView}
          originWhitelist={["*"]}
          javaScriptEnabled={true}
            domStorageEnabled={true}
            userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
         />
        <Text>{texto}</Text>
        <TouchableOpacity onPress={closePopup} style={styles.emergente}>
          <Text style={styles.textEmergente}>Cerrar ventana</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%", // Porcentaje del ancho de la pantalla
    height: 200, // Valor absoluto en píxeles
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  webView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  sendButton: {
    padding: 8,
    height: 40,
    margin: 10,
    backgroundColor: "rgb(15, 70, 125)",
    borderRadius: 8,
    alignItems: "center",
  },
  emergente: {
    padding: 8,
    height: 40,
    margin: 10,
    backgroundColor: "rgb(15, 70, 125)",
    borderRadius: 8,
  },
  textEmergente: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  text: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 15
  }
});

export default MicrosoftLogin;

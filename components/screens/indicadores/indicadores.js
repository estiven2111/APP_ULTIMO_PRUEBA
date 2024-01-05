import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Constants from "expo-constants";
import SearchBar from '../../searchBar';
import PieComp from './pie';
import RangeDatePicker from './datePicker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoSync from "../../images/logo_syncroniza.png"

const Indicadores = () => {
  const [name, setName] = useState("")
  useEffect(() => {
    const getName = async () => {
      const fullname = await AsyncStorage.getItem("name")
      setName(fullname)
      console.log("hola", name)
    };
    getName();
  },[])
  const [showGraph, setShowGraph,] = useState(false);

  const showGraphHandler = ()=> {
    setShowGraph(true)
    console.log(data.activity)
  }

  const [data, setData] = useState({
    hDisp : "",
    hProg : "",
    hCump : "",
    hFrec : "",
  })

  const handleOnChange = (text, name) => {
    setData({
    ...data,
    [name]: text
    });
  };
  const aTiempo = ((data.hCump/data.hProg)*58.064516).toFixed(1)
  const cRetraso = ((data.hCump/data.hProg)*(100-58.064516)).toFixed(1)
  const pFrec = ((data.hFrec/data.hProg)*100).toFixed(1)

  const calculoActividad = () => {

    ((parseInt(data.hCump) + parseInt(data.hFrec)) / parseInt(data.hProg) * 100).toFixed(1)
    
  }

    return (
      <View style={styles.container}>
        <SearchBar/>
        <ScrollView style={styles.scroll}>
          <RangeDatePicker/>
          <View style={styles.inputCont}>
            <Text style={styles.label}>Horas Disp.:</Text>
            <TextInput style={styles.input} value={data.hDisp} onChangeText={text => handleOnChange(text, "hDisp")} placeholder="Horas" keyboardType='numeric'/>
            <Text style={styles.label}>Horas Cumplidas:</Text>
            <TextInput style={styles.input} value={data.hCump} onChangeText={text => handleOnChange(text, "hCump")} placeholder="Horas" keyboardType='numeric'/>
          </View>
          <View style={styles.inputCont}>
            <Text style={styles.label}>Horas Prog.:</Text>
            <TextInput style={styles.input} value={data.hProg} onChangeText={text => handleOnChange(text, "hProg")} placeholder="Horas" keyboardType='numeric'/>
            <Text style={styles.label}>Horas Frecuencia:</Text>
            <TextInput style={styles.input} value={data.hFrec} onChangeText={text => handleOnChange(text, "hFrec")} placeholder="Horas" keyboardType='numeric'/>
          </View>
          <View style={styles.inputCont}>
            <Text style={styles.label2}>NIVEL DE ACTIVIDAD(%):</Text>
            <TextInput style={styles.input} value={data.hProg&&data.hFrec&&data.hCump?((parseInt(data.hCump) + parseInt(data.hFrec)) / parseInt(data.hProg) * 100).toFixed(1):""} onChangeText={text => handleOnChange(text, "activity")} placeholder="%" />
          </View>
          <View style={styles.grafico}>
            <View>
              {data.hDisp && data.hCump && data.hFrec && data.hProg && !showGraph
              ? (<TouchableOpacity style={styles.button}>
                  <Text onPress={showGraphHandler} style={styles.text}>
                    MOSTRAR GRAFICA
                  </Text>
                </TouchableOpacity>) 
              : null}
            </View>
            {showGraph
            ?
            <>
              <View>
                <Text style={styles.name}>
                  {name}
                </Text>
              </View>
              <PieComp aTiempo={parseFloat(aTiempo)} cRetraso={parseFloat(cRetraso)} pFrec={parseFloat(pFrec)}/> 
            </>
            : null}
          </View>
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
      flexGrow: 1,
      flex: 1,
    },
    scroll: {
      padding: 10,
    },
    inputBar: {
        paddingHorizontal: 10,
        backgroundColor: 'lightblue',
        borderRadius: 10,
        marginVertical: 5,
        height: 40
      },
    inputCont: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 5,
      marginTop: 5
    },
    label: {
      width: 85,
      marginRight: 5,
      fontWeight: 'bold',
    },
    input: {
      flex: 1,
      paddingHorizontal: 5,
      backgroundColor: 'lightblue',
      borderRadius: 10,
      marginRight: 5,
      paddingVertical: 5,
    },
    label2: {
      width: 170,
      marginRight: 5,
      fontWeight: 'bold',
    },
    grafico: {
      height: 250,
      width: '90%',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "rgb(15, 70, 125)",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    },
    text: {
      color: "white"
    },
    name: {
      paddingTop: 60,
      fontWeight: "bold",
      textDecorationLine: "underline",
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
  
  export default Indicadores;
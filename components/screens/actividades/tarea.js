import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, Animated, Easing} from "react-native";
import { CheckBox } from "react-native-elements";
import Time from "./time";
import Entregables from "./entregables";
import Camera from "./camera";
import api from "../../../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "../../images/logo.png";

const Tarea = (props) => {
  const [checked, setChecked] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false)
  const [isTotalTime, setIsTotalTime] = useState("")
  const [finished, setFinished] = useState (false)
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      setFinished(false)
  },[props.proyecto])
  
  const handleCheckboxToggle = () => {
    //! faltaria definir una funcion de determine que se va a hacer cuando el check se marque
    setConfirmModal(true)
  };
  const postInfo =
  {
    proyect : props.proyecto,
    component : props.componente,
    activity : props.actividad,
    SKU_Proyecto : props.skuP,
    NitCliente : props.nitCliente,
    DocumentoEmpleado : props.documentoEmpleado,
    idNodoProyecto : props.idNodoProyecto,
    idNodoActividad : props.idNodoActividad,
    Cod_Parte : props.Cod_Parte
  }
  const confirmChecked = async() => {
    setIsLoading(true)
    const formatDate = new Date().toISOString().split("T")[0];
    const name = await AsyncStorage.getItem("name")
    const email = await AsyncStorage.getItem("email")
    const response = await api.put("/proyect/update", {
      idNodoProyecto : props.idNodoActividad,
      SKU_Proyecto : props.skuP,
      finished:1,
    });
    await api.put("/proyect/updateProyect", {
      email : email,
      doc_id : props.documentoEmpleado
    });
    setConfirmModal(false); 
    setChecked(true); 
    setFinished(true)
    props.finishedUpdate(true)
    setIsLoading(false)
    Alert.alert("Se completó la tarea")
  }

  useEffect(() => {
    if (isLoading) {
      const spinAnimation = Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      });

      Animated.loop(spinAnimation).start();
    } else {
      spinValue.setValue(0);
    }
  }, [isLoading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const [uri, setUri] = useState("")
  const [numberOfLines, setNumberOfLines] = useState(true);
  const handlePress = () => {
      setNumberOfLines(!numberOfLines);
  };

  return (
    // <View style={finished?styles.disabledContainer:styles.container}>
    <View style={styles.container}>
      <View style={styles.pruebas}>
        <TouchableOpacity onPress={handlePress}>
          <Text ellipsizeMode="tail" numberOfLines={numberOfLines?2:10} style={props.entregable} >{props.actividad}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconsCont}>
        <CheckBox
          checked={checked}
          containerStyle={styles.checkBoxContainer}
          checkedColor="black"
          uncheckedColor="black"
          onPress={() => {
            if (!isNaN(isTotalTime)) {
              handleCheckboxToggle();
            }
          }}
        />
        <Modal visible={confirmModal} transparent={true} >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.text}>Después de confirmar, la actividad ya no estará disponible en su dispositivo. ¿Está seguro de haber enviado todos los elementos requeridos?</Text>
              <View style={styles.botones}>
                <TouchableOpacity style={styles.boton} onPress={confirmChecked}>
                  <Text>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boton} onPress={()=>{setConfirmModal(false)}}>
                  <Text>Cancelar</Text>
                </TouchableOpacity>
              </View>
              {isLoading? (
                        <View style={styles.modalLoading}>
                            <Animated.Image
                                source={logo}
                                style={{
                                position: "absolute",
                                marginLeft: 100,
                                marginTop: 40,
                                width: 100,
                                height: 100,
                                transform: [{ rotate: spin }],
                                }}
                            />
                        </View>
                    ) : null}
            </View>
          </View>
        </Modal>

        <Time entrega={props.entregable} postInfo={postInfo} isTime={setIsTotalTime} setChecked={setChecked}/>
        <Entregables entrega={props.entregable} lista={props.listaEntregable} uri={uri} setUri={setUri} SKU_Proyecto={props.skuP} nitCliente={props.nitCliente} idNodoProyecto={props.idNodoProyecto} DocumentoEmpleado={props.documentoEmpleado} Codi_parteA={props.Cod_Parte} finishedUpdate={props.finishedUpdate}/>
        <Camera entrega={props.entregable} setUri={setUri}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  disabledContainer: {
    display: "none"
  },
  pruebas: {
    width : "50%"

  },
  iconsCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%"
  },
  modalContainer: {
    flex:1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 270,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(15, 70, 125)",
    borderRadius: 10,
    padding: 12
  },
  text: {
    textAlign: "left",
    fontSize: 16,
    color: "white"
  },
  botones: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 190,
    margin: 14
  },
  boton: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 7,

  },
  checkBoxContainer: {
    padding: 0,
    margin: 0
  },
  modalLoading: {
    backgroundColor: "rgba(225, 225, 225 ,0.5)",
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: "100%",
    borderRadius: 10,
    position: 'absolute'
  },
});

export default Tarea;

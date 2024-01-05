import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Overlay } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import api from "../../../api/api";
import { TimeInput } from "../../../utils/inputControl";

const Time = ({ entrega, postInfo, isTime, setChecked}) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const updateStartTime = (value) => {
    setStartTime(value);
  };
  const updateEndTime = (value) => {
    setEndTime(value);
  };
  const [manualDuration, setManualDuration] = useState(false);
  const [newDuration, setNewDuration] = useState("");
  const [editedTime, setEditedTime] = useState(false)
  const handleNewDuration = (value) => {
    console.log("value: " , value)
    const numericValue = value.replace(/[^0-9]/g, '');
    console.log("numericvalue: " , numericValue)
    let formattedValue = '';
    if (numericValue.length > 0) {
      formattedValue = numericValue.replace(/(\d{2})(\d{0,2})/, '$1:$2');
      console.log("soy el formatedValue", formattedValue);
    }
    const isValidTime = /^([0-1][0-9]|2[0-3])(?::([0-5][0-9]?){0,2})?$/.test(formattedValue);
    console.log("isvalidtime: " , isValidTime)
    if (formattedValue.length>2) {
      console.log("correcto!!!!!!")
      setNewDuration(isValidTime ? formattedValue : null);
    } else {
      console.log("incorrecto!!!!!!")
      setNewDuration(formattedValue)
    }
  };

  const getDuration = () => {
    if (startTime.length===5 && endTime.length===5) {
        const start = startTime.split(":")
        const startMinutes = (parseInt(start[0])*60) + parseInt(start[1])

        const end = endTime.split(":")
        const endMinutes = (parseInt(end[0])*60 )+ parseInt(end[1])
        let totalMinutes = 0
        if (endMinutes >= startMinutes) {
            totalMinutes = endMinutes - startMinutes
        } else {
            totalMinutes = (24*60)+(endMinutes - startMinutes)
        }
        const duration = `${Math.floor(totalMinutes/60)<10 ? "0" + Math.floor(totalMinutes/60) : Math.floor(totalMinutes/60)}:${totalMinutes%60<10 ? "0" + totalMinutes%60 : totalMinutes%60}`
        return duration
    } else {
      return ""
    }
  }

  const [errorModal, setErrorModal] = useState(false);
  const toggleOverlay = () => {
    setErrorModal(!errorModal);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    if (startTime.length === 0 && endTime.length === 0) {
      if (editedTime) {
        sendInfoDB()
        setNewDuration("")
        setModalVisible(false)
        setEditedTime(false)
        return
      } else {

        return setModalVisible(false);
      }
    }
    if (startTime.length === 5 && endTime.length === 5) {
      sendInfoDB();
      updateStartTime("");
      updateEndTime("");
      setModalVisible(false);
    } else {
      toggleOverlay();
    }
  };

  const [date, setDate] = useState("");
  useEffect(() => {
    const getDate = () => {
      const currentDate = new Date();
      const formatDate = currentDate.toISOString().split("T")[0].split("-").join("");
      setDate(formatDate);
    };
    getDate();
  }, []);

  const [totalTime, setTotalTime] = useState("");

  useEffect(() => {
    const solicitud = async () => {
      try {
        const response = await api.get(`/proyect/hours?idNodoActividad=${postInfo.idNodoActividad}&idNodoProyecto=${postInfo.idNodoProyecto}`);
        console.log(postInfo.idNodoActividad, postInfo.idNodoProyecto);
        console.log("respuesta", response.data);
        setTotalTime(response.data)
        isTime(response.data)
        setChecked(false)
      } catch (error) {
        console.error("No se envio la informacion correctamente", error);
      }
    };
    solicitud();
  }, [postInfo.idNodoActividad, postInfo.idNodoProyecto]);
  
  
  const sendInfoDB = async () => {
    try {
      console.log("estas en la duracion manuel", newDuration.split(":").join("."))
      console.log("estas en la duracion automatica", getDuration().split(":").join("."))
      console.log({...postInfo,
        FechaRegistro : date,
        FechaInicio : `${date} ${startTime?(startTime+":00"):"00:00:00"}`,
        FechaFinal : `${date} ${startTime?(endTime+":00"):"00:00:00"}`,
        DuracionHoras : editedTime?newDuration.split(":").join("."):getDuration().split(":").join("."),
        finished:false})
      const response = await api.post("/proyect/hours", {
        ...postInfo,
        FechaRegistro : date,
        FechaInicio : `${date} ${startTime?(startTime+":00"):"00:00:00"}`,
        FechaFinal : `${date} ${startTime?(endTime+":00"):"00:00:00"}`,
        DuracionHoras : editedTime?newDuration.split(":").join("."):getDuration().split(":").join("."),
        // inicio : startTime?startTime.split(":").join("."):"00.00",
        // fin : endTime?endTime.split(":").join("."):"00.00",
        // HParcial : editedTime?newDuration.split(":").join("."):getDuration().split(":").join("."),
        finished:false
      });
      console.log("esta es la respuesta", response.data.horaTotal)
      isTime(response.data.horaTotal)
      setTotalTime(response.data.horaTotal);
    } catch (error) {
      console.error("No se envio la informacion correctamente", error);
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={entrega ? styles.button : styles.disable}
        onPress={openModal}
      >
        <Text>{!isNaN(totalTime) ? totalTime : "00:00"}</Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        visible={modalVisible}
        onRequestClose={closeModal}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.text}>Fecha: {date}</Text>
            <View style={styles.hour}>
              <Text style={styles.text}>Hora inicio:</Text>
              <TimeInput value={startTime} onChange={updateStartTime} />
            </View>
            <View style={styles.hour}>
              <Text style={styles.text}>Hora final:</Text>
              <TimeInput value={endTime} onChange={updateEndTime} />
            </View>
            {manualDuration
              ?
              <View style={styles.duration}>
                <Text style={styles.text}>Duracion:</Text>
                <TextInput style={styles.manualDuration} keyboardType="numeric" maxLength={5} placeholder="00:00" value={newDuration} onChangeText={handleNewDuration}></TextInput>
                <TouchableOpacity style={styles.icon} onPress={()=>{setEditedTime(true); setManualDuration(false)}}>
                  <Icon name="check" size={15} color="#fff"/>
                </TouchableOpacity>
              </View>
              :
              <View style={styles.duration}>
              <Text style={styles.text}>Duracion:</Text>
              {editedTime
              ?
              <Text style={styles.textDuration}>{newDuration}</Text>
              :
              <Text style={styles.textDuration}>{getDuration() !== "" ?getDuration(): "00:00"}</Text>
              }
              <TouchableOpacity style={styles.icon} onPress={()=>setManualDuration(true)}>
                <Icon name="pencil" size={15} color="#fff"/>
              </TouchableOpacity>
            </View>
            }
            <Text style={styles.text}>Tiempo Total: {!isNaN(totalTime) ? totalTime : "00:00"}</Text>
            <TouchableOpacity onPress={closeModal} style={styles.aceptar} disabled={manualDuration?true:false}>
              <Text style={styles.textAcept}>Aceptar</Text>
            </TouchableOpacity>
            <Overlay
              isVisible={errorModal}
              onBackdropPress={toggleOverlay}
              overlayStyle={styles.modal}
            >
              <Text style={styles.errorMesage}>Formato no válido</Text>
            </Overlay>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "lightblue",
    padding: 5,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
  },
  disable: {
    backgroundColor: "lightblue",
    padding: 5,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
  },
  duration: {
    flexDirection: "row",
    margin: 8,
  },
  manualDuration: {
    width:70,
    marginHorizontal: 5,
    backgroundColor: "white",
    borderRadius: 5,
    textAlign: "center",
  },
  textDuration: {
    width:70,
    marginHorizontal: 5,
    borderRadius: 5,
    textAlign: "center",
    backgroundColor: "white",
    color: "black",
    padding: 4
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente para el modal
  },
  modalContent: {
    backgroundColor: "rgb(15, 70, 125)",
    justifyContent: "center",
    alignItems: "center",
    width: 220,
    padding: 10,
    borderRadius: 10,
  },
  hour: {
    flexDirection: "row",
    padding: 5,
    justifyContent: "space-between",
    width: 190,
  },
  text: {
    color: "white",
    paddingVertical: 4,
    fontSize: 14,
  },
  modal: {
    width: 250,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
  },
  aceptar: {
    margin: 5,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 5
  },
  textAcept: {
    color: "black",
  },
  errorMesage: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    padding: 4
  }
});

export default Time;

import React, {useEffect, useState, useRef} from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Animated, Easing, Alert } from "react-native";
import FilePickerButton from './filePicker';
import api from '../../../api/api';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MicrosoftLogin from './MicrosoftLogin';
import logo from "../../images/logo.png";

const Entregables = (props) => {
    const [token, setToken] = useState(false);
    const [info, setInfo] = useState({})
    const spinValue = useRef(new Animated.Value(0)).current;
    const [isLoading, setIsLoading] = useState(false);
    const [updates, setUpdates] = useState(false);
    const handlerInfo = (value) => {
        setInfo({
            ...info,
            ...value
        })
        console.log("handlerinfo", info)
    }
    const deleteInfo = (value) => {
        delete info[value]
        console.log("deleteInfo", info)
    }
   
    const update = () =>{
        setUpdates(!updates)
    }

    const [modalVisible, setModalVisible] = useState(false);
    const openModal = () => {
      setModalVisible(true);
      setInfo({})
    };
    const closeModal = () => {
        setInfo({})
        props.setUri("")
        setModalVisible(false);
    };

    const sendInfoToBack = async () => {
        try {
            setIsLoading(true)
            console.log("Sending info", info);
            const user_name = await AsyncStorage.getItem("name");
            const email = await AsyncStorage.getItem("email");
            const formatDate = new Date().toISOString().split("T")
            const finalDate = `${formatDate[0]} ${formatDate[1].split(".")[0]}`
            const ActualizarEntregable = {
                SKU_Proyecto : props.SKU_Proyecto,
                nitCliente : props.nitCliente,
                idNodoProyecto : props.idNodoProyecto,
                DocumentoEmpleado : props.DocumentoEmpleado,
                Fecha : finalDate,
                idProceso : props.Codi_parteA
            }
            console.log("aquiuiii!!!!", ActualizarEntregable)
            
            const formData = new FormData();
            formData.append("tipo","entregable")
            formData.append("user",user_name);
            formData.append("ActualizarEntregable", JSON.stringify(ActualizarEntregable));
            console.log("Actualiar entregable front", ActualizarEntregable)
            const currentDate = (new Date()).getTime();
            console.log("actual date!!!!", finalDate)
            console.log("esta es la info", info)
            Object.entries(info).forEach(([key, value]) => {
                const extension = value.uri.split(".").pop().toLowerCase();
                console.log("extension", extension)
                const contentTypeMap = {
                    pdf: 'application/pdf',
                    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    png: 'image/png',
                    jpg: 'image/jpeg',
                    jpeg: 'image/jpeg',
                    txt: 'text/plain',
                  };
                const type =  contentTypeMap[extension] || 'application/octet-stream';
                const formatKey = key.split(" ").join("_")
                console.log("formatKey", formatKey)
                
                const name = `${formatKey}${currentDate}.${extension}`
                
                formData.append(key, {
                    uri: value.uri,
                    type: type, // Ajusta el tipo de imagen según corresponda
                    name: `${value.Numero}-${name}`,
                });            });
            console.log("antes peticion", formData);
            // console.log("parts formdats antes", formData._parts[2][1])
            // const response = await axios.post('http://localhost:5000/user/api/proyect/ocr', formData);
            const auth = await axios.get(
                "https://syncronizabackup-production.up.railway.app/user/api/callback"
              );
              console.log("object", auth.data.token);
              const resp = auth.data.token;
              if (resp === true) {
                formData.append("token", auth.data.tokenSecret);
                  const response = await api.post(
                    "/dashboard",
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  );
              } else {
                console.log("no se loggueo")
              }
              
            // const response = await api.post('/dashboard', formData, {
            //     headers: {
            //       'Content-Type': 'multipart/form-data'
            //     }
            //   });
              console.log("despues peticion")
            // const data = await response.json();
            // console.log(response.data); // Aquí puedes hacer algo con la respuesta del servidor si lo deseas
            console.log("parts formdats", formData._parts[2][1])
            //! aqui se actualiza el proyecto junto con props.finishedUpdate(true)
            // await api.put("/proyect/updateProyect", {
            //     email : email,
            //     doc_id : props.DocumentoEmpleado
            //   });
            setInfo({})
            setModalVisible(false);
            setIsLoading(false)
            Alert.alert("Envío de archivos completado")
            // props.finishedUpdate(true)
          } catch (error) {
            console.log('Error al enviar el objeto:', error);
          }
    //    const tam = Object.keys(info).length
    //     if (tam === 0) {
    //         setModalVisible(false);
    //     }
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

    useEffect(() => {
        const execute = async () => {
            // https://syncronizabackup-production.up.railway.app
            // https://appsyncroniza-production.up.railway.app
          const auth = await axios.get(
            "https://syncronizabackup-production.up.railway.app/user/api/callback"
          );
          console.log("object", auth.data.token);
          const resp = auth.data.token;
          if (resp === true) {
            setToken(resp);
          }
        };
        execute();
      }, [updates]);

    //   const sendInfoToBack1 = async () => {
    //     const response = await api.post(
    //         "/dashboard",
    //         // formData,
    //         {
    //             nombre : "miguel"
    //         },
    //         {
    //           headers: {
    //             "Content-Type": "multipart/form-data",
    //           },
    //         }
    //       );
    //       console.log(response.data)
    //   }
    const [newList, setNewList] = useState([])
    useEffect(() => {
        const createList = async () => {
          const formattedList = await Promise.all(
            props.lista.map(async (entregable) => {
              const response = await api.get(`/proyect/entregables?SKU_Proyecto=${props.SKU_Proyecto}&NitCliente=${props.nitCliente}&idNodoProyecto=${props.idNodoProyecto}&NumeroEntregable=${entregable.Numero}&idProceso=${entregable.id_proceso}`);
              console.log("esta es la lista", entregable);
              console.log(response.data);
              return { ...entregable, subido: response.data };
            })
          );
          
          console.log("aqui esta la nueva lista", formattedList);
          setNewList(formattedList);
        };
      
        createList();
      }, [props.lista, props.SKU_Proyecto, props.nitCliente, props.idNodoProyecto, modalVisible]);

    return (
        <View>
        <TouchableOpacity style={props.entrega?styles.button:styles.disable} disabled={props.entrega?false:true} onPress={openModal}>
            <Text>...</Text>
        </TouchableOpacity>
        <Modal animationType= "fade" visible={modalVisible} onRequestClose={closeModal} transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>ENTREGABLES A ENVIAR:</Text>
                    {newList.map((ent, index) => {
                        console.log("subido", ent.Numero)
                        return(
                            <View style={styles.entregables} key={index}>
                                
                                <FilePickerButton ent={ent.Nom_Entregable} numero={ent.Numero} justUploaded={ent.subido} handlerInfo={handlerInfo} deleteInfo={deleteInfo}/>
                            </View>
                        )
                    })}
                    {props.uri
                    ? <View style={styles.entregables}>
                        <FilePickerButton 
                            ent={"DOCUMENTO ADICIONAL"} 
                            upLoaded={props.uri} 
                            setUri={props.setUri} 
                            handlerInfo={handlerInfo} 
                            deleteInfo={deleteInfo}/>
                        </View>
                    : null
                    }
                   
            {!token ? (
            <View style={styles.buttonContainer}>
                <View style={styles.button2}>
                    <MicrosoftLogin
                    update={update}
                    />
                </View>
                <TouchableOpacity onPress={closeModal}  style={styles.button2}>
                    <Text  style={styles.textButton}>Cancelar</Text>
                </TouchableOpacity>
            </View>
            ) : (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={sendInfoToBack} style={styles.button2}>
                        <Text style={styles.textButton}>Enviar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closeModal}  style={styles.button2}>
                        <Text  style={styles.textButton}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            )}   
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
    </View>
    )
}
const styles = StyleSheet.create({
    title: {
        color: "white"
    },
    button: {
        backgroundColor: "lightblue",
        padding: 5,
        height: 30,
        borderRadius: 8,
        justifyContent: "center"
    },
    disable: {
        backgroundColor: "rgba(108, 108, 110, 0.393)",
        padding: 5,
        height: 30,
        borderRadius: 8,
        justifyContent: "center"
    },
    entregables : {
        flexDirection: "row",
    },
    charged: {
        backgroundColor: "green",
        width: 150,
        margin: 1,
        borderRadius: 5,
        fontSize:11,
        paddingHorizontal:3
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        backgroundColor: "rgb(15, 70, 125)",
        justifyContent: "center",
        alignItems: "center",
        width: 300,
        padding: 10,
        borderRadius: 10,
    },
    modalLoading: {
        backgroundColor: "rgba(225, 225, 225 ,0.5)",
        justifyContent: "center",
        alignItems: "center",
        width: 300,
        height: "100%",
        borderRadius: 10,
        position: 'absolute'
    },
    hour: {
        flexDirection: "row",
        padding: 5
    },
    buttonContainer: {
        width: "60%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 5
    },
    button2: {
        display: "flex",
        backgroundColor: "white",
        padding: 5,
        height: 30,
        borderRadius: 8,
        justifyContent: "center",
        width: "48%",
        justifyContent: "center",
    },
    textButton: {
        textAlign: "center"
    }
});

export default Entregables


import React, { useState, useEffect, useRef, useContext } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Image,
  Animated,
  Easing,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import SearchBar from "../../searchBar";
import callGoogleVisionAsync from "./helperFunction";
import UseCameraOCR from "../../../utils/useCamOCR";
import Camera from "../actividades/camera";
import ImagePickerComponent from "./imagePicker";
import api from "../../../api/api";
import Icon from "react-native-vector-icons/FontAwesome";
import MicrosoftLogin from "./MicrosoftLogin";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import logo from "../../images/logo.png";
import LogoSync from "../../images/logo_syncroniza.png"
// import { authorize } from 'react-native-app-auth';
// import Geolocation from 'react-native-geolocation-service';
// import { request, PERMISSIONS } from 'react-native-permissions';
import * as Location from "expo-location";
import { AuthContext } from '../../context/context';

// import { response } from '../../../../api/src/app';
const Gastos = () => {
  const {infoProject, anticipos, inputValue, todosAnticipos} = useContext(AuthContext)
  console.log("aqui!!!!!!!!!!!!!!!!!!!!11 infoproject", infoProject)

  const spinValue = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(false);
  const [updates, setUpdates] = useState(false);
  const [prepayment, setPrepayment] =useState("")


  const webViewRef = useRef(null);

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
  const update = () =>{
    setUpdates(!updates)
}

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const [openCamera, setOpenCamera] = useState(false);
  const openCam = () => {
    setOpenCamera(true);
  };
  const closeCam = () => {
    setOpenCamera(false);
  };
  const [res, setRes] = useState("");
  const [toScan, setToScan] = useState("");
  const newPhoto = (value) => {
    setToScan(value);
  };

  //! este estado se debe cambiar por los parametros de cada input
  const [fillData, setFillData] = useState(false);
  const [responsedata, setResponsedata] = useState({
    nit: "",
    numFact: "",
    doc: "",
    total: "",
    totalSinIva: "",
    nombre: "",
    rete: "",
    retePorc: 4,
    iva: "",
    ivaPorc: 19,
    fecha: "",
    concepto: "",
    municipio: "",
    codepostal: "",
    ipc: "",
  });
  const [token, setToken] = useState(false);

  const handlerScan = async () => {
    try {
      // Solicitar permiso para acceder a la ubicación del dispositivo
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permiso de ubicación denegado");
            Alert.alert(
          "Aviso",
          "Si no otorga permiso a la aplicacion el campo de codigo postal y municipio lo debe llenar manualmente.",
          [
            {
              text: 'aceptar',
              onPress: () => {
                console.log('Botón OK presionado');
                setIsLoading(true);
                realizarPeticion(0,0);
                return
              }
            }
          ]
        );
        return;
      }

      // Obtener la ubicación actual del dispositivo

      console.log("loadingggggg");
      const location = await Location.getCurrentPositionAsync({});
      console.log("loadin111");
      // Extraer las coordenadas (latitud y longitud) de la ubicación
      const { latitude, longitude } = location.coords;
      console.log("loadin2222");
      //   setFillData(true)
      setIsLoading(true);
      realizarPeticion(latitude,longitude)


    } catch (error) {
      console.log("error", error);
    }
  };

  const realizarPeticion = async(latitude,longitude) =>{
    const formData = new FormData();
    formData.append("imagen", {
      uri: toScan,
      type: "image/jpeg",
      name: "nombre_de_la_imagen.jpg",
    });
    console.log(latitude, longitude);
    formData.append("latitud", latitude);
    formData.append("longitud", longitude);
    const response = await api.post(`/proyect/ocr`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    let municipio = ""
    let codepostal = ""
    if (response.data.codepostal === undefined || response.data.codepostal === undefined ) {
      municipio = ""
      codepostal = ""
    }else{
      municipio = response.data.municipio
      codepostal = response.data.codepostal
    }
    setResponsedata({
      ...responsedata,
      nit: response.data.nit,
      numFact: response.data.numFact,
      doc: response.data.doc,
      total: response.data.total,
      nombre: response.data.nombre,
      iva: response.data.iva,
      rete: response.data.rete,
      fecha: response.data.fecha,
      concepto: response.data.concepto,
      municipio ,
      codepostal,
    });
    console.log("hola", responsedata);
    setFillData(true);
    setIsLoading(false);
   }


  const handleOnChange = (text, name) => {
    setResponsedata({
      ...responsedata,
      [name]: text,
    });
    console.log("on change", responsedata);
  };

  const handlerCancel = () => {
    setResponsedata({
      nit: "",
      numFact: "",
      doc: "",
      total: "",
      totalSinIva: "",
      nombre: "",
      rete: "",
      retePorc: 4,
      iva: "",
      ivaPorc: 19,
      fecha: "",
      concepto: "",
      municipio: "",
      codepostal: "",
      ipc: "",
    });
    setToScan("");
    setIsLoading(false);
    setFillData(false);
  };
  const [ban, setBan] = useState(false);
  const handlerSend = async () => {
    setIsLoading(true);
    console.log("enviooo gastos");
      // https://syncronizabackup-production.up.railway.app
        // https://appsyncroniza-production.up.railway.app
    const respon = await axios.get(
      "https://syncronizabackup-production.up.railway.app/user/api/callback"
    );
 if (respon.data.token === true) {
    const user_name = await AsyncStorage.getItem("name");
    const email = await AsyncStorage.getItem("email");
    const docEmpleado = await AsyncStorage.getItem("doc_empleado");


    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0"); // Día del mes con dos dígitos
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Mes (0 - 11) con dos dígitos
    const year = String(currentDate.getFullYear()).slice(2); // Año con dos dígitos
    const hours = String(currentDate.getHours()).padStart(2, "0"); // Hora con dos dígitos
    const minutes = String(currentDate.getMinutes()).padStart(2, "0"); // Minutos con dos dígitos
    const formatDate = (new Date().toISOString().split("T"))[0]
    const nom_img = `${user_name}_${day}${month}${year}_${hours}${minutes}.jpg`;

    console.log("*************************", infoProject.input)
    const ActualizarEntregable = {
      ...infoProject.input,
      N_DocumentoEmpleado: docEmpleado,
      Nombre_Empleado: user_name.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      NumeroComprobante : prepayment?prepayment.NumeroComprobante : "",//
      Fecha: formatDate,//
      FechaComprobante: responsedata.fecha?responsedata.fecha.split("/").join("-"):"", //
      ValorComprobante: responsedata.total?parseInt(responsedata.total):0,//
      NitComprobante: responsedata.nit?responsedata.nit:"",//
      NombreComprobante: responsedata.concepto?responsedata.concepto:"",//
      CiudadComprobante:responsedata.municipio?responsedata.municipio:"",//
      DireccionComprobante:responsedata.codepostal?responsedata.codepostal.toString():"",//
      CCostos : prepayment?prepayment.IdCentroCostos.toString() : "",//
      idAnticipo: prepayment?parseInt(prepayment.IdResponsable) : "",//
      ipc: responsedata.ipc?parseInt(responsedata.ipc):0,//
      Sub_Total : responsedata.totalSinIva?parseInt(responsedata.totalSinIva):0,//
      
    }
    console.log("***************************", ActualizarEntregable)
    const formData = new FormData();
    formData.append("ActualizarEntregable", JSON.stringify(ActualizarEntregable))
    formData.append("token", respon.data.tokenSecret);
    formData.append("imagen", {
      uri: toScan,
      type: "image/jpeg",
      name: nom_img,
    });
    formData.append("user", user_name);
    formData.append("tipo", "OCR");
         // https://syncronizabackup-production.up.railway.app
        // https://appsyncroniza-production.up.railway.app
    const send = await axios.post(
      "https://syncronizabackup-production.up.railway.app/user/api/dashboard",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("este es el send!!!!!", send.data)
    setBan(true);
    setResponsedata({
      nit: "",
      numFact: "",
      doc: "",
      total: "",
      totalSinIva: "",
      nombre: "",
      rete: "",
      retePorc: "",
      iva: "",
      ivaPorc: "",
      fecha: "",
      concepto: "",
      municipio: "",
      codepostal: "",
      ipc: "",
    });
    setIsLoading(false);
    Alert.alert("Envío de datos completado")
    setToScan("");
    setFillData(false);
 }

  };






  const handlerSend1 = async () => {
    console.log("borrado datos");
    setBan(true);
    setResponsedata({
      nit: "",
      numFact: "",
      doc: "",
      total: "",
      totalSinIva: "",
      nombre: "",
      rete: "",
      retePorc: "",
      iva: "",
      ivaPorc: "",
      fecha: "",
      concepto: "",
      municipio: "",
      codepostal: "",
      ipc: "",
    });

    setToScan("");
    setIsLoading(false);
    setFillData(false);
  };
  const [isModalVisible, setModalVisible] = useState(false);

  const openPopup = () => {
    setModalVisible(true);
  };

  const closePopup = () => {
    setModalVisible(false);
  };

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [totalAnt, setTotalAnt] = useState([])
    const [justSelected, SetJustSelected] = useState(false);

    useEffect(() => {
      setIsOpen(false);
      SetJustSelected(false)
    },[inputValue])

    useEffect(() => {
      const ActulizarOptions = () => {
        if (anticipos){
        setTotalAnt(anticipos)
        }
      }
      ActulizarOptions()
      },[anticipos])

    const toggleDropdown = () => {
      SetJustSelected(false)
      setIsOpen(!isOpen);
    };

    const handleOptionSelect = (option) => {
      if (!selectedOptions.includes(option)) {
        setSelectedOptions([option]);
      }
      setIsOpen(false);
      SetJustSelected(true)
    };

    const renderOptions = () => {
      return totalAnt.map((option, index) => (
        <TouchableOpacity
        backgroundColor= "blue"
          key={index}
          onPress={() => {
            handleOptionSelect(option.DetalleConcepto+option.NumeroComprobante);
            setPrepayment(option)
          }}
        >
          <Text ellipsizeMode="tail" numberOfLines={numberOfLines?1:2} style={styles.oneOption}>{option.NumeroComprobante+option.DetalleConcepto}</Text>
        </TouchableOpacity>
      ));
    };

    const renderSelectedOptions = () => {
      return selectedOptions.map((option, index) => (
        <Text key={index}>{option}</Text>
      ));
    };

    const [numberOfLines, setNumberOfLines] = useState(true);
    const handlePress = () => {
        setNumberOfLines(!numberOfLines);
    };

  return (
    <View style={styles.container}>
      <SearchBar />
      <ScrollView>
        <View style={styles.singleInput}>
          <View style={styles.inputCont}>
            <View style={styles.inputIntLeftDrop}>
            {justSelected
            ?
              <View style={styles.block}>
                <TouchableOpacity onPress={toggleDropdown}>
                  <Text>{renderSelectedOptions()}</Text>
                </TouchableOpacity>
              </View>
            : 
              <View style={styles.blockNoSelected}>
                <TouchableOpacity onPress={toggleDropdown}>
                  <Text>Seleccionar opciones</Text>
                </TouchableOpacity>
              </View>}
            </View>
            {isOpen && (
                  <View style={styles.options}>
                    {/* <Text ellipsizeMode="tail" numberOfLines={numberOfLines?1:2} style={styles.compTitle}>{compo.componente}</Text> */}
                    {renderOptions()}
                  </View>
                )}
            <TextInput style={styles.inputIntRight} placeholder="$000.000.00" value={prepayment?prepayment.Valor.toString():null} />
          </View>
        </View>
        <View style={styles.scan}>
          <View>
            {toScan ? (
              <Image
                source={{ uri: toScan }}
                style={isLoading ? styles.photoLoading : styles.photo}
                resizeMode="contain"
              />
            ) : null}

            {isLoading && !fillData ? (
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
            ) : null}

            {isLoading && fillData ? (
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
            ) : null}
          </View>
          {toScan ? (
            <View style={styles.scanCont}>
              <TouchableOpacity style={styles.buttonScan} onPress={handlerScan}>
                <Text>Escanear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonScan} onPress={handlerCancel}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.select}>
              <TouchableOpacity style={styles.button} onPress={openCam}>
                <Icon name="camera" size={40} color="white" />
              </TouchableOpacity>
              <ImagePickerComponent setToScan={newPhoto}/>
            </View>
          )}

          <Modal
            visible={openCamera}
            onRequestClose={closeCam}
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <UseCameraOCR
                setToScan={newPhoto}
                closeCam={closeCam}
                handlerScan={handlerScan}
              />
            </View>
          </Modal>
        </View>
        <View style={styles.singleInput}>
          <Text style={styles.label}>Concepto:</Text>
          <TextInput
            style={styles.input}
            placeholder="*Concepto"
            value={fillData ? !responsedata.concepto ? "" : `${responsedata.concepto}` : ""}
            onChangeText={(text) => handleOnChange(text, "concepto")}
          />
        </View>

        <View style={styles.inputCont}>
          <View style={styles.doubleInput}>
            <Text style={styles.label}>*NIT/CC</Text>
            <TextInput
              style={styles.input}
              placeholder="*NIT/CC"
              value={fillData ? !responsedata.nit ? "" : `${responsedata.nit}` : ""}
              onChangeText={(text) => handleOnChange(text, "nit")}
            />
          </View>
          <View style={styles.doubleInput}>
            <Text style={styles.label}>*Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="*Nombre"
              value={fillData ? !responsedata.nombre ? "" : `${responsedata.nombre}` : ""}
              onChangeText={(text) => handleOnChange(text, "nombre")}
            />
          </View>
        </View>
        <View style={styles.inputCont}>
          <View style={styles.doubleInput}>
            <Text style={styles.label}>*Valor pagado $...</Text>
            <TextInput
              style={styles.input}
              placeholder="*Valor pagado $..."
              value={fillData ? !responsedata.total ? "" : `${responsedata.total}` : ""}
              onChangeText={(text) => handleOnChange(text, "total")}
            />
          </View>
          <View style={styles.doubleInputHalf}>
            <View style={styles.contentLeft}>
              <Text style={styles.label}>IVA $</Text>
              <TextInput
                style={styles.inputIntLeft}
                placeholder="Valor IVA $"
                value={fillData ? !responsedata.ivaPorc || !responsedata.total ? "" : `${responsedata.total*responsedata.ivaPorc/100}` : ""}
                onChangeText={(text) => handleOnChange(text, "iva")}
                editable={false}
              />
            </View>
            <View style={styles.contentRight}>
              <Text style={styles.label}>%IVA</Text>
              <TextInput
                style={styles.inputIntRight}
                placeholder="%IVA $"
                value={fillData ? !responsedata.ivaPorc ? "" : `${responsedata.ivaPorc}` : ""}
                onChangeText={(text) => handleOnChange(text, "ivaPorc")}
              />
            </View>
          </View>
        </View>
        <View style={styles.inputCont}>
          <View style={styles.doubleInputHalf}>
            <View style={styles.contentLeft}>
              <Text style={styles.label}>Rete $</Text>
              <TextInput
                style={styles.inputIntLeft}
                placeholder="Valor Rete fuente $"
                value={fillData ? !responsedata.retePorc || !responsedata.total ? "" : `${responsedata.total*responsedata.retePorc/100}` : ""}
                onChangeText={(text) => handleOnChange(text, "rete")}
                editable= {false}
              />
            </View>
            <View style={styles.contentRight}>
              <Text style={styles.label}>Rete %</Text>
              <TextInput
                style={styles.inputIntRight}
                placeholder="% Rete fuente"
                value={fillData ? `${responsedata.retePorc}` : ""}
                onChangeText={(text) => handleOnChange(text, "retePorc")}
              />
            </View>
          </View>
          <View style={styles.doubleInput}>
            <Text style={styles.label}>Fecha</Text>
            <TextInput
              style={styles.input}
              placeholder="*DD/MM/AAAA"
              value={fillData ? !responsedata.fecha ? "" : `${responsedata.fecha}` : ""}
              />
          </View>
        </View>
        <View style={styles.inputCont}>
          <View style={styles.doubleInput}>
            <Text style={styles.label}>Código postal</Text>
            <TextInput
              style={styles.input}
              placeholder="código postal"
              value={fillData ? !responsedata.codepostal ? "" : `${responsedata.codepostal}` : ""}
              onChangeText={(text) => handleOnChange(text, "codepostal")}
            />
          </View>
          <View style={styles.doubleInput}>
            <Text style={styles.label}>Municipio</Text>
            <TextInput
              style={styles.input}
              placeholder="Municipio"
              value={fillData ? !responsedata.municipio ? "" : `${responsedata.municipio}` : ""}
              onChangeText={(text) => handleOnChange(text, "municipio")}
            />
          </View>
        </View>
        <View style={styles.inputCont}>
          <View style={styles.doubleInput}>
            <Text style={styles.label}>IPC</Text>
            <TextInput
              style={styles.input}
              placeholder="IPC"
              value={fillData ? !responsedata.ipc ? "" :`${responsedata.ipc}` : ""}
              onChangeText={(text) => handleOnChange(text, "ipc")}
            />
          </View>
          <View style={styles.doubleInput}>
            <Text style={styles.label}>Pago sin IVA</Text>
            <TextInput
              style={styles.input}
              placeholder="Pago antes de IVA"
              value={fillData ? !responsedata.totalSinIva ? "" : `${responsedata.totalSinIva}` : ""}
              onChangeText={(text) => handleOnChange(text, "totalSinIva")}
            />
          </View>
        </View>
        {!token ? (
          <View style={{ flex: 1 }}>
            <MicrosoftLogin
              fillData={!fillData}
              update={update}
            />
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.sendButton,
              fillData
                ? { borderColor: "rgb(0,255,255)", borderWidth: 2 }
                : null,
            ]}
            onPress={handlerSend}
            disabled={!fillData}
          >
            <Text>Confirmar envío</Text>
          </TouchableOpacity>
        )}
        <View  style={styles.footer2}>
          <Text style={{fontSize:14}}>Powered by: </Text>
          <Image source={LogoSync} style={{ height: 30, width:80}} resizeMode="contain"/>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    padding: 5
  },
  inputCont: {
    paddingVertical: 5,
    flexDirection: "row"
  },
  select: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    backgroundColor: "rgb(15, 70, 125)",
    padding: 5,
    margin: 10,
    marginHorizontal: 50,
    height: 70,
    width: 70,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  scanCont: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonScan: {
    alignItems: "center",
    margin: 3,
    backgroundColor: "rgb(72, 169, 229)",
    width: 100,
    padding: 3,
    borderRadius: 5,
  },
  scan: {
    paddingHorizontal: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    height: 220,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    paddingHorizontal: 10,
    backgroundColor: "lightblue",
    borderRadius: 10,
    height: 40,
    flex: 1,
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
    width: "100%"
  },
  contentLeft: {
    width: "50%"
  },
  contentRight: {
    width: "50%"
  },
  inputIntLeft: {
    paddingHorizontal: 5,
    backgroundColor: "lightblue",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    height: 40,
    flex: 1,
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
    color: "black"
  },
  inputIntLeftDrop: {
    paddingHorizontal: 5,
    backgroundColor: "lightblue",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    height: 40,
    flex: 1,
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
    color: "black",
    textAlignVertical: "center",
    justifyContent: "center",
  },
  dropdownText: {
    paddingLeft: 5
  },
  options: {
    position: "absolute",
    marginTop: 45,
    backgroundColor: "rgb(245, 245, 245)",
    padding: 5,
    borderRadius: 5,
    width: "100%"
  },
  inputIntRight: {
    paddingHorizontal: 5,
    backgroundColor: "lightblue",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    height: 40,
    flex: 1,
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    margin: 5,
  },
  footer2: {
    paddingRight: 5,
    flexDirection: "row",
    alignItems: "center",
    bottom: 0,
    backgroundColor: "white",
    width: "100%",
    justifyContent: "flex-end",
  },
  modalContainer: {
    // flex: 1,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente para el modal
  },
  photo: {
    width: 300,
    height: 180,
  },
  photoLoading: {
    width: 300,
    height: 180,
    opacity: 0.5,
  },
  sendButton: {
    padding: 8,
    height: 40,
    margin: 10,
    backgroundColor: "rgb(151,151,151)",
    borderRadius: 8,
    alignItems: "center",
  },
  singleInput: {
    flexDirection: "column",
    paddingHorizontal: 3,
    justifyContent: "space-between",
    alignItems: "center",
    justifyContent: "left",
  },
  label : {
    textAlign: "left",
    width: "100%",
    fontSize: 12,
    marginTop: -5
  },
  doubleInput: {
    flexDirection: "column",
    paddingHorizontal: 3,
    justifyContent: "space-between",
    alignItems: "center",
    width: "50%",
  },
  doubleInputHalf: {
    flexDirection: "row",
    paddingHorizontal: 3,
    justifyContent: "space-between",
    alignItems: "center",
    width: "50%",
  }
  // loader: {
  //     width: 100,
  //     height: 100,
  //     transform: [{ rotate: spin }]
  // }
});
export default Gastos;

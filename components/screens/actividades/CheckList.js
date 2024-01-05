import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AuthContext } from '../../context/context';

import api from '../../../api/api';
import Tarea from './tarea';
import AsyncStorage from "@react-native-async-storage/async-storage";
const Checklist = () => {
  const [response, setResponse] = useState([]);
  const {inputValue, setProjectData, todosAnticipos, anticipos} = useContext(AuthContext)
  const [doc, setDoc] = useState("")
  const [name, setName] = useState("")
  const [finishedUpdate, setFinishedUpdate] = useState(false)
  const updateFinished = (value) => {
    setFinishedUpdate(value)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(inputValue!==""){
          const user_name = await AsyncStorage.getItem("name");
          setName(user_name.toString())
          const docEmpleado = await AsyncStorage.getItem("doc_empleado");
          setDoc(docEmpleado.toString());
          const email = await AsyncStorage.getItem("email");
          const response = await api.get(`/proyect?search=${inputValue}&email=${email}`);
          const anticipo = await api.post(`/proyect/anticipo`, {sku:response.data[0].skuP, doc:docEmpleado});
          todosAnticipos(anticipo.data)
          console.log("respuesta del anticipo", anticipo.data);
          console.log("esto es lo que necesitamos", response.data[0])
          setProjectData({
            //!aqui se agraran mas datos
           SKU_Proyecto : response.data[0].skuP,
           NitCliente : response.data[0].nitCliente,
           idNodoProyecto : response.data[0].idNodoP,
           idProceso : response.data[0].Codi_parteP,
         })
          setResponse(response?.data);
          setFinishedUpdate(false)
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [inputValue, finishedUpdate,]);

  //  useEffect(()=> {

  //  }, [])
  

  const [numberOfLines, setNumberOfLines] = useState(true);
  const handlePress = () => {
      setNumberOfLines(!numberOfLines);
  };

  return (
    <View style={styles.container}>
      {response?.map((pro,index) => (
       <View key={index} style={styles.pro}>
          {pro.componentes.map((compo,index) => (
            <View key={index} style={styles.compo}>
              {compo.actividades.length===0
              ? null
              :<>
                <View style={styles.compoCont}>
                <Text style={styles.compTitle}>{compo.fecha}</Text>
                <TouchableOpacity onPress={handlePress}>
                  <Text ellipsizeMode="tail" numberOfLines={numberOfLines?1:2} style={styles.compTitle}>{compo.componente}</Text>
                </TouchableOpacity>
              </View>
              {compo.actividades.map((act,ind) => (
                <View key={ind} style={styles.actividad}>
                  <Tarea 
                    proyecto={pro.proyecto}
                    skuP={pro.skuP}
                    componente={compo.componente}
                    nitCliente={pro.nitCliente}
                    documentoEmpleado={doc}
                    idNodoProyecto={pro.idNodoP}
                    idNodoActividad={act.idNodoA}
                    Cod_Parte={act.Codi_parteA}
                    actividad={act.actividad} 
                    entregable={act.entregable} 
                    listaEntregable={act.nombre_entregable}
                    finishedUpdate={updateFinished}
                  />
                </View>
                ))
              }
              </>
            }
            </View>
          ))}
        </View>
      ))}
      <View style={styles.footer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop:5,
    flex: 1,
  },
  pro: {
    marginBottom: 10,
    borderRadius: 5,
  },
  compoCont: {
    flexDirection: "row",
    width : 280,
  },
  compo: {
    marginVertical: 2,
    backgroundColor: 'lightblue',
    borderRadius: 10,
    marginVertical: 8,
    padding:3,
    fontSize: 15
  },
  compTitle: {
    marginHorizontal: 5,
    fontSize: 15
  },
  actividad: {
    backgroundColor: "white", //! dejar este color
    marginVertical: 5,
    borderRadius: 3
  },
  footer: {
    marginBottom: 28
  },
});

export default Checklist;


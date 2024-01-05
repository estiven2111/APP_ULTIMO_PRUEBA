import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const FilePickerButton = ({ent, upLoaded, setUri, handlerInfo, deleteInfo, justUploaded, numero}) => {
  const [fileCharged, setFileCharged] = useState(false)
  const [adicionalName, setAdicionalName] = useState("")
  useEffect(() => {
    if (upLoaded) {
      setFileCharged(true);
      handlerInfo({[adicionalName.toUpperCase()]:{uri:upLoaded, Numero:numero}})
    }
  }, [upLoaded, adicionalName]);
  const handleFilePick = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync();
      const uri = file.assets[0].uri
      if (uri) setFileCharged(true)
      console.log("este es el numero!!!!!!!!!!!!!!!!!!!!!!: ", numero)
      handlerInfo({[ent]:{uri:uri, Numero:numero}})
    } catch (error) {
        console.log('Selección de archivo cancelada', error);
    }
  };

  const handlerCancel = () => {
    setFileCharged(false)
    deleteInfo(ent)
  }

  const handlerOnChange = (value) => {
    deleteInfo(adicionalName.toUpperCase())
    setAdicionalName(value)
  }

    return (
      <View style={styles.container}>
        {upLoaded
          ? <TextInput style={fileCharged?styles.charged:styles.input} placeholder={ent} onChangeText={handlerOnChange}>{adicionalName.toUpperCase()}</TextInput>
          : <Text style={fileCharged || justUploaded?styles.charged:styles.input}>{ent}</Text> 
        }
        {fileCharged || justUploaded
        ?<TouchableOpacity onPress={() => {upLoaded?setUri(""):null; handlerCancel()}} style={styles.selectCont}>
          <Text style={styles.select}>X</Text>
        </TouchableOpacity>
        :<TouchableOpacity onPress={handleFilePick} style={styles.selectCont}>
          <Text style={styles.select}>...</Text>
        </TouchableOpacity>
      }
        
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      flexDirection: "row",
      padding:5
    },
    charged: {
        backgroundColor: "lightblue",
        width: 230,
        height: 30,
        margin: 1,
        borderRadius: 5,
        fontSize:13,
        paddingHorizontal:3,
        textAlign: "center",
        textAlignVertical: "center"
    },
    input: {
      backgroundColor: "white",
        width: 230,
        height: 30,
        margin: 1,
        borderRadius: 5,
        fontSize:13,
        paddingHorizontal:3,
        textAlign: "center",
        textAlignVertical: "center"
    },
      selectCont: {
        width: 30,
        height:30,
        borderRadius: 5,
        margin: 1,
        backgroundColor: "lightgrey",
        alignItems: "center",
        justifyContent: "center"
    },
    select: {
        width: 20,
        textAlign: "center",
        fontWeight: "bold",
    }

});
  
export default FilePickerButton
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const FilePickerButton = ({setToScan}) => {
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      const uri = result.assets[0].uri
      if (uri) 
      setImage(uri);
    } catch (error) {
        console.log('Selección de archivo cancelada', error);
    }
  };
    useEffect(() => {
      setToScan(image)
    },[image])

    // const pickImabge = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.All,
    //   base64: true, //return base64 data.
    //   //this will allow the Vision API to read this image.
    // });
    // if (!result.canceled) { //if the user submits an image,
    //     const { assets } = result;
    //   if (assets.length > 0) {
    //     const selectedAsset = assets[0];
    //     setImage(selectedAsset.uri);
    //     console.log(selectedAsset.uri)
        
    //   }
    // }
  // };
  // const handlerCancel = () => {
  //   setFileCharged(false)
  //   deleteInfo(ent)
  // }

  // const handlerOnChange = (value) => {
  //   deleteInfo(adicionalName.toUpperCase())
  //   setAdicionalName(value)
  // }

    return (
      <View style={styles.container}>
        <TouchableOpacity>
          <Icon name="upload" size={40} color="white" onPress={pickImage}/>
        </TouchableOpacity>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(15, 70, 125)",
    width:70,
    height:70,
    borderRadius: 100,
    alignItems:"center",
    justifyContent: "center",
    margin: 20,
    marginHorizontal: 50
  }
})
  
export default FilePickerButton

//! usando imagePicker
// import * as ImagePicker from 'expo-image-picker';

// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';

// function ImagePickerComponent({ setToScan }) {
//   const [image, setImage] = useState(null);

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       base64: true, //return base64 data.
//       //this will allow the Vision API to read this image.
//     });
//     if (!result.canceled) { //if the user submits an image,
//         const { assets } = result;
//       if (assets.length > 0) {
//         const selectedAsset = assets[0];
//         setImage(selectedAsset.uri);
//         console.log(selectedAsset.uri)
        
//       }
//     }
//   };

//   useEffect(() => {
//     setToScan(image)
// },[image])
//   return (
//     <View style={styles.container}>
//       <TouchableOpacity>
//         <Icon name="upload" size={40} color="white" onPress={pickImage}/>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "rgb(15, 70, 125)",
//     width:70,
//     height:70,
//     borderRadius: 100,
//     alignItems:"center",
//     justifyContent: "center",
//     margin: 20,
//     marginHorizontal: 50
//   }
// })
// export default ImagePickerComponent;

//! para pruebas con ocr de google
// import * as ImagePicker from 'expo-image-picker';
// import React, { useState, useEffect } from 'react';
// import { Button, Image, View, Text } from 'react-native';

// function ImagePickerComponent({ onSubmit }) {
//   const [image, setImage] = useState(null);
//   const [text, setText] = useState('Please add an image');

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       base64: true, //return base64 data.
//       //this will allow the Vision API to read this image.
//     });
//     if (!result.canceled) { //if the user submits an image,
//         const { assets } = result;
//       if (assets.length > 0) {
//         const selectedAsset = assets[0];
//         setImage(selectedAsset.uri);
//         const googleText = await onSubmit(selectedAsset.base64);
        
//       }
//     }
//   };
//   return (
//     <View>
//       <Button title="Pick an image from camera roll" onPress={pickImage} />
//       {image && (
//         <Image
//           source={{ uri: image }}
//           style={{ width: 200, height: 200, resizeMode:"contain" }}
//         />
//       )}
//     </View>
//   );
// }
// export default ImagePickerComponent;
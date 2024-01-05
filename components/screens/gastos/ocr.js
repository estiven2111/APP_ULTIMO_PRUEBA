// import React, { useState } from 'react';
// import { View, TouchableOpacity, Button, Image, Text } from 'react-native';
// // import OCR from 'react-native-ocr';

// import UseCamera from '../utils/useCamera';

// const OCRComponent = ({onClose}) => {
//   const [imagePath, setImagePath] = useState(null);
//   const [recognizedText, setRecognizedText] = useState('');

//   const captureImage = async () => {
//     const { status } = await Camera.requestPermissionsAsync();

//     if (status === 'granted') {
//       const { uri } = await Camera.takePictureAsync(); // Captura la imagen utilizando la cámara
  
//       setImagePath(uri); // Guarda la ruta de la imagen capturada en el estado "imagePath"
//     }
//     // Aquí debes implementar la lógica para capturar la imagen utilizando la cámara de tu proyecto
//     // Guarda la ruta de la imagen capturada en el estado "imagePath"
//     // Por ejemplo:
//     // const imagePath = ... // Obtén la ruta de la imagen capturada
//     // setImagePath(imagePath);
//   };

//     const performOCR = async () => {
//         try {
//         const result = await OCR.recognize({
//             image: imagePath,
//             language: 'eng',
//             whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
//         });
//         setRecognizedText(result || 'No se detectó texto');
//         } catch (error) {
//         console.log('Error al detectar el texto:', error);
//         setRecognizedText('Error al realizar OCR');
//         }
//     };

//     return (
//         <View>
//             <Button title="Capturar imagen" onPress={captureImage} />
//             {imagePath && <Image source={{ uri: imagePath }} style={{ width: 200, height: 200 }} />}
//             <Button title="Procesar imagen" onPress={performOCR} />
//             {recognizedText !== '' && <Text>{recognizedText}</Text>}
//             <TouchableOpacity onPress={onClose}>
//                 <Text>Cerrar OCR</Text>
//             </TouchableOpacity>
//             </View>
//     );
// };

// export default OCRComponent;

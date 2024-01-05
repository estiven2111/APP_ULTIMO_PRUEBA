import {Camera, CameraType, FlashMode} from "expo-camera";
import React, { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Modal, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/MaterialIcons';
import * as MediaLibrary from 'expo-media-library';


//!vamos de aqui
const UseCameraOCR = ({setToScan, closeCam, handlerScan}) => {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [permissionResponse, requestPermissions] = MediaLibrary.usePermissions();
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
    const [zoom, setZoom] = useState(0);
    
    const [photoModal, setPhotoModal] = useState(null);
    const [photo, setPhoto] = useState("");
    // useEffect(() => {
    //     setToScan(photo)
    // },[photo, setToScan])
    
    const camRef = useRef(null);


    if (!permission) {
      return <View />;
    }
    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: 'center' }}>Se necesita permiso para acceder a la cámara</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }

    if (!permissionResponse) {
        return <View />;
    }
    if (!permissionResponse.granted) {
    return (
        <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Se necesita permiso para acceder a la librería</Text>
        <Button onPress={requestPermissions} title="grant permission" />
        </View>
    );
    }

    const takePicture = async () => {
        if (camRef) {
            const data = await camRef.current.takePictureAsync()
            setPhoto(data.uri)
            // setPhotoModal(true)
            await MediaLibrary.saveToLibraryAsync(data.uri)
            setToScan(data.uri)
            // handlerScan()
            closeCam()
        }
    }
    

    const savePicture = ()=> {
        // setPhotoModal(false)
    }


    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const handleFlashMode = () => {
        setFlashMode(
          flashMode === Camera.Constants.FlashMode.off
            ? Camera.Constants.FlashMode.torch
            : Camera.Constants.FlashMode.off
        );
      };

      const handleZoomIn = () => {
        setZoom(zoom + 0.1); // Aumentar el nivel de zoom en 0.1
      };
    
      const handleZoomOut = () => {
        setZoom(Math.max(zoom - 0.1, 0)); // Disminuir el nivel de zoom en 0.1, mínimo 0
      };

    return (
        <View style={styles.container}>
            <View style={styles.camOptions}>
                <TouchableOpacity style={styles.button} onPress={handleZoomOut}>
                    <Text style={styles.text}><Icons name="zoom-out" size={24} color="white" /></Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleFlashMode}>
                    <Text style={styles.text}>
                    <Icon name={flashMode === Camera.Constants.FlashMode.off ? 'flashlight-sharp' : 'flashlight-outline'} size={24} color="white" />
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleZoomIn}>
                    <Text style={styles.text}><Icons name="zoom-in" size={24} color="white" /></Text>
                </TouchableOpacity>
            </View>
            <Camera style={styles.camera} type={type} ref={camRef} flashMode={flashMode} zoom={zoom}/>
            <View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => toggleCameraType()}>
                        <Icon name="refresh" size={40} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => takePicture()}>
                        <Icon name="camera" size={40} color="white" />
                    </TouchableOpacity>
                </View>
            </View>  
        </View>
    );
}

    const styles = StyleSheet.create({
        container: {
        flex: 1,
        width: "100%",
        justifyContent: 'center',
        height: 300,
        backgroundColor: "black"
        },
        camera: {
            height: 500
        },
        camOptions: {
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
        },
        buttonContainer: {
            flexDirection: 'row',
            backgroundColor: 'transparent',
            justifyContent: "space-around"
        },
        button: {
            alignSelf: 'center',
            alignItems: 'flex-end',
            padding: 7,
            margin: 20
        },
        text: {
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
        },
        photo: {
            width: "100%",
            height: 350
        },
        modalCont: {
            justifyContent:"center",
            alignItems: "center",
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.8)"
        },
        modalOptions: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: "row"
          },
          button2: {
            width: 100,
            backgroundColor: "white",
            padding: 5,
            marginHorizontal:30,
            alignItems: "center",
            borderRadius: 5
          },
          text: {
            textAlign: "center",
            fontSize:18,
            color: "white",
          }
    });

export default UseCameraOCR
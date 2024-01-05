import {Camera, CameraType} from "expo-camera";
import React, { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Modal, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/MaterialIcons';
import * as MediaLibrary from 'expo-media-library';


//!vamos de aqui
const UseCamera = ({closeCam, setUri}) => {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [permissionResponse, requestPermissions] = MediaLibrary.usePermissions()
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
    const [zoom, setZoom] = useState(0);

    const camRef = useRef(null);
    const [photo, setPhoto] = useState("");
    const [photoModal, setPhotoModal] = useState(null);


    if (!permission) {
      return <View />;
    }
    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
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
        <Text style={{ textAlign: 'center' }}>We need your permission to access Media Library</Text>
        <Button onPress={requestPermissions} title="grant permission" />
        </View>
    );
    }

    const takePicture = async () => {
        if (camRef) {
            const data = await camRef.current.takePictureAsync()
            setPhoto(data.uri)
            setPhotoModal(true)
        }
    }

    const savePicture = ()=> {
        MediaLibrary.saveToLibraryAsync(photo)
        setPhotoModal(false)
        setUri(photo)
        closeCam()
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
                <TouchableOpacity style={styles.button} onPress={handleZoomIn}>
                    <Text style={styles.text}><Icons name="zoom-in" size={24} color="white" /></Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleFlashMode}>
                    <Text style={styles.text}>
                    <Icon name={flashMode === Camera.Constants.FlashMode.off ? 'flashlight-sharp' : 'flashlight-outline'} size={24} color="white" />
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleZoomOut}>
                    <Text style={styles.text}><Icons name="zoom-out" size={24} color="white" /></Text>
                </TouchableOpacity>
            </View>
            <Camera style={styles.camera} type={type} ref={camRef} flashMode={flashMode} zoom={zoom}/>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => toggleCameraType()}>
                    <Icon name="refresh" size={40} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => takePicture()}>
                    <Icon name="camera" size={40} color="white" />
                </TouchableOpacity>
                <Modal animationType= "slide" visible={photoModal} transparent={false}>
                    <View style={styles.takedPhoto}>
                        <Image source={{uri: photo}} style={styles.photo}/>
                        <View style={styles.options}>
                            <TouchableOpacity style={styles.buttonOption} onPress={() => savePicture()}>
                                <Text style={styles.textOption}>Guardar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonOption} onPress={() => setPhotoModal(false)}>
                                <Text style={styles.textOption}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
            height: 550
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
        takedPhoto: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgb(51,51,51)"
        },
        photo: {
            width: "100%",
            height: 350
        },
        options: {
            flexDirection: "row",
            width: 350,
            justifyContent: "space-between"
        },
        textOption: {
            fontSize: 20,
            color: "white",
            padding: 5,
            textAlign: "center"
        },
        buttonOption: {
            alignSelf: 'center',
            justifyContent: "center",
            padding: 3,
            margin: 15,
            backgroundColor: "rgb(100,100,100)",
            borderRadius: 10,
            width: 130
        },
    });

export default UseCamera
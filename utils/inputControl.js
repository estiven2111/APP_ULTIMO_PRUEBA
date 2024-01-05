import React, { useState  } from 'react';

import { TextInput, StyleSheet } from 'react-native';

const TimeInput = ({ value, onChange}) => {
    const [time, setTime] = useState(value);

    const handleInputChange = (value) => {
    // Eliminar caracteres no numéricos
    const numericValue = value.replace(/[^0-9]/g, '');
    // Formatear el valor en HH:MM
    let formattedValue = '';
    if (numericValue.length > 0) {
      // Agregar ":" después de los primeros dos caracteres
      formattedValue = numericValue.replace(/(\d{2})(\d{0,2})/, '$1:$2');
    }
    // Actualizar el estado con el valor formateado
    // Validar si el valor es una hora válida
    const isValidTime = /^([0-1][0-9]|2[0-3])(?::([0-5][0-9]?){0,2})?$/.test(formattedValue);
    
    // Actualizar el estado con el valor formateado si es válido, de lo contrario mantener el valor anterior
    // if (formattedValue.length===0 ||formattedValue.length===5) {
        // }
    if (formattedValue.length>2) {
        setTime(isValidTime ? formattedValue : time);
        onChange(isValidTime ? formattedValue : time);
    } else {
        setTime(formattedValue)
        onChange(formattedValue);
    }
    };

  return (
    <TextInput
      style={styles.input}
      keyboardType="numeric"
      maxLength={5}
      value={time}
      onChangeText={handleInputChange}
      placeholder="HH:MM"
      placeholderTextColor="#9e9e9e"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    textAlign: "center",
    paddingHorizontal: 10,
    backgroundColor: "white",
    width: "50%",
    marginHorizontal: 10,
    borderRadius: 5
  },
});

export {TimeInput}
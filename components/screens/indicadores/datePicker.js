import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';

const RangeDatePicker = () => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (day) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      console.log("este el el day", day)
      setSelectedStartDate(day.dateString);
      setSelectedEndDate(null);
    } else if (selectedStartDate && !selectedEndDate) {
      setSelectedEndDate(day.dateString);
      setShowCalendar(false); // Cerrar el calendario después de seleccionar la segunda fecha
    }
  };

  const markedDates = {
    [selectedStartDate]: { selected: true, startingDay: true, color: 'green' },
    [selectedEndDate]: { selected: true, endingDay: true, color: 'green' },
  };
  
  useEffect(() => {
    const getDates = () => {
      const currentDate = new Date();
      const formatCurrentDay = currentDate.toISOString().split("T")[0];
      const currentDay = formatCurrentDay.split("-").reverse().join("-")
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const formatFirstDay = firstDayOfMonth.toISOString().split("T")[0];
      const firstDay = formatFirstDay.split("-").reverse().join("-")
      setSelectedStartDate(formatFirstDay);
      setSelectedEndDate(formatCurrentDay);
    }
    getDates();
  },[])


  return (
    <View style={styles.container}>
      <View style={styles.firstLine}>
        {selectedStartDate && selectedEndDate 
        ? 
        <View>
          <Text style={styles.selectedDate}>
            Fecha de inicio: {selectedStartDate.split("-").reverse().join("-")}
          </Text>
          <Text style={styles.selectedDate}>
            Fecha de fin:      {selectedEndDate.split("-").reverse().join("-")}
          </Text>
        </View>
        :
          <Text style={styles.selectedDate}>Selecciona un rango de fechas: </Text>
        }
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => setShowCalendar(true)}>
            <Text style={styles.openButtonText}>Seleccionar</Text>
        </TouchableOpacity>
      </View>
      {showCalendar && (
        <Calendar
          markingType={'period'}
          markedDates={markedDates}
          onDayPress={handleDateSelect}
          hideExtraDays
          onDayLongPress={handleDateSelect}
          theme={{
            selectedDayBackgroundColor: 'red',  
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15
  },
  firstLine: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  openButton: {
    backgroundColor: 'rgb(15, 70, 125)',
    padding: 10,
    marginRight: 5,
    borderRadius: 8,
  },
  openButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedDate: {
    fontWeight: 'bold',
    textAlign : 'left',
    lineHeight : 20,
    marginRight: 20,
  },
});

export default RangeDatePicker;

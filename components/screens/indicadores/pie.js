import React from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { PieChart } from 'react-native-chart-kit';

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const PieComp = (props) => {
  console.log(props)
  const donutWidth = 50; // Ajusta este valor para determinar el ancho del donut
  const data = [
    {
      name: '% A tiempo',
      population: props.aTiempo,
      // population: props.aTiempo,
      color: '#1f77b4',
      legendFontColor: '#7F7F7F',
      legendFontSize: 10,
    },
    {
      name: '% Con Retraso',
      population: props.cRetraso,
      // population: props.cRetraso,
      color: '#9467bd',
      legendFontColor: '#7F7F7F',
      legendFontSize: 10,
    },
    {
      name: '% Por frecuencia',
      population: props.pFrec,
      // population: props.pFrec,
      color: '#8c564b',
      legendFontColor: '#7F7F7F',
      legendFontSize: 10,
    },
  ];

  return (
    <View>
      <PieChart
        data={data}
        width={300}
        height={180}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft="5"
        absolute
      />
      <View
        style={{
          position: 'absolute',
          top: '50%',
          left: '26%',
          transform: [{ translateX: -donutWidth / 2 }, { translateY: -donutWidth / 2 }],
          width: donutWidth,
          height: donutWidth,
          borderRadius: donutWidth / 2,
          backgroundColor: '#ffffff', // Cambia el color según tu preferencia
        }}
      />
    </View>
  );
};


export default PieComp
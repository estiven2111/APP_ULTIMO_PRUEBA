import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";

import Actividades from "./screens/actividades/actividades";
import Gastos from "./screens/gastos/gastos";
import Indicadores from "./screens/indicadores/indicadores";
import WelcomeBar from "./welcomeBar";

import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
const Tab = createMaterialTopTabNavigator();

// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <View style={styles.container}>
      <WelcomeBar/>
      <Tab.Navigator
        sceneContainerStyle={styles.sceneContainer}
        screenOptions={
          {
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "gray",
            tabBarIndicatorStyle: {
              backgroundColor: "white"
            },
            tabBarStyle: {
              backgroundColor: "rgb(15, 70, 125)",
              height: 70
            }
          }}
      >
        <Tab.Screen
          name="Actividades"
          component={Actividades}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={'checkbox-outline'}
              size={20}
              color={focused ? color="white":color="grey"}
              style={{ marginBottom: focused ? 5 : 0 }} // Ejemplo de estilo condicional
            />
          ),
          }}
        />
        <Tab.Screen
          name="Gasto"
          component={Gastos}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialIcons name="attach-money" size={20} color={focused ? color="white":color="grey"}
              style={{ marginBottom: focused ? 5 : 0 }} />
            ),
          }}
        />
        <Tab.Screen
          name="Indicadores"
          component={Indicadores}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Entypo name="bar-graph" size={20} color={focused ? color="white":color="grey"}
              style={{ marginBottom: focused ? 5 : 0 }}/>
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    // paddingTop: 10,
  },
  sceneContainer: {
    backgroundColor: "white"
  }
});
export default Home;

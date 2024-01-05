import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ContextProvider from './components/context/context.js';

import Login from './components/login.js';
import Home from './components/home';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <ContextProvider>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
            <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
          </Stack.Navigator>
        </ContextProvider>
      </NavigationContainer>
      </GestureHandlerRootView>
  );
}
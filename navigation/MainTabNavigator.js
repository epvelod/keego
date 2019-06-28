import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Formulario from '../screens/Formulario';
import Instrucciones from '../screens/Instrucciones';
import Instruccion from '../screens/Instruccion';
import Fallas from '../screens/Fallas';
import RegistroFalla from '../screens/RegistroFalla';
import Valoracion from '../screens/Valoracion';

import Colors from '../constants/Colors';

export default HomeStack = createStackNavigator({
  Home: HomeScreen,
  Instrucciones: Instrucciones,
  Instruccion: Instruccion,
  Fallas: Fallas,
  Formulario: Formulario,
  RegistroFalla: RegistroFalla,
  Valoracion: Valoracion,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Inventarios',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'ios-journal'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Cifras',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-stats' : 'md-stats'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-time' : 'md-time'}
    />
  ),
};


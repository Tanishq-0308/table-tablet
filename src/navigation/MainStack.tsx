import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator} from '@react-navigation/native-stack'
import { MainStackParamList } from './types';
import HomeWrapper from '../screens/Home/HomeWrapper';
import FactorySettingsScreen from '../screens/FactorySettingsScreen';


const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName='HomeWrapper'
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name='HomeWrapper' component={HomeWrapper}/>
      <Stack.Screen name='FactorySettings' component={FactorySettingsScreen}/>
    </Stack.Navigator>
  )
}

export default MainStack
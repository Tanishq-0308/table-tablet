import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator} from '@react-navigation/native-stack'
import { MainStackParamList } from './types';
import HomeWrapper from '../screens/Home/HomeWrapper';
import FactorySettingsScreen from '../screens/FactorySettingsScreen';
import MemoryPage from '../screens/MemoryPage';
import OffsetPage from '../screens/OffsetPage';
import RealPositionPage from '../screens/RealPositionPage';


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
      <Stack.Screen name='MemoryPage' component={MemoryPage}/>
      <Stack.Screen name='OffsetPage' component={OffsetPage}/>
      <Stack.Screen name='RealPositionPage' component={RealPositionPage}/>
    </Stack.Navigator>
  )
}

export default MainStack
import { View, Text } from 'react-native'
import React from 'react'
import MainScreen from './screens/Home/MainScreen'
import HomeWrapper from './screens/Home/HomeWrapper'

const App = () => {
  return (
    <View style={{flex:1}}>
      <HomeWrapper/>
    </View>
  )
}

export default App
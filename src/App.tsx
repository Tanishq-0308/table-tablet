import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import MainStack from './navigation/MainStack'

const App = () => {
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <SafeAreaProvider>
        <NavigationContainer>
          <MainStack/>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App
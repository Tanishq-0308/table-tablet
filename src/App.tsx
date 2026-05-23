import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import MainStack from './navigation/MainStack'
import { ButtonSettingsProvider } from './contexts/ButtonSettingsContext'
import { FeedbackProvider } from './contexts/FeedbackContext'
import { BluetoothProvider } from './contexts/BluetoothContext'
import { NativeEventEmitter, NativeModules } from 'react-native'

const { BluetoothModule }= NativeModules;
const btEvent = new NativeEventEmitter(BluetoothModule);

btEvent.addListener("BluetoothLog", (data) => {
  // console.log("NATIVE LOG:", data.log);
});
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BluetoothProvider>
        <FeedbackProvider>
          <ButtonSettingsProvider>
            <NavigationContainer>
              <MainStack />
            </NavigationContainer>
          </ButtonSettingsProvider>
        </FeedbackProvider>
        </BluetoothProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App
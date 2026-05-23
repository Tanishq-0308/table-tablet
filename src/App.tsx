import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import MainStack from './navigation/MainStack'
import { ButtonSettingsProvider } from './contexts/ButtonSettingsContext'
import { FeedbackProvider } from './contexts/FeedbackContext'
import { BluetoothProvider } from './contexts/BluetoothContext'
import { LockProvider } from './contexts/LockContext'
import { ReverseOrientProvider } from './contexts/ReverseOrientContext'
import { MemoryProvider } from './contexts/MemoryContext'
import { OffsetProvider } from './contexts/OffsetContext'
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
            <LockProvider>
              <ReverseOrientProvider>
                <MemoryProvider>
                  <OffsetProvider>
                    <NavigationContainer>
                      <MainStack />
                    </NavigationContainer>
                  </OffsetProvider>
                </MemoryProvider>
              </ReverseOrientProvider>
            </LockProvider>
          </ButtonSettingsProvider>
        </FeedbackProvider>
        </BluetoothProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App
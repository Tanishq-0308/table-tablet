import React, { useEffect } from 'react'
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
import { NativeEventEmitter, NativeModules, StatusBar } from 'react-native' // ← add StatusBar

const { BluetoothModule } = NativeModules;
const btEvent = new NativeEventEmitter(BluetoothModule);

btEvent.addListener("BluetoothLog", (_data) => {});

const App = () => {

  // ← ADD THIS
  useEffect(() => {
    StatusBar.setHidden(true, 'none');
  }, []);

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
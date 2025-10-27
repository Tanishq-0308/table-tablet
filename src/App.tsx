import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import MainStack from './navigation/MainStack'
import { ButtonSettingsProvider } from './contexts/ButtonSettingsContext'
import { FeedbackProvider } from './contexts/FeedbackContext'

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FeedbackProvider>
          <ButtonSettingsProvider>
            <NavigationContainer>
              <MainStack />
            </NavigationContainer>
          </ButtonSettingsProvider>
        </FeedbackProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App
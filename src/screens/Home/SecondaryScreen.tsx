import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SecondaryScreen = () => {
  return (
    <View style={styles.mainContainer}>
      <Text>SecondaryScreen</Text>
    </View>
  )
}

export default SecondaryScreen

const styles = StyleSheet.create({
  mainContainer: {
    flex:1,
    backgroundColor:'white'
  }
})
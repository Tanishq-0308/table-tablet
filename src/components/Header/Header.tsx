import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Logo from '../../assets/Logo/logo1.png'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import FeedbackModeSelector from './FeedbackModeSelector'
import ReverseOrientToggle from './ReverseOrientToggle'

const Header = () => {
  return (
    <View style={styles.container}>
      <Image
        source={Logo}
        style={styles.logoImage}
      />
      <View style={styles.rightCluster}>
        <ReverseOrientToggle/>
        <FeedbackModeSelector/>
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'black',
  },
    logoImage: {
      height: verticalScale(30),
      width: scale(70),
      margin:moderateScale(10)
    },
    rightCluster: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(12),
      paddingRight: moderateScale(10),
    },
})
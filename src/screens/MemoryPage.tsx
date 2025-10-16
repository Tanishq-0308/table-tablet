import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import BackButton from '../components/BackButton'
import { moderateScale } from 'react-native-size-matters'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import { MainStackParamList } from '../navigation/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const MemoryPage = () => {
  const navigation = useNavigation<NavigationProp>();
  
  return (
    <View style={styles.mainContainer}>
      <View style={styles.backButtonBox}>
        <TouchableOpacity onPress={()=> navigation.goBack()}>
          <BackButton />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MemoryPage

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: 'black',
      paddingTop:moderateScale(10),
      paddingLeft: moderateScale(10)
    },
    backButtonBox: {
      width: widthPercentageToDP('10%')
    }
})
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import BackButton from '../components/BackButton';
import { MainStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const OffsetPage = () => {
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

export default OffsetPage

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
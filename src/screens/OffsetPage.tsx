import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import BackButton from '../components/BackButton';
import { MainStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface OffsetValue {
  label: string;
  value: string;
}

const OffsetPage = () => {
  const navigation = useNavigation<NavigationProp>();

    const [offsetValues, setOffsetValues] = useState<OffsetValue[]>([
    { label: 'Actual sensor reading height', value: '0000' },
    { label: 'Ground to sensor distance at minimum height', value: '0000' },
    { label: 'Final height value', value: '0000' },
    { label: 'Slide actual reading', value: '0000' },
    { label: 'Slide minus offset', value: '0000' },
    { label: 'Final slide value', value: '0000' },
    { label: 'height plus offset', value: '0000' },
    { label: 'side tilt left', value: '0000' },
    { label: 'side tilt right', value: '0000' },
    { label: 'trend up', value: '0000' },
    { label: 'trend down', value: '0000' },
    { label: 'Back up', value: '0000' },
    { label: 'Back down', value: '0000' },
    { label: 'Leg up', value: '0000' },
    { label: 'Leg down', value: '0000' },
  ]);

  const updateValue = (index: number, newValue: string) => {

  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headBox}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonBox}>
          <BackButton />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: heightPercentageToDP(3.4), paddingRight: moderateScale(40), fontWeight: 500 }}>
            Offset in Height & Slider    in (mm)
          </Text>
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {offsetValues.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <TextInput
              style={styles.input}
              value={item.value}
              onChangeText={(text)=> updateValue(index,text)}
              keyboardType='numberic'
              maxLength={4}
              placeholder='0000'
              placeholderTextColor="#999"
            />
          </View>
        ))}
      </ScrollView>

            {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply</Text>
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
    paddingTop: moderateScale(10),
    paddingLeft: moderateScale(10)
  },
  backButtonBox: {
    width: widthPercentageToDP('10%')
  },
  headBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: widthPercentageToDP('3%'),
    paddingVertical: heightPercentageToDP('2%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: heightPercentageToDP('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 16,
    color: '#d1d1d1ff',
    flex: 1,
    marginRight: widthPercentageToDP('2%'),
  },
  input: {
    width: widthPercentageToDP('15%'),
    height: heightPercentageToDP('5%'),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: widthPercentageToDP('2%'),
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  footer: {
    padding: widthPercentageToDP('3%'),
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: widthPercentageToDP('20%'),
    paddingVertical: heightPercentageToDP('2%'),
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import BackButton from '../components/BackButton'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainStackParamList } from '../navigation/types'
import { useNavigation } from '@react-navigation/native'
import { FIRST_PAGE_BUTTONS } from '../config/buttonConfig'
import { useButtonSettings } from '../contexts/ButtonSettingsContext'

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const FactorySettingsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { buttonStates, toggleButton, toggleFeature, featureStates } = useButtonSettings();
  const [showSliderChild, setShowSliderChild] = useState(false);

  const dynamicButtons = FIRST_PAGE_BUTTONS.filter(btn => !btn.isFixed);
  const buttons = ['Memory', 'RTS', 'Battery', 'AntiCollision', 'RTP'];
  
  
  return (
    <View style={styles.mainContainer}>
      <View style={styles.backButtonBox}>
        <TouchableOpacity onPress={()=> navigation.goBack()}>
          <BackButton />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View>
          <Text style={styles.heading}>Enable / Disable</Text>
          <View>
            {dynamicButtons.map(btn => (
              <TouchableOpacity key={btn.id} style={styles.buttons} onPress={()=> toggleButton(btn.id as keyof typeof buttonStates)}>
                <Text style={buttonStates[btn.id as keyof buttonStates] ? styles.btnEnable: styles.btnText}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
            {buttons.map((btn, index )=> (
              <TouchableOpacity key={index} style={styles.buttons} onPress={() =>toggleFeature(btn as keyof typeof featureStates)}>
                <Text style={featureStates[btn] ? styles.btnEnable: styles.btnText}>{btn}</Text>
              </TouchableOpacity>
            ))}
            { featureStates.RTP &&
            <View style={{flexDirection:'row', gap:10}}>
              <TouchableOpacity style={styles.childBtn}>
                <Text style={styles.btnText}>Height</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.childBtn}>
                <Text style={styles.btnText}>Slide</Text>
              </TouchableOpacity>
            </View>
            }
          </View>
        </View>
        <View>
          <Text style={styles.heading}>Key Configuration</Text>
          <View>
            <TouchableOpacity style={styles.buttons} onPress={()=> setShowSliderChild((prev)=>!prev)}>
              <Text style={styles.btnText} >Slider</Text>
            </TouchableOpacity>
            { showSliderChild &&
            <View style={{flexDirection:'row', gap:10}}>
              <TouchableOpacity style={styles.childBtn}>
                <Text style={styles.btnText}>Zero</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.childBtn}>
                <Text style={styles.btnText}>Flex / Reflex</Text>
              </TouchableOpacity>
            </View>
            }
          </View>
        </View>
        <View>
          <TouchableOpacity onPress={()=>navigation.navigate('OffsetPage')}>
            <Text style={styles.heading}>Offset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default FactorySettingsScreen

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop:moderateScale(10),
    paddingLeft: moderateScale(10)
  },
  backButtonBox: {
    width: widthPercentageToDP('10%')
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  container: {
    flexDirection:'row',
    justifyContent:'space-between',
    padding:moderateScale(30)
  },
  heading: {
    color:'white',
    backgroundColor: '#0492b6ff',
    fontSize: heightPercentageToDP(3),
    padding:moderateScale(5),
    width:widthPercentageToDP(24),
    textAlign:'center',
    fontWeight:600
  },
  buttons: {
    // borderWidth:1,
    // borderColor: 'white',
    marginTop:moderateVerticalScale(7),
    padding:moderateScale(2),
    backgroundColor: '#969292ff'
  },
  childBtn: {
    backgroundColor: '#969292ff',
    marginTop:moderateVerticalScale(7),
    padding:moderateScale(2),
    flex:1
  },
  btnText: {
    fontSize: heightPercentageToDP(3),
    paddingVertical:moderateVerticalScale(2),
    color:'white',
    textAlign:'center',
  },
  btnEnable: {
    fontSize: heightPercentageToDP(3),
    paddingVertical:moderateVerticalScale(2),
    color:'white',
    backgroundColor:'green',
    textAlign:'center',
  }
})
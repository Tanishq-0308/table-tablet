import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../navigation/types'
import { useNavigation } from '@react-navigation/native';

import factBtn from "../../assets/images/factBtn.png"
import factImage from "../../assets/images/factImage.png"
import memoryBtn from "../../assets/images/memoryBtn.png"
import memoryImage from "../../assets/images/memoryImage.png"
import rtsBtn from "../../assets/images/rtsBtn.png"
import rtsImage from "../../assets/images/rtsImage.png"
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { useButtonSettings } from '../../contexts/ButtonSettingsContext';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';

interface dynamicBtnConfig {
  id: string;
  image: ImageSourcePropType;
  button: ImageSourcePropType;
  navigation: keyof MainStackParamList;
}

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const SecondaryScreen = () => {
  console.log("rendering second screen");
  
  const navigation = useNavigation<NavigationProp>();
  const { featureStates } = useButtonSettings();
  const dynamicButtons: dynamicBtnConfig[] = [
    {
      id: 'Memory',
      image: memoryImage,
      button: memoryBtn,
      navigation: 'MemoryPage'
    },
    {
      id: 'RTS',
      image: rtsImage,
      button: rtsBtn,
      navigation: 'RealPositionPage'
    }
  ];

  const dynamic = dynamicButtons.filter(
    btn => featureStates[btn.id as keyof typeof featureStates]
  );

  const allButtons =[
    {
      id:'factory',
      image: factImage,
      button: factBtn,
      navigation: 'FactorySettings' as keyof MainStackParamList
    },
    ...dynamic
  ];

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        // horizontal
        // showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
      {allButtons.map(btn => (
        <View style={styles.mainBox} key={btn.id} >
          <Image source={btn.image} style={styles.image} />
          <TouchableOpacity
            onPress={() => navigation.navigate(btn.navigation)}
            >
            <Image source={btn.button} resizeMode='contain'/>
          </TouchableOpacity>
        </View>
      ))}
      </ScrollView>
    </View>
  )
}

export default SecondaryScreen

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black',
    // justifyContent:'space-around'
  },
  scrollContent: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: moderateVerticalScale(7),
    paddingHorizontal:moderateScale(15),
    gap: 40, // Space between items
  },
  mainBox: {
    justifyContent: "space-around",
    alignItems: "center",
    width: widthPercentageToDP('30%'),
    height: heightPercentageToDP('30%'),
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 8,
    borderWidth: 2,
    // borderColor: '#333',
  },
  image: {
    width: widthPercentageToDP('13%'),
    height: heightPercentageToDP('13%')
  }
})
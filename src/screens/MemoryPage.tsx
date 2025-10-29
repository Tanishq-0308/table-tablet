import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import BackButton from '../components/BackButton'
import { moderateScale } from 'react-native-size-matters'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { MainStackParamList } from '../navigation/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const MemoryPage = () => {
  const navigation = useNavigation<NavigationProp>();
  const positions=[
    {
      id:"pos1",
      label: "Position 1",
    },
    {
      id:"pos2",
      label: "Position 2",
    },
    {
      id:"pos3",
      label: "Position 3",
    },
    {
      id:"pos4",
      label: "Position 4",
    },
    {
      id:"pos5",
      label: "Position 5",
    },
  ]

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headBox}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonBox}>
          <BackButton />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: heightPercentageToDP(3.4), paddingRight: moderateScale(40), fontWeight: 500 }}>
            Save / Recall Position
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        {positions.map((position)=>(
          <View key={position.id} style={styles.positionBox}>
            <Text style={{color:'white', fontSize:heightPercentageToDP(3.4)}}>
              {position.label}
            </Text>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', flex:1, gap:50}}>
              <TouchableOpacity>
                <Text style={styles.buttons}>
                  SET
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.buttons}>
                  RECALL
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default MemoryPage

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: moderateScale(10),
    paddingInline: moderateScale(10)
  },
  backButtonBox: {
    width: widthPercentageToDP('10%'),
  },
  headBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  container: {
    flex:1,
    padding:moderateScale(50),
    gap:35
  },
  positionBox: {
    flexDirection:'row',
    // backgroundColor:'#272626ff',
    padding:moderateScale(6),
    alignItems:'center',
    borderRadius:10
  },
  buttons: {
    color:'white',
    fontSize:heightPercentageToDP(3.4),
    // borderWidth:2,
    padding:moderateScale(6),
    elevation:4,
    borderRadius:10,
    width:widthPercentageToDP(15),
    textAlign:'center',
    backgroundColor:'#a5a5a518'
  }
})
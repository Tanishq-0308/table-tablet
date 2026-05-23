import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import BackButton from '../components/BackButton'
import { moderateScale } from 'react-native-size-matters'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { MainStackParamList } from '../navigation/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { MEMORY_SLOTS, MemorySlot, getMemoryPacket } from '../config/memoryConfig'
import { useMemorySlots } from '../contexts/MemoryContext'
import { useBluetooth } from '../contexts/BluetoothContext'
import { useFeedback } from '../contexts/FeedbackContext'

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const MemoryPage = () => {
  const navigation = useNavigation<NavigationProp>();
  const { status, markSet, markRecalled } = useMemorySlots();
  const { startRepeatedRawCommand, stopRepeatedCommand } = useBluetooth();
  const { doFeedback } = useFeedback();

  const handleSetPressIn = (slot: MemorySlot) => {
    doFeedback();
    markSet(slot);
    startRepeatedRawCommand(getMemoryPacket(slot, 'set'), 200);
  };

  const handleRecallPressIn = (slot: MemorySlot) => {
    doFeedback();
    // Only mark as recalled if this slot has been set at least once
    if (status[slot] !== 'unset') markRecalled(slot);
    startRepeatedRawCommand(getMemoryPacket(slot, 'recall'), 200);
  };

  const handlePressOut = () => {
    stopRepeatedCommand();
  };

  const setButtonStyle = (slot: MemorySlot) => {
    const s = status[slot];
    if (s === 'set') return styles.btnSet;
    if (s === 'recalled') return styles.btnRecalled;
    return styles.buttons;
  };

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
        {MEMORY_SLOTS.map((slot) => (
          <View key={slot} style={styles.positionBox}>
            <Text style={{ color: 'white', fontSize: heightPercentageToDP(3.4) }}>
              {`Position ${slot}`}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 50 }}>
              <TouchableOpacity
                onPressIn={() => handleSetPressIn(slot)}
                onPressOut={handlePressOut}
              >
                <Text style={setButtonStyle(slot)}>SET</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPressIn={() => handleRecallPressIn(slot)}
                onPressOut={handlePressOut}
              >
                <Text style={styles.buttons}>RECALL</Text>
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
    flex: 1,
    padding: moderateScale(50),
    gap: 35
  },
  positionBox: {
    flexDirection: 'row',
    padding: moderateScale(6),
    alignItems: 'center',
    borderRadius: 10
  },
  buttons: {
    color: 'white',
    fontSize: heightPercentageToDP(3.4),
    padding: moderateScale(6),
    elevation: 4,
    borderRadius: 10,
    width: widthPercentageToDP(15),
    textAlign: 'center',
    backgroundColor: '#a5a5a518'
  },
  btnSet: {
    color: 'white',
    fontSize: heightPercentageToDP(3.4),
    padding: moderateScale(6),
    elevation: 4,
    borderRadius: 10,
    width: widthPercentageToDP(15),
    textAlign: 'center',
    backgroundColor: '#1e7a3a'
  },
  btnRecalled: {
    color: 'white',
    fontSize: heightPercentageToDP(3.4),
    padding: moderateScale(6),
    elevation: 4,
    borderRadius: 10,
    width: widthPercentageToDP(15),
    textAlign: 'center',
    backgroundColor: '#d97706'
  }
})

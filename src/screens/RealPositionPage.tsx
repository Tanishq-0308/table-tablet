import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackButton from '../components/BackButton';
import { MainStackParamList } from '../navigation/types';
import { useBluetooth, useBluetoothAngles, useBluetoothStats } from '../contexts/BluetoothContext';
import { useButtonSettings } from '../contexts/ButtonSettingsContext';
import { useOffsets } from '../contexts/OffsetContext';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const RealPositionPage = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    isReceivingData
  } = useBluetooth();

  const angles = useBluetoothAngles();
  const stats = useBluetoothStats();
  const { buttonStates } = useButtonSettings();
  const gyroEnabled = buttonStates.btn6;
  const { offsets } = useOffsets();

  const displayed = {
    sideTiltLeft: angles.sideTiltLeft + offsets.tiltLeft,
    sideTiltRight: angles.sideTiltRight + offsets.tiltRight,
    backUp: angles.backUp + offsets.backUp,
    backDown: angles.backDown + offsets.backDown,
    trendelenburg: angles.trendelenburg + offsets.trendUp,
    revTrendelenburg: angles.revTrendelenburg + offsets.trendDown,
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headBox}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonBox}>
          <BackButton />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: heightPercentageToDP(3.4), paddingRight: moderateScale(40), fontWeight: 500 }}>
            Real-Time Position
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.dataDisplay}>
        <View style={[styles.statusBar, { backgroundColor: isReceivingData ? '#4CAF50' : '#FF5722' }]}>
          <Text style={styles.statusText}>
            {isReceivingData ? '🟢 LIVE (Native)' : '🔴 NO DATA'}
          </Text>
          <Text style={styles.rateText}>{stats.dataRate} pkt/s</Text>
        </View>

        {gyroEnabled && (
          <>
            {/* Side Tilt */}
            <View style={styles.angleSection}>
              <Text style={styles.sectionTitle}>Side Tilt</Text>
              <View style={styles.angleRow}>
                <View style={styles.angleItem}>
                  <Text style={styles.angleLabel}>← Left</Text>
                  <Text style={styles.angleValue}>{displayed.sideTiltLeft}°</Text>
                </View>
                <View style={styles.angleItem}>
                  <Text style={styles.angleLabel}>Right →</Text>
                  <Text style={styles.angleValue}>{displayed.sideTiltRight}°</Text>
                </View>
              </View>
            </View>

            {/* Back Tilt */}
            <View style={styles.angleSection}>
              <Text style={styles.sectionTitle}>Back Position</Text>
              <View style={styles.angleRow}>
                <View style={styles.angleItem}>
                  <Text style={styles.angleLabel}>↑ Up</Text>
                  <Text style={styles.angleValue}>{displayed.backUp}°</Text>
                </View>
                <View style={styles.angleItem}>
                  <Text style={styles.angleLabel}>Down ↓</Text>
                  <Text style={styles.angleValue}>{displayed.backDown}°</Text>
                </View>
              </View>
            </View>

            {/* Trendelenburg */}
            <View style={styles.angleSection}>
              <Text style={styles.sectionTitle}>Trendelenburg</Text>
              <View style={styles.angleRow}>
                <View style={styles.angleItem}>
                  <Text style={styles.angleLabel}>Normal</Text>
                  <Text style={styles.angleValue}>{displayed.trendelenburg}°</Text>
                </View>
                <View style={styles.angleItem}>
                  <Text style={styles.angleLabel}>Reverse</Text>
                  <Text style={styles.angleValue}>{displayed.revTrendelenburg}°</Text>
                </View>
              </View>
            </View>

            {/* Height */}
            <View style={styles.angleSection}>
              <Text style={styles.sectionTitle}>Height</Text>
              <View style={styles.angleRow}>
                <View style={styles.angleItem}>
                  <Text style={styles.angleLabel}>Position</Text>
                  <Text style={styles.angleValue}>0°</Text>
                </View>
              </View>
            </View>

            {/* Slide */}
            <View style={styles.angleSection}>
              <Text style={styles.sectionTitle}>Slide</Text>
              <View style={styles.angleRow}>
                <View style={styles.angleItem}>
                  <Text style={styles.angleLabel}>Position</Text>
                  <Text style={styles.angleValue}>0°</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {stats.lastUpdateTime && (
          <Text style={styles.timeText}>Last Update: {stats.lastUpdateTime}</Text>
        )}
      </ScrollView>
    </View>
  )
}

export default RealPositionPage

const styles = StyleSheet.create({
      dataDisplay: {
        padding: 16,
        backgroundColor: 'black',
        borderRadius: 8,
        margin: 16,
    },
    statusBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    statusText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    rateText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
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
  angleSection: {
    marginBottom: 16,
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  angleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  angleItem: {
    alignItems: 'center',
  },
  angleLabel: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 4,
  },
  angleValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
})
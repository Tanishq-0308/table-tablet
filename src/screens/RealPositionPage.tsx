import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackButton from '../components/BackButton';
import { MainStackParamList } from '../navigation/types';
import { useBluetooth, useBluetoothAngles, useBluetoothStats } from '../contexts/BluetoothContext';
import { useButtonSettings } from '../contexts/ButtonSettingsContext';
import { useOffsets } from '../contexts/OffsetContext';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Placeholder until linear (height/slide) sensor logic is wired in.
const HEIGHT_MM_PLACEHOLDER: number | null = null;
const SLIDE_MM_PLACEHOLDER: number | null = null;

const RealPositionPage = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isReceivingData } = useBluetooth();
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

  const formatMm = (v: number | null) => (v == null ? '—' : `${v}`);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headBox}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonBox}>
          <BackButton />
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Real-Time Position</Text>
        </View>
        <View style={styles.backButtonBox} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.statusBar, { backgroundColor: isReceivingData ? '#27ae60' : '#cf0a0a' }]}>
          <Text style={styles.statusText}>
            {isReceivingData ? '● LIVE' : '○ NO DATA'}
          </Text>
          <Text style={styles.rateText}>{stats.dataRate} pkt/s</Text>
        </View>

        {/* Linear measurements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Linear</Text>
          <View style={styles.tileRow}>
            <View style={styles.tile}>
              <Text style={styles.tileLabel}>Height</Text>
              <View style={styles.tileValueRow}>
                <Text style={styles.tileValue}>{formatMm(HEIGHT_MM_PLACEHOLDER)}</Text>
                <Text style={styles.tileUnit}>mm</Text>
              </View>
            </View>
            <View style={styles.tile}>
              <Text style={styles.tileLabel}>Slide</Text>
              <View style={styles.tileValueRow}>
                <Text style={styles.tileValue}>{formatMm(SLIDE_MM_PLACEHOLDER)}</Text>
                <Text style={styles.tileUnit}>mm</Text>
              </View>
            </View>
          </View>
        </View>

        {gyroEnabled && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Side Tilt</Text>
              <View style={styles.tileRow}>
                <View style={styles.tile}>
                  <Text style={styles.tileLabel}>← Left</Text>
                  <View style={styles.tileValueRow}>
                    <Text style={styles.tileValue}>{displayed.sideTiltLeft}</Text>
                    <Text style={styles.tileUnit}>°</Text>
                  </View>
                </View>
                <View style={styles.tile}>
                  <Text style={styles.tileLabel}>Right →</Text>
                  <View style={styles.tileValueRow}>
                    <Text style={styles.tileValue}>{displayed.sideTiltRight}</Text>
                    <Text style={styles.tileUnit}>°</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Back Position</Text>
              <View style={styles.tileRow}>
                <View style={styles.tile}>
                  <Text style={styles.tileLabel}>↑ Up</Text>
                  <View style={styles.tileValueRow}>
                    <Text style={styles.tileValue}>{displayed.backUp}</Text>
                    <Text style={styles.tileUnit}>°</Text>
                  </View>
                </View>
                <View style={styles.tile}>
                  <Text style={styles.tileLabel}>Down ↓</Text>
                  <View style={styles.tileValueRow}>
                    <Text style={styles.tileValue}>{displayed.backDown}</Text>
                    <Text style={styles.tileUnit}>°</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trendelenburg</Text>
              <View style={styles.tileRow}>
                <View style={styles.tile}>
                  <Text style={styles.tileLabel}>Normal</Text>
                  <View style={styles.tileValueRow}>
                    <Text style={styles.tileValue}>{displayed.trendelenburg}</Text>
                    <Text style={styles.tileUnit}>°</Text>
                  </View>
                </View>
                <View style={styles.tile}>
                  <Text style={styles.tileLabel}>Reverse</Text>
                  <View style={styles.tileValueRow}>
                    <Text style={styles.tileValue}>{displayed.revTrendelenburg}</Text>
                    <Text style={styles.tileUnit}>°</Text>
                  </View>
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
  mainContainer: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: moderateScale(10),
    paddingHorizontal: moderateScale(10),
  },
  headBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButtonBox: {
    width: widthPercentageToDP('10%'),
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: heightPercentageToDP(2.8),
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: widthPercentageToDP('2%'),
    paddingTop: moderateVerticalScale(6),
    paddingBottom: moderateVerticalScale(12),
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateVerticalScale(5),
    borderRadius: 8,
    marginBottom: moderateVerticalScale(8),
  },
  statusText: {
    color: 'white',
    fontSize: heightPercentageToDP(1.6),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  rateText: {
    color: 'white',
    fontSize: heightPercentageToDP(1.5),
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingBottom: moderateVerticalScale(6),
    marginBottom: moderateVerticalScale(8),
    overflow: 'hidden',
  },
  sectionTitle: {
    color: 'white',
    backgroundColor: '#0492b6',
    fontSize: heightPercentageToDP(1.8),
    fontWeight: '600',
    paddingVertical: moderateVerticalScale(4),
    paddingHorizontal: moderateScale(12),
  },
  tileRow: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(8),
    paddingTop: moderateVerticalScale(6),
    gap: moderateScale(8),
  },
  tile: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 8,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateVerticalScale(6),
    alignItems: 'center',
  },
  tileLabel: {
    color: '#9aa0a6',
    fontSize: heightPercentageToDP(1.5),
    marginBottom: moderateVerticalScale(2),
  },
  tileValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: moderateScale(3),
  },
  tileValue: {
    color: 'white',
    fontSize: heightPercentageToDP(2.6),
    fontWeight: '700',
  },
  tileUnit: {
    color: '#9aa0a6',
    fontSize: heightPercentageToDP(1.6),
    fontWeight: '600',
  },
  timeText: {
    color: '#666',
    fontSize: heightPercentageToDP(1.3),
    textAlign: 'center',
    marginTop: moderateVerticalScale(4),
  },
})

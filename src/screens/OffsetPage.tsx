import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';
import BackButton from '../components/BackButton';
import { MainStackParamList } from '../navigation/types';
import NumericStepper from '../components/NumericStepper';
import { OffsetKey, useOffsets } from '../contexts/OffsetContext';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Placeholder until height/slide sensor logic is wired in.
const SENSOR_HEIGHT_READING = 0;
const SENSOR_SLIDE_READING = 0;

type ComputedKey =
  | 'sensorHeight'
  | 'finalHeight'
  | 'slideActual'
  | 'finalSlide';

type StepperRow = { kind: 'stepper'; label: string; key: OffsetKey };
type ComputedRow = { kind: 'computed'; label: string; key: ComputedKey };
type Row = StepperRow | ComputedRow;

const ROWS: Row[] = [
  { kind: 'computed', label: 'Actual sensor reading height', key: 'sensorHeight' },
  { kind: 'stepper', label: 'Ground to sensor distance at minimum height', key: 'groundToSensorMin' },
  { kind: 'computed', label: 'Final height value', key: 'finalHeight' },
  { kind: 'computed', label: 'Slide actual reading', key: 'slideActual' },
  { kind: 'stepper', label: 'Slide minus offset', key: 'slideMinusOffset' },
  { kind: 'computed', label: 'Final slide value', key: 'finalSlide' },
  { kind: 'stepper', label: 'height plus offset', key: 'heightPlusOffset' },
  { kind: 'stepper', label: 'side tilt left', key: 'tiltLeft' },
  { kind: 'stepper', label: 'side tilt right', key: 'tiltRight' },
  { kind: 'stepper', label: 'trend up', key: 'trendUp' },
  { kind: 'stepper', label: 'trend down', key: 'trendDown' },
  { kind: 'stepper', label: 'Back up', key: 'backUp' },
  { kind: 'stepper', label: 'Back down', key: 'backDown' },
];

const OffsetPage = () => {
  const navigation = useNavigation<NavigationProp>();
  const { offsets, incOffset, decOffset, getRange } = useOffsets();

  const computedValue = (key: ComputedKey): number => {
    switch (key) {
      case 'sensorHeight': return SENSOR_HEIGHT_READING;
      case 'slideActual': return SENSOR_SLIDE_READING;
      case 'finalHeight': return SENSOR_HEIGHT_READING + offsets.groundToSensorMin;
      case 'finalSlide': return offsets.slideMinusOffset * 2;
    }
  };

  const handleApply = () => {
    // Logic wired in next step
    console.log('Apply offsets:', offsets);
  };

  // Wider value box for numeric (4-digit) steppers so 2000 fits cleanly.
  const valueWidthFor = (key: OffsetKey): number =>
    key === 'tiltLeft' || key === 'tiltRight' ||
    key === 'trendUp' || key === 'trendDown' ||
    key === 'backUp' || key === 'backDown'
      ? 8
      : 12;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headBox}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonBox}>
          <BackButton />
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Offset in Height &amp; Slider (mm)</Text>
        </View>
        <View style={styles.backButtonBox} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {ROWS.map(row => (
          <View key={row.key} style={styles.row}>
            <Text style={styles.label} numberOfLines={2}>{row.label}</Text>
            {row.kind === 'stepper' ? (
              <NumericStepper
                value={offsets[row.key]}
                min={getRange(row.key).min}
                max={getRange(row.key).max}
                onIncrement={() => incOffset(row.key)}
                onDecrement={() => decOffset(row.key)}
                valueWidth={valueWidthFor(row.key)}
              />
            ) : (
              <View style={styles.readonlyBox}>
                <Text style={styles.readonlyText}>{computedValue(row.key)}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply} activeOpacity={0.8}>
          <Text style={styles.applyButtonText}>APPLY</Text>
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
    fontSize: heightPercentageToDP(3.4),
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    marginTop: moderateVerticalScale(8),
  },
  scrollContent: {
    paddingHorizontal: widthPercentageToDP('3%'),
    paddingBottom: moderateVerticalScale(10),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: moderateVerticalScale(10),
    paddingHorizontal: moderateScale(14),
    borderRadius: 10,
    marginBottom: moderateVerticalScale(8),
  },
  label: {
    fontSize: heightPercentageToDP(2.2),
    color: '#e5e5e5',
    flex: 1,
    marginRight: widthPercentageToDP('2%'),
  },
  readonlyBox: {
    minWidth: widthPercentageToDP('14%'),
    height: heightPercentageToDP('5.5%'),
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#3a3a3a',
    borderRadius: 8,
    paddingHorizontal: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  readonlyText: {
    color: '#9aa0a6',
    fontSize: heightPercentageToDP(2.4),
    fontWeight: '600',
  },
  footer: {
    paddingVertical: moderateVerticalScale(10),
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: widthPercentageToDP('18%'),
    paddingVertical: moderateVerticalScale(10),
    borderRadius: 10,
  },
  applyButtonText: {
    color: 'white',
    fontSize: heightPercentageToDP(2.4),
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
})

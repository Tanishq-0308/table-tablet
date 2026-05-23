import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import BackButton from '../components/BackButton'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainStackParamList } from '../navigation/types'
import { useNavigation } from '@react-navigation/native'
import { FIRST_PAGE_BUTTONS } from '../config/buttonConfig'
import { useButtonSettings } from '../contexts/ButtonSettingsContext'

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Feature toggles shown under "Enable / Disable" (in addition to the dynamic main-screen buttons).
const FEATURE_TOGGLES = ['Memory', 'RTS', 'Battery', 'AntiCollision', 'RTP'] as const;

const FactorySettingsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { buttonStates, toggleButton, featureStates, toggleFeature } = useButtonSettings();
  const [showSliderChild, setShowSliderChild] = useState(false);

  const dynamicButtons = FIRST_PAGE_BUTTONS.filter(btn => !btn.isFixed);

  const renderToggleRow = (label: string, value: boolean, onValueChange: () => void) => (
    <View key={label} style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#3a3a3a', true: '#27ae60' }}
        thumbColor={value ? '#ffffff' : '#cccccc'}
      />
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headBox}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonBox}>
          <BackButton />
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Factory Settings</Text>
        </View>
        <View style={styles.backButtonBox} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.columns}>

          {/* Enable / Disable card */}
          <View style={[styles.card, styles.cardWide]}>
            <Text style={styles.cardHeader}>Enable / Disable</Text>

            {dynamicButtons.map(btn =>
              renderToggleRow(
                btn.label,
                buttonStates[btn.id as keyof typeof buttonStates],
                () => toggleButton(btn.id as keyof typeof buttonStates)
              )
            )}

            {FEATURE_TOGGLES.map(featureId => (
              <View key={featureId}>
                {renderToggleRow(
                  featureId,
                  featureStates[featureId as keyof typeof featureStates],
                  () => toggleFeature(featureId as keyof typeof featureStates)
                )}
                {featureId === 'RTP' && featureStates.RTP && (
                  <View style={styles.childRow}>
                    <View style={styles.childPill}>
                      <Text style={styles.childPillText}>Height</Text>
                    </View>
                    <View style={styles.childPill}>
                      <Text style={styles.childPillText}>Slide</Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Key Configuration card */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Key Configuration</Text>

            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setShowSliderChild(prev => !prev)}
              activeOpacity={0.7}
            >
              <Text style={styles.toggleLabel}>Slider</Text>
              <Text style={styles.chevron}>{showSliderChild ? '▾' : '▸'}</Text>
            </TouchableOpacity>

            {showSliderChild && (
              <View style={styles.childRow}>
                <View style={styles.childPill}>
                  <Text style={styles.childPillText}>Zero</Text>
                </View>
                <View style={styles.childPill}>
                  <Text style={styles.childPillText}>Flex / Reflex</Text>
                </View>
              </View>
            )}
          </View>

          {/* Offset navigation tile */}
          <TouchableOpacity
            style={[styles.card, styles.offsetTile]}
            onPress={() => navigation.navigate('OffsetPage')}
            activeOpacity={0.8}
          >
            <Text style={styles.offsetTileTitle}>Offset</Text>
            <Text style={styles.offsetTileHint}>Configure offsets ›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default FactorySettingsScreen

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
  scrollContent: {
    paddingVertical: moderateVerticalScale(12),
    paddingHorizontal: widthPercentageToDP('2%'),
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: moderateScale(12),
  },
  card: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingBottom: moderateVerticalScale(8),
    overflow: 'hidden',
  },
  cardWide: {
    flex: 1.4,
  },
  cardHeader: {
    color: 'white',
    backgroundColor: '#0492b6',
    fontSize: heightPercentageToDP(2.6),
    fontWeight: '600',
    paddingVertical: moderateVerticalScale(8),
    textAlign: 'center',
    marginBottom: moderateVerticalScale(6),
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateVerticalScale(8),
  },
  toggleLabel: {
    color: '#e5e5e5',
    fontSize: heightPercentageToDP(2.4),
    fontWeight: '500',
  },
  chevron: {
    color: '#9aa0a6',
    fontSize: heightPercentageToDP(2.6),
    paddingHorizontal: moderateScale(4),
  },
  childRow: {
    flexDirection: 'row',
    gap: moderateScale(8),
    paddingHorizontal: moderateScale(14),
    paddingBottom: moderateVerticalScale(8),
  },
  childPill: {
    flex: 1,
    backgroundColor: '#262626',
    borderRadius: 8,
    paddingVertical: moderateVerticalScale(8),
    alignItems: 'center',
  },
  childPillText: {
    color: '#cccccc',
    fontSize: heightPercentageToDP(2.1),
    fontWeight: '500',
  },
  offsetTile: {
    paddingTop: 0,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateVerticalScale(40),
  },
  offsetTileTitle: {
    color: 'white',
    fontSize: heightPercentageToDP(3.2),
    fontWeight: '600',
    marginBottom: moderateVerticalScale(6),
  },
  offsetTileHint: {
    color: '#9aa0a6',
    fontSize: heightPercentageToDP(2),
  },
})

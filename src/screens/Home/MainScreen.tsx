import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useButtonSettings } from '../../contexts/ButtonSettingsContext';
import { FIRST_PAGE_BUTTONS } from '../../config/buttonConfig';
import CustomButton from '../../components/CustomButton';



const MainScreen = () => {
  const { buttonStates } = useButtonSettings();

  const fixedButtons = FIRST_PAGE_BUTTONS.filter(btn => btn.isFixed);

  const dynamicButtons = FIRST_PAGE_BUTTONS.filter(
    btn => !btn.isFixed && buttonStates[btn.id as keyof typeof buttonStates]
  );

  const allVisibleButtons = [...fixedButtons, ...dynamicButtons];

  const handleUpPress = (buttonId: string, label: string) => {
    console.log(`${label} (${buttonId}) UP pressed`);

  };

  const handleDownPress = (buttonId: string, label: string) => {
    console.log(`${label} (${buttonId}) DOWN pressed`);
  }

  const [isTablet, setIsTablet] = useState(Dimensions.get('window').width > 800);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      if (window.width > 800) {
        setIsTablet(true);
      } else if (window.width <= 800) {
        setIsTablet(false);
      }
    })
    return () => subscription?.remove();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.buttonGrid}>
          {allVisibleButtons.map((btn)=> (
            <View key={btn.id} style={styles.buttonWrapper}>
              <CustomButton
                type={btn.type}
                upButton={btn.upButton}
                middleImage={btn.middleImage}
                downButton={btn.downButton}
                onUpPress={() => handleUpPress(btn.id, btn.label)}
                onDownPress={btn.type === 'standard'
                  ? () => handleDownPress(btn.id, btn.label)
                  : undefined
                }
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

export default MainScreen

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black'
  },
 container: {
    flex: 1,
    backgroundColor: 'black',
  },
  buttonGrid: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    width: '48%',
    marginBottom: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 10,
  },
})
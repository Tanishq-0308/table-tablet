import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import { useButtonSettings } from '../../contexts/ButtonSettingsContext';
import { FIRST_PAGE_BUTTONS } from '../../config/buttonConfig';
import CustomButton from '../../components/CustomButton';
import { moderateScale } from 'react-native-size-matters';
import { useFeedback } from '../../contexts/FeedbackContext';
import { useBluetooth, useBluetoothAngles, useBluetoothStats } from '../../contexts/BluetoothContext';
import { getCommandCode } from '../../config/commandConfig';  // ✅ Add this import


interface MainScreenProps {
  connected?: (isConnected: boolean) => void;
}

const MainScreen = () => {
  const {
    isConnected,
    isReceivingData,
    startRepeatedCommand,
    stopRepeatedCommand
  } = useBluetooth();

  const stats = useBluetoothStats();

  const { buttonStates } = useButtonSettings();
  const { doFeedback } = useFeedback();

  const fixedButtons = FIRST_PAGE_BUTTONS.filter(btn => btn.isFixed);

  const dynamicButtons = FIRST_PAGE_BUTTONS.filter(
    btn => !btn.isFixed && buttonStates[btn.id as keyof typeof buttonStates]
  );

  const allVisibleButtons = [...fixedButtons, ...dynamicButtons];

  // ✅ Updated: Use command mapping
  const handleUpPress = (buttonId: string, label: string) => {
    const commandCode = getCommandCode(buttonId, true);  // true = up
    console.log(`${label} (${buttonId}) UP pressed → Command: 0x${commandCode.toString(16)}`);
    startRepeatedCommand(commandCode, 200);
    doFeedback();
  };

  // ✅ Updated: Use command mapping
  const handleDownPress = (buttonId: string, label: string) => {
    const commandCode = getCommandCode(buttonId, false);  // false = down
    console.log(`${label} (${buttonId}) DOWN pressed → Command: 0x${commandCode.toString(16)}`);
    startRepeatedCommand(commandCode, 200);
    doFeedback();
  }

  const handlePressOut = () => {
    stopRepeatedCommand();
  }

  return (
    <View style={styles.mainContainer}>
      <View>
        <ScrollView contentContainerStyle={styles.buttonGrid}>
          {allVisibleButtons.map((btn) => (
            <View key={btn.id}>
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
                onPressout={handlePressOut}
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
    backgroundColor: 'black',
  },
  buttonGrid: {
    paddingInline: moderateScale(10),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
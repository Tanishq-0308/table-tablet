import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import { useButtonSettings } from '../../contexts/ButtonSettingsContext';
import { FIRST_PAGE_BUTTONS } from '../../config/buttonConfig';
import CustomButton from '../../components/CustomButton';
import { moderateScale } from 'react-native-size-matters';
import { useFeedback } from '../../contexts/FeedbackContext';
import { useBluetooth, useBluetoothAngles, useBluetoothStats } from '../../contexts/BluetoothContext';
import { getCommandCode } from '../../config/commandConfig';  // ✅ Add this import
import { useLock } from '../../contexts/LockContext';
import { useReverseOrient } from '../../contexts/ReverseOrientContext';

const LOCK_BUTTON_ID = 'btn5';
const REVERSE_BUTTON_ID = 'btn7';
const TREND_BUTTON_ID = 'btn2';
const ZERO_BUTTON_ID = 'btn6';


interface MainScreenProps {
  connected?: (isConnected: boolean) => void;
}

const MainScreen = () => {
  const {
    isConnected,
    isReceivingData,
    startRepeatedCommand,
    stopRepeatedCommand,
    startRepeatedZeroCommand,
    startRepeatedLabelCommand,
  } = useBluetooth();

  const stats = useBluetoothStats();

  const { buttonStates } = useButtonSettings();
  const { doFeedback } = useFeedback();
  const { isLocked, lock, unlock } = useLock();
  const { isReverseActive, toggleReverse } = useReverseOrient();

  // Reverse moved to the global header toggle; its tile is hidden but the
  // config entry stays in place.
  const fixedButtons = FIRST_PAGE_BUTTONS.filter(
    btn => btn.isFixed && btn.id !== REVERSE_BUTTON_ID
  );

  const dynamicButtons = FIRST_PAGE_BUTTONS.filter(btn => {
    if (btn.isFixed) return false;
    // If gateBy is set, follow that other button's toggle state instead of own id.
    const gateId = (btn.gateBy ?? btn.id) as keyof typeof buttonStates;
    return buttonStates[gateId];
  });

  const allVisibleButtons = [...fixedButtons, ...dynamicButtons];

  // While reverse-orientation is active, swap trend up/down so up sends rev-trend
  // and down sends trend. All other buttons unaffected.
  const resolveDirection = (buttonId: string, isUp: boolean): boolean => {
    if (buttonId === TREND_BUTTON_ID && isReverseActive) return !isUp;
    return isUp;
  };

  const handleUpPress = (buttonId: string, label: string) => {
    // Lock button (btn5 up) toggles app lock — no Bluetooth command sent
    if (buttonId === LOCK_BUTTON_ID) {
      lock();
      doFeedback();
      return;
    }
    // Reverse button (btn7) toggles reverse-orientation — no Bluetooth command sent
    if (buttonId === REVERSE_BUTTON_ID) {
      toggleReverse();
      doFeedback();
      return;
    }
    if (isLocked) return;
    // Zero (btn6) requires a two-packet sequence interleaved while held —
    // mirrors the hardware remote's two-button combo.
    if (buttonId === ZERO_BUTTON_ID) {
      console.log(`${label} (${buttonId}) UP pressed → Zero combo packets`);
      startRepeatedZeroCommand(200);
      doFeedback();
      return;
    }
    const commandCode = getCommandCode(buttonId, resolveDirection(buttonId, true));
    console.log(`${label} (${buttonId}) UP pressed → Command: 0x${commandCode.toString(16)}`);
    startRepeatedCommand(commandCode, 200);
    doFeedback();
  };

  const handleDownPress = (buttonId: string, label: string) => {
    // Unlock button (btn5 down) clears app lock — no Bluetooth command sent
    if (buttonId === LOCK_BUTTON_ID) {
      unlock();
      doFeedback();
      return;
    }
    if (isLocked) return;
    // Label sits on the down position of the Zero tile (btn6); sends only
    // the Zero packet (no modifier frame).
    if (buttonId === ZERO_BUTTON_ID) {
      console.log(`${label} (${buttonId}) DOWN pressed → Label (Zero only)`);
      startRepeatedLabelCommand(200);
      doFeedback();
      return;
    }
    const commandCode = getCommandCode(buttonId, resolveDirection(buttonId, false));
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
          {allVisibleButtons.map((btn) => {
            const isLockBtn = btn.id === LOCK_BUTTON_ID;
            const isReverseBtn = btn.id === REVERSE_BUTTON_ID;
            const isTrendBtn = btn.id === TREND_BUTTON_ID;
            // While locked: disable everything except the unlock action (btn5 down).
            // The lock button (btn5 up) is also disabled while locked since we're already locked.
            const upDisabled = isLocked && !isLockBtn ? true : (isLocked && isLockBtn);
            const downDisabled = isLocked && !isLockBtn;
            // Reverse turns green when active; Trend turns red while reverse is active
            // (signals that its up/down direction is inverted).
            const active = (isReverseBtn || isTrendBtn) && isReverseActive;
            const activeVariant = isTrendBtn ? 'red' : 'green';
            return (
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
                  upDisabled={upDisabled}
                  downDisabled={downDisabled}
                  active={active}
                  activeVariant={activeVariant}
                />
              </View>
            );
          })}
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
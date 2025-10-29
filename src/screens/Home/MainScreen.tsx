import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import { useButtonSettings } from '../../contexts/ButtonSettingsContext';
import { FIRST_PAGE_BUTTONS } from '../../config/buttonConfig';
import CustomButton from '../../components/CustomButton';
import { moderateScale } from 'react-native-size-matters';
import { useFeedback } from '../../contexts/FeedbackContext';



const MainScreen = () => {
    console.log("rendering mainscreen");
  const { buttonStates } = useButtonSettings();
  const { doFeedback} = useFeedback();

  const fixedButtons = FIRST_PAGE_BUTTONS.filter(btn => btn.isFixed);

  const dynamicButtons = FIRST_PAGE_BUTTONS.filter(
    btn => !btn.isFixed && buttonStates[btn.id as keyof typeof buttonStates]
  );

  const allVisibleButtons = [...fixedButtons, ...dynamicButtons];

  const handleUpPress = (buttonId: string, label: string) => {
    console.log(`${label} (${buttonId}) UP pressed`);
    doFeedback();

  };

  const handleDownPress = (buttonId: string, label: string) => {
    console.log(`${label} (${buttonId}) DOWN pressed`);
    doFeedback();
  }

  return (
    <View style={styles.mainContainer}>
      <View>
        <ScrollView contentContainerStyle={styles.buttonGrid}>
          {allVisibleButtons.map((btn)=> (
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
    // borderWidth:2,
    // borderColor:'white',
    // justifyContent:'space-around'
  },
  buttonGrid: {
    paddingInline: moderateScale(10),
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-around',
  },
})
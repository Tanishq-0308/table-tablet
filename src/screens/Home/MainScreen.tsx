import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import heightUpBtn from "../../assets/images/heightUp.png"
import planeImage from "../../assets/images/planeImage.png"
import heightDownBtn from "../../assets/images/heightDown.png"
import sideTiltLeftBtn from "../../assets/images/tiltLeftBtn.png"
import tiltImage from "../../assets/images/tiltImage.png"
import sideTiltRightBtn from "../../assets/images/tiltRightBtn.png"
import flexBtn from "../../assets/images/flexBtn.png"
import reflexBtn from "../../assets/images/reflexBtn.png"
import flexImage from "../../assets/images/flexImage.png"
import trendBtn from "../../assets/images/trendBtn.png"
import trendImage from "../../assets/images/trendImage.png"
import revTrendBtn from "../../assets/images/revTrendBtn.png"
import lockBtn from "../../assets/images/lockBtn.png"
import lockImage from "../../assets/images/lockImage.png"
import unlockBtn from "../../assets/images/unlockBtn.png"
import zeroBtn from "../../assets/images/zeroBtn.png"
import reverseImage from "../../assets/images/reverseImage.png"
import revOrientBtn from "../../assets/images/orientBtn.png"
import backUpBtn from "../../assets/images/backup.png"
import backImage from "../../assets/images/backImage.png"
import backDownBtn from "../../assets/images/backDown.png"
import slideBtn from "../../assets/images/slideBtn.png"
import revSlideBtn from "../../assets/images/revSlideBtn.png"
import fLockBtn from "../../assets/images/fLock.png"
import fUnlockBtn from "../../assets/images/fUnlock.png"


const MainScreen = () => {

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
      {/* <View style={styles.container1}>
        <View style={styles.mainBox}>
          <TouchableOpacity>
            <Image source={heightUpBtn} />
          </TouchableOpacity>
          <Image source={planeImage} />
          <TouchableOpacity>
            <Image source={heightDownBtn} />
          </TouchableOpacity>
        </View>
        <View style={styles.mainBox}>

        </View>
        <View style={styles.mainBox}>

        </View>
      </View>
      <View style={styles.container2}>
        <View style={styles.mainBox}>

        </View>
        <View style={styles.mainBox}>

        </View>
        <View style={styles.mainBox}>

        </View>
      </View>
      <View style={styles.container3}>
        <View style={styles.mainBox}>

        </View>
        <View style={styles.mainBox}>

        </View>
        <View style={styles.mainBox}>

        </View>
      </View> */}
    </View>
  )
}

export default MainScreen

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black'
  },
  container1: {

  },
  container2: {

  },
  container3: {

  },
  mainBox: {
    flexDirection: 'row'
  }
})
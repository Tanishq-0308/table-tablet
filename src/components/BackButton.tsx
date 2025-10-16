import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const BackButton = () => {
    return (
        <View style={styles.backBtnContainer}>
            <Text style={styles.backBtn}>GO BACK</Text>
        </View>
    )
}

export default BackButton

const styles = StyleSheet.create({
    backBtnContainer: {
        backgroundColor: '#27ae60',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 17,
    },
    backBtn: {
        fontSize: hp('1.8%'),
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 1
    },
})
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { heightPercentageToDP, heightPercentageToDP as hp, widthPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';

type ButtonType = 'standard' | 'single';

interface CustomButtonProps {
    type: ButtonType;
    upButton: ImageSourcePropType;
    middleImage: ImageSourcePropType;
    downButton?: ImageSourcePropType;
    onUpPress: () => void;
    onDownPress?: () => void;
    onPressout: () =>void;
}

const CustomButton = ({
    type,
    upButton,
    middleImage,
    downButton,
    onUpPress,
    onDownPress,
    onPressout,
}: CustomButtonProps) => {

    if (type === 'single') {
        return (
            <View style={styles.singleBox}>
                <Image source={middleImage} style={styles.bigIcon} />
                <TouchableOpacity onPressIn={onUpPress} onPressOut={onPressout}>
                    <Image source={upButton} style={styles.icon} />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.mainBox}>
            <TouchableOpacity onPressIn={onUpPress} onPressOut={onPressout}>
                <Image source={upButton} style={styles.icon} />
            </TouchableOpacity>

            <Image source={middleImage} style={styles.bigIcon} />

            <TouchableOpacity onPressIn={onDownPress} onPressOut={onPressout}>
                <Image source={downButton} style={styles.icon} />
            </TouchableOpacity>
        </View>
    )

}

export default CustomButton

const styles = StyleSheet.create({
    mainBox: {
        // flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: widthPercentageToDP('30%'),
        height:heightPercentageToDP('25%'),
        marginHorizontal: moderateScale(6),
        marginVertical: moderateScale(6),
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 10,
        borderWidth: 2,
        // borderColor: 'white'
    },
    singleBox: {
        // flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",
        width: widthPercentageToDP('13.5%'),
        marginVertical: moderateScale(5) ,
        marginHorizontal: moderateScale(10) ,
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        paddingVertical: moderateScale(5.7),
        borderWidth: 2,
        // borderColor: 'white'
    },
    icon: {
        // resizeMode: "contain",
        // height: 100,
        // width: 100,
        // marginHorizontal: 20,
    },
    bigIcon: {
        width: wp('10%'),
        height: hp('12%'),
        resizeMode: "contain",
    },
})
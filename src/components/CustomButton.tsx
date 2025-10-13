import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

type ButtonType = 'standard' | 'single';

interface CustomButtonProps {
    type: ButtonType;
    upButton: ImageSourcePropType;
    middleImage: ImageSourcePropType;
    downButton?: ImageSourcePropType;
    onUpPress: () => void;
    onDownPress?: () => void;
}

const CustomButton = ({
    type,
    upButton,
    middleImage,
    downButton,
    onUpPress,
    onDownPress
}: CustomButtonProps) => {

    if (type === 'single') {
        return (
            <View>
                <Image source={middleImage} style={styles.bigIcon} />
                <TouchableOpacity onPressIn={onUpPress} >
                    <Image source={upButton} style={styles.icon} />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.mainBox}>
            <TouchableOpacity onPressIn={onUpPress}>
                <Image source={upButton} style={styles.icon} />
            </TouchableOpacity>

            <Image source={middleImage} style={styles.bigIcon} />

            <TouchableOpacity onPressIn={onDownPress} >
                <Image source={downButton} style={styles.icon} />
            </TouchableOpacity>
        </View>
    )

}

export default CustomButton

const styles = StyleSheet.create({
    mainBox: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    icon: {
        // resizeMode: "contain",
        height: 100,
        width: 100,
        marginHorizontal: 20,
    },
    bigIcon: {
        width: wp('10%'),
        height: hp('12%'),
        resizeMode: "contain",
    },
})
import React, { useCallback, useRef } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'

interface NumericStepperProps {
    value: number;
    min: number;
    max: number;
    onIncrement: () => void;
    onDecrement: () => void;
    valueWidth?: number; // width of the value box in % of screen width
}

const REPEAT_DELAY_MS = 400;   // initial pause before hold-to-repeat kicks in
const REPEAT_INTERVAL_MS = 150;

const NumericStepper = ({
    value,
    min,
    max,
    onIncrement,
    onDecrement,
    valueWidth = 8,
}: NumericStepperProps) => {
    const intervalRef = useRef<number | null>(null);
    const initialTimeoutRef = useRef<number | null>(null);

    const clearTimers = useCallback(() => {
        if (initialTimeoutRef.current !== null) {
            clearTimeout(initialTimeoutRef.current);
            initialTimeoutRef.current = null;
        }
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startHold = useCallback((fn: () => void) => {
        clearTimers();
        initialTimeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(fn, REPEAT_INTERVAL_MS);
        }, REPEAT_DELAY_MS) as unknown as number;
    }, [clearTimers]);

    const handleIncPressIn = () => {
        onIncrement();
        startHold(onIncrement);
    };

    const handleDecPressIn = () => {
        onDecrement();
        startHold(onDecrement);
    };

    const atMin = value <= min;
    const atMax = value >= max;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.btn, atMin && styles.btnDisabled]}
                onPressIn={handleDecPressIn}
                onPressOut={clearTimers}
                disabled={atMin}
                activeOpacity={0.7}
            >
                <Text style={styles.btnText}>−</Text>
            </TouchableOpacity>
            <View style={[styles.valueBox, { minWidth: widthPercentageToDP(`${valueWidth}%`) }]}>
                <Text style={styles.valueText}>{value}</Text>
            </View>
            <TouchableOpacity
                style={[styles.btn, atMax && styles.btnDisabled]}
                onPressIn={handleIncPressIn}
                onPressOut={clearTimers}
                disabled={atMax}
                activeOpacity={0.7}
            >
                <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

export default NumericStepper;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(6),
    },
    btn: {
        width: widthPercentageToDP('5%'),
        height: heightPercentageToDP('5.5%'),
        borderRadius: 8,
        backgroundColor: '#0492b6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnDisabled: {
        backgroundColor: '#333',
    },
    btnText: {
        color: 'white',
        fontSize: heightPercentageToDP(3),
        fontWeight: 'bold',
        lineHeight: heightPercentageToDP(3.2),
    },
    valueBox: {
        height: heightPercentageToDP('5.5%'),
        backgroundColor: '#0f0f0f',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateVerticalScale(2),
        alignItems: 'center',
        justifyContent: 'center',
    },
    valueText: {
        color: 'white',
        fontSize: heightPercentageToDP(2.4),
        fontWeight: '600',
    },
});

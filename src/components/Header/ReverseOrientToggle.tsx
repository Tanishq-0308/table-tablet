import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useReverseOrient } from '../../contexts/ReverseOrientContext';
import { useFeedback } from '../../contexts/FeedbackContext';

const ReverseOrientToggle: React.FC = () => {
    const { isReverseActive, toggleReverse } = useReverseOrient();
    const { doFeedback } = useFeedback();

    const handlePress = () => {
        toggleReverse();
        doFeedback();
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={[styles.pill, isReverseActive ? styles.pillActive : styles.pillInactive]}
        >
            <Text style={styles.text}>Rev Orient</Text>
        </TouchableOpacity>
    );
};

export default ReverseOrientToggle;

const styles = StyleSheet.create({
    pill: {
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(6),
        borderRadius: moderateScale(16),
        borderWidth: 1,
    },
    pillActive: {
        backgroundColor: '#1e7a3a',
        borderColor: '#46d134',
    },
    pillInactive: {
        backgroundColor: '#1a1a1a',
        borderColor: '#444',
    },
    text: {
        color: 'white',
        fontSize: moderateScale(11),
        fontWeight: '600',
    },
});

import { View, Text, StyleSheet, BackHandler } from 'react-native'
import React, { useCallback } from 'react'
import PagerView from 'react-native-pager-view';
import MainScreen from './MainScreen';
import SecondaryScreen from './SecondaryScreen';
import Header from '../../components/Header/Header';
import { useFocusEffect } from '@react-navigation/native';
import { useLock } from '../../contexts/LockContext';

const HomeWrapper = () => {
    console.log("rendering homeWrapper");
    const { isLocked } = useLock();

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => isLocked;
            const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => sub.remove();
        }, [isLocked])
    );

  return (
    <View style={{flex:1}}>
        <Header/>
        <PagerView
            style={styles.pager}
            scrollEnabled={!isLocked}
        >
            <View key="1">
                <MainScreen/>
            </View>
            <View key="2">
                <SecondaryScreen/>
            </View>
        </PagerView>
    </View>
  )
}

const styles= StyleSheet.create({
    pager:{
        flex:1
    }
})

export default HomeWrapper
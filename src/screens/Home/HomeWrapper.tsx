import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import PagerView from 'react-native-pager-view';
import MainScreen from './MainScreen';
import SecondaryScreen from './SecondaryScreen';
import Header from '../../components/Header/Header';

const HomeWrapper = () => {
    console.log("rendering homeWrapper");
  return (
    <View style={{flex:1}}>
        <Header/>
        <PagerView
            style={styles.pager}
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
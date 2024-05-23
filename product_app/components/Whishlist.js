import { useState } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Whishlist() {
    //AsyncStorage.setItem('whishlist', JSON.stringify({uri: ['1', '2', '3']}));

    AsyncStorage.getItem('whishlist').then(asyncStorageRes => {
      console.log(JSON.parse(asyncStorageRes))
    });

    return (
      <View>
      </View>
    );
}
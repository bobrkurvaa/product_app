import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text} from 'react-native';
import { YaMap, Marker } from 'react-native-yamap';

//YaMap.init('db1ba68c-3c08-49a4-9131-1c626cf900f0');

export default function Order() {
    const [position, setPosition] = useState({
        latitude: 55.752,
        longitude: 37.615,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
    });

    return (<View></View>
    );
}

const styles = StyleSheet.create({
    map: {
        width: 400,
        height: 400
    }
});
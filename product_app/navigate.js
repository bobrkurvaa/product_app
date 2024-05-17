import React, { useState } from "react";
import Home from "./components/Home";
import Whishlist from "./components/Whishlist";
import Profile from "./components/Profile";
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, Image, SafeAreaView } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createBottomTabNavigator();

const setScreenOptions = (route) => {
    return {
        tabBarStyle:{
            position: 'absolute',
            backgroundColor:'#6DE5B5',
        },
        tabBarItemStyle:{
            marginTop: 4,
            marginBottom: 4
        },
        tabBarLabelStyle: {
            color: '#151515',
            fontSize: 14,
            fontWeight: '500'
        },
        tabBarIcon: () => {   
            switch (route.name) {
                case 'Главная':
                    return (
                        <Image 
                            style={styles.btn_image}
                            source={require('./assets/home_btn-icon.png')}
                        />
                    );
                case 'Избранное':
                    return (
                        <Image 
                            style={styles.btn_image}
                            source={require('./assets/whishlist_btn-icon.png')}
                        />
                    );
                case 'Профиль':
                    return (
                        <Image 
                            style={styles.btn_image}
                            source={require('./assets/profile_btn-icon.png')}
                        />
                    );
            }
        }
    }
}

export default function Navigate() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({route}) => setScreenOptions(route)}
            >
                <Tab.Screen 
                    name="Главная" 
                    component={Home} 
                />
                <Tab.Screen 
                    name="Избранное" 
                    component={Whishlist} 
                />
                <Tab.Screen 
                    name="Профиль" 
                    component={Profile} 
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    btn_image: {
        width: 24,
        height: 24,
    }
});


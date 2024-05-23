import React from "react";
import Home from "./components/Home";
import Whishlist from "./components/Whishlist";
import Profile from "./components/Profile";
import Recipes from "./components/Recipes";
import Recipe from "./components/Recipe";
import Stores from "./components/Stores";
import Order from "./components/Order";
import Product from "./components/Product";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Image, View } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const setScreenOptions = (route) => {
    return {
        headerShown: false,
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
                case 'Home':
                    return (
                        <Image 
                            style={styles.btn_image}
                            source={require('./assets/home_btn-icon.png')}
                        />
                    );
                case 'Whishlist':
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
                initialRouteName="Home"
            >
                <Tab.Screen 
                    name="Home" 
                    options={
                        {
                            title: 'Главная',
                        }
                    }
                >
                    {() => (
                        <Stack.Navigator>
                            <Stack.Screen 
                                name="HomeStack" 
                                component={Home}
                                options={
                                    {
                                        title: 'Главная',
                                    }
                                }
                            />
                            <Stack.Screen 
                                name="Recipes" 
                                component={Recipes} 
                                options={
                                    {
                                        title: 'Рецепты',
                                    }
                                }
                            />
                            <Stack.Screen 
                                name="Recipe" 
                                component={Recipe} 
                                options={
                                    {
                                        title: 'Рецепт',
                                    }
                                }
                            />
                            <Stack.Screen 
                                name="Stores" 
                                component={Stores} 
                                options={
                                    {
                                        title: 'Выбор магазина',
                                    }
                                }
                            />
                            <Stack.Screen 
                                name="Order" 
                                component={Order} 
                                options={
                                    {
                                        title: 'Выбор продуктов',
                                    }
                                }
                            />
                            <Stack.Screen 
                                name="Product" 
                                component={Product} 
                                options={
                                    {
                                        title: 'Добавление в корзину',
                                    }
                                }
                            />
                        </Stack.Navigator>
                    )}
                </Tab.Screen>
                <Tab.Screen 
                    name="Whishlist" 
                    options={
                        {
                            title: 'Избранное',
                        }
                    }
                >
                    {() => (
                        <Stack.Navigator>
                            <Stack.Screen 
                                name="WhishlistStack" 
                                component={Whishlist}
                                options={
                                    {
                                        title: 'Избранное',
                                    }
                                }
                            />
                        </Stack.Navigator>
                    )}
                </Tab.Screen>
                <Tab.Screen 
                    name="Профиль" 
                    component={Stores} 
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


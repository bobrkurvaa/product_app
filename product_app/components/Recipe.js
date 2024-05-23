import { StyleSheet, ScrollView, View, Text, Image, Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';

export default function Recipe({ navigation, route }) {
    const [inWhishlist, setToWhishlist] = useState(false);

    const checkWhishlist = async () => {
        const asyncStorageRes = await AsyncStorage.getItem('whishlist');
        const whishlist = await JSON.parse(asyncStorageRes);
        let whishlist_uri = whishlist.uri;

        if (whishlist_uri.indexOf(route.params.url) != -1) {
            setToWhishlist(true);
        } else {
            setToWhishlist(false)
        }   
    }

    const addToWhishlist = async (title, uri) => {
        //AsyncStorage.setItem('whishlist', JSON.stringify({title:[], uri:[]}))
        const asyncStorageRes = await AsyncStorage.getItem('whishlist');
        const whishlist = await JSON.parse(asyncStorageRes);
        if (whishlist = {}) {
            let whishlist_uri = [];
            let whishlist_title = [];
        } else {
            let whishlist_uri = whishlist.uri;
            let whishlist_title = whishlist.title;
        }
        

        if (whishlist_uri.indexOf(uri) == -1) {
            whishlist_uri.push(uri);
            whishlist_title.push(title);
            await AsyncStorage.setItem('whishlist', JSON.stringify({title: whishlist_title, uri: whishlist_uri}));
            checkWhishlist();
        }
    }

    const removeWhishlist = async(uri) => {
        const asyncStorageRes = await AsyncStorage.getItem('whishlist');
        const whishlist = await JSON.parse(asyncStorageRes);
        let whishlist_uri = whishlist.uri;
        let whishlist_title = whishlist.title;

        if (whishlist_uri.indexOf(uri) != -1) {
            let index = whishlist_uri.indexOf(uri);

            whishlist_uri.splice(index, 1);
            whishlist_title.splice(index, 1);

            await AsyncStorage.setItem('whishlist', JSON.stringify({title: whishlist_title, uri: whishlist_uri}));
            checkWhishlist();
        }
    }

    checkWhishlist();

    return (
        <ScrollView style={styles.recipe_container}>
            <Image 
                style={styles.recipe_image}
                source={{
                    uri: route.params.data.image,
                }}
            />
            <Text style={styles.recipe_title}>{route.params.data.title}</Text>
            {!inWhishlist && (
                <Pressable 
                    style={styles.btn_add_to_whishlist}
                    onPress={() => addToWhishlist(route.params.data.title, route.params.url)}
                >
                    <Text style={styles.btn_add_to_whishlist_text}>В избранное</Text>
                </Pressable>
            )}
             {inWhishlist && (
                <Pressable 
                    style={styles.btn_remove_from_whishlist}
                    onPress={() => removeWhishlist(route.params.url)}
                >
                    <Text style={styles.btn_remove_from_whishlist_text}>Убрать из избранного</Text>
                </Pressable>
             )}
            <View style={styles.recipe_products}>
                <Text style={styles.recipe_products_head}>Ингредиенты</Text>
                {route.params.data.products.map((item) =>
                    <View 
                        style={styles.recipe_product}
                        key={item.key}
                    >
                        <Text style={styles.recipe_product_title}>{item.title}</Text>
                        {item.weight > 0 && (
                            <Text style={styles.recipe_product_weight}>{item.weight} {item.measure}</Text>
                        )}
                    </View>
                )}
            </View>
            <Text style={styles.recipe_buy_products_head}>Необходимо докупить: </Text>
            <Text style={styles.recipe_buy_products_text}>
                {route.params.data.buy_products.map((item) => {
                        if (item.key > 0) {
                            return ', ' + item.title;
                        }
                        return item.title;
                    }
                )}
            </Text>
            <Pressable 
              style={styles.btn_buy_products}
              onPress={ () => {
                navigation.navigate(
                    'Stores', 
                    {
                        products: route.params.data.buy_products
                    }
                );
              }}
            >
              <Text style={styles.btn_buy_products_text}>Докупить продукты</Text>
            </Pressable>
            <View style={styles.recipe_instruction}>
                <Text style={styles.recipe_instruction_head}>Приготовление</Text>
                <Text style={styles.recipe_instruction_text}>{route.params.data.instruction}</Text>
            </View>
            
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    recipe_container: {
        paddingTop: 24,
        paddingHorizontal: 18,
        backgroundColor: '#FFFFFF',
    },
    recipe_image: {
        width: '100%',
        height: 280,
        objectFit: 'contain'
    },
    recipe_title: {
        fontSize: 24,
        fontWeight: '700',
        marginVertical: 28
    },
    btn_add_to_whishlist: {
        width: 200,
        paddingHorizontal: 14,
        paddingVertical: 16,
        backgroundColor: '#d2d2d2',
        borderRadius: 14,
        marginBottom: 24
    },
    btn_add_to_whishlist_text: {
        fontSize: 16,
        textAlign: 'center'
    },
    btn_remove_from_whishlist: {
        width: 200,
        paddingHorizontal: 14,
        paddingVertical: 16,
        backgroundColor: '#f45db7',
        borderRadius: 14,
        marginBottom: 24
    },
    btn_remove_from_whishlist_text: {
        fontSize: 16,
        textAlign: 'center'
    },
    recipe_products: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FCBA26',
        alignItems: 'flex-start',
        width: '100%',
        maxWidth: '100%',
        marginBottom: 18,
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 8
    },
    recipe_products_head: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '500',
        color: '#151515',
    },
    recipe_product: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '100%',
        fontSize: 16,
        paddingVertical: 4,
    },
    recipe_product_title: {
        fontSize: 16,
        color: '#151515',  
    },
    recipe_product_weight: {
        fontSize: 16,
        fontWeight: '500',
        color: '#151515',
    },
    recipe_buy_products_head: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '500',
        color: '#151515',
    },
    recipe_buy_products_text: {
        marginBottom: 16,
        fontSize: 18,
        fontWeight: '400',
        lineHeight: 28,
        color: '#151515',
    },
    btn_buy_products: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: '#6DE5B5',
        paddingVertical: 24,
        width: '100%',
    },
    btn_buy_products_text: {
        color: '#151515',
        fontSize: 18,
        fontWeight: '500',
    },
    recipe_instruction: {
        width: '100%',
        maxWidth: '100%',
        marginTop: 24,
        marginBottom: 120,
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderColor: '#6DE5B5',
        borderWidth: 2,
        borderRadius: 18,
        borderRadius: 8
    },
    recipe_instruction_head: {
        marginBottom: 18,
        fontSize: 20,
        fontWeight: '500',
        color: '#151515',
    },
    recipe_instruction_text: {
        fontSize: 16,
        lineHeight: 24,
        color: '#151515',
    }
})
import React, {useState} from 'react';
import { StyleSheet, View, Text, Image, FlatList, Pressable} from 'react-native';
 
export default function Stores({ navigation }) {
    const [position, setPosition] = useState({
        latitude: 55.702936,
        longitude: 37.530768
    });

    const [stores, setStores] = useState([]);

    fetch(
        'https://sbermarket.ru/api/v2/multisearches?q=' + encodeURI('Огурец') + '&lat=' + position.latitude + '&lon=' + position.longitude + '&include%5B%5D=retailer&include%5B%5D=closest_shipping_options'
    ).then(async(response) => {
        return await response.json();
    }).then(response => {
        let stores_data = [];

        response.stores.forEach(store => {
            if (store.vertical == 'grocery') {
                stores_data.push(
                    {
                        key: stores_data.length,
                        id: store.id,
                        name: store.retailer.name,
                        logo: store.retailer.logo,
                        logo_background_color: store.retailer.logo_background_color,
                        delivery_text: store.next_delivery == null ? 'время не указано' : store.next_delivery.summary,
                        order_amount: store.min_order_amount
                    }    
                )
            }
        });
        
        return stores_data;
    }).then(async(stores) => {
        await setStores(stores);
    });

    const createOrder = (store) => {
        let products = [
            {
                title: 'Сыр Камамбер'
            },
            {
                title: 'Колбаса'
            },
            {
                title: 'Огурец'
            }
        ] 
        navigation.navigate(
            'Order', 
            { 
                store: store,
                products: products
            }
        );
    }

    return (
        <View style={styles.stores_container}>
            {stores.length == 0 && (
                <View style={styles.stores_preloader_container}>
                   <Text style={styles.stores_preloader_text}>Подбираем магазины...</Text>
                   <Image 
                      style={styles.stores_preloader_animate}
                      source={require('./../assets/preloader.gif')}
                    />
                </View>
            )}
            <FlatList 
                style={styles.stores}
                data={stores} 
                renderItem={({ item }) => (
                <View style={styles.store}>
                    <View>
                        <Image 
                            style={{
                                width: 168,
                                height: 124,
                                objectFit: 'contain',
                                backgroundColor: item.logo_background_color
                            }}
                            source={{
                              uri: item.logo,
                            }}
                        />
                    </View>
                    <View style={styles.store_data}>
                        <Text style={styles.store_delivery_text}>Доставка: {item.delivery_text}</Text>
                        <Text style={styles.store_order_amount}>Заказ от {item.order_amount}₽</Text>
                        <Pressable 
                              style={styles.btn_select_store}
                              onPress={()=>createOrder(item.id)}
                            >
                              <Text style={styles.btn_select_store_text}>Выбрать</Text>
                        </Pressable>
                    </View>
                </View>
            )} />
        </View>
    );
}

const styles = StyleSheet.create({
    stores_container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 18,
        backgroundColor: '#FFFFFF',
    },
    stores_preloader_container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        paddingHorizontal: 18,
        backgroundColor: '#FFFFFF'     
    },
    stores_preloader_text: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 24,
    },
    stores_preloader_animate: {
        width: 52,
        height: 52
    },
    stores: {
        width: '100%',
        maxWidth: 480,
        marginBottom: 92
    },
    store: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 18,
        paddingVertical: 14,
        borderColor: '#e5ecf1',
        borderWidth: 2,
        borderRadius: 14
    },
    store_logo: {
        width: 168,
        height: 168,
        objectFit: 'contain'
    },
    store_data: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 120,
        width: '48%'
    },
    btn_select_store: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: '#6DE5B5',
        paddingVertical: 12,
    },
    btn_select_store_text: {
        color: '#151515',
        fontSize: 16,
        fontWeight: '500',
    }
});
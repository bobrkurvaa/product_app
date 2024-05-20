import React, {useState} from 'react';
import { StyleSheet, View, Text, Image, FlatList} from 'react-native';

export default function Order() {
    const [position, setPosition] = useState({
        latitude: 55.702936,
        longitude: 37.530768
    });

    const [stores, setStores] = useState([]);

    fetch(
        'https://sbermarket.ru/api/v3/multisearches?include%5B%5D=retailer&q=' + encodeURI('Колбаса') + '&lat=' + position.latitude + '&lon=' + position.longitude
    ).then(async(response) => {
        return await response.json();
    }).then(response => {
        let stores_data = [];

        response.stores.forEach(store => {
            stores_data.push(
                {
                    key: stores_data.length,
                    id: store.id,
                    name: store.retailer.name,
                    logo: store.retailer.logo,
                    logo_background_color: store.retailer.logo_background_color,
                    delivery_text: store.next_delivery == null ? 'время не указано' : store.next_delivery.summary
                }    
            )
        });
        
        return stores_data;
    }).then(async(stores) => {
        await setStores(stores);
    });

    return (
        <View>
            {stores.length == 0 && (
                <View style={styles.stores_preloader_container}>
                   <Text style={styles.stores_preloader_text}>Подбираем магазины...</Text>
                   <Image 
                      style={styles.stores_preloader_animate}
                      source={require('./../assets/preloader.gif')}
                    />
                </View>
            )}
            <FlatList data={stores} renderItem={({ item }) => (
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
                    <Text>{item.name}</Text>
                    <Text>{item.id}</Text>
                    <Text>Доставка: {item.delivery_text}</Text>
                </View>
            )} />
        </View>
    );
}

const styles = StyleSheet.create({
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
    store_logo: {
        width: 168,
        height: 168,
        objectFit: 'contain'
    }
});
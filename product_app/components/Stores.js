import React, {useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Pressable} from 'react-native';
 
export default function Stores({ navigation, route }) {
    const [position, setPosition] = useState({
        latitude: 55.702936,
        longitude: 37.530768
    });

    const [stores, setStores] = useState([]);
    const [loadStores, setLoadStores] = useState(false);
    const [existProducts, setExistProducts] = useState(true);

    useEffect(() => {
        getStores(route.params.products);
    },[])

    const getProducts = async(store, product) =>{
        try{
            const response = await fetch('https://sbermarket.ru/api/v2/products?q=' + encodeURI(product) + '&sid=' + store)
            const response_data = await response.json();

            if (response_data.products.length > 0) {
                return true;
            } else {
                return false;
            }
        }
        catch(error){
          console.log(error)
          return false;
        }
    }

    const getStores = async() => {
        let stores_list = [];
        try {
            const response = await fetch('https://sbermarket.ru/api/v2/multisearches?q=' + encodeURI(route.params.products[0].title) + '&lat=' + position.latitude + '&lon=' + position.longitude + '&include%5B%5D=retailer&include%5B%5D=closest_shipping_options')
            const data = await response.json();

            for(let i = 0; i < data.stores.length; i++) {
                let store = data.stores[i];

                if (store.vertical == 'grocery') {
                    var exist_products = true;

                    for(let j = 0; j < route.params.products.length; j++) {
                        let product = route.params.products[j];
                        exist_products = await getProducts(store.id, product.title);

                        if (!exist_products) {
                            break;
                        }
                    }

                    if (exist_products) {
                        stores_list.push(
                            {
                                key: stores_list.length,
                                id: store.id,
                                name: store.retailer.name,
                                slug: store.retailer.slug,
                                logo: store.retailer.logo,
                                logo_background_color: store.retailer.logo_background_color,
                                delivery_text: store.next_delivery == null ? 'время не указано' : store.next_delivery.summary,
                                order_amount: store.min_order_amount
                            }    
                        )
                    }
                }
            };   
        } catch(error) {
            console.log(error)
        } finally {
            setStores(stores_list);
            setLoadStores(true);
        }
    }
    
    

    const createOrder = (store, store_slug) => {
        /*let products = [
            {
                key: '1',
                title: 'Сыр Камамбер'
            },
            {
                key: '2',
                title: 'Колбаса'
            },
            {
                key: '3',
                title: 'Огурец'
            }
        ] */
        navigation.navigate(
            'Order', 
            { 
                store: store,
                store_slug: store_slug,
                products: route.params.products
            }
        );
    }

    return (
        <View style={styles.stores_container}>
            {!loadStores && (
                <View style={styles.stores_preloader_container}>
                   <Text style={styles.stores_preloader_text}>Подбираем магазины...</Text>
                   <Image 
                      style={styles.stores_preloader_animate}
                      source={require('./../assets/preloader.gif')}
                    />
                </View>
            )}
            {loadStores && stores.length == 0 && (
                <Text style={styles.stores_not_found_text}>Магазины не найдены</Text>
            )}
            {loadStores && stores.length > 0 && (
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
                                onPress={()=>createOrder(item.id, item.slug)}
                                >
                                <Text style={styles.btn_select_store_text}>Выбрать</Text>
                            </Pressable>
                        </View>
                    </View>
                )} />
            )}
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
    stores_not_found_text: {
        width: '100%',
        height: '100%',
        marginVertical: 30,
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center'
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
        width: 124,
        height: 124,
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
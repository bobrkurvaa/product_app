import React, {useState} from 'react';
import { StyleSheet, View, ScrollView, Text, Image} from 'react-native';

export default function Order({ navigation, route }) {
    const [products, setProducts] = useState([]);
    const [products_array, setProductsArray] = useState([]);

    route.params.products.forEach(async (product, key) => {
        await fetch(
            'https://sbermarket.ru/api/v2/products?q=' + encodeURI(product.title) + '&sid=' + route.params.store 
        ).then(async(response) => {
            return await response.json();
        }).then(async(response) => {
            let variations = [];

            response.products.forEach(item => {
                variations.push({
                    id: item.id,
                    name: item.name,
                    image: item.images[0].small_url,
                    price: item.price,
                    human_volume: item.human_volume,
                    volume: item.volume,
                    volume_type: item.type
                })
            })

            return await variations;
        }).then(async (variations) => {
            await setProductsArray((list) => {
                return [
                    {
                        search_product: product.title,
                        product_variations: variations
                    },
                    ...list
                ]
            })

            if (products_array.length == route.params.products.length) {
                await setProducts(products_array);
            }
        });
    });

    return (
      <ScrollView style={styles.order_container}>
        {products.length == 0 && (
            <View style={styles.order_preloader_container}>
               <Text style={styles.order_preloader_text}>Ищем продукты...</Text>
               <Image 
                  style={styles.order_preloader_animate}
                  source={require('./../assets/preloader.gif')}
                />
            </View>
        )}
        {products.length > 0 && (
            <Text style={styles.order_head_text}>Выберите продукты, которые необходимо докупить</Text>
        )}
        <View style={styles.order_products_container}>
            {products.map((item) =>
                <View style={styles.order_product}>
                    <Text style={styles.order_product_title}>{item.search_product}</Text>
                    {item.product_variations.length == 0 && (
                        <Text style={styles.order_product_variation_not_found_text}>Продукты не найдены</Text>
                    )}
                    {item.product_variations.length > 0 && (
                    <ScrollView
                        horizontal={true} 
                        style={styles.order_product_variations}
                    >
                        {item.product_variations.map((product_variation) =>
                            <View style={styles.order_product_variation}>
                                <Image 
                                    style={styles.order_product_variation_image}
                                    source={{
                                        uri: product_variation.image
                                    }}
                                />
                                <Text style={styles.order_product_variation_title}>{product_variation.name}</Text>
                                <View style={styles.order_product_variation_data}>
                                    <Text style={styles.order_product_variation_price}>{product_variation.price} ₽</Text>
                                    <Text style={styles.order_product_variation_weight}>{product_variation.human_volume}</Text>
                                </View>
                                
                            </View>
                        )}
                    </ScrollView>
                    )}
                </View>
            )}
        </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
    order_container: {
        height: '100%',
        paddingHorizontal: 18,
        backgroundColor: '#FFFFFF',
    },
    order_preloader_container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        paddingHorizontal: 18,
        backgroundColor: '#FFFFFF'     
    },
    order_preloader_text: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 24,
    },
    order_preloader_animate: {
        width: 52,
        height: 52
    },
    order_head_text: {
        marginTop: 12,
        marginBottom: 8,
        color: '#151515',
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '500'
    },
    order_products_container: {
        marginBottom: 96
    },
    order_product: {
        
    },
    order_product_title:  {
        color: '#151515',
        fontSize: 20,
        fontWeight: '700'
    },
    order_product_variation_not_found_text: {
        marginVertical: 30,
        fontSize: 16,
        fontWeight: '500'
    },
    order_product_variations: {
        marginVertical: 30
    },
    order_product_variation: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 228,
        paddingHorizontal: 14,
        paddingTop: 8,
        paddingBottom: 16,
        marginHorizontal: 8,
        borderColor: '#e5ecf1',
        borderWidth: 2,
        borderRadius: 14
    },
    order_product_variation_image: {
        width: 192,
        height: 192
    },
    order_product_variation_title: {
        color: '#151515',
        fontSize: 16,
        fontWeight: '600'
    },
    order_product_variation_data: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
        marginTop: 8
    },
    order_product_variation_price: {
        width: '65%',
        textAlign: 'right',
        color: '#151515',
        fontSize: 20,
        fontWeight: '500'
    },
    order_product_variation_weight: {
        color: '#151515',
        fontSize: 15,
        fontWeight: '400'
    }
});
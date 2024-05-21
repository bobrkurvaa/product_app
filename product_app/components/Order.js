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
                    image: item.images[0].product_url,
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
      <View>
        <Text>Создание заказа</Text>
        <Text>{route.params.store}</Text>
        {products.map((item) =>
            <View style={styles.recipe_product}>
                <Text style={styles.recipe_product_title}>{item.search_product}</Text>
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
                            <Text style={styles.stores_preloader_text}>{product_variation.name}</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        )}
      </View>
    );
}

const styles = StyleSheet.create({
    order_product_variations: {
    },
    order_product_variation_image: {
        width: 64,
        height: 64
    }
});
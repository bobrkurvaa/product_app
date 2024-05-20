import React, {useState} from 'react';
import { StyleSheet, View, Text} from 'react-native';

export default function Order({ navigation, route }) {
    const [products, setProducts] = useState([]);

    let products_array = [];
    route.params.products.forEach(product => {
        fetch(
            'https://sbermarket.ru/api/v2/products?q=' + encodeURI(product.title) + '&sid=' + route.params.store 
        ).then(async(response) => {
            return await response.json();
        }).then((response) => {
            let product_variations = []

            response.products.forEach(item => {
                product_variations.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    human_volume: item.human_volume,
                    volume: item.volume,
                    volume_type: item.type
                })
            })
        })
    });
    

    return (
      <View>
        <Text>Создание заказа</Text>
        <Text>{route.params.store}</Text>
        {route.params.products.map((item) =>
            <View style={styles.recipe_product}>
                <Text style={styles.recipe_product_title}>{item.title}</Text>
            </View>
        )}
      </View>
    );
}

const styles = StyleSheet.create({

});
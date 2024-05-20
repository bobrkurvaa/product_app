import { StyleSheet, View, Text} from 'react-native';
import Header from './Header';
import Footer from './Footer';

export default function Order({ navigation, route }) {
    const [products, setProducts] = useState([]);
    
    route.params.products.forEach(product => {
        fetch(
            'https://sbermarket.ru/api/v2/products?q=' + encodeURI(product.title) + '&sid=' + route.params.store 
        ).then(async(response) => {
            return await response.json();
        }).then((response) => {
            console.log(response);
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
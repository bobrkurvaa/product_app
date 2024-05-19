import { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, FlatList, Image, ImageBackground } from 'react-native';

export default function FormAddProduct({ navigation }) {  
    const [products, setProduct] = useState([]);

    const [productTitle, setProductTitle] = useState('');
    const [productWeight, setProductWeight] = useState('');

    const product_title_input = useRef(null);
    const product_weight_input = useRef(null);
    
    const addProductTitle = (productTitle) => {
        setProductTitle(productTitle);
    }

    const addProductWeight = (productWeight) => {
        setProductWeight(productWeight);
    }

    const addProductHandler = (productTitle) => {
        product_title_input.current.clear();
        product_weight_input.current.clear();

        setProduct((list) => {
            return [
                {
                    key: 'product_' + new Date().getTime(),
                    title: productTitle,
                    weight: productWeight
                },
                ...list
            ];       
        });
    };

    const removeProductHandler = (key) => {
        setProduct((list) => {
            return list.filter(products => products.key != key);
        });
    }

    const findRecipe = () => {
        navigation.navigate('Recipes', {products: products});
    }
     
    return (
        <View style={styles.form_add_product_container}>
            <View style={styles.form_add_product}>
                <Text style={styles.form_add_product_head_text}>
                    Для получения списка рецептов, укажите продукты, которые у вас есть
                </Text>
                <View style={styles.form_add_product_fields_container}>
                    <TextInput 
                        style={styles.form_add_product_title_input} 
                        ref={product_title_input}
                        onChangeText={addProductTitle}
                        placeholder='Например "Сыр"...' 
                    />
                    <TextInput 
                        style={styles.form_add_product_weight_input} 
                        ref={product_weight_input}
                        onChangeText={addProductWeight}
                        keyboardType={'numeric'}
                        placeholder='Вес (грамм)' 
                    />
                </View>
                <Pressable 
                    style={styles.form_add_product_btn}
                    onPress={() => addProductHandler(productTitle)}
                >
                    <Text style={styles.form_add_product_btn_text}>Добавить продукт</Text>
                </Pressable>
            </View>
            <View style={styles.list_products_container}>
                {/* {products.length == 0 && (
                    <ImageBackground source={require('./../assets/fridge-image.png')} resizeMode="contain" style={styles.list_products_fridge_image}/>
                )} */}
                <FlatList 
                    style={styles.list_products}
                    data={products} renderItem={({item}) => (
                    <View style={styles.list_products_item}>
                        <Text style={styles.list_products_item_title}>{item.title}</Text>
                        <Text style={styles.list_products_item_weight}>{item.weight} гр.</Text>
                        <Pressable 
                            style={styles.remove_product_btn} 
                            onPress={()=>removeProductHandler(item.key)}
                        >
                            <Image 
                                style={styles.remove_product_btn_image}
                                source={require('./../assets/remove_btn-icon.png')}
                            />
                        </Pressable>
                    </View>
                )}/>
            </View>
            <View style={styles.find_recipe_container}>
                {products.length > 0 && (
                    <Pressable 
                        style={styles.btn_find_recipe}
                        onPress={findRecipe}
                    >
                        <Text style={styles.btn_find_recipe_text}>Подобрать рецепт</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    form_add_product_container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    form_add_product: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 182,
    },
    form_add_product_head_text: {
        color: '#151515',
        fontSize: 18,
        lineHeight: 22,
        fontWeight: '500',
        textAlign: 'center'
    },
    form_add_product_fields_container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    form_add_product_title_input: {
        width: '59%',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 18,
        borderColor: '#FCBA26',
        fontSize: 16
    },
    form_add_product_weight_input: {
        width: '39%',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 18,
        borderColor: '#FCBA26',
        fontSize: 16
    },
    form_add_product_btn: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: '#FCBA26',
        paddingVertical: 16,
    },
    form_add_product_btn_text: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
    },
    list_products_container: {
        marginVertical: 14,
        flex: 1,
    },
    list_products_fridge_image: {
        display: 'flex',
        height: '100%'
    },
    list_products: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'scroll'
    },
    list_products_item: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        verticalAlign: 'middle',
        marginVertical: 4,
        paddingHorizontal: 16,
        paddingVertical: 24,
        borderColor: '#6DE5B5',
        borderWidth: 2,
        borderRadius: 18,
    },
    list_products_item_title: {
        width: '60%',
        marginRight: '1%',
        textAlign: 'left',
        fontSize: 22,
        fontWeight: '500',
        color: '#151515',
    },
    list_products_item_weight: {
        marginRight: '1%',
        fontSize: 20,
        fontWeight: '400',
        textAlign: 'left'
    },
    remove_product_btn: {
        width: 32,
        height: 32,
    },
    remove_product_btn_image: {
        width: 28,
        height: 28,
    },
    find_recipe_container: {
        display: 'flex',
        verticalAlign: 'middle',
        marginBottom: 24,
    },
    btn_find_recipe: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: '#6DE5B5',
        paddingVertical: 18,
    },
    btn_find_recipe_text: {
        color: '#151515',
        fontSize: 18,
        fontWeight: '500',
    },
})
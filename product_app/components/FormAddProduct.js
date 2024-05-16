import { useState } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, FlatList } from 'react-native';

export default function FormAddProduct() {  
    const [products, addProduct] = useState([
        {title: 'Продукт 1', index: 1}
    ]);
    
    const addProductHandler = (productTitle) => {
        addProduct((list) => {
            return [
                {title: productTitle},
                ...list
            ]        
        });
    };

    const [productTitle, setProductTitle] = useState('');
    
    const addProductTitle = (productTitle) => {
        setProductTitle(productTitle);
    }
     
    return (
        <View style={styles.form_add_product_container}>
            <View style={styles.form_add_product}>
                <Text style={styles.form_add_product_head_text}>
                    Для получения список рецептов, укажите продукты, которые есть у вас
                </Text>
                <TextInput 
                    style={styles.form_add_product_input} 
                    onChangeText={addProductTitle}
                    placeholder='Например "Сыр"...' 
                />
                <Pressable 
                    style={styles.form_add_product_btn}
                    onPress={() => addProductHandler(productTitle)}
                >
                    <Text style={styles.form_add_product_btn_text}>+ Добавить продукт</Text>
                </Pressable>
            </View>
            <View style={styles.list_products_container}>
                <FlatList 
                    style={styles.list_products}
                    data={products} renderItem={({item}) => (
                    <View style={styles.list_products_item}>
                        <Text style={styles.list_products_item_text}>{item.title}</Text>
                    </View>
                )}/>
            </View>
        </View>
        
    );
}

const styles = StyleSheet.create({
    form_add_product_container: {

    },
    form_add_product: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 182
    },
    form_add_product_head_text: {
        color: '#151515',
        fontSize: 18,
        lineHeight: 22,
        fontWeight: '500',
        textAlign: 'center'
    },
    form_add_product_input: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderRadius: 18,
        borderColor: '#FCBA26',
        fontSize: 16
    },
    form_add_product_btn: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: '50%',
        backgroundColor: '#FCBA26',
        paddingVertical: 16,
    },
    form_add_product_btn_text: {
        color: '#151515',
        fontSize: 16
    },
    list_products_container: {
        marginTop: 18
    },
    list_products: {
        overflow: 'scroll'
    },
    list_products_item: {
        marginVertical: 4,
        paddingHorizontal: 16,
        paddingVertical: 36,
        backgroundColor: '#6DE5B5',
        borderRadius: 18,
    },
    list_products_item_text: {
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center'
    }
})
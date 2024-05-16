import { StyleSheet, View, TextInput, Text, Pressable } from 'react-native';

export default function FormAddProduct() {
    return (
        <View style={styles.form_add_product}>
            <Text style={styles.form_add_product_head_text}>
                Для получения список рецептов, укажите продукты, которые есть у вас
            </Text>
            <TextInput style={styles.form_add_product_input} placeholder='Например "Сыр"...' />
            <Pressable style={styles.form_add_product_btn}>
                <Text style={styles.form_add_product_btn_text}>+ Добавить продукт</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
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
    }
})
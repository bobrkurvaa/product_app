import { useState, useRef } from 'react';
import { FlatList, StyleSheet, View, Text, Image, Pressable} from 'react-native';

export default function Recipe({ route }) {
    return (
        <View>
            <Image 
            style={styles.recipe_image}
            source={{
              uri: route.params.image,
            }}
          />
            <Text>{route.params.title}</Text>
            
            <FlatList 
                //style={styles.recipes} 
                data={route.params.data.products} 
                renderItem={({ item }) => (
                    <Text>{item.title} - {item.weight} {item.measure}</Text>
                )} />
            <Text>{route.params.data.instruction}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    recipe_image: {
        width: 96,
        height: 96
    }
})
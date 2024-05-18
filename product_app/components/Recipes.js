import { useState, useRef } from 'react';
import { FlatList, StyleSheet, View, Text} from 'react-native';

export default function Recipes({ route }) {
  const DOMParser = require('react-native-html-parser').DOMParser;
  
  const [recipes, setRecipe] = useState([]);

  fetch(
    'https://vkuso.ru/?s=%D0%A1%D1%8B%D1%80+%D0%9A%D0%BE%D0%BB%D0%B1%D0%B0%D1%81%D0%B0+%D0%A5%D0%BB%D0%B5%D0%B1&ms=1'
  ).then(response => {
    return response.text();
  }).then(html => {
    return new DOMParser().parseFromString(html,'text/html');
  }).then(doc => {
    for (let i = 0; i < doc.getElementsByClassName('views-item').length; i++) {      
      setRecipe((list) => {
        return [
            {
                key: 'recipe_' + new Date().getTime(),
                title: doc.getElementsByClassName('views-item')[i].getElementsByClassName('views-item__item-title')[0].getElementsByTagName('a')[0].attributes._ownerElement.firstChild.data,
                image: doc.getElementsByClassName('views-item')[i].getElementsByClassName('card__image')[0].getElementsByTagName('img')[0].attributes[2].value
            },
            ...list
        ];       
      });
    }
  })

  return (
    <View style={styles.container}>
      <FlatList data={recipes} renderItem={({ item }) => (
        <Text>{item.title}</Text>
      )} />
    </View>
  );
}
  
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between'
    },
    content_container: {
      height: '86%',
      maxHeight: '86%',
      paddingTop: 18,
      paddingHorizontal: '6%'
    }
});
import { useState, useRef } from 'react';
import { FlatList, StyleSheet, View, Text, Image} from 'react-native';

export default function Recipes({ route }) {
  const DOMParser = require('react-native-html-parser').DOMParser;
  
  const [recipes, setRecipes] = useState([]);

  let search_products = [];

  route.params.products.forEach(product => {
    search_products.push(product.title);
  });

  fetch(
    'https://vkuso.ru/?s=' + encodeURI(search_products.join('+')) + '&ms=1'
  ).then(response => {
    return response.text();
  }).then(html => {
    return new DOMParser().parseFromString(html,'text/html');
  }).then((doc) => {
    let list = []
    for (let i = 0; i < doc.getElementsByClassName('views-item').length; i++) { 
      list = [
        {
          key: 'recipe_' + new Date().getTime(),
          title: doc.getElementsByClassName('views-item')[i].getElementsByClassName('views-item__item-title')[0].getElementsByTagName('a')[0].attributes._ownerElement.firstChild.data,
          image: doc.getElementsByClassName('views-item')[i].getElementsByClassName('card__image')[0].getElementsByTagName('img')[0].attributes[2].value,
          url: doc.getElementsByClassName('views-item')[i].getElementsByClassName('views-item__item-title')[0].getElementsByTagName('a')[0].attributes[0].value
        },
        ...list
      ]  
    }

    return list;
  }).then(async(recipes) => {
    for (let i = 0; i < recipes.length; i++) {
      recipes[i].data = await fetch(
        'https://vkuso.ru' + recipes[i].url
      ).then(response => {
        return response.text();
      }).then(html => {
        return new DOMParser().parseFromString(html,'text/html');
      }).then((recipe) => {
        return {
          level: recipe.getElementsByClassName('recipe_information')[0].getElementsByClassName('recipe-difficulty').length > 0 ?
            recipe.getElementsByClassName('recipe_information')[0].getElementsByClassName('recipe-difficulty')[0].getElementsByTagName('span')[0].childNodes[0].nodeValue : 'Не указано',
          time: recipe.getElementsByClassName('recipe_information')[0].getElementsByClassName('recipe_info__value').length > 0 ?
            recipe.getElementsByClassName('recipe_information')[0].getElementsByClassName('recipe_info__value')[0].getElementsByTagName('span')[1].childNodes[0].nodeValue : 'Не указано'
        }
      });
    }  

    return recipes;
  }).then(recipes => {
    //console.log(recipes);
    setRecipes(recipes)
  })

  return (
    <View style={styles.container}>
      <FlatList style={styles.recipes} data={recipes} renderItem={({ item }) => (
        <View style={styles.recipe}>
          <Image 
            style={styles.recipe_image}
            source={{
              uri: item.image,
            }}
          />
          <Text>{item.title}</Text>
          <Text>Сложность {item.data.level}</Text>
          <Text>Время приготовления {item.data.time}</Text>
        </View>
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
    },
    recipes: {
      overflow: 'scroll',
    },
    recipe: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: 360,
      margin: '4%',
      paddingHorizontal: 14,
      backgroundColor: '#FFFFFF',
      borderRadius: 8
    },
    recipe_image: {
      width: 360,
      height: 240,
      objectFit: 'contain',
    }
});
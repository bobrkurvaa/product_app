import { useState, useRef } from 'react';
import { FlatList, StyleSheet, View, Text, Image, Pressable} from 'react-native';

export default function Recipes({ navigation, route }) {
  const DOMParser = require('react-native-html-parser').DOMParser;
  
  const [recipes, setRecipes] = useState([
    /*{
      key: 'recipe_' + new Date().getTime() + 1,
      title: 'Recipe 1',
      image: 'https://cdn.vkuso.ru/uploads/119531_omlet-s-nachinkoj-iz-kolbasy-s-syrom_1698498090-400x225.jpg',
      data: {
        level: 'Низкая',
        time: '15 минут'
      }
    },
    {
      key: 'recipe_' + new Date().getTime() + 2,
      title: 'Recipe 2',
      image: 'https://cdn.vkuso.ru/uploads/119531_omlet-s-nachinkoj-iz-kolbasy-s-syrom_1698498090-400x225.jpg',
      data: {
        level: 'Низкая',
        time: '15 минут'
      }
    },
    {
      key: 'recipe_' + new Date().getTime() + 3,
      title: 'Recipe 3',
      image: 'https://cdn.vkuso.ru/uploads/119531_omlet-s-nachinkoj-iz-kolbasy-s-syrom_1698498090-400x225.jpg',
      data: {
        level: 'Низкая',
        time: '15 минут'
      }
    }*/
  ]);

  let search_products = [];

  route.params.products.forEach(product => {
    search_products.push(product.title);
  });

  fetch(
    'https://vkuso.ru/?s=' + encodeURI(search_products.join('+')) + '&ms=1'
  ).then(async(response) => {
    return await response.text();
  }).then(async(html) => {
    return await new DOMParser().parseFromString(html,'text/html');
  }).then((doc) => {
    let list = [];
    let recipes_count = doc.getElementsByClassName('views-item').length;

    if (recipes_count > 0) {
      if (recipes_count > 10) {
        recipes_count = 10;
      }

      for (let i = 0; i < recipes_count; i++) { 
        let recipe = doc.getElementsByClassName('views-item')[i];
        list = [
          {
            key: 'recipe_' + new Date().getTime(),
            title: recipe.getElementsByClassName('views-item__item-title')[0].getElementsByTagName('a')[0].attributes._ownerElement.firstChild.data,
            image: recipe.getElementsByClassName('card__image')[0].getElementsByTagName('img')[0].attributes[2].value,
            url: recipe.getElementsByClassName('views-item__item-title')[0].getElementsByTagName('a')[0].attributes[0].value
          },
          ...list
        ]  
      }
    } 

    return list;
  }).then(async(recipes) => {
    for (let i = 0; i < recipes.length; i++) {
      recipes[i].data = await fetch(
        'https://vkuso.ru' + recipes[i].url
      ).then(async(response) => {
        return await response.text();
      }).then(async(html) => {
        return await new DOMParser().parseFromString(html,'text/html');
      }).then(recipe => {
        let products = recipe.getElementsByClassName('recipe-ingr')[0].getElementsByClassName('ingredient');
        let products_list = [];
        let instruction_text = '';
        
        for (let j = 0; j < products.length; j++) {
          products_list.push(
            {
              title: products[j].getElementsByClassName('name')[0].firstChild.data,
              weight: products[j].getElementsByClassName('value').length > 0 ? products[j].getElementsByClassName('value')[0].firstChild.data : 0,
              measure: products[j].getElementsByClassName('type').length > 0 ? products[j].getElementsByClassName('type')[0].firstChild.data : 'не указано'
            }
          );
        }

        if (recipe.getElementsByClassName('instructions ver_2').length > 0) {
          let instructions = recipe.getElementsByClassName('instructions ver_2')[0].getElementsByClassName('instruction_description _no-photo');

          for (let n = 0; n < instructions.length; n++) {
            instruction_text += instructions[n].firstChild.data + ' ';
          }
        } else if (recipe.getElementsByClassName('instructions').length > 0) {
          let instructions = recipe.getElementsByClassName('instructions')[0].getElementsByClassName('instruction');

          for (let n = 0; n < instructions.length; n++) {
            instruction_text += instructions[n].firstChild.data + ' ';
          }
        }
        
        return {
          products: products_list,
          instruction: instruction_text,
          level: recipe.getElementsByClassName('recipe_information')[0].getElementsByClassName('recipe-difficulty').length > 0 ?
            recipe.getElementsByClassName('recipe_information')[0].getElementsByClassName('recipe-difficulty')[0].getElementsByTagName('span')[0].childNodes[0].nodeValue : 'Не указано',
          time: recipe.getElementsByClassName('recipe_information')[0].getElementsByClassName('recipe_info__value').length > 0 ?
            recipe.getElementsByClassName('recipe_information')[0].getElementsByClassName('recipe_info__value')[0].getElementsByTagName('span')[1].childNodes[0].nodeValue : 'Не указано'
        }
      });
    }  

    return recipes;
  }).then(async(recipes) => {
    //console.log(recipes);
    await setRecipes(recipes)
  })

  

  return (
    <View style={styles.recipes_container}>
      {recipes.length == 0 && (
        <View style={styles.recipes_preloader_container}>
           <Text style={styles.recipes_preloader_text}>Уже ищем рецепты, которые вам подойдут...</Text>
           <Image 
              style={styles.recipes_preloader_animate}
              source={require('./../assets/preloader.gif')}
            />
        </View>
      )}
      <FlatList style={styles.recipes} data={recipes} renderItem={({ item }) => (
        <View style={styles.recipe}>
          <Image 
            style={styles.recipe_image}
            source={{
              uri: item.image,
            }}
          />
          <View style={styles.recipe_content}>
            <Text style={styles.recipe_title}>{item.title}</Text>
            <View style={styles.recipe_details}>
              <View style={styles.recipe_detail}>
                <Image 
                  style={styles.recipe_detail_image}
                  source={require('./../assets/cooking_image.png')}
                />
                <View style={styles.recipe_detail_text_content}>
                  <Text style={styles.recipe_detail_text}>Сложность</Text>
                  <Text style={styles.recipe_detail_text}>{item.data.level}</Text>
                </View>
              </View>
              <View style={styles.recipe_detail}>
                <Image 
                  style={styles.recipe_detail_image}
                  source={require('./../assets/time_image.png')}
                />
                <View style={styles.recipe_detail_text_content}>
                  <Text style={styles.recipe_detail_text}>Приготовление</Text>
                  <Text style={styles.recipe_detail_text}>{item.data.time}</Text> 
                </View>
              </View>
            </View>
            <View style={styles.recipe_buy_product}>
              <Text style={styles.recipe_buy_product_label}>Необходимо докупить: </Text>
              <Text style={styles.recipe_detail_text}>6 продуктов</Text> 
            </View>
            <Pressable 
              style={styles.btn_show_recipe}
              onPress={ () => {
                navigation.navigate('Recipe', item);
              }}
            >
              <Text style={styles.btn_show_recipe_text}>Подробнее</Text>
            </Pressable>
          </View>
        </View>
      )} />
    </View>
  );
}
  
  const styles = StyleSheet.create({
    recipes_container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '96%',
      maxHeight: '96%',
    },
    recipes_preloader_container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      paddingHorizontal: 18,
      backgroundColor: '#FFFFFF'     
    },
    recipes_preloader_text: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 24,
    },
    recipes_preloader_animate: {
      width: 52,
      height: 52
    },
    recipes: {
      overflow: 'scroll',
    },
    recipe: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: 520,
      margin: '4%',
      paddingBottom: 24,
      paddingHorizontal: 14,
      backgroundColor: '#FFFFFF',
      borderRadius: 8
    },
    recipe_image: {
      width: 360,
      height: 240,
      objectFit: 'contain',
    },
    recipe_content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
      width: '100%',
      marginTop: 8
    },
    recipe_title: {
      fontSize: 18,
      fontWeight: '700'
    },
    recipe_details: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: '#FCBA26',
      width: '100%',
      maxWidth: '100%',
      paddingVertical: 16,
      paddingHorizontal: 12,
      borderRadius: 8
    },
    recipe_detail: {
      display: 'flex',
      flexDirection: 'row',
      width: '50%',
      maxWidth: '50%'
    },
    recipe_detail_image: {
      width: 36,
      height: 36
    },
    recipe_detail_text_content: {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: 4
    },
    recipe_buy_product: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%'
    },
    recipe_buy_product_label: {
      fontWeight: '700'
    },
    btn_show_recipe: {
      display: 'flex',
      alignItems: 'center',
      borderRadius: 50,
      backgroundColor: '#6DE5B5',
      paddingVertical: 18,
      width: '100%',
    },
    btn_show_recipe_text: {
      color: '#151515',
      fontSize: 16,
      fontWeight: '500',
    }
});
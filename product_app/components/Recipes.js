import { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text, Image, Pressable} from 'react-native';

export default function Recipes({ navigation, route }) {
  const DOMParser = require('react-native-html-parser').DOMParser;
  const [recipes, setRecipes] = useState([]);
  const [loadRecipes, setLoadRecipes] = useState(false);

  useEffect(() => {
    getRecipes(route.params.products);
  },[])



  const getRecipes = async(products) => {
    let recipes_list = [];
    try {
      let search_products = [];

      products.forEach(product => {
        search_products.push(product.title);
      });

      const response = await fetch('https://vkuso.ru/?s=' + encodeURI(search_products.join('+')) + '&ms=1');
      const html = await response.text();
      const doc = await new DOMParser().parseFromString(html,'text/html');

      let recipes_count = doc.getElementsByClassName('views-item').length;

      if (recipes_count > 0) {
        if (recipes_count > 10) {
          recipes_count = 10;
        }
  
        for (let i = 0; i < recipes_count; i++) { 
          let recipe = doc.getElementsByClassName('views-item')[i];
          let url = recipe.getElementsByClassName('views-item__item-title')[0].getElementsByTagName('a')[0].attributes[0].value;

          if (!url.includes('/wiki/')) {
            recipes_list.push(
              {
                key: 'recipe_' + new Date().getTime(),
                url: url,
                data: await getRecipe(url, products)
              }
            )
          }
        }
      } 
    } catch(error) {
      console.log(error)
    } finally {
      setRecipes(recipes_list);
      setLoadRecipes(true);
    }
  } 

  const getRecipe = async(recipe, search_products) => {
    try {
      const response = await fetch('https://vkuso.ru' + recipe);
      const html = await response.text();
      const recipe_html = await new DOMParser().parseFromString(html,'text/html')

      let search_products_array = search_products.slice(); 
      let products = recipe_html.getElementsByClassName('recipe-ingr')[0].getElementsByClassName('ingredient');
      let products_list = [];
      let buy_products = [];
      let instruction_text = '';

      for (let j = 0; j < products.length; j++) {
        let title = products[j].getElementsByClassName('name')[0].firstChild.data;
        let weight = products[j].getElementsByClassName('value').length > 0 ? products[j].getElementsByClassName('value')[0].firstChild.data : 0;
        let measure = products[j].getElementsByClassName('type').length > 0 ? products[j].getElementsByClassName('type')[0].firstChild.data : 'не указано';
        let in_stock = false;
        
        search_products_array.forEach((item, index) => {
          if (title.toLowerCase().includes(item.title.toLowerCase())) {
            if(measure == item.measure) {
              if (weight <= item.weight) {
                in_stock = true;
              }
            }
            search_products_array.splice(index, 1);
          }
        });

        products_list.push(
          {
            key: 'product_' + products_list.length,
            title: title,
            weight: weight,
            measure: measure,
            in_stock: in_stock
          }
        );

        if(!in_stock) {
          buy_products.push(
            {
              key: buy_products.length,
              title: title
            }
          )
        }
      }

      if (recipe_html.getElementsByClassName('instructions ver_2').length > 0) {
        let instructions = recipe_html.getElementsByClassName('instructions ver_2')[0].getElementsByClassName('instruction_description _no-photo');

        for (let n = 0; n < instructions.length; n++) {
          instruction_text += instructions[n].firstChild.data + ' ';
        }
      } else if (recipe_html.getElementsByClassName('instructions').length > 0) {
        let instructions = recipe_html.getElementsByClassName('instructions')[0].getElementsByClassName('instruction');

        for (let n = 0; n < instructions.length; n++) {
          instruction_text += instructions[n].firstChild.data + ' ';
        }
      }
      
      return {
        title: recipe_html.getElementsByClassName('hrecipe')[0].getElementsByTagName('h1')[0].childNodes[0].nodeValue,
        image: recipe_html.getElementsByClassName('recipe-img')[0].getElementsByTagName('img')[0].attributes[3].value,
        products: products_list,
        buy_products: buy_products,
        instruction: instruction_text,
        level: recipe_html.getElementsByClassName('recipe_information')[0].getElementsByClassName('recipe-difficulty').length > 0 ?
          recipe_html.getElementsByClassName('recipe_information')[0].getElementsByClassName('recipe-difficulty')[0].getElementsByTagName('span')[0].childNodes[0].nodeValue : 'Не указано',
        time: recipe_html.getElementsByClassName('recipe_information')[0].getElementsByClassName('recipe_info__value').length > 0 ?
          recipe_html.getElementsByClassName('recipe_information')[0].getElementsByClassName('recipe_info__value')[0].getElementsByTagName('span')[1].childNodes[0].nodeValue : 'Не указано'
      }
    } catch(error) {
      console.log(error)
      return null;
    }
  }



  return (
    <View style={styles.recipes_container}>
      {!loadRecipes && recipes.length == 0 && (
        <View style={styles.recipes_preloader_container}>
           <Text style={styles.recipes_preloader_text}>Уже ищем рецепты, которые вам подойдут...</Text>
           <Image 
              style={styles.recipes_preloader_animate}
              source={require('./../assets/preloader.gif')}
            />
        </View>
      )}
      {loadRecipes && recipes.length == 0 && (
        <Text style={styles.recipes_not_found_text}>Рецепты не найдены</Text>
      )}
      {loadRecipes && recipes.length > 0 && (
        <FlatList style={styles.recipes} data={recipes} renderItem={({ item }) => (
          <View style={styles.recipe}>
            <Image 
              style={styles.recipe_image}
              source={{
                uri: item.data.image,
              }}
            />
            <View style={styles.recipe_content}>
              <Text style={styles.recipe_title}>{item.data.title}</Text>
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
                <Text style={styles.recipe_detail_text}>{item.data.buy_products.length} продуктов</Text> 
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
      )}
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
    recipes_not_found_text: {
      width: '100%',
      marginVertical: 30,
      fontSize: 18,
      fontWeight: '500',
      textAlign: 'center'
    },
    recipes: {
      overflow: 'scroll',
    },
    recipe: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: 528,
      margin: '4%',
      paddingVertical: 20,
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
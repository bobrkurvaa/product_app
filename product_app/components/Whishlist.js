import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";

export default function Whishlist({ navigation }) {
  const isFocused = useIsFocused();
  const [whishlistArray, setWhishlist] = useState([]);
  const DOMParser = require('react-native-html-parser').DOMParser;

  useEffect(() => {
    checkWhishlist();
  }, [isFocused]);

  const checkWhishlist = async () => {
    const asyncStorageRes = await AsyncStorage.getItem('whishlist');
    const whishlist = await JSON.parse(asyncStorageRes);
  
    setWhishlist([]);
  
    whishlist.uri.forEach((item, index) => {
      setWhishlist((list) => {
        return [
          {
            title: whishlist.title[index],
            uri: item
          },
          ...list
        ]
      })
    });
  }



  const removeWhishlist = async(uri) => {
    const asyncStorageRes = await AsyncStorage.getItem('whishlist');
    const whishlist = await JSON.parse(asyncStorageRes);
    let whishlist_uri = whishlist.uri;
    let whishlist_title = whishlist.title;

    if (whishlist_uri.indexOf(uri) != -1) {
        let index = whishlist_uri.indexOf(uri);

        whishlist_uri.splice(index, 1);
        whishlist_title.splice(index, 1);

        await AsyncStorage.setItem('whishlist', JSON.stringify({title: whishlist_title, uri: whishlist_uri}));
        checkWhishlist();
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
            } else {
              if (weight > 0) {
                if (convertWeight(item.title, weight, measure) <= item.weight) {
                  in_stock = true;
                }
              } else {
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

  const showRecipe = async (url) => {
    navigation.navigate('Recipe', {data: await getRecipe(url, [])});
  }

  return (
    <View style={styles.whishlist_container}>
      <FlatList 
        style={styles.whishlist}
        data={whishlistArray} 
        renderItem={({item}) => (
          <TouchableOpacity 
            style={styles.whishlist_item}
            onPress={()=>showRecipe(item.uri)}
          >
            <Text style={styles.whishlist_title}>{item.title}</Text>
            <Pressable 
                style={styles.remove_whishlist_btn} 
                onPress={()=>removeWhishlist(item.uri)}
            >
              <Image 
                style={styles.remove_whishlist_btn_image}
                source={require('./../assets/remove_btn-icon.png')}
              />
            </Pressable>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  whishlist_container: {
    marginVertical: 14,
    flex: 1,
  },
  whishlist: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll',
    paddingHorizontal: 18
  },
  whishlist_item:  {
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
  whishlist_title: {
    width: '86%',
    marginRight: '1%',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '500',
    color: '#151515',
  },
  remove_whishlist_btn: {
    width: 32,
    height: 32,
  },
  remove_whishlist_btn_image: {
    width: 28,
    height: 28,
  }
});
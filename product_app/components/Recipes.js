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


  
  const convertWeight = (product, weight, measure) => {
    let measuresArray = [   
      {  
        title:'Абрикос',
        m1:null,
        m2:null,
        m3:null,
        m4:40
      },
      {  
        title:'Апельсин',
        m1:null,
        m2:null,
        m3:null,
        m4:140
      },
      {  
        title:'Арахис очищенный',
        m1:175,
        m2:20,
        m3:null,
        m4:null
      },
      {  
        title:'Баклажан',
        m1:null,
        m2:null,
        m3:null,
        m4:200
      },
      {  
        title:'Болгарский перец',
        m1:null,
        m2:null,
        m3:null,
        m4:100
      },
      {  
        title:'Брусника',
        m1:140,
        m2:null,
        m3:null,
        m4:null
      },
      {  
        title:'Варенье',
        m1:330,
        m2:50,
        m3:17,
        m4:null
      },
      {  
        title:'Вино столовое',
        m1:250,
        m2:20,
        m3:5,
        m4:null
      },
      {  
        title:'Вишня свежая',
        m1:190,
        m2:30,
        m3:null,
        m4:null
      },
      {  
        title:'Вода',
        m1:250,
        m2:18,
        m3:5,
        m4:null
      },
      {  
        title:'Гвоздика молотая',
        m1:null,
        m2:null,
        m3:3,
        m4:null
      },
      {  
        title:'Гвоздика не молотая',
        m1:null,
        m2:null,
        m3:4,
        m4:null
      },
      {  
        title:'Гвоздика цельная',
        m1:null,
        m2:null,
        m3:null,
        m4:0.06
      },
      {  
        title:'Голубика',
        m1:260,
        m2:null,
        m3:null,
        m4:null
      },
      {  
        title:'Горох лущеный',
        m1:null,
        m2:25,
        m3:10,
        m4:null
      },
      {  
        title:'Горох не лущеный',
        m1:null,
        m2:0,
        m3:0,
        m4:null
      },
      {  
        title:'Горчица',
        m1:null,
        m2:null,
        m3:4,
        m4:null
      },
      {  
        title:'Горчица порошок',
        m1:null,
        m2:null,
        m3:4,
        m4:null
      },
      {  
        title:'Груша',
        m1:null,
        m2:null,
        m3:null,
        m4:135
      },
      {  
        title:'Джем',
        m1:null,
        m2:40,
        m3:15,
        m4:null
      },
      {  
        title:'Ежевика',
        m1:190,
        m2:null,
        m3:null,
        m4:null
      },
      {  
        title:'Желатин (порошок)',
        m1:null,
        m2:15,
        m3:5,
        m4:null
      },
      {  
        title:'Желатин гранулированный',
        m1:null,
        m2:15,
        m3:5,
        m4:null
      },
      {  
        title:'Желатин листик',
        m1:null,
        m2:null,
        m3:null,
        m4:2.5
      },
      {  
        title:'Земляника',
        m1:null,
        m2:null,
        m3:null,
        m4:8
      },
      {  
        title:'Изюм',
        m1:190,
        m2:25,
        m3:null,
        m4:null
      },
      {  
        title:'Какао',
        m1:null,
        m2:20,
        m3:10,
        m4:null
      },
      {  
        title:'Капуста (кочан)',
        m1:null,
        m2:null,
        m3:null,
        m4:1750
      },
      {  
        title:'Картофель средний',
        m1:null,
        m2:null,
        m3:null,
        m4:100
      },
      {  
        title:'Кислота лимонная',
        m1:null,
        m2:25,
        m3:8,
        m4:null
      },
      {  
        title:'Клубника',
        m1:150,
        m2:25,
        m3:null,
        m4:null
      },
      {  
        title:'Клюква',
        m1:145,
        m2:null,
        m3:null,
        m4:null
      },
      {  
        title:'Корица молотая',
        m1:null,
        m2:20,
        m3:8,
        m4:null
      },
      {  
        title:'Кофе',
        m1:null,
        m2:20,
        m3:10,
        m4:null
      },
      {  
        title:'Кофе молотый',
        m1:null,
        m2:20,
        m3:7,
        m4:null
      },
      {  
        title:'Крупа геркулес',
        m1:90,
        m2:12,
        m3:6,
        m4:null
      },
      {  
        title:'Крупа гречневая',
        m1:210,
        m2:15,
        m3:7,
        m4:null
      },
      {  
        title:'Крупа манная',
        m1:200,
        m2:25,
        m3:8,
        m4:null
      },
      {  
        title:'Крупа овсяная',
        m1:90,
        m2:12,
        m3:null,
        m4:null
      },
      {  
        title:'Крупа перловая',
        m1:230,
        m2:25,
        m3:8,
        m4:null
      },
      {  
        title:'Крупа ячневая',
        m1:180,
        m2:20,
        m3:7,
        m4:null
      },
      {  
        title:'Крыжовник',
        m1:210,
        m2:null,
        m3:null,
        m4:null
      },
      {  
        title:'Лавровый лист',
        m1:null,
        m2:null,
        m3:null,
        m4:0.2
      },
      {  
        title:'Ликер',
        m1:null,
        m2:20,
        m3:7,
        m4:null
      },
      {  
        title:'Лук репчатый средний',
        m1:null,
        m2:null,
        m3:null,
        m4:75
      },
      {  
        title:'Мак',
        m1:null,
        m2:18,
        m3:5,
        m4:null
      },
      {  
        title:'Малина',
        m1:140,
        m2:20,
        m3:null,
        m4:null
      },
      {  
        title:'Маргарин топленый',
        m1:230,
        m2:14,
        m3:10,
        m4:null
      },
      {  
        title:'Масло животное топленое',
        m1:240,
        m2:17,
        m3:5,
        m4:null
      },
      {  
        title:'Масло растительное',
        m1:240,
        m2:20,
        m3:5,
        m4:null
      },
      {  
        title:'Масло сливочное',
        m1:240,
        m2:40,
        m3:15,
        m4:null
      },
      {  
        title:'Мёд',
        m1:325,
        m2:25,
        m3:15,
        m4:null
      },
      {  
        title:'Миндаль очищенный',
        m1:160,
        m2:30,
        m3:10,
        m4:null
      },
      {  
        title:'Молоко сгущеное',
        m1:null,
        m2:30,
        m3:12,
        m4:null
      },
      {  
        title:'Молоко сухое',
        m1:120,
        m2:20,
        m3:5,
        m4:null
      },
      {  
        title:'Молоко',
        m1:250,
        m2:20,
        m3:5,
        m4:null
      },
      {  
        title:'Морковь',
        m1:null,
        m2:null,
        m3:null,
        m4:75
      },
      {  
        title:'Мука картофельная',
        m1:180,
        m2:30,
        m3:10,
        m4:null
      },
      {  
        title:'Мука кукрузная',
        m1:160,
        m2:30,
        m3:10,
        m4:null
      },
      {  
        title:'Мука пшеничная',
        m1:160,
        m2:25,
        m3:10,
        m4:null
      },
      {  
        title:'Огурец средний',
        m1:null,
        m2:null,
        m3:null,
        m4:100
      },
      {  
        title:'Орех грецкий молотый',
        m1:120,
        m2:20,
        m3:5,
        m4:null
      },
      {  
        title:'Орех фундук очищенный',
        m1:170,
        m2:30,
        m3:10,
        m4:null
      },
      {  
        title:'Орех ядро',
        m1:165,
        m2:30,
        m3:null,
        m4:null
      },
      {  
        title:'Перец горький',
        m1:null,
        m2:null,
        m3:null,
        m4:0.05
      },
      {  
        title:'Перец душистый порошок',
        m1:null,
        m2:null,
        m3:4.5,
        m4:0.07
      },
      {  
        title:'Перец молотый красный',
        m1:null,
        m2:null,
        m3:1,
        m4:null
      },
      {  
        title:'Перец молотый черный',
        m1:null,
        m2:null,
        m3:5,
        m4:null
      },
      {  
        title:'Перец черный горошек',
        m1:null,
        m2:null,
        m3:0,
        m4:0.03
      },
      {  
        title:'Персик',
        m1:null,
        m2:null,
        m3:null,
        m4:85
      },
      {  
        title:'Петрушка',
        m1:null,
        m2:null,
        m3:null,
        m4:50
      },
      {  
        title:'Петрушка корень',
        m1:null,
        m2:null,
        m3:null,
        m4:150
      },
      {  
        title:'Повидло',
        m1:310,
        m2:36,
        m3:12,
        m4:null
      },
      {  
        title:'Помидор',
        m1:null,
        m2:null,
        m3:null,
        m4:75
      },
      {  
        title:'Пшено',
        m1:null,
        m2:25,
        m3:8,
        m4:null
      },
      {  
        title:'Пюре земляничное',
        m1:350,
        m2:50,
        m3:17,
        m4:null
      },
      {  
        title:'Пюре ягодное',
        m1:350,
        m2:50,
        m3:17,
        m4:null
      },
      {  
        title:'Редис',
        m1:null,
        m2:null,
        m3:null,
        m4:20
      },
      {  
        title:'Редька',
        m1:null,
        m2:null,
        m3:null,
        m4:175
      },
      {  
        title:'Репа',
        m1:null,
        m2:null,
        m3:null,
        m4:85
      },
      {  
        title:'Рис',
        m1:240,
        m2:25,
        m3:9,
        m4:null
      },
      {  
        title:'Сало',
        m1:null,
        m2:50,
        m3:30,
        m4:null
      },
      {  
        title:'Сало топленое',
        m1:245,
        m2:20,
        m3:null,
        m4:null
      },
      {  
        title:'Сахар кусковой',
        m1:200,
        m2:null,
        m3:null,
        m4:9
      },
      {  
        title:'Сахарная пудра',
        m1:180,
        m2:25,
        m3:8,
        m4:null
      },
      {  
        title:'Сахарный песок',
        m1:230,
        m2:30,
        m3:12,
        m4:null
      },
      {  
        title:'Свекла',
        m1:null,
        m2:null,
        m3:null,
        m4:50
      },
      {  
        title:'Сельдерей',
        m1:null,
        m2:null,
        m3:null,
        m4:100
      },
      {  
        title:'Сельдерей корень',
        m1:null,
        m2:null,
        m3:null,
        m4:85
      },
      {  
        title:'Слива',
        m1:150,
        m2:null,
        m3:null,
        m4:30
      },
      {  
        title:'Сливки',
        m1:250,
        m2:14,
        m3:5,
        m4:null
      },
      {  
        title:'Сметана',
        m1:250,
        m2:25,
        m3:10,
        m4:null
      },
      {  
        title:'Смородина красная',
        m1:175,
        m2:35,
        m3:null,
        m4:null
      },
      {  
        title:'Смородина черная',
        m1:155,
        m2:30,
        m3:null,
        m4:null
      },
      {  
        title:'Сода питьевая',
        m1:null,
        m2:28,
        m3:12,
        m4:null
      },
      {  
        title:'Сок',
        m1:250,
        m2:18,
        m3:5,
        m4:null
      },
      {  
        title:'Соль',
        m1:325,
        m2:30,
        m3:10,
        m4:null
      },
      {  
        title:'Сорго',
        m1:180,
        m2:20,
        m3:7,
        m4:null
      },
      {  
        title:'Сухари',
        m1:null,
        m2:null,
        m3:null,
        m4:50
      },
      {  
        title:'Сухари молотые',
        m1:125,
        m2:15,
        m3:5,
        m4:null
      },
      {  
        title:'Сухари панировачные',
        m1:125,
        m2:20,
        m3:5,
        m4:null
      },
      {  
        title:'Сыр кисломолочный',
        m1:null,
        m2:17,
        m3:5,
        m4:null
      },
      {  
        title:'Толченые орехи',
        m1:null,
        m2:20,
        m3:7,
        m4:null
      },
      {  
        title:'Томатное пюре',
        m1:220,
        m2:25,
        m3:8,
        m4:null
      },
      {  
        title:'Томатный соус',
        m1:null,
        m2:25,
        m3:8,
        m4:null
      },
      {  
        title:'Томатная паста',
        m1:null,
        m2:30,
        m3:10,
        m4:null
      },
      {  
        title:'Уксус',
        m1:250,
        m2:18,
        m3:5,
        m4:null
      },
      {  
        title:'Фасоль',
        m1:null,
        m2:30,
        m3:10,
        m4:null
      },
      {  
        title:'Кукурузные Хлопья',
        m1:50,
        m2:17,
        m3:2,
        m4:null
      },
      {  
        title:'Хлопья овсяные',
        m1:100,
        m2:14,
        m3:4,
        m4:null
      },
      {  
        title:'Хлопья пшеничные',
        m1:60,
        m2:9,
        m3:2,
        m4:null
      },
      {  
        title:'Цветная капуста средняя',
        m1:null,
        m2:null,
        m3:null,
        m4:750
      },
      {  
        title:'Чай',
        m1:null,
        m2:15,
        m3:4,
        m4:null
      },
      {  
        title:'Черешня',
        m1:165,
        m2:null,
        m3:null,
        m4:null
      },
      {  
        title:'Черная смородина',
        m1:180,
        m2:30,
        m3:null,
        m4:null
      },
      {  
        title:'Черника',
        m1:200,
        m2:35,
        m3:null,
        m4:null
      },
      {  
        title:'Черника сушеная',
        m1:null,
        m2:15,
        m3:null,
        m4:null
      },
      {  
        title:'Чернослив',
        m1:250,
        m2:25,
        m3:null,
        m4:null
      },
      {  
        title:'Чечевица',
        m1:210,
        m2:null,
        m3:null,
        m4:null
      },
      {  
        title:'Яблоко',
        m1:null,
        m2:null,
        m3:null,
        m4:90
      },
      {  
        title:'Яблоко сушеное',
        m1:70,
        m2:null,
        m3:null,
        m4:null
      },
      {  
        title:'Белок',
        m1:null,
        m2:null,
        m3:null,
        m4:30
      },
      {  
        title:'Желток',
        m1:null,
        m2:null,
        m3:null,
        m4:20
      },
      {  
        title:'Яйцо',
        m1:null,
        m2:null,
        m3:null,
        m4:50
      },
      {  
        title:'Яичный порошок',
        m1:180,
        m2:25,
        m3:10,
        m4:null
      }
    ]

    measuresArray.forEach((item) => {
      if (item.title.toLowerCase().includes(product.toLowerCase())) {
        switch (measure) {
          case 'стакан':
          case 'стакана':
            return m1 * parseFloat(weight);
            break;
          case 'ст.л.':
          case 'ст. л.':
            return m2 * parseFloat(weight);
            break;
          case 'ч.л.':
          case 'ч. л.':
            return m3 * parseFloat(weight);
            break;
          case 'шт.':
            return m4 * parseFloat(weight);
            break;
          case 'г':
          case 'гр':
            return parseFloat(weight);
            break;
          default:
            return 0;
        }
      }
    })

    return 0;
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
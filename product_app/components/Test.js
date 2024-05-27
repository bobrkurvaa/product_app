/*
  route.params.products.forEach((product, index) => {  
    fetch(
      'http://recepty-po-ingredientam.ru/api/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service:"Parser",
          method:"SearchIngredients",
          data: {
            search: product.title,
          }
        })
      }
    ).then(response => {
      return response.json();
    }).then(response => {
      var items = response.data.items;
      
      items.forEach(function(item, key) {
        if (!item.name.substring(0, product.title.length).toLowerCase().includes(product.title.toLowerCase())) {
          delete items[key];
        } else {
          items[key].name = items[key].name.replace('\"', '').replace(',', '');
        }
      });
      
      items = items.sort((a, b) => a.name > b.name ? 1 : -1);
  
      if (items.length > 0) {
        products_list.push(items[0].id)
        //console.log(items); // show find products
      }

      if (route.params.products.length - 1 == index) {
        fetch(
          'http://recepty-po-ingredientam.ru/api/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              service:"Parser",
              method:"Search",
              data: {
                ingredients: products_list,
                
                filters:{
                  orderby:1,
                  orderdest:2,
                  limit:40
                }
              }
            })
          }
        ).then(response => {
          return response.json();
        }).then(response => {
          console.log(response.data.items);
        })
      }
    });
  })

*/







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
      let url = recipe.getElementsByClassName('views-item__item-title')[0].getElementsByTagName('a')[0].attributes[0].value;
      
      if (!url.includes('/wiki/')) {
        list = [
          {
            key: 'recipe_' + new Date().getTime(),
            url: url
          },
          ...list
        ]  
      }
    }
  } 

  return list;
}).then(async(recipes) => {
  for (let i = 0; i < recipes.length; i++) {
    recipes[i].data = await getRecipe(recipes[i], route.params.products)
    /*
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
      let search_products_array = search_products.slice();
      let buy_products = [];
      
      for (let j = 0; j < products.length; j++) {
        let title = products[j].getElementsByClassName('name')[0].firstChild.data;
        let weight = products[j].getElementsByClassName('value').length > 0 ? products[j].getElementsByClassName('value')[0].firstChild.data : 0;
        let measure = products[j].getElementsByClassName('type').length > 0 ? products[j].getElementsByClassName('type')[0].firstChild.data : 'не указано';
        let in_stock = false;
        
        search_products_array.forEach((product_title, index) => {
          if (title.includes(product_title)) {
            
            if(measure == route.params.products[index].measure) {
              if (weight <= route.params.products[index].weight) {
                in_stock = true;
              } else {
                in_stock = false;
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
          buy_products.push({
            key: buy_products.length,
            title: title
          })
        }
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
        title: recipe.getElementsByClassName('hrecipe')[0].getElementsByTagName('h1')[0].childNodes[0].nodeValue,
        image: recipe.getElementsByClassName('recipe-img')[0].getElementsByTagName('img')[0].attributes[3].value,
        products: products_list,
        instruction: instruction_text,
        buy_products: buy_products,
        level: recipe.getElementsByClassName('recipe_information')[0].getElementsByClassName('recipe-difficulty').length > 0 ?
          recipe.getElementsByClassName('recipe_information')[0].getElementsByClassName('recipe-difficulty')[0].getElementsByTagName('span')[0].childNodes[0].nodeValue : 'Не указано',
        time: recipe.getElementsByClassName('recipe_information')[0].getElementsByClassName('recipe_info__value').length > 0 ?
          recipe.getElementsByClassName('recipe_information')[0].getElementsByClassName('recipe_info__value')[0].getElementsByTagName('span')[1].childNodes[0].nodeValue : 'Не указано'
      }
    });*/
  }  

  return recipes;
}).then(async(recipes) => {
  await setRecipes(recipes)
  await setLoadResipes(true)
})




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

fetch(
  'https://sbermarket.ru/api/v2/multisearches?q=' + encodeURI(route.params.products[0].title) + '&lat=' + position.latitude + '&lon=' + position.longitude + '&include%5B%5D=retailer&include%5B%5D=closest_shipping_options'
).then(async(response) => {
  return await response.json();
}).then(response => {
  let stores_data = [];

  response.stores.forEach(store => {
      if (store.vertical == 'grocery') {
          stores_data.push(
              {
                  key: stores_data.length,
                  id: store.id,
                  name: store.retailer.name,
                  slug: store.retailer.slug,
                  logo: store.retailer.logo,
                  logo_background_color: store.retailer.logo_background_color,
                  delivery_text: store.next_delivery == null ? 'время не указано' : store.next_delivery.summary,
                  order_amount: store.min_order_amount
              }    
          )
      }
  });
  
  return stores_data;
}).then(async(stores) => {
  await setStores(stores);
});
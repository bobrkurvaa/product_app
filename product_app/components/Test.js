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
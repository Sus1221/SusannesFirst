// Wait for DOM ready
$(function(){

  // Some "globals" to remember sortOrder and filterCat
  var sortOrder = "name", filterCat = "all", products = [];

  // Get the products from the database
  function getAllProducts(){
    
    showCorrectSortArrow(sortOrder);
    
    $.ajax({
      // Use Nodebite's magic library
      url:"libs/sql-ajax-json.php",
      // Expect json in return
      dataType: "json",
      data: {
        // Read SQL questions from this file
        sql: "sql/product-questions.sql",
        // Run the query named all products
        run: "get products",
        sortOrder: sortOrder,
        filterCat: filterCat
      },
      // When we have got an response from the server
      // run listAllProducts
      success:listAllProducts
    });

  }

  // Get the categories from the database
  function getAllCategories(){
    
    $.ajax({
      url:"libs/sql-ajax-json.php",
      dataType: "json",
      data: {
        sql: "sql/product-questions.sql",
        run: "get categories"
      },
      success:buildRadioButtons
    });

  }

  // Build the radio buttons for categories
  function buildRadioButtons(categories){

    // get the holder for radio buttons "category-listing"
    var radios =  $('.category-listing');
    
    // an extra category for "all"
    radios.append('<input type="radio" checked name="cat" value="all">Alla');
    
    // loop through and add the categories we got from ajax
    for(var i = 0; i < categories.length; i++){
      radios.append('<input type="radio" name="cat" value="' +
        categories[i].id +'">' + categories[i].name);
    }
    
    // add a click handler for each radio button including the all one
    radios.find('input').click(function(){
      filterCat = $(this).val();
      getAllProducts();
    });

  }
  
  // Show the correct sort arrow according to sql question name
  function showCorrectSortArrow(sortOrder){

    // replace all spaces in sortOrder with hyphens
    // (since we are going to use sortOrder as a class name)
    sortOrder = sortOrder.replace(/ /g,"-");

    // hide all arrows
    $('.product-column-names i').hide();
    // then show the correct one
    $('.product-column-names .' + sortOrder).show();
  }

  // List all products
  function listAllProducts(data){

    // Store the data from ajax in our "global" variable products
    products = data;

    // Now that the products are loaded we can load any stored shopping cart
    loadCartFromLocalStorage();

    // empty the product-listing element from articles except
    // the article with the class product-column-names
    $('.product-listing article').not('.product-column-names').remove();

    // loop through the products array with a for-loop
    for(var i = 0; i < products.length; i++){
      // ask jQuery to create a new article
      var article = $('<article/>');

      // Create some spans inside the article for each 
      //product property we want to show
      article.append('<span class="p-name">' + products[i].name + '</span>');
      article.append('<span class="p-price">' + products[i].price + '</span>');

      // Add a buy button
      var buyButton = $('<button>Köp</button>');
      var spanForBuyButton = $('<span class="buy"/>');
      spanForBuyButton.append(buyButton);
      article.append(spanForBuyButton);

      // Let the buy button remember its products
      // Read more: http://api.jquery.com/data/
      buyButton.data("product",products[i]);
      
      article.append(
        '<div class="p-description">' + products[i].description + '</div>'
      );

      // add the article to the product-listing element
      $('.product-listing').append(article);
    }

    // Add the click handlers for the buy buttons
    $('.buy button').click(buyButtonHandler);

  }

  // The buyButtonHandler runs when we click a buy button
  function buyButtonHandler(){

      // Show the shopping-cart (emulate click on "show-cart" button)
      $('.show-cart').click();

      // Retrieve the product object associated with the button
      // (we did this association in the listAllProducts function) 
      var productToBuy = $(this).data("product");

      // If the product does not have a amount property then add it
      if(!productToBuy.amount){
        productToBuy.amount = 0;
      }

      // Now add 1 to the product's amount property value
      productToBuy.amount +=1;

      // Create a new article to display the product in the cart
      var productInCart = $('<article/>');

       // Check if the product is already in the shopping cart
       // if so change productInCart to refer to the existing article
      $('.shopping-cart article').each(function(){
        if($(this).data('product').id == productToBuy.id){
          productInCart = $(this);
        }
      });

      // Create the html for displaying the product in the cart
      productInCart.html(
        '<span class="remove"><i class="fa fa-times"></i></span>' +
        '<span class="name"> ' + productToBuy.name + '</span>' +
        '<span class="price"> ' + productToBuy.price + '</span>' +
        '<span class="amount"> ' + productToBuy.amount + '</span>' +
        '<span class="line-sum">' + productToBuy.price * productToBuy.amount + '</span>'
      );

      // If we haven't added the product to the cart then do so
      if($('.shopping-cart').find(productInCart).length === 0){
        $('.shopping-cart').append(productInCart);
      }
        
      // Associate the article with the product object
      productInCart.data("product",productToBuy);

      // Sum the cost of all products
      productSumCosts();

      // Add remove "button" click event handler
      $('.shopping-cart .remove').click(function(){
        // Remove the my parent element (article)
        $(this).parent().remove();
        productToBuy.amount = 0;
        productSumCosts();
        // Save the shopping-cart to localstorage
        saveCartToLocalStorage();
      });

      // Save the shopping-cart to localstorage
      saveCartToLocalStorage();
  }

  // Sum the cost of all product
  function productSumCosts(){
    
    var sum = 0;
    
    // Loop through a set of DOM elements using jQuery each
    $('.shopping-cart article').each(function(){
      // This function will run once for each element
      // $(this) will be the current element in the loop

      // we can retrieve to product data we associated with 
      // the dom element erlier like this
      var product = $(this).data('product');
      
      // Add the price times the amount to the total sum
      sum += product.price * product.amount;

    });

    // Display the sum in the shopping-cart
    // (remove the last/old sum first then add the new one)
    $('.shopping-cart section.sum').remove();
    var sumAsElement = $('<section class="sum">Totalt: ' + sum + '</section>');
    $('.shopping-cart').append(sumAsElement);
    $('.shopping-cart button.checkOut').remove();
    $('.shopping-cart').append('<button class="checkOut">Betala</button>');
    $('.shopping-cart .checkOut').click(function() {
      $('.hide-cart').click();
      $('.formsect').show();
    });
    //cancel checkout-button
    $('.formsect .cancelCheckout').click(function() {
      $('.formsect').hide();
    });
  }

  // Save the cart to localStorage
  function saveCartToLocalStorage(){

     // Actually just save the product id and amount
     var toSave = [];

     // Create a new array
     var productIds = [];

     // Loop through the DOM to collect products in the cart
     // and add them to the array
     $('.shopping-cart article').each(function(){
       var p = $(this).data('product');
       toSave.push({id:p.id,amount:p.amount});
     });

     // Save to localStorage
     localStorage.productsInCart = JSON.stringify(toSave);
  }

  // Load the cart from localStorage
  function loadCartFromLocalStorage(){

    // Create a "fake" buy button just to be able to bind some data to it
    var fakeBuyButton = $('<button/>');

    // Add the click handler for buy buttons to our fake buy button
    fakeBuyButton.click(buyButtonHandler);

    // Load the product data from localStorage
    // and revive it from a JSON string to a real array of objects
    var loaded = [];
    if(localStorage.productsInCart){
      loaded = JSON.parse(localStorage.productsInCart);
    }

    // We only store the product id and the amount for each product
    // in localStorage, the reset of the data about a product
    // we will get from the products var (products we just asked SQL about)
    // This way if we change a price or name those will be correctly updated
    // when we return to the web site to look at our cart
    for(var i = 0; i < products.length; i++){
      for(var j = 0; j < loaded.length; j++){
        
        if(loaded[j].id == products[i].id){
          
          // We found a product that exists in the cart
          // Add the amount to it - 1 (since a buy button click
          // that we fake below will add 1 to the amount)
          products[i].amount = loaded[j].amount - 1;
          // Associate it with the fake buy button and click it
          fakeBuyButton.data('product',products[i]);
          fakeBuyButton.click();
        }
      }
    }
  }

  // Add a click handler to product-listing-column names
  $('.product-column-names span').click(function(){
    
    var me = $(this);

    // get the column name from the third character
    // and onwords in the class name
    // (i.e. p-name becoms name, p-price becomes price)
    var columnName = me.attr('class').substring(2);

    // to find a child element within an element
    // you can use jQuerys find
    var sortedAscending = me.find('.fa-chevron-down:visible').length !== 0;
    var sortedDescending = me.find('.fa-chevron-up:visible').length !== 0;
    
    // if we are not sorting by this column start sorting by it ascending
    if(!sortedAscending && !sortedDescending){
      // change the "global" sortOrder, then get all products again
      sortOrder = columnName;
      getAllProducts();
    }

    // if we are sorted descending then switch to ascending
    if(sortedDescending){
      // change the "global" sortOrder, then get all products again
      sortOrder = columnName;
      getAllProducts();
    }

    if(sortedAscending){
      // change the "global" sortOrder, then get all products again
      sortOrder =  columnName + " desc";
      getAllProducts();
    }

  });

  //a function to verify a user
  function verifyInfo(customerInfo) {
     
      $.ajax({
         // Use Nodebite's magic library
          url:"libs/sql-ajax-json.php",
          // Expect json in return
          dataType: "json",
          data: {
          // Read SQL questions from this file
          sql: "sql/product-questions.sql",
          // Run the query named all products
          run: "get user",
          email: JSON.stringify(customerInfo["email"])
        },
        success: function(data) {
          if (customerInfo["förnamn"] != data[0]["förnamn"] || customerInfo["efternamn"] != data[0]["efternamn"]) {
            $('.userNotify .userError').show();
            return;
          }

          //if nothing is wrong, register the password
          registerPassword(customerInfo, data);

          console.log("verifyInfo success:", data);
        },
        error: function(data) {
          console.log("Error", data);
          $('.userNotify .userError').show();
        }
      });
  }
  //Function to register a new password in the database
  function registerPassword(customerInfo) {

          $.ajax({
            // Use Nodebite's magic library
            url:"libs/sql-ajax-json.php",
            // Expect json in return
            dataType: "json",
            data: {
              // Read SQL questions from this file
              sql: "sql/product-questions.sql",
              // Run the query named all products
              run: "register password",
              email: JSON.stringify(customerInfo["email"]),
              password: JSON.stringify(customerInfo["password"])
            },
            success: function(data) {
              console.log("registerPassword success:", data);
              userLogin(customerInfo);
            }
          });
  }

  function userLogin(customerInfo) {

          $.ajax({
            // Use Nodebite's magic library
            url:"libs/sql-ajax-json.php",
            // Expect json in return
            dataType: "json",
            data: {
              // Read SQL questions from this file
              sql: "sql/product-questions.sql",
              // Run the query named all products
              run: "login user",
              email: JSON.stringify(customerInfo["email"]),
              password: JSON.stringify(customerInfo["password"])
            },
            success: function(data) {
              console.log("userLogin success:", data);
              processLogin(data);
            }
          });
  }

  //function to do stuff when login
  function processLogin(data) {
    //save to local storage
    localStorage.currentUser = data[0];

    $('.userNotify .userSuccess').show();
  }

  // Add click handlers for show/hide shopping cart buttons
  $('.show-cart').click(function(){
    $('.show-cart').hide();
    $('.shopping-cart, .hide-cart').show();
  });
  $('.hide-cart').click(function(){
    $('.hide-cart, .shopping-cart').hide();
    $('.show-cart').show();
  });

  //add submit handler for the checkoutform
  $('.formsect .customerInfo').submit(function() {
    //a variable to hold the new customer information
    var customerInfo = {};
    //ON this level - "this" is the <form> being submitted
    $(this).find("input").not("input[type='submit']").each(function() {
      //On this level "this" is the current <input> in the array
      customerInfo[this.name] = $(this).val();
    });
    console.log("customerInfo:", customerInfo);

     $.ajax({
      // Use Nodebite's magic library
      url:"libs/sql-ajax-json.php",
      // Expect json in return
      dataType: "json",
      data: {
        // Read SQL questions from this file
        sql: "sql/product-questions.sql",
        // Run the query named all products
        run: "register user",
        förnamn: JSON.stringify(customerInfo["förnamn"]),
        efternamn: JSON.stringify(customerInfo["efternamn"]),
        email: JSON.stringify(customerInfo["email"])
      
      },
      // When we have got an response from the server
      // run listAllProducts
      success: function(data) {
        verifyInfo(customerInfo);
      },
      error: function(data) {
        console.log("Error", data);
        $('.userNotify .userError').show();

      }
    });

    return false;
  });

  // Start by getting all the categories & products
  getAllCategories();
  getAllProducts();
});
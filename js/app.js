// Foundation.Abide.defaults.patterns['API-pattern'] = /^[0-9A-Za-z-\\.@:%_\+~#=]+$/;
$(document).foundation()
var x = $("#location_input");
var lat, lon, milesRadius, cusineChoice, photoRef;
var apiKey = "";
var apiKeyReceipy = "";
var data = {};
var actions = {};
var dataReceipy = {};
// const recepiesAPIKey = "dff8f3f117msh752eb83c0d81eb8p10add3jsn52664fe1c35d";

function getLocation() {
  $.ajax({
    url: "https://geolocation-db.com/jsonp",
    jsonpCallback: "callback",
    dataType: "jsonp",
    success: function (location) {
      x.val(location.city + "," + location.state + "," + location.country_name);
      lat = location.latitude;
      lon = location.longitude;
    }
  });
}
function alertCall(textAlert) {
  $("#alertText").text(textAlert);
  $('#alertModal').foundation('open');
}

$('#modalForm').submit(function (event) {
  event.preventDefault();
  // validate input before 
  var textinput = $("#modal_input").val();
  if (textinput != "") {
    $('#inputModal').foundation('close');
    apiKey = textinput;
  }
});



// class FancyPrompt {
//   constructor(a) {
//     this.textforTop = a;
//   }
//   // method
//    theValue() {
//     $("#alertText1").text(this.textforTop);
//     var textinput;
//     var finishCheck = false;
//     popup.open();
//     $('#modalForm').submit(function (event) {
//       event.preventDefault();
//       // validate input before 
//       var textinput = $("#modal_input").val();
//       if (textinput != "") {
//         finishCheck = true;
//         popup.close;
//         return;
//       }
//     });
//     while(!finishCheck){
//       new Promise(resolve => setTimeout(resolve, 500));
//     }
//     return textinput
//   }
// }


function inputdata(textAlert) {
  $("#alertText1").text(textAlert);
  $('#inputModal').foundation('open');
}

function restaurantSearch() {
  var params = {};
  params.target = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${milesRadius * 1600}&type=restaurant&keyword=${cusineChoice}&key=${apiKey}`;
  $.ajax({
    url: 'https://greve-chaise-90856.herokuapp.com/proxy/api/v1?' + $.param(params),
    method: 'GET'
  }).then(function (response) {
    // Creates cards for search results
    drawRestaurants(response);
  });
}





function drawRestaurants(res) {
  restaurants = JSON.parse(res);
  for (var i = 0; i < restaurants.results.length; i++) {
    console.log(restaurants.results[i]);
    var restaurantlocation = restaurants.results[i].vicinity;
    var restaurantRating = restaurants.results[i].rating;
    var restaurantName = restaurants.results[i].name;
    // restaurantIcon needs to be changed
    if (restaurants.results[i]['photos']) {
      // var restaurantIcon = restaurants.results[i].photos.photo_reference;
      var restaurantIcon = "./assets/images/burgerplaceholder.jpg"
      
      var cardImage = $(`<img src='${restaurantIcon}' alt='restaurant Icon'>`);
    }
    else {
      var cardImage = $(`<img src='' alt='NO restaurant Icon'>`);
    }

    if (restaurants.results[i]['opening_hours']) {
      if (restaurants.results[i].opening_hours['open_now']) {
        var openConfirm = $(`<p style='color: green;'>Open Now</p>`);
      }
      if (restaurants.results[i].opening_hours['open_now'] === false) {
        var openConfirm = $(`<p style='color: red;'>Closed</p>`);
      }
    }
    else {
      var openConfirm = $(`<p style='color: yellow;'>No Info</p>`);
    }

    var restaurantCell = $("<div class='cell'>")
    var restaurantCard = $("<div class='card'>");
    var cardHeader = $(`<div class='card-divider' value='${restaurants.results[i].id}'>${restaurantName}</div>`);
    var cardTextSection = $(`<div class='card-section'>`);
    var cardSectionHeader = $(`<h4>Restaurant Info:</h4>`);
    var cardSectionRating = $(`<p>Rating: ${restaurantRating}</p>`);
    var cardSectionlocation = $(`<p>Location: ${restaurantlocation}</p>`);

    $(restaurantCard).append(cardHeader);
    $(restaurantCard).append(cardImage);
    $(restaurantCard).append(cardSectionHeader);
    $(restaurantCard).append(cardTextSection);
    $(cardTextSection).append(cardSectionRating);
    $(cardTextSection).append(cardSectionlocation);
    $(cardTextSection).append(openConfirm);
    $(restaurantCell).append(restaurantCard);
    $("#restaurantList").append(restaurantCell);
  }
};





// contentType: "application/json",
// }).then(function (response) {
//   console.log(response)
// });



// method: "GET",
// headers: {"Access-Control-Allow-Origin": "*"}
// }).then(function (response) {
// console.log(response)
// }).catch(function (error) {
// if error use default

// alertCall("ERRRoRRR! #"+error.status)
// });




$('#restaurantForm').submit(function (event) {
  event.preventDefault();
  // validate input before proceed
  var textLocation = $("#location_input").val();
  cusineChoice = $("#cusineChoice").val();
  milesRadius = $("#milesRadius").val();
  var dishesChoice = $("#dishesChoice").val();
  if (!lat) {
    getLocation();
  }
  if (!milesRadius) {
    alertCall("Please enter radious of search");
    return;
  };
  if ((!dishesChoice) && (!cusineChoice)) {
    alertCall("Please enter something! I have no idea what you like to eat");
    return;
  }
  restaurantSearch();
  alertCall("pass!");
  // console.log(restaurants);
});
function dishClick(n) {
  var dishId = $("#dish_" + n).attr("value");
  $("#ReceipyTitle").text(data.results[n].title)
  $('#ReceipyModal').css("background-image", "url(" + data.results[n].image + ")")
  var ingredientURL = `https://api.spoonacular.com/recipes/${dishId}/ingredientWidget.json?apiKey=${apiKeyReceipy}`;
  $.ajax({
    url: ingredientURL,
    method: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: 'json',
    data: JSON.stringify(data),
    success: function (data) {
      dataReceipy = data;
      var listIng = "";
      for (var i = 0; i < dataReceipy.ingredients.length; i++) {
        listIng += dataReceipy.ingredients[i].name + " " + dataReceipy.ingredients[i].amount.us.value + dataReceipy.ingredients[i].amount.us.unit + "<br>";
      }
      $("#ingredientsList").html(listIng);

    },
  }).catch(function (error) {
    alertCall("Errors!!! in Receipy ingredientsWidget " + error.status);
  });
  ingredientURL = `https://api.spoonacular.com/recipes/${dishId}/analyzedInstructions?apiKey=${apiKeyReceipy}`;
  $.ajax({
    url: ingredientURL,
    method: "GET",
    contentType: "application/json",
    success: function (data1) {
      actions = data1;
      var listActions = "";
      for (var i = 0; i < actions[0].steps.length; i++) {
        listActions += (i + 1) + ". " + actions[0].steps[i].step + "<br>";
      }
      $("#orderList").html(listActions);
    }
  }).catch(function (error) {
    alertCall("Errors!!! in Receipy Analyzed Instructions " + error.status);
  })
  $('#ReceipyModal').foundation('open');
};
function DrawIngredients() {
  var listIng = "";
  for (var i = 0; i < dataReceipy.ingredients.length; i++) {
    listIng += dataReceipy.ingredients[i].name + " " + dataReceipy.ingredients[i].amount.us.value + dataReceipy.ingredients[i].amount.us.unit + "<br>";
  }
  return listIng;
}
function recepiesSearch(url) {
  $.ajax({
    url: url,
    method: "GET",
  }).then(function (data1) {
    data = data1;
    var el = `<div class="grid-x grid-padding-x">`;
    for (var i = 0; i < data.results.length; i++) {
      el +=
        ` 
       <div  class="large-6 medium-6 cell" >
        <img style="padding: 5px; width:100%; border-radius: 2rem; border: 1, solid, salmon"  src="${data.results[i].image}" alt="${data.results[i].title}'s image">
       </div>
       <div  class="large-6 medium-6 cell"  >
         <h4 id="dish_${i}" onClick="dishClick(${i})" style="align-text: center; margin-top: 2rem " value="${data.results[i].id}">${i + 1}. ${data.results[i].title}</h4> 
       </div>
       `
    }
    $currentEl = document.createElement('div');
    $currentEl.innerHTML = el + "</div>";
    $("#ReceipiesTab").empty();
    $("#ReceipiesTab").append($currentEl);
  }).catch(function (error) {
    alertCall("Errors!!! receipies Search " + error.status);
  });
}
$('#receipiesForm').submit(function (event) {
  event.preventDefault();
  // validate input before proceed
  var foodName = $("#dishesChoice2").val();
  apiKeyReceipy = $("#apikeyReceipy").val();
  if (apiKeyReceipy === "") {
    alertCall("Please enter api Key! Can't go without it");
    return;
  }
  var receipiesURL = "https://api.spoonacular.com/recipes/complexSearch?apiKey=" + apiKeyReceipy;
  if ($("#selType").val() != "") {
    receipiesURL += "&type=" + $("#selType").val();
  }
  if ($("#skipN").val() != 0) {
    receipiesURL += "&offset=" + $("#skipN").val();
  }
  receipiesURL += "&number=" + $("#returnN").val();
  if ($("#cusineChoice2").val() != "") {
    receipiesURL += "&cuisine=" + $("#cusineChoice2").val();
  }
  if ($("#dietChoice").val() != "") {
    receipiesURL += "&diet=" + $("#dietChoice").val();
  }
  if ($("#outChoice").val() != "") {
    receipiesURL += "&intolerances=" + $("#outChoice").val();
  }
  if ($("#excludeChoice").val() != "") {
    receipiesURL += "&excludeIngredients=" + $("#excludeChoice").val();
  }
  receipiesURL += "&query=" + foodName;
  recepiesSearch(receipiesURL);
});

inputdata("Please input your API key");


$('#restaurantForm').submit(function (event) {
  event.preventDefault();
  // validate input before proceed
  var textLocation = $("#location_input").val();
  cusineChoice = $("#cusineChoice").val();
  milesRadius = $("#milesRadius").val();
  var dishesChoice = $("#dishesChoice").val();
  if (!lat) {
    getLocation();
  }
  if (!milesRadius) {
    alertCall("Please enter radious of search");
    return;
  };
  if ((!dishesChoice) && (!cusineChoice)) {
    alertCall("Please enter something! I have no idea what you like to eat");
    return;
  }
  restaurantSearch();
  alertCall("pass!");
  // console.log(restaurants);
});

inputdata("Please input your API key");

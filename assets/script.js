createBtn();
displayPrev();
displayPrevFiveDay();

//ajax prefilter
jQuery.ajaxPrefilter(function (options) {
  if (options.crossDomain && jQuery.support.cors) {
    options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
  }
});

//CURRENT WEATHER funciton

var uvTextColor;

function renderWeather(cityName) {

  //add API key
  var APIKey = "83e902ae13d8ee169d5dc6d0cee7226d";

  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${APIKey}`;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    //create
    $("#currentCityName").text(response.name);
    //print date
    $("#currentDate").text("(" + Date().substring(0, 15) + ")");
    //print temp
    $("#currentTemp").text(response.main.temp);
    //weather icon
    // pull current weather icon
    var weatherIcon = $(
      "<img src='http://openweathermap.org/img/wn/" +
        response.weather[0].icon +
        ".png' style='margin-left:10px;'/>"
    );
    storeCity(response.name);
    createBtn();
    fiveDayForcast(cityName);

    // append weather icon

    $("#icon").empty();
    $("#icon").append(weatherIcon);
    
    //add Humidity

    
   
    //add Wind speed

   

    //add UV
  
    // place latitude & longitude
    longitude = response.coord.lon;
    latitude = response.coord.lat;

    //finding UV index
    uvURL =
      "https://api.openweathermap.org/data/2.5/uvi?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&appid=" +
      APIKey;
    $.ajax({
      url: uvURL,
      method: "GET",
    }).then(function (response) {
     
      var UV = response.value;

      //fill text
      $("#currentUV").text(UV);
      uvColor(UV);
    });
  });
}

// click function
$("#addCity").click(function () {

  //it takes user input and stores it in a var cityName
  var cityName = $("#cityName").val();


  renderWeather(cityName);
  createBtn();
});


//localStorage

//Save user input(city names) into local storage
function storeCity(cityName) {

  // create for loop to see if item is already in LS
  var seen = false;
  for (var i = 0; i < localStorage.length; i++) {
    if (cityName === localStorage.getItem(i)) {
      seen = true;
    }
  }
  if (seen !== true) {
    localStorage.setItem(localStorage.length, cityName);
  }
  //store each city name as a seperate key value pair
}

//display last logged city as current city
function displayPrev() {
  var prevCity = localStorage.getItem(localStorage.length - 1);
  renderWeather(prevCity);
}

//display last logged city as current city
function displayPrevFiveDay() {
  var prevCityFiveDay = localStorage.getItem(localStorage.length - 1);
  fiveDayForcast(prevCityFiveDay);
}

//create button fuction // called every time page is opened, placed up top
function createBtn() {
  //iterate through local storage
  $("#bookmarks").empty();
  for (var i = 0; i < localStorage.length; i++) {
    //adding the city name to bookmarks div
    var btn = $(`<button>`).text(localStorage.getItem(i));
    //turn the string into a clickable button
    btn.addClass("button cityBtn is-medium is-fullwidth");
    //make a butto tage
    $("#bookmarks").append(btn);
  }
  $(".cityBtn").click(function () {
    //it takes user input and stores it in a var cityName
    //passed cityName thru render weather
    console.log("pressed");

    cityName = $(this).text();

    renderWeather(cityName);
  });
}

//five day
function fiveDayForcast(cityName) {
  var fiveDayAPIkey = "83e902ae13d8ee169d5dc6d0cee7226d";

  //API URL
  var fiveDayForcastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&cnt=5&appid=${fiveDayAPIkey}`;

  // 'api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}'
  //ajax request
  $.ajax({
    url: fiveDayForcastURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    for (let i = 0; i < 5; i++) {
      //empty out the days
      $("#day-" + i).empty();
      //get date
      var date = new Date();
      var fullDate =
        date.getMonth() +
        1 +
        "/" +
        (date.getDate() + i + 1) +
        "/" +
        date.getFullYear();
      // print date
      $("#day-" + i).text(fullDate);
      //pull the icon
      var iconFore = $(
        "<img src='http://openweathermap.org/img/wn/" +
          response.list[i].weather[0].icon +
          ".png' style='margin-left:10px;'/>"
      );
      // add the icon to the page
      $("#day-" + i).append(iconFore);
      // pull the temp
      var tempFore = $("<p>").text(
        "Tempurature:\n" + response.list[i].main.temp + "°F"
      );
      // add the temp to the page
      $("#day-" + i).append(tempFore);
      // pull the humidity
      var humFore = $("<p>").text(
        "Humidity:\n" + response.list[i].main.humidity + "%"
      );
      // add the humidity to the page
      $("#day-" + i).append(humFore);
    }
  });
}
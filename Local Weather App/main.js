$(document).ready(function() {
  // Toggling button from fahrenheit to celcius
  getUserInfo();
  $(".toggleFC").click(function() {
    var degree = toggleFC($(this).text());
    $(this).text(degree);
    var temp = toggleTemp($("#temp").text(), degree);
    $("#temp").text(temp);
  });
});

var x = document.getElementById("location");
var temp = document.getElementById("temp");
var cond = document.getElementById("conditions");
var icon = document.getElementById("icon");

// Retrieving users location
function getUserInfo() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

// Retrieving longitude and latitude through google api. Forecast retrieved from DarkSky api
function showPosition(position) {
  var latlon = position.coords.latitude + "," + position.coords.longitude;
  var apiLinkGM =
    "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
    latlon +
    "&key=AIzaSyBkxiXwmrSptSHa5XWsJWpBtHUUtqnK89U";
  var apiLinkDS =
    "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/a071de7a9227536bfaca44b6df2cf0e4/" +
    latlon;

  getLocationAPI(apiLinkGM);
  getWeatherAPI(apiLinkDS);
}

function getLocationAPI(apiLinkGM) {
  fetch(apiLinkGM, {
    method: "GET"
  }).then(function(response) {
    response.json().then(function(data) {
      var user_hood = data.results[0].address_components[2].long_name;
      var user_city = data.results[0].address_components[3].long_name;
      var user_state = data.results[0].address_components[5].long_name;
      x.innerHTML = user_hood + ", " + user_city + ", " + user_state;
    });
  });
}

function getWeatherAPI(apiLinkDS) {
  fetch(apiLinkDS, {
    method: "GET"
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      temp.innerHTML = Math.round(data.currently.temperature);
      cond.innerHTML = data.currently.summary;
      weatherIcon(data.currently.icon);
    });
}

// Adding weather icons from DarkSky Skycons.
function weatherIcon(weatherType) {
  console.log(weatherType);
  var skycon = new Skycons({ color: "orange" });

  switch (weatherType) {
    case "clear-day":
      skycon.add("icon", Skycons.CLEAR_DAY);
      break;
    case "clear-night":
      skycon.add("icon", Skycons.CLEAR_NIGHT);
      break;
    case "partly-cloudy-day":
      skycon.add("icon", Skycons.PARTLY_CLOUDY_DAY);
      break;
    case "partly-cloudy-night":
      skycon.add("icon", Skycons.PARTLY_CLOUDY_NIGHT);
      break;
    case "cloudy":
      skycon.add("icon", Skycons.CLOUDY);
      break;
    case "rain":
      skycon.add("icon", Skycons.RAIN);
      break;
    case "sleet":
      skycon.add("icon", Skycons.SLEET);
      break;
    case "snow":
      skycon.add("icon", Skycons.SNOW);
      break;
    case "wind":
      skycon.add("icon", Skycons.WIND);
      break;
    case "fog":
      skycon.add("icon", Skycons.FOG);
      break;
  }
  skycon.play();
}

// Returning proper temperature from Fahrenheit to Celcius when toggling button
function toggleFC(val) {
  if (val == "Fahrenheit") {
    return "Celcius";
  }
  return "Fahrenheit";
}

// Calculating fahrenheit to celcius.
function toggleTemp(val, x) {
  if (x == "Celcius") {
    return Math.round(val * (9 / 5) + 32);
  }
  return Math.round((val - 32) * (5 / 9));
}

// Creating a function to produce error messages when location is unavailable
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred.";
      break;
  }
}

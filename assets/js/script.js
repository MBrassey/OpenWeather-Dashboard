var todaysDate = moment().format("L");

var apiKey = "718523b17d4bbd2336cf57c34cc3836a";

var searchFormEl = document.querySelector("#search-form");

var searchCityEl = document.querySelector("#city");

var formSubmitHandler = function (event) {
    event.preventDefault();

    // Get Search Terms
    var cityName = searchCityEl.value.trim();

    if (cityName) {
        getWeatherData(cityName);
        searchCityEl.value = "";
    } else {
        alert("Please enter a City");
    }
};

function getWeatherData(cityName) {
    var dataApi = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;

    // Query Open Weather API to Get "coord"
    fetch(dataApi)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (currentData) {
                    // Generate One Call Endpoint With Returned Coordinates
                    var lat = currentData.coord.lat;
                    var lon = currentData.coord.lon;
                    var forecastApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly&units=imperial&appid=" + apiKey;

                    fetch(forecastApi)
                        .then(function (response) {
                            if (response.ok) {
                                response.json().then(function (forecastData) {
                                    var current = currentData; // Result From dataApi
                                    var forecast = forecastData; // Result From forecastApi

                                    // Send Data to be Compiled
                                    presentData(cityName, current, forecast);
                                });
                            } else {
                                alert("Error: " + response.statusText);
                            }
                        })
                        .catch(function (error) {
                            alert("Unable to Access Open Weather");
                        });
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to Access Open Weather");
        });
}

var presentData = function (cityName, current, forecast) {
    currentObj = {
        city: current.name,
        country: current.sys.country,
        icon: forecast.daily[0].weather[0].icon,
        temp: current.sys.temp,
        humid: current.sys.humidity,
        wind: current.wind.speed,
        uvi: forecast.daily[0].uvi,
        altTxt: forecast.daily[0].weather[0].description,
    };

    // Calculate UVI Color
    if (currentObj.uvi < 3) {
        uvColor = "low";
    } else if (currentObj.uvi > 2 && currentObj.uvi < 6) {
        uvColor = "low-mid";
    } else if (currentObj.uvi > 5 && currentObj.uvi < 8) {
        uvColor = "mid";
    } else if (currentObj.uvi > 7 && currentObj.uvi < 11) {
        uvColor = "high";
    } else if (currentObj.uvi > 10) {
        uvColor = "extreme";
    } else {
        uvColor = "low";
    }

    // Generate Todays Weather Card
    var iconURL1 = "https://openweathermap.org/img/wn/" + currentObj.icon + "@2x.png";
    $("#today").empty();
    $("#today").append(
        '<ul><li id="cityTitle">' +
            currentObj.city +
            ", " +
            currentObj.country +
            ' (<span id="date" class="minimize">' +
            todaysDate +
            '</span>) <span id="todayIcon"><img src="' +
            iconURL1 +
            '" alt="' +
            currentObj.altTxt +
            '"></span></li><li id="temp" class="cityData">Temperature: <span class="data">90.9</span> °F</li><li id="humidity" class="cityData">Humidity: <span class="data">41%</span></li><li id="wind" class="cityData">Wind Speed: <span class="data">4.7</span> MPH</li><li id="uv" class="cityData">UV Index: <span id="' +
            uvColor +
            '">' +
            currentObj.uvi +
            "</span></li></ul>"
    );

    $("#fcst").empty();
    for (var i = 1; i < 6; i++) {
        // Set Appropriate Date
        var forecastDate = moment().add(i, "days").format("L");

        // Assign Forecast Variables
        temp = forecast.daily[i].temp.day;
        icon = forecast.daily[i].weather[0].icon;
        humid = forecast.daily[i].humidity;
        wind = forecast.daily[i].wind_speed;
        altTxt = forecast.daily[i].weather[0].description;

        // Generate Forecast Cards
        var iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        $("#fcst").append(
            '<div class="card"><ul><li class="icon-card" class="sm-data"><img src="' +
                iconURL +
                '" alt="' +
                altTxt +
                '"></li><li class="date-card" class="sm-data">' +
                forecastDate +
                '</li><li class="temp-card">Temp: <span class="sm-data">' +
                temp +
                '</span> °F</li><li class="humidity-card">Humidity: <span class="sm-data">' +
                humid +
                '</span>%</li><li class="wind-card">Wind Speed: <span class="sm-data">' +
                wind +
                "</span> MPH</li></ul></div>"
        );
    }
    console.log("Displaying Weather For: " + currentObj.city + ", " + currentObj.country + ".");
};

var initial = function () {
    // Geo Locate User's City
    $.get(
        "https://ipinfo.io",
        function (response) {
            getWeatherData(response.city);
            //locatedCity = response.city;
        },
        "jsonp"
    );
};

initial();
searchFormEl.addEventListener("submit", formSubmitHandler);

var todaysDate = moment().format("L");

var apiKey = "8e152ed2750d0d0366ce5d92ef6739df";

var searchFormEl = document.querySelector("#search-form");

var searchCityEl = document.querySelector("#city");

var cities = {};

var formSubmitHandler = function (event) {
    event.preventDefault();

    // Get Search Terms
    var cityName0 = searchCityEl.value.trim();
    const cityName = cityName0.charAt(0).toUpperCase() + cityName0.slice(1);

    if (cityName) {
        getWeatherData(cityName);
        searchCityEl.value = "";
    } else {
        alert("Please enter a City");
    }
};

function getWeatherData(cityName) {
    // Define OpenWeather Enpoint with Newly Searched CityName
    var dataApi = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;

    // Query Open Weather API for "coord" Value
    fetch(dataApi)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (currentData) {
                    // Generate One Call Endpoint With Returned Coordinates
                    var lat = currentData.coord.lat;
                    var lon = currentData.coord.lon;
                    var forecastApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly&units=imperial&appid=" + apiKey;
                    var uviApi = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey;

                    // Query OpenWeather API for "uvi" value
                    fetch(forecastApi)
                        .then(function (response) {
                            if (response.ok) {
                                response.json().then(function (forecastData) {
                                    fetch(uviApi)
                                        .then(function (response) {
                                            if (response.ok) {
                                                response.json().then(function (uviData) {
                                                    var current = currentData; // Result From dataApi
                                                    var forecast = forecastData; // Result From forecastApi
                                                    var uvi = uviData; // Result From uviApi

                                                    // Send Data to be Compiled
                                                    presentData(cityName, current, forecast, uvi);
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
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to Access Open Weather");
        });
}

var storeCity = function (cityName) {
    // Structure the Cities Array
    var cities = [];
    cities = JSON.parse(localStorage.getItem("city")) || [];

    // Push City to LocalStorage if Not Already Present
    cities.indexOf(cityName) === -1 ? cities.push(cityName) : console.log(cityName + " is already stored.");

    // Sanitize JSON
    localStorage.setItem("city", JSON.stringify(cities));
};

var presentStoredCities = function (cityName) {
    // Load "storedCities" from LocalStorage
    var storedCities = JSON.parse(localStorage.getItem("city"));

    // Clear Saved Searches Container
    $("#cityContainer").empty();

    // Present Newest Search on Top
    const reversed = storedCities.reverse();

    // Present UpTo 8 Stored Cities 
    if (reversed.length < 8) {
        // Present 8 storedCities
        $.each(reversed, function (key, value) {
            $("#cityContainer").append('<div id="' + value + '" class="card card2 zinc"><span class="cityButton">' + value + "</span></div>");
            console.log(value);
            //var cityButtonEl = document.querySelector(value);
            //cityButtonEl.addEventListener("click", getWeatherData(value));
        });
    } else {
        var times = 8;
        for (var i = 0; i < times; i++) {
            $("#cityContainer").append('<div id="' + reversed[i] + '" class="card card2 zinc"><span class="cityButton">' + reversed[i] + "</span></div>");
        }
    }
};

var presentData = function (cityName, current, forecast, uvi) {
    // Run Store & Present Functions for New City
    storeCity(cityName);
    presentStoredCities(cityName);

    // Make "cityContainer" Buttons Sortable
    $(function () {
        $("#cityContainer").sortable({
            placeholder: "placeHolder",
            update: function () {
                alert("updated");
            },
        });
    });

    // Define Current Weather Object
    currentObj = {
        city: current.name,
        country: current.sys.country,
        icon: forecast.daily[0].weather[0].icon,
        temp: forecast.daily[0].temp.day,
        humid: forecast.daily[0].humidity,
        wind: forecast.daily[0].wind_speed,
        uvi: uvi.value,
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
            '"></span></li><li id="temp" class="cityData">Temperature: <span class="data">' +
            currentObj.temp +
            '</span> °F</li><li id="humidity" class="cityData">Humidity: <span class="data">' +
            currentObj.humid +
            '</span></li><li id="wind" class="cityData">Wind Speed: <span class="data">' +
            currentObj.wind +
            '</span> MPH</li><li id="uv" class="cityData">UV Index: <span id="' +
            uvColor +
            '">' +
            currentObj.uvi +
            "</span></li></ul>"
    );

    // Clear the Forecast Section for New Cards
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
    // Geo Locate User's City Without User Interaction
    console.log("Your IP, Location Etc:");
    $.get(
        "https://ipinfo.io",
        function (response) {
            getWeatherData(response.city);
        },
        "jsonp"
    );
};

initial();
searchFormEl.addEventListener("submit", formSubmitHandler);

var setDate = function () {
    $("#date").text(moment().format("L"));
};

var apiKey = "718523b17d4bbd2336cf57c34cc3836a";

function getWeatherData(cityName) {
    var dataApi = "http://api.openweathermap.org/data/2.5/weather?q=Boise&appid=" + apiKey;

    // Query Open Weather API to Get "coord"
    fetch(dataApi)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (currentData) {
                    // Generate One Call Endpoint With Returned Coordinates
                    var lat = currentData.coord.lat;
                    var lon = currentData.coord.lon;
                    var forecastApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly&appid=" + apiKey;

                    fetch(forecastApi)
                        .then(function (response) {
                            if (response.ok) {
                                response.json().then(function (forecastData) {
                                    var current = currentData; // Result From dataApi
                                    var forecast = forecastData; // Result From forecastApi

                                    // Send Data to be Compiled
                                    presentData(current, forecast);
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

var presentData = function (current, forecast) {
    currentObj = {
        city: current.name,
        country: current.sys.country,
        temp: current.sys.temp,
        humid: current.sys.humidity,
        wind: current.wind.speed,
        uvi: forecast.daily[0].uvi,
    };

    for (var i = 1; i < 6; i++) {
        $("#fcst").append(
            '<div class="card"><ul><li class="date-card" class="sm-data">09/07/2020</li><li class="icon-card" class="sm-data"><i class="fas fa-sun"></i></li><li class="temp-card">Temp: <span class="sm-data">86.84</span> °F</li><li class="humidity-card">Humidity: <span class="sm-data">43</span>%</li><li class="wind-card">Wind Speed: <span class="sm-data">4</span> MPH</li></ul></div>'
        );

        // date forecast.daily+i.temp
        // temp forecast.daily+i.temp.day
        // humid forecast.daily+i.humidity
        // wind forecast.daily+i.wind_speed
        // icon forecast.daily+i.weather[0].icon
        // e.preventDefault();
    }
};

var initial = function () {
    setDate();
    getWeatherData("Boise");
};

initial();

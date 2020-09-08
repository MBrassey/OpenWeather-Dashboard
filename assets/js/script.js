var setDate = function () {
    $("#date").text(moment().format("L"));
};

function getWeatherData(cityName) {

    // create the address to access the api for the chosen city
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=718523b17d4bbd2336cf57c34cc3836a";
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=718523b17d4bbd2336cf57c34cc3836a";

    // Query Open Weather API
    fetch(weatherApiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;

                    var uvApiUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=718523b17d4bbd2336cf57c34cc3836a&lat=" + lat + "&lon=" + lon;
                    
                    fetch(uvApiUrl)
                        .then(function (response) {
                            if (response.ok) {
                                response.json().then(function (uvData) {
                                    fetch(forecastUrl)
                                        .then(function (response) {
                                            if (response.ok) {
                                                response.json().then(function (forecastData) {

                                                    // Compile Weather Data
                                                    // compileWeatherData(data, uvData, forecastData, cityName);
                                                    console.log(data, uvData, forecastData, cityName);
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

var initial = function() {
    setDate();
    getWeatherData("Boise");
}

initial();

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
                response.json().then(function(currentData) {    

                    // Generate One Call Endpoint With Returned Coordinates
                    var lat = currentData.coord.lat;
                    var lon = currentData.coord.lon;
                    var forecastApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + apiKey;
                    
                    fetch(forecastApi)
                    .then(function (response) {
                        if (response.ok) {
                            response.json().then(function(forecastData) {    
                                var current = currentData; // Result From dataApi
                                var forecast = forecastData.daily; // Result From forecastApi
                                
                                // Send Data to be Compiled                              
                                compileData(current, forecast);
                            }
                            );
                        } else {
                            alert("Error: " + response.statusText);
                        }
                    })
                    .catch(function (error) {
                        alert("Unable to Access Open Weather");
                    });

                }
                );
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to Access Open Weather");
        });
}

var compileData = function(current, forecast) {
    console.log("current:" + current + "forecast:" + forecast);
    currentObj = {
        cityName: current.name,
        country: current.sys.country,
    }

    futureObj = {

    }
    console.log(currentObj.cityName + "," + currentObj.country);
}

var initial = function() {
    setDate();
    getWeatherData("Boise");
}

initial();

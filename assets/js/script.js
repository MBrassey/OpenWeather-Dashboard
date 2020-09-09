var setDate = function () {
    $("#date").text(moment().format("L"));
};

var currentObj = [];
var futureObj = [];

var apiKey = "718523b17d4bbd2336cf57c34cc3836a";

function getWeatherData(cityName) {

    var dataApi = "http://api.openweathermap.org/data/2.5/weather?q=Boise&appid=" + apiKey;

    // Query Open Weather API to Get "coord", "weather"
    fetch(dataApi)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function(data) {    

                    // Generate One Call Endpoint With Coordinates
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;
                    var forecastApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + apiKey;
                    
                    fetch(forecastApi)
                    .then(function (response) {
                        if (response.ok) {
                            response.json().then(function(data) {    
                                var daily = data.daily;
                                var one = data.daily[1].temp.day;
                                
                                // Send Data to be Compiled
                                console.log(one);                                
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

var initial = function() {
    setDate();
    getWeatherData("Boise");
}

initial();

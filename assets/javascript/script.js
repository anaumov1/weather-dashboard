// load searches from local storage
var loadSearches = function () {
    searches = JSON.parse(localStorage.getItem("searches"));

    if (!searches) {
        searches = [];
    }

    // clear out previous searches to get rid of duplicates
    $("#previous-searches").empty();

    // create elements for previous searches
    searches.forEach(function (search) {
        $("previous-searches").append("<button class='btn btn-secondary m-1 searchbtns'>" + search + "</button>")
    })
}

// save searches to local storage
var saveSearches = function () {
    localStorage.setItem("searches", JSON.stringify(searches));
}

// pull weather data from API and populate in DOM
var getForecast = function (citySearch) {
    //get lat/long of searched city
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + citySearch +
        "&units=imperial&appid=aef3eaaa7164d35e707dd205449ae85b")
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            //set fetched lat/long from city search to get better weather results
            var cityLat = response.coord.lat;
            var cityLon = response.coord.lon;

            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' +
                cityLat +
                '&lon=' + cityLon +
                '&exclude=minutely,hourly,alerts&units=imperial&appid=aef3eaaa7164d35e707dd205449ae85'
            )
            .then(function(response) {
                return response.json();
            })

            .then(function(response) {
                //current weather vars
                var currentTemp = response.current.temp;
                var currentWind = response.current.wind_speed;
                var currentHumidity = response.current.humidity;
                var currentUVI = response.current.uvi;
                var currentDate = new Date(response.current.dt * 1000).toLocaleDateString("en-US");
                var currentIcon = response.current.weather[0].icon;

                // forcast information 5 days
                var fiveDayForecast = [
                    {
                        "date": new Date(response.daily[1].dt * 1000).toLocaleDateString("en-US"),
                        "icon": response.daily[1].weather[0].icon,
                        "temp": response.daily[1].temp.day,
                        "wind": response.daily[1].wind_speed,
                        "humidity": response.daily[1].humidity
                    },
                    {
                        "date": new Date(response.daily[2].dt * 1000).toLocaleDateString("en-US"),
                        "icon": response.daily[2].weather[0].icon,
                        "temp": response.daily[2].temp.day,
                        "wind": response.daily[2].wind_speed,
                        "humidity": response.daily[2].humidity
                    },
                    {
                        "date": new Date(response.daily[3].dt * 1000).toLocaleDateString("en-US"),
                        "icon": response.daily[3].weather[0].icon,
                        "temp": response.daily[3].temp.day,
                        "wind": response.daily[3].wind_speed,
                        "humidity": response.daily[3].humidity
                    },
                    {
                        "date": new Date(response.daily[4].dt * 1000).toLocaleDateString("en-US"),
                        "icon": response.daily[4].weather[0].icon,
                        "temp": response.daily[4].temp.day,
                        "wind": response.daily[4].wind_speed,
                        "humidity": response.daily[4].humidity
                    },
                    {
                        "date": new Date(response.daily[5].dt * 1000).toLocaleDateString("en-US"),
                        "icon": response.daily[5].weather[0].icon,
                        "temp": response.daily[5].temp.day,
                        "wind": response.daily[5].wind_speed,
                        "humidity": response.daily[5].humidity
                    },
                ];

                // empty current weather box
                $("#current-weather").empty();

                //append info to the current weather box

                $('#current-weather').append('<h2>' + citySearch + " " + currentDate + '<img src=https://openweathermap.org/img/wn/' + currentIcon + '@2x.png>' + '</h2>');
                $('#current-weather').append('<p>Temperature: ' + currentTemp + " ℉" + '</p>');
                $('#current-weather').append('<p>Wind: ' + currentWind + " MPH" + '</p>');
                $('#current-weather').append('<p>Humidity: ' + currentHumidity + "%" + '</p>');

                // change background color of UV rating

                if (currentUVI < 2) {
                    $("#current-weather").append('<p>UV Index: <span class="bg-success text-white p-1 rounded">' + currentUVI + '</span></p>');

                } else if (currentUVI > 2 && currentUVI < 8) {
                    $('#current-weather').append('<p>UV Index: <span class="bg-warning text-white p-1 rounded">' + currentUVI + '</span></p>');

                } else if (currentUVI > 8) {
                    $('#current-weather').append('<p>UV Index: <span class="bg-danger text-white p-1 rounded">' + currentUVI + '</span></p>');
                }

                // prevent duplicates by checking if forecast header exists

                if ($('#future-header').length) {
                    $('#future-header').remove();
                    $('#future').prepend("<h3 id='future-header'>5-Day Forecast:</h3>")

                } else {
                    $('#future').prepend("<h3 id='future-header'>5-Day Forecast:</h3>")  
                }
            

                
            })

        })

}


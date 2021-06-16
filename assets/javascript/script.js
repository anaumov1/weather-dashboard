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
        $("#previous-searches").append("<button class='btn btn-secondary m-1 searchbtns'>" + search + "</button>")
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
                '&exclude=minutely,hourly,alerts&units=imperial&appid=aef3eaaa7164d35e707dd205449ae85b'
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
                var futureForecast = [
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

                // empty forecast container

                $('#forecast-container').empty();

                // loop through entrys in future forecast and create card

                futureForecast.forEach(function(dayForecast) {
                    var weatherCard = $("<div>").attr({"class": "card text-white bg-dark m-1"});
                    var weatherCardHeader = $("<div>").attr({"class": "card-header"}).html('<h5>' + dayForecast.date + '<img src=https://openweathermap.org/img/wn/' + dayForecast.icon + '@2x.png>' + '</h5>');
                    var weatherCardBody = $("<div>").attr({"class": "card-body"});
                    var weatherCardTemp = $("<p>").attr({"class": "card-text"}).text("Temp: " + dayForecast.temp + " ℉");
                    var weatherCardWind = $("<p>").attr({"class": "card-text"}).text("Wind: " + dayForecast.wind + " MPH");
                    var weatherCardHumidity = $("<p>").attr({"class": "card-text"}).text("Humidity: " + dayForecast.humidity + "%");

                    // append the card to the forecast container

                    $("#forecast-container").append(weatherCard);

                    // append temperature, wind and humidity data to the card

                    weatherCardBody.append(weatherCardTemp, weatherCardWind, weatherCardHumidity)

                    // append the body to the card 
                    weatherCard.append(weatherCardHeader, weatherCardBody)
                })
            

                
            })

        })

}

// Load initial searches from localstorage
loadSearches();

// Dynamically created buttons
$("#previous-searches").on("click", ".searchbtns", function() {
    // Get the city to search from the button's value
    var citySearch = $(this).text();
    getForecast(citySearch);
})

// Check to see if the Submit button is pressed
$("#btnSubmit").click(function() {
    // Get the city to search for from input field
    var citySearch = $('#city-search').val();

    if (citySearch != "") {

         // Check to see if this was previously searched for
         var previousSearch = searches.includes(citySearch);

         if (!previousSearch) {
            searches.push(citySearch);
            saveSearches();
        }
        if ($('#alert').length) {
            // Remove any previous alerts
            $('#alert').remove();
        }
        getForecast(citySearch);
        loadSearches();
    } else {
        // Check to see if an alert already exists
        if ($('#alert').length) {
            // Remove any previous alerts
            $('#alert').remove();
            // Create new alert
            $('#searchbox').prepend('<div class="alert alert-warning" role="alert" id="alert">Please ensure you enter a City</div>');
        }
        // If no alerts already exist
        else {
            // Create new alert
            $('#searchbox').prepend('<div class="alert alert-warning" role="alert" id="alert">Please ensure you enter a City</div>');
        }
    }
})

// JQuery Media Query to adjust columns on smaller screens
$(window).resize(function(){
    if ($(window).width()<767) {
        $('#main').removeClass('row');
        $('#main').addClass('col');
        $('#searchbox').removeClass('col-3');
        $('#forecastbox').removeClass('col-9');
    };
});

// JQuery Media Query to adjust columns on larger screens
$(window).resize(function(){
    if ($(window).width()>768) {
        $('#main').removeClass('col');
        $('#main').addClass('row');
        $('#searchbox').addClass('col-3');
        $('#forecastbox').addClass('col-9');
    };
});



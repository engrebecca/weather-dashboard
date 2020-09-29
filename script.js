
// Render city search history
var cityList = ["New York", "San Francisco", "Seattle"];
function renderCities() {
    $("#city-list").empty();
    for (var i = 0; i < cityList.length; i++) {
        var cityName = cityList[i];
        var cityButton = $(`<li class="list-group-item" data-name="${cityName}">${cityName}</li>`);
        $("#city-list").append(cityButton);
    }
}
renderCities();

// Push new search to city list array
function appendCity() {
    var cityAppend = "Austin";
    console.log("append" + cityAppend);
    cityList.push(cityAppend);
    renderCities();
}
appendCity();

// Search for a new city, display current and future conditions, and add to search history
function renderSearchResult() {
    // event.preventDefault();
    var cityInput = "Austin";
    console.log(cityInput);
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=imperial&appid=b45e06127671f741ee914cedb135bb5d`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var cityName = response.name;
        var condition = response.weather[0].icon;
        var dateUnix = response.dt;
        var dateObject = new Date(dateUnix * 1000);
        var dateFormat = dateObject.toLocaleDateString();
        var temp = Math.floor(response.main.temp);
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var cityEl = `<p>${cityName}</p>`;
        var conditionEl = `<img src="http://openweathermap.org/img/wn/${condition}@2x.png">`;
        var tempEl = `<p>Temperature: ${temp} °F</p>`;
        var humidityEl = `<p>Humidity: ${humidity} %</p>`;
        var windSpeedEl = `<p>Wind Speed: ${windSpeed} MPH</p>`;
        $("#current-weather").append(cityEl, dateFormat, conditionEl, tempEl, humidityEl, windSpeedEl);

        var coordURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=b45e06127671f741ee914cedb135bb5d`;
        console.log(coordURL);
        function returnUV() {
            $.ajax({
                url: coordURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                var uvIndex = response.value;
                console.log(uvIndex);
                var uvEl = $(`<p>UV Index: ${uvIndex}</p>`)
                $("#current-weather").append(uvEl);
            })
        }
        returnUV();

        function renderForecast() {
            var forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude={part}&appid=b45e06127671f741ee914cedb135bb5d`;
            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function (response) {
                console.log("forecast:" + response)
                // current visibility can be pulled from here
                for (var i = 1; i < 6; i++) {
                    var cardCol = $(`<div class="col-lg-2">`)
                    var newCard = $(`<div class="card bg-primary text-white" style="width: 10rem;">`)
                    var cardBody = $(`<div class="card-body">`)
                    var fDate = response.daily[i].dt;
                    var fdateObject = new Date(fDate * 1000);
                    var fdateFormat = fdateObject.toLocaleDateString();
                    var fCondition = response.daily[i].weather[0].icon;
                    var fTemp = Math.floor(response.daily[i].temp.day);
                    var fHumidity = response.daily[i].humidity;
                    var fDateEl = $(`<p>${fdateFormat}</p>`);
                    var fConditionEl = $(`<img class="h-50 w-50" src="http://openweathermap.org/img/wn/${fCondition}@2x.png">`);
                    var fTempEl = $(`<p>Temp: ${fTemp} °F</p>`);
                    var fHumidityEl = $(`<p>Humidity: ${fHumidity} %</p>`);
                    cardBody.append(fDateEl, fConditionEl, fTempEl, fHumidityEl);
                    newCard.append(cardBody);
                    cardCol.append(newCard);
                    $("#forecast").append(cardCol);
                }

            })
        }
        renderForecast();
    })
    // $.when(returnConditions()).then(returnUV);
}
renderSearchResult();

// Display UV Index
// var lat = 30.27;
// var lon = -97.74;
// var coordURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=b45e06127671f741ee914cedb135bb5d`;
// function returnUV (){
//     $.ajax({
//         url: coordURL,
//         method: "GET"
//     }).then(function(response){
//         console.log(response);
//         var uvIndex = response.value;
//         console.log("UV: " + uvIndex);
//         if (uvIndex <= 3){
//             var uvEl = $(`<p>UV Index: <span class="bg-success">${uvIndex}</span></p>`)
//         } else if (uvIndex > 3 && uvIndex <=8){
//             var uvEl = $(`<p>UV Index: <span class="bg-warning">${uvIndex}</span></p>`)
//         } else {
//             var uvEl = $(`<p>UV Index: <span class="bg-danger">${uvIndex}</span></p>`)
//         }
//         $("#current-weather").append(uvEl);
//     })
// }
// returnUV();

// Display 5 day forecast
// var lat = 30.27;
// var lon = -97.74;
// function renderForecast(){
//     var forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude={part}&appid=b45e06127671f741ee914cedb135bb5d`;
//     $.ajax({
//         url: forecastURL,
//         method: "GET"
//     }).then(function(response){
//         console.log(response)
//         // current visibility can be pulled from here
//         for (var i = 1; i < 6; i++){
//             var cardCol = $(`<div class="col-lg-2">`)
//             var newCard = $(`<div class="card bg-primary text-white" style="width: 10rem;">`)
//             var cardBody = $(`<div class="card-body">`)
//             var fDate = response.daily[i].dt;
//             var fdateObject = new Date(fDate * 1000);
//             var fdateFormat = fdateObject.toLocaleDateString();
//             var fCondition = response.daily[i].weather[0].icon;
//             var fTemp = Math.floor(response.daily[i].temp.day);
//             var fHumidity = response.daily[i].humidity;
//             var fDateEl = $(`<p>${fdateFormat}</p>`);
//             var fConditionEl = $(`<img class="h-50 w-50" src="http://openweathermap.org/img/wn/${fCondition}@2x.png">`);
//             var fTempEl = $(`<p>Temp: ${fTemp} °F</p>`);
//             var fHumidityEl = $(`<p>Humidity: ${fHumidity} %</p>`);
//             cardBody.append(fDateEl, fConditionEl, fTempEl, fHumidityEl);
//             newCard.append(cardBody);
//             cardCol.append(newCard);
//             $("#forecast").append(cardCol);
//         }

//     })
// }
// renderForecast();

// $("#submit-button").on("click", renderSearchResult);
// $("#city-list").on("click", renderSearchResult);
// $("#city-list").on("click", appendCity);
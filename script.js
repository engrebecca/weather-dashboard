
// Render city search history
var initialList = JSON.parse(localStorage.getItem("city list"))
if (initialList === null){
    var cityList = ["New York", "Hong Kong", "Oslo"];
    localStorage.setItem("city list", JSON.stringify(cityList));
} else{
    cityList = initialList;
}

function renderCities() {
    $("#city-list").empty();
    var newCityList = JSON.parse(localStorage.getItem("city list"));
    for (var i = 0; i < newCityList.length; i++) {
        var cityName = newCityList[i];
        var cityButton = $(`<li class="list-group-item">${cityName}</li>`);
        cityButton.data("city", cityName);
        $("#city-list").append(cityButton);
    }
}
renderCities();

// Push new search to city list array
function appendCity(city) {
    cityList.push(city);
    localStorage.setItem("city list", JSON.stringify(cityList));
    renderCities();
}

var renderSearchResult = function(city) {
    // Search for a new city, display current and future conditions, and add to search history
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=b45e06127671f741ee914cedb135bb5d`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
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
        $("#cityEl").text(cityName);
        $("#dateEl").text(dateFormat);
        $("#conditionEl").attr("src", `http://openweathermap.org/img/wn/${condition}@2x.png`);
        $("#tempEl").text(`Temperature: ${temp} °F`);
        $("#humidityEl").text(`Humidity: ${humidity} %`);
        $("#windSpeedEl").text(`Wind Speed: ${windSpeed} MPH`);

        // Display UV index for city search input
        var coordURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=b45e06127671f741ee914cedb135bb5d`;
        $.ajax({
            url: coordURL,
            method: "GET"
        }).then(function (response) {
            var uvIndex = response.value;
            $("#uvEl").text(`UV Index: ${uvIndex}`)
            if (uvIndex <= 3){
                $("#uvEl").html(`UV Index: <span class="bg-success">${uvIndex}</span>`);
            } else if (uvIndex > 3 && uvIndex <=8){
                $("#uvEl").html(`UV Index: <span class="bg-warning">${uvIndex}</span>`);
            } else {
                $("#uvEl").html(`UV Index: <span class="bg-danger">${uvIndex}</span>`);
            }
            $("#current-weather").append(uvEl);
        })

        // Display 5 day forecast for city search input
        var forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude={part}&appid=b45e06127671f741ee914cedb135bb5d`;
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function (response) {
            $("#forecast").empty();
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
    })
}

// On click event handlers
$("#submit-button").on("click", function(event) {
    event.preventDefault();
    var city = $("#search-bar").val();
    if (city === "") {
        return;
    }
    renderSearchResult(city);
    appendCity(city);
});

$("#city-list").on("click", "li", function(event) {
    event.preventDefault();
    var city = $(this).data("city");
    renderSearchResult(city);
});

renderSearchResult("New York");
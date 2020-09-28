// Retrieve and display current day weather
// let cityInput = "New York";
// let queryURL = 

// Render city search history
var cityList = ["New York", "San Francisco", "Seattle"];
function renderList(){
    for (var i = 0; i < cityList.length; i++){
        var cityName = cityList[i];
        var cityButton = $(`<button type="button" class="btn btn-light btn-lg btn-block city" data-name="${cityName}">${cityName}</button>`);
        $("#city-list").append(cityButton);
    }
}
renderList();

// Search for a new city, display current and future conditions, and add to search history
function renderSearchResult (){
    // var cityInput = $("#search-bar").val();
    var cityInput = "Austin";
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=imperial&appid=b45e06127671f741ee914cedb135bb5d`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        var cityName = response.name;
        var condition = response.weather[0].icon;
        var dateUnix = response.dt;
        var dateObject = new Date(dateUnix * 1000);
        var dateFormat = dateObject.toLocaleDateString();
        console.log(dateFormat);
        var temp = Math.floor(response.main.temp);
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        // Add condition icon and date
        var cityEl = `<p>${cityName}</p>`;
        var conditionEl = `<img src="http://openweathermap.org/img/wn/${condition}@2x.png">`;
        console.log(conditionEl);
        var tempEl = `<p>Temperature: ${temp} °F</p>`;
        var humidityEl = `<p>Humidity: ${humidity} %</p>`;
        var windSpeedEl = `<p>Wind Speed: ${windSpeed} MPH</p>`;
        $("#current-weather").append(cityEl, dateFormat, conditionEl, tempEl, humidityEl, windSpeedEl);
    })

    // Display UV Index
    var lat = 30.27;
    var lon = -97.74;
    console.log("lat:" + lat + "lon:" + lon);
    var coordURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=b45e06127671f741ee914cedb135bb5d`;
    $.ajax({
        url: coordURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
    })


}
renderSearchResult();

// $("#submit-button").on("click", renderSearchResult)
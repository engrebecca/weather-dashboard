// Retrieve and display current day weather
// let cityInput = "New York";
// let queryURL = 

// Search city and add to list
var cityList = ["New York", "San Francisco", "Seattle"];
function renderList(){
    for (var i = 0; i < cityList.length; i++){
        var cityName = cityList[i];
        var cityButton = $(`<button type="button" class="btn btn-light btn-lg btn-block city" data-name="${cityName}">${cityName}</button>`);
        $("#city-list").append(cityButton);
    }
}
renderList();
// $("#submit-button").on("click", renderList)
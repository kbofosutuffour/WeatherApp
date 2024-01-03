/**
 * Object that holds the link to gifs used to display various weather conditions
 */
const WEATHER_CONDITIONS = {
    "Day": "https://giphy.com/embed/BCgbjF9Y41UgGEam5O",
    "Night": "https://giphy.com/embed/KxzLgj2R2rneCZ8rvE",
    "Partly Cloudy": "https://giphy.com/embed/HQp9pMIlKV6zQiBlBi",
    "Cloudy": "https://giphy.com/embed/dByKTOKy3msWmAx2V4",
    "Rainy": "https://giphy.com/embed/WE5lcJuijb2hhuM7TK",
    "Stormy": "https://giphy.com/embed/TgygPXqxrx6PjwPymq",
    "Snow": "https://giphy.com/embed/eiMzTkBCN4lGg",
    "Default": "",
}

/**
 * Function called when the user submits a city
 * @param {*} input the city the user entered
 */
const search = (input) => {
    var city = input? document.querySelector("input").value : "Williamsburg, VA";

    var forecast_search = "http://api.weatherapi.com/v1/forecast.json?key=aa0c6dd759d24c78a4b155701231608&q=";
    forecast_search = forecast_search.concat(city, "&days=5&aqi=no&alerts=no");

    fetch(forecast_search, {mode: 'cors'})
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log(response);

            showTop(response)
            showHourlyWeather(response);
            showWeeklyWeather(response);
            showExtra(response);
        })
        .catch(function(response) {
            alert('Input invalid');
            console.log(response);
        });



}

/**
 * Function that shows information on the top of the website
 * including city name, current temperature, and current weather conditions
 * @param {*} response the json object returned from the weather api call
 */
const showTop = (response) => {
    var temperature = document.getElementById('temperature-text');
    temperature.innerHTML = response.current.temp_f + '&deg';
    temperature.style.fontSize = "3em";

    document.getElementById('weather-description').innerHTML = response.current.condition.text;
    document.getElementById('high').innerHTML = "High: " + response.forecast.forecastday[0].day.maxtemp_f + '&deg';
    document.getElementById('low').innerHTML = "Low: " + response.forecast.forecastday[0].day.mintemp_f + '&deg';
    document.getElementById('low').style.paddingBottom = "20px";

    var icon = response.current.condition.icon
    document.getElementById('top-image').src = icon.replace("//cdn.weatherapi.com/", "");
    document.getElementById('city-name').innerHTML = response.location.name;

    // Changing the background color and text color based on whether it is day or night
    // in the city the user is viewing
    document.body.style.backgroundColor = response.current.is_day ? '#87CEEB' : '#2e4482';
    document.body.style.color = response.current.is_day ? 'black': 'white';
    document.getElementById('dayOrNight').children[0].setAttribute("src", response.current.is_day ? WEATHER_CONDITIONS["Day"] : WEATHER_CONDITIONS["Night"]);
    
    // Changing the weather condition gif on the top
    // of the website based on the city
    let condition = response.current.condition.text.toLowerCase().split(' ');
    let type = "";
    if (condition.includes("clear")) {
        type = "Default";
    } else if (condition.includes("partly") && condition.includes("cloudy")) {
        type = "Partly Cloudy"
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
        type = "Rainy"
    } else if (condition.includes("snow") || condition.includes("blizzard")) {
        type = "Snow"
    } else if (condition.includes("thunder") || condition.includes("thundery")) {
        type = "Stormy"
    } else {
        type = "Default";
    }
    let weatherConditionDiv = document.getElementById('weatherCondition')
    for (let i = 0; i < weatherConditionDiv.children.length; i++) {
        weatherConditionDiv.children[i].setAttribute("src", WEATHER_CONDITIONS[type])
    }

}


/**
 * Function that shows the hourly weather information on the website
 * @param {*} response the json object returned from the weather api call
 */
const showHourlyWeather = (response) => {
    /**
     * Time based on local time zone in the input city
     */
    const date = new Date(response.location.localtime);

    var hourlyWeather = document.getElementById('hourly-weather');

    // Removing hourly weather information from the previous search
    while (hourlyWeather.firstChild) {
        hourlyWeather.removeChild(hourlyWeather.firstChild)
    }
    
    for (let i = 0; i < 5; i++) {
        let hour = document.createElement('div');
        hour.className = "hourly-weather-inner";
        let [hour_time, day_or_night, hour_temp] = [document.createElement('h3'), document.createElement('img'), document.createElement('h3')];
        
        /**
         * The input city's local time
         */
        let time = (date.getHours() + i) % 24;

        hour_temp.innerHTML = response.forecast.forecastday[0].hour[time.toString()].temp_f + "&#176";
        var icon = response.forecast.forecastday[0].hour[time.toString()].condition.icon;
        day_or_night.src = icon.replace("//cdn.weatherapi.com/", "");

        /**
         * The time used in the json response (EST)
         */
        let timestr = (time % 12).toString();

        timestr = ((date.getHours() + i) % 24 < 12) ? timestr.concat("AM") : timestr.concat("PM");
        if (timestr == "0AM") {timestr="12AM"}
        else if (timestr =="0PM") {timestr="12PM"}
        hour_time.innerHTML = timestr;

        hour.appendChild(hour_time);
        hour.appendChild(day_or_night);
        hour.appendChild(hour_temp);
        hour.className = 'hour';
        
        hourlyWeather.appendChild(hour);

        // Changing the background color and text color based on whether it is day or night
        // in the city the user is viewing
        hourlyWeather.style.backgroundColor = response.current.is_day ? '#dcf0fa' : '#546bab';
        
    }
}

/**
 * number of days where forecast information is provided by the Free Weather Api
 */
const NUMBER_OF_DAYS = 3;

/**
 * Function that shows the three-day weather forecast
 * @param {*} response the json object returned from the weather api call
 */
const showWeeklyWeather = (response) => {

    const date = new Date();
    const days = ['Sunday', 'Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = date.getDay();
    var weeklyWeather = document.getElementById('weekly-weather');

    // Removing all forecast information from the previous search
    while(weeklyWeather.firstChild) {
        weeklyWeather.removeChild(weeklyWeather.firstChild);
    }

    for (let i = 0; i < NUMBER_OF_DAYS; i++) {
        let day = document.createElement('div');
        let [weekday, high, average, low] = [document.createElement('h3'), document.createElement('h3'), document.createElement('h3'), document.createElement('h3')];
        let rain_or_shine = document.createElement('img');
        weekday.innerHTML = days[(today + i) % 7];
        high.innerHTML = response.forecast.forecastday[i].day.maxtemp_f + "&#176";
        average.innerHTML = response.forecast.forecastday[i].day.avgtemp_f + "&#176";
        low.innerHTML = response.forecast.forecastday[i].day.mintemp_f + "&#176";

        var icon = response.forecast.forecastday[i].day.condition.icon;
        rain_or_shine.src = icon.replace("//cdn.weatherapi.com/", "");

        day.appendChild(weekday);
        day.appendChild(rain_or_shine);
        day.appendChild(low);
        day.appendChild(average);
        day.appendChild(high);
        day.className = "day";

        weeklyWeather.appendChild(day);
    }

    // Changing the background color and text color based on whether it is day or night
    // in the city the user is viewing
    weeklyWeather.style.backgroundColor = response.current.is_day ? '#dcf0fa' : '#546bab';


}

/**
 * Function that shows additional weather information on the bottom of the screen, 
 * like precipitation, feels-like, and humidity
 * @param {*} response 
 */
const showExtra = (response) => {
    const data = {
        "uv-index": response.current.uv,
        "sunset": response.forecast.forecastday[0].astro.sunset,
        "wind": response.current.wind_mph + " mph",
        "precipitation": response.current.precip_mm + " in",
        "feels-like": response.current.feelslike_f + " &#176",
        "humidity": response.current.humidity + "%",
        "visibility": response.current.vis_miles + " mi",
        "pressure": response.current.pressure_in + " inHg"
    }
    
    var extra = document.getElementById('extra');
    
    for (let i = 0; i < extra.children.length; i++) {
        var temp = document.createElement('div');
        child = extra.children[i];

        // Need to change the size of the precipitation div based on screen size
        var header = window.innerWidth > 480 || child.id !== "precipitation" ? document.createElement('h3') : document.createElement('h5');
        
        var text = document.createElement('h2');
        header.innerHTML = child.id
        text.innerHTML = data[child.id];

        temp.appendChild(header);
        temp.appendChild(text);
        if(child.firstChild) {
            child.removeChild(child.firstChild)
        }
        child.appendChild(temp);

        // Changing the background color and text color based on whether it is day or night
        // in the city the user is viewing
        child.style.backgroundColor = response.current.is_day ? '#dcf0fa' : '#546bab';
    }
}

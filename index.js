
const search = (input) => {
    var current_search = "http://api.weatherapi.com/v1/current.json?key=aa0c6dd759d24c78a4b155701231608&q=";
    var city = input? document.querySelector("input").value : "New York";
    current_search = current_search.concat(city, "&aqi=no");

    var forecast_search = "http://api.weatherapi.com/v1/forecast.json?key=aa0c6dd759d24c78a4b155701231608&q=";
    forecast_search = forecast_search.concat(city, "&days=5&aqi=no&alerts=no");

    fetch(forecast_search, {mode: 'cors'})
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log(response);

            showTop(response)
            showMiddle(response);
            showBottom(response);
            showExtra(response);
        })
        .catch(function(response) {
            alert('Input invalid')

        });



}

const showTop = (response) => {
    var [temperature, low] = [document.getElementById('temperature-text'), document.getElementById('low')];
    temperature.innerHTML = response.current.temp_f;
    temperature.style.fontSize = "3em";
    document.getElementById('weather-description').innerHTML = response.current.condition.text;
    document.getElementById('high').innerHTML = "High: " + response.forecast.forecastday[0].day.maxtemp_f;
    document.getElementById('low').innerHTML = "Low: " + response.forecast.forecastday[0].day.mintemp_f;
    document.getElementById('low').style.paddingBottom = "20px";
    var icon = response.current.condition.icon
    document.getElementById('top-image').src = icon.replace("//cdn.weatherapi.com/", "");
    document.getElementById('city-name').innerHTML = response.location.name;


}



const showMiddle = (response) => {
    const date = new Date();
    var hourlyWeather = document.getElementById('hourly-weather');
        while (hourlyWeather.firstChild) {
            hourlyWeather.removeChild(hourlyWeather.firstChild)
        }
    
    for (let i = 0; i < 5; i++) {
        let hour = document.createElement('div');
        hour.className = "hourly-weather-inner";
        let [hour_time, day_or_night, hour_temp] = [document.createElement('h3'), document.createElement('img'), document.createElement('h3')];
        let time = (date.getHours() + i) % 24;
        let timestr = (time % 12).toString();
        hour_temp.innerHTML = response.forecast.forecastday[0].hour[time.toString()].temp_f + "&#176";
 
        var icon = response.forecast.forecastday[0].hour[time.toString()].condition.icon;
        day_or_night.src = icon.replace("//cdn.weatherapi.com/", "");

        timestr = ((date.getHours() + i) % 24 < 12) ? timestr.concat("AM") : timestr.concat("PM");
        if (timestr == "0AM") {timestr="12AM"}
        else if (timestr =="0PM") {timestr="12PM"}
        hour_time.innerHTML = timestr;

        hour.appendChild(hour_time);
        hour.appendChild(day_or_night);
        hour.appendChild(hour_temp);
        hour.className = 'hour';
        
        hourlyWeather.appendChild(hour);
        
    }
}

const showBottom = (response) => {
    const date = new Date();
    const days = ['Sunday', 'Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = date.getDay()
    var weeklyWeather = document.getElementById('weekly-weather');
    while(weeklyWeather.firstChild) {
        weeklyWeather.removeChild(weeklyWeather.firstChild);
    }
    response.forecast.forecastday
    for (let i = 0; i < 3; i++) {
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

}

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
        var header = document.createElement('h4');
        var text = document.createElement('h2');
        header.innerHTML = child.id
        text.innerHTML = data[child.id];

        temp.appendChild(header);
        temp.appendChild(text);
        if(child.firstChild) {
            child.removeChild(child.firstChild)
        }
        child.appendChild(temp);
    }

}

//Constants
const storageKey = 'weather-dashboard';
const defaultCityName = 'Sydney';
const reqCurrentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?';
const reqForecastWeatherURL = 'https://api.openweathermap.org/data/2.5/forecast?';
const reqCityDataURL = 'https://api.openweathermap.org/geo/1.0/direct?q=';
const reqCityNameURL = 'https://api.openweathermap.org/geo/1.0/reverse?';
const apiKey = '54235d685be1b7eea306dd40934a9322';

//ID Names.
//const cityNameID = 'city-name';
//const presentDayID = 'present-day-name';
// const currentTempID = 'current-temperature';
// const feelsLikeID = 'feels-like';
// const currentWeatherIconID = 'current-weather-icon';
// const currentWeatherDescID = 'current-weather-description';
// const currentHighTempID = 'current-high-temperature';
// const currentLowTempID = 'current-low-temperature';
// const currentWindID = 'current-wind';
// const currentHumidityID = 'current-humidity';
// const currentSunriseID = 'current-sunrise';
// const currentSunsetID = 'current-sunset';

//Class Names
const flexRowJustMiddleCl = 'flex-row-justify-middle';
const flexColJustMiddleCl = 'flex-column-justify-middle';
const todayCl = 'today';
const currCondCl = 'current-condition';
const flexJustMiddleCl = 'flex-justify-middle';
const currDataCl = 'current-data';
const currTempCl = 'current-temp';
const feelLikeCl = 'feels-like';
const currWeatherIconCl = 'current-weather-icon';
const currWeatherDescCl = 'current-weather-description';
const currOthInfoCl = 'current-other-info';
const lineHgt2remCl = 'line-height-2rem';


//DOM Elements
const presentDayContainer = document.getElementById('present-day');
const futureDaysContainer = document.getElementById('future-days');
    
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

init();

async function init(){

    //Adds temporary loading text while weather data is obtained.
    let h2El = addTemporaryLoadingText();

    //Gets lat and lon of user location.
    //Gets lat and lon of Sydney, if fails to get user location.
    let cityLocation= getCurrentLocationData();
    if(cityLocation.lat === 0 && cityLocation.lon === 0) return;
    
    //Adds current weather information.
    addsCurrentWeatherInformation(cityLocation, h2El);

    //Adds 5 day forecast information.
    addForecastWeatherInformation(cityLocation);
}

//Adds 5 day forecast information.
async function addForecastWeatherInformation(cityLocation){

    //Gets forecast weather for the city.
    let weatherData = await getForecastWeatherData(cityLocation);
    if(typeof(weatherData) === 'undefined'){
        return;
    }

    //Filters one forecast for each day.
    let forecastWeather = weatherData.list.filter(dayForecast => dayForecast.dt_txt.indexOf('06:00:00') !== -1);

    

}

//Gets forecast weather for the city.
async function getForecastWeatherData(cityLocation){

    let url = `${reqForecastWeatherURL}lat=${cityLocation.lat}&lon=${cityLocation.lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    return response.json();
}

//Updates current weather information in browser.
async function addsCurrentWeatherInformation(cityLocation, h2El){

    //Gets the city name from lat and lon.
    let cityName = await getCityName(cityLocation);
    if(cityName === '') return;

    //Gets current weather information.
    let currentWeatherData = await getCurrentWeatherData(cityLocation);
    if(typeof(currentWeatherData) === 'undefined'){
        h2El.innerHTML= `Failed to get weather data for ${cityName}`;
        return;
    }

    //Removes temporary loading text once weather data is obtained.
    h2El.remove();

    //Adds city name, current day and date information.
    addLocationInformation(cityName);

    //Creates div container that holds all weather data.
    let currCondEl = document.createElement('div');
    currCondEl.className = `${currCondCl} ${flexJustMiddleCl}`;

    //Adds current temperature information.
    addCurrentTemperatureInformation(currentWeatherData, currCondEl);

    //Adds current weather icon and weather condition.
    addCurrentWeatherConditionInformation(currentWeatherData, currCondEl);

    //Adds other weather information.
    addOtherWeatherInformation(currentWeatherData, currCondEl, true);

    presentDayContainer.append(currCondEl);
}

//Adds other weather information.
function addOtherWeatherInformation(weatherData, containerEl, showHighTemp){

    let highTempEl;
    let lowTempEl;

    //Creates div element for current weather icon and description information.
    let otherWeatherEl = document.createElement('div');
    otherWeatherEl.className = currOthInfoCl;

    //Only displays high and low temperature if specified.
    if(showHighTemp){
        //Gets high temperature with one decimal place.
        let highTemp = Math.round(weatherData.main.temp_max * 10)/ 10;

        //Create div element to display high temperature.
        highTempEl = document.createElement('div');
        highTempEl.className = `${lineHgt2remCl} ${flexRowJustMiddleCl}`;
        highTempEl.innerHTML = `<img src="assets/images/High-Temperature.png" alt="High temperature icon">${highTemp}&#176C`;

        //Gets low temperature with one decimal place.
        let lowTemp = Math.round(weatherData.main.temp_min * 10)/ 10;

        //Create div element to display low temperature.
        lowTempEl = document.createElement('div');
        lowTempEl.className = `${lineHgt2remCl} ${flexRowJustMiddleCl}`;
        lowTempEl.innerHTML = `<img src="assets/images/Low-Temperature.png" alt="Low temperature icon">${lowTemp}&#176C`;
    }

    //Gets wind speed with one decimal place.
    let windSpeed = Math.round(weatherData.wind.speed * 36)/ 10;

    //Create div element to display wind speed.
    let windSpeedEl = document.createElement('div');
    windSpeedEl.className = `${lineHgt2remCl} ${flexRowJustMiddleCl}`;
    windSpeedEl.innerHTML = `<img src="assets/images/Wind.png" alt="Wind icon">${windSpeed} km/h`;

    //Create div element to display humidity.
    let humidityEl = document.createElement('div');
    humidityEl.className = `${lineHgt2remCl} ${flexRowJustMiddleCl}`;
    humidityEl.innerHTML = `<img src="assets/images/Humidity.png" alt="Humidity icon">${weatherData.main.humidity}%`;

    //Create div element to display sunrise time.
    let sunriseEl = document.createElement('div');
    sunriseEl.className = `${lineHgt2remCl} ${flexRowJustMiddleCl}`;
    sunriseEl.innerHTML = `<img src="assets/images/Sunrise.png" alt="Sunrise icon">${dayjs(weatherData.sys.sunrise * 1000).format('hh:mm A')}`;

    //Create div element to display sunset time.
    let sunsetEl = document.createElement('div');
    sunsetEl.className = `${lineHgt2remCl} ${flexRowJustMiddleCl}`;
    sunsetEl.innerHTML = `<img src="assets/images/Sunset.png" alt="Sunset icon">${dayjs(weatherData.sys.sunset * 1000).format('hh:mm A')}`;

    if(showHighTemp){
        otherWeatherEl.append(highTempEl, lowTempEl, windSpeedEl, humidityEl, sunriseEl, sunsetEl);
    } else{
        otherWeatherEl.append(windSpeedEl, humidityEl, sunriseEl, sunsetEl);
    }

    containerEl.append(otherWeatherEl);
}

//Adds current weather icon and weather condition.
function addCurrentWeatherConditionInformation(weatherData, currCondEl){

    //Creates div element for current weather icon and description information.
    let currWeatherEl = document.createElement('div');
    currWeatherEl.className = flexColJustMiddleCl;

    //Gest URL for weather icon.
    let iconURL = getIconURL(weatherData.weather[0].icon);

    //Creates img element to display current weather icon.
    let currWeatherIconEL = document.createElement('img');
    currWeatherIconEL.className = currWeatherIconCl;
    currWeatherIconEL.src = iconURL;
    currWeatherIconEL.alt = 'Current weather icon';

    //Gets current weather description with first letter capital in each word.
    let currWeatherDesc = getWeatherDescription(weatherData.weather[0].description);

    //Adds div element to display current weather description.
    let currWeatherDescEL = document.createElement('div');
    currWeatherDescEL.className = currWeatherDescCl;
    currWeatherDescEL.innerHTML = currWeatherDesc;

    currWeatherEl.append(currWeatherIconEL, currWeatherDescEL);

    currCondEl.append(currWeatherEl);
}

//Gets current weather description with first letter capital in each word.
function getWeatherDescription(description){

    let descArray = description.split(' ');

    for (let i = 0; i < descArray.length; i++) {
        descArray[i] = descArray[i].charAt(0).toUpperCase() + descArray[i].substring(1);
    }

    return descArray.join(' ');
}

//Gest URL for weather icon.
function getIconURL(icon){
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

//Adds current temperature information.
function addCurrentTemperatureInformation(weatherData, currCondEl){

    //Creates div element for current temperature information.
    let currDataEl = document.createElement('div');
    currDataEl.className = currDataCl;

    //Gets current temperature with one decimal place.
    let currentTemp = Math.round(weatherData.main.temp * 10)/ 10;

    //Create div element to display current temperature.
    let currTempEl = document.createElement('div');
    currTempEl.className = currTempCl;
    currTempEl.innerHTML = `<img src="assets/images/Temperature.png" alt="Temperature icon">${currentTemp}&#176C`;

    //Gets feel like temperature with one decimal place.
    let feelsLike = Math.round(weatherData.main.feels_like * 10)/ 10;

     //Create div element to display feels like temperature.
    let feelsLikeEL = document.createElement('div');
    feelsLikeEL.className = `${feelLikeCl} ${flexRowJustMiddleCl}`
    feelsLikeEL.innerHTML = `<img src="assets/images/FeelsLike.png" alt="Feels like icon">${feelsLike}&#176C`;

    currDataEl.append(currTempEl, feelsLikeEL);

    currCondEl.append(currDataEl);
}

//Adds city name, current day and date information.
function addLocationInformation(cityName){

    //Adds the city name element in browser.
    addCityName(cityName);

    //Adds value of present day and date.
    addPresentDay();
}

//Updates value of present day and date.
function addPresentDay(){

    //Adds div element and updates its inner HTML to present day and date.
    let dayNameEl = document.createElement('div');
    //dayNameEl.id = presentDayID;
    dayNameEl.className = todayCl;
    dayNameEl.innerHTML = dayjs().format('dddd- DD/MM/YYYY');
    presentDayContainer.append(dayNameEl);
}

//Adds the city name element in browser.
function addCityName(cityName){

    //Creates h2 element, adds id and class name.
    //Sets inner html text to show city name.
    let cityNameEl = document.createElement('h2');
    //cityNameEl.id = cityNameID;
    cityNameEl.className = flexRowJustMiddleCl;
    cityNameEl.innerHTML = `<img class="location-tag" src="assets/images/Location.png" alt="Location pin icon">${cityName}`;
    presentDayContainer.append(cityNameEl);
}

//Gets current weather information.
async function getCurrentWeatherData(cityLocation){

    let url = `${reqCurrentWeatherURL}lat=${cityLocation.lat}&lon=${cityLocation.lon}&units=metric&appid=${apiKey}`;

    const response = await fetch(url);

    return response.json();
}

//Gets the city name from lat and lon.
async function getCityName(cityLocation){

    //Gets the city name from lat and lon using API.
    let cityData = await getCityNameFromAPI(cityLocation);
    if(typeof(cityData) === 'undefined') return '';

    //Returns thecity name from response ontained from API.
    return cityData[0].name;
}

//Gets the city name from lat and lon using API.
async function getCityNameFromAPI(cityLocation){

    //Creates a URL to fetch city name data.
    let url = `${reqCityNameURL}lat=${cityLocation.lat}&lon=${cityLocation.lon}&limit=1&appid=${apiKey}`;

    const response = await fetch(url);

    return response.json();
}

//Gets lat and lon of user location.
//Gets lat and lon of Sydney, if fails to get user location.
function getCurrentLocationData(){

    let cityLocation = {
        lat: 0,
        lon: 0
    };

    //Tries to get the user location.
    //If fails, gets lat an lon for Sydney and
    //Stores into location storage.
    navigator.geolocation.getCurrentPosition(success, error, options);

    //Ges the local storage.
    let storage = getLocalStorage();
    if(storage !== null){

        cityLocation = {
            lat: storage.curLocation.lat,
            lon: storage.curLocation.lon
        };
    }

    //Returns city lat and lon.
    return cityLocation;
}

//Gets the city lat and lon.
async function success(pos) {

    let cityLocation = {
        lat: 0,
        lon: 0
    };

    const crd = pos.coords;

    //Tries to get user location data.
    //If fails, gets lat an lon for Sydney.
    if(crd.latitude === 0 && crd.longitude === 0){

        cityLocation = await getDefaultCityLocation();

    } else {

        cityLocation = {
            lat: crd.latitude,
            lon: crd.longitude
        };
       
    }

    let storage = {
        curLocation: cityLocation,
        cityNames:[]
    };

    //Updates local storage with city lat and lon.
    addUpdateLocalStorage(storage);
}

//Gets lat an lon for Sydney.
async function getDefaultCityLocation(){

    let cityLocation = {
        lat: 0,
        lon: 0
    };

    //Gets lat an lon for Sydney using API.
    let defaultCityLocation = await getLocationDataByCityName(defaultCityName);

    if(typeof(defaultCityLocation) !== 'undefined'){
        cityLocation.lat =  defaultCityLocation[0].lat,
        cityLocation.lon = defaultCityLocation[0].lon
    }

    return cityLocation;
}

//Gets lat an lon for Sydney using API.
async function getLocationDataByCityName(cityName){

    let url = `${reqCityDataURL}${cityName}&limit=1&appid=${apiKey}`;

    const response = await fetch(url);

    return response.json();
}

//Adds/updates local storage.
function addUpdateLocalStorage(storage){
    localStorage.setItem(storageKey, JSON.stringify(storage));
}

//Gets the local storage for trivia games.
function getLocalStorage(){

    //Gets the schedule storage and converts it into an array of objects.
    let storage = localStorage.getItem(storageKey);   
    if(storage === null){
        return null;
    }

    return JSON.parse(storage);
}

//Logs the error in consol log.
function error(err) {
    //console.warn(`ERROR(${err.code}): ${err.message}`);
}

//Adds temporary loading text while weather data is obtained.
function addTemporaryLoadingText(){
    let h2El = document.createElement('h2');
    h2El.textContent = "Loading..."
    presentDayContainer.append(h2El);

    return h2El;
}
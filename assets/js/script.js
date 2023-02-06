//Constants
const storageKey = 'weather-dashboard';
const defaultCityName = 'Sydney';
const reqCurrentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?';
const reqCityDataURL = 'https://api.openweathermap.org/geo/1.0/direct?q=';
const reqCityNameURL = 'https://api.openweathermap.org/geo/1.0/reverse?';
const apiKey = '54235d685be1b7eea306dd40934a9322';

const cityNameID = 'city-name';
const presentDayID = 'present-day-name';
const currentTempID = 'current-temperature';
const feelsLikeID = 'feels-like';
const currentWeatherIconID = 'current-weather-icon';
const currentWeatherDescID = 'current-weather-description';
const curentHighTempID = 'current-high-temperature';
const currentLowTempID = 'current-low-temperature';
const currentWindID = 'current-wind';
const currentHumidityID = 'current-humidity';
const currentSunriseID = 'current-sunrise';
const currentSunsetID = 'current-sunset';
    
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};


init();

async function init(){

    //Gets lat and lon of user location.
    //Gets lat and lon of Sydney, if fails to get user location.
    let cityLocation= getCurrentLocationData();
    if(cityLocation.lat === 0 && cityLocation.lon === 0) return

    //Gets the city name from lat and lon.
    let cityName = await getCityName(cityLocation);

    //Updates the city name element in browser.
    updateCityName(cityName);

    //Updates value of present day and date.
    updatePresentDay();

    //Gets current weather information.
    let currentWeatherData = await getCurrentWeatherData(cityLocation);
    console.log(currentWeatherData);
    
    //Updates current weather information in browser.
    updateCurrentWeatherInformation(currentWeatherData);
}

//Updates current weather information in browser.
function updateCurrentWeatherInformation(currentWeatherData){

    //Updates current temperature value.
    let currentTempEL = document.getElementById(currentTempID);
    let currentTemp = Math.round(currentWeatherData.main.temp * 10)/ 10;
    currentTempEL.innerHTML = `<img src="/assets/images/Temperature.png" alt="Temperature icon">${currentTemp}&#176C`;

    //Updates feels like value.
    let feelsLikeEL = document.getElementById(feelsLikeID);
    let feelsLike = Math.round(currentWeatherData.main.feels_like * 10)/ 10;
    feelsLikeEL.innerHTML = `<img src="/assets/images/FeelsLike.png" alt="Feels like icon">${feelsLike}&#176C`;

    //Updates current weather icon.
    let iconURL = getIconURL(currentWeatherData.weather[0].icon);
    let currWeatherIconEL = document.getElementById(currentWeatherIconID);
    currWeatherIconEL.src = iconURL;

    //Updates current weather description.
    let currWeatherDescEL = document.getElementById(currentWeatherDescID);

    //Gets current weather description with first letter capital in each word.
    let currWeatherDesc = getWeatherDescription(currentWeatherData.weather[0].description);
    currWeatherDescEL.innerHTML = currWeatherDesc;
}

//Gest URL for weather icon.
function getIconURL(icon){
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

//Gets current weather description with first letter capital in each word.
function getWeatherDescription(description){

    let descArray = description.split(' ');

    for (let i = 0; i < descArray.length; i++) {
        descArray[i] = descArray[i].charAt(0).toUpperCase() + descArray[i].substring(1);
    }

    return descArray.join(' ');
}

//Gets current weather information.
async function getCurrentWeatherData(cityLocation){

    let url = `${reqCurrentWeatherURL}lat=${cityLocation.lat}&lon=${cityLocation.lon}&units=metric&appid=${apiKey}`;

    const response = await fetch(url);

    return response.json();
}

//Updates value of present day and date.
function updatePresentDay(){

    //Gets the day name div element and updates its inner HTML.
    let dayNameEl = document.getElementById(presentDayID);
    dayNameEl.innerHTML = dayjs().format('dddd- DD/MM/YYYY');
}

//Updates the city name element in browser.
function updateCityName(cityName){

    //Gets the city name h2 element and updates its inner HTML.
    let cityNameEl = document.getElementById(cityNameID);
    cityNameEl.innerHTML = `<img class="location-tag" src="/assets/images/Location.png" alt="Location pin icon">${cityName}`;
}

//Gets the city name from lat and lon.
async function getCityName(cityLocation){

    //Gets the city name from lat and lon using API.
    let cityData = await getCityNameFromAPI(cityLocation);

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
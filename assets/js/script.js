//Constants
const storageKey = 'weather-dashboard';
const defaultCityName = 'Sydney';
const reqCurrentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?';
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

    //Gets the city name from lat and lon.
    let cityName = await getCityName(cityLocation);
    if(cityName === '') return;

    //Gets current weather information.
    let currentWeatherData = await getCurrentWeatherData(cityLocation);
    console.log(currentWeatherData);

    //Removes temporary loading text once weather data is obtained.
    h2El.remove();

    //Adds city name, current day and date information.
    addLocationInformation(cityName);
    
    //Adds current weather information.
    addsCurrentWeatherInformation(currentWeatherData);

    //Adds 5 day forecast information.
}

//Updates current weather information in browser.
function addsCurrentWeatherInformation(currentWeatherData){

    //Creates div container that holds all weather data.
    let currCondEl = document.createElement('div');
    currCondEl.className = `${currCondCl} ${flexJustMiddleCl}`;

    //Adds current temperature information.
    addCurrentTemperatureInformation(currentWeatherData, currCondEl);

    //Adds current weather icon and weather condition.
    addCurrentWeatherConditionInformation(currentWeatherData, currCondEl);

    

    presentDayContainer.append(currCondEl);
}

//Adds current weather icon and weather condition.
function addCurrentWeatherConditionInformation(currentWeatherData, currCondEl){

    //Creates div element for current weather icon and description information.
    let currWeatherEl = document.createElement('div');
    currWeatherEl.className = flexColJustMiddleCl;

    //Gest URL for weather icon.
    let iconURL = getIconURL(currentWeatherData.weather[0].icon);

    //Creates img element to display current weather icon.
    let currWeatherIconEL = document.createElement('img');
    currWeatherIconEL.className = currWeatherIconCl;
    currWeatherIconEL.src = iconURL;
    currWeatherIconEL.alt = 'Current weather icon';

    //Gets current weather description with first letter capital in each word.
    let currWeatherDesc = getWeatherDescription(currentWeatherData.weather[0].description);

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
function addCurrentTemperatureInformation(currentWeatherData, currCondEl){

    //Creates div element for current temperature information.
    let currDataEl = document.createElement('div');
    currDataEl.className = currDataCl;

    //Gets current temperature with one decimal place.
    let currentTemp = Math.round(currentWeatherData.main.temp * 10)/ 10;

    //Create div element to display current temperature.
    let currTempEl = document.createElement('div');
    currTempEl.className = currTempCl;
    currTempEl.innerHTML = `<img src="/assets/images/Temperature.png" alt="Temperature icon">${currentTemp}&#176C`;

    //Gets feel like temperature with one decimal place.
    let feelsLike = Math.round(currentWeatherData.main.feels_like * 10)/ 10;

     //Create div element to display feels like temperature.
    let feelsLikeEL = document.createElement('div');
    feelsLikeEL.className = `${feelLikeCl} ${flexRowJustMiddleCl}`
    feelsLikeEL.innerHTML = `<img src="/assets/images/FeelsLike.png" alt="Feels like icon">${feelsLike}&#176C`;

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
    cityNameEl.innerHTML = `<img class="location-tag" src="/assets/images/Location.png" alt="Location pin icon">${cityName}`;
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
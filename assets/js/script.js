//Constants
const storageKey = 'weather-dashboard';
const defaultCityName = 'Sydney';
const reqCurrentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?';
const reqForecastWeatherURL = 'https://api.openweathermap.org/data/2.5/forecast?';
const reqCityDataURL = 'https://api.openweathermap.org/geo/1.0/direct?q=';
const reqCityNameURL = 'https://api.openweathermap.org/geo/1.0/reverse?';
const apiKey = '54235d685be1b7eea306dd40934a9322';
const weekends = ['Saturday', 'Sunday'];

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
const futureDayCl = 'future-day';
const dayValueCl = 'day-value';
const dayDateCl = 'day-date';
const weekendCl = 'weekend';
const dayDataCl = 'day-data';
const futMainSummCl = 'future-main-summary';
const futWeatherIconCl = 'future-weather-icon';
const futWeatherDescCl = 'future-weather-description';
const topBorderCl = 'top-border';
const favCityCl = 'favourite-city';
const selCityCl = 'selected-city';

//DOM Elements
const presentDayContainer = document.getElementById('present-day');
const futureDaysContainer = document.getElementById('future-days');
const forecastTextEl= document.getElementById('forecast-text');
const searchBtnEl = document.getElementById('search-button');
const cityNameTextboxEl = document.getElementById('city-name-textbox');
const cityListEl = document.getElementById('favourite-city-container');

init();

searchBtnEl.addEventListener('click', processSearchCityWeatherData);

cityListEl.addEventListener('click', updateSelectedCity);

async function updateSelectedCity(event){

    event.preventDefault();

    let cityNameEl = event.target;

    if(cityNameEl.nodeName.toLowerCase() !== 'li') return;

    //Gets the selected city name.
    let selCityname = cityNameEl.textContent;
    
    //Removes existing selected city.
    removeExistingSelectedCity();

    //Adds selected city class name.
    addSelectedCityClassName(cityNameEl);

    //Removes existing current and future weather data.
    removeExistingWeatherData();

    //Adds temporary loading text while weather data is obtained.
    let h2El = addTemporaryLoadingText();

    //Hides forecast text.
    forecastTextEl.style.visibility = 'hidden';

    let cityLocation = await getCityCoordinates(selCityname);

    if(cityLocation.lat === 0 && cityLocation.lon === 0) {
        h2El.innerHTML = `Failed to get cordinates of '${selCityname}'.`;
        return;
    }

     //Adds current weather information.
     addCurrentWeatherInformation(cityLocation, h2El, selCityname);

     //Adds 5 day forecast information.
     addForecastWeatherInformation(cityLocation);

     //Updates favourite cities list.
     updateFavouriteCities(selCityname);
}

//Adds selected city class name and arrow
function addSelectedCityClassName(cityNameEl){

    //Gets the city name.
    let selCityname = cityNameEl.textContent;

    //Gets existing class names.
    let className = cityNameEl.className;

    //Adds selected city class name.
    className = `${className} ${selCityCl}`;

    //Resets the class name of selected city element.
    cityNameEl.className = className

    //Resets inner HTML by adding arrow image after city name.
    cityNameEl.innerHTML = `<img class="location-tag" src="assets/images/Location-Current.png" alt="Current location pin icon">${selCityname}<img class="arrow" src="assets/images/Arrow.png" alt="Arrow icon">`;
}

//Removes existing selected city.
function removeExistingSelectedCity(){

    //Gets existing city name child emelemts and removes the selected city class.
    let cityNameChildren = cityListEl.children;
    if(cityNameChildren.length === 0) return;

    let cityList = Array.from(cityNameChildren);

    cityList.forEach(cityNameEl => {
        let className = cityNameEl.className;
        className = className.replace(selCityCl, '');
        cityNameEl.className = className.trim();

        //Gets the city name and updates the inner HTML.
        //This is to remove arrow after city name.
        let cityname = cityNameEl.textContent;
        cityNameEl.innerHTML = `<img class="location-tag" src="assets/images/Location.png" alt="Location pin icon">${cityname}`;
    });
}

async function processSearchCityWeatherData(event){

    event.preventDefault();

    //Gets the city name.
    let cityName = cityNameTextboxEl.value;

    //Resets the textbox value to empty string.
    cityNameTextboxEl.value = '';

    //Exist the function if city name is empty.
    if(cityName.trim() === '') return;

    //Capitalizes first letter in each word.
    cityName = capitalizeWords(cityName);

    //Removes existing selected city.
    removeExistingSelectedCity();

    //Removes existing current and future weather data.
    removeExistingWeatherData();

    //Adds temporary loading text while weather data is obtained.
    let h2El = addTemporaryLoadingText();

    //Hides forecast text.
    forecastTextEl.style.visibility = 'hidden';

    //Gets the city coordinates.
    let cityLocation = await getCityCoordinates(cityName);

    if(cityLocation.lat === 0 && cityLocation.lon === 0) {
        h2El.innerHTML = `Failed to get cordinates of '${cityName}'.`;
        return;
    }

     //Adds current weather information.
     addCurrentWeatherInformation(cityLocation, h2El, cityName);

     //Adds 5 day forecast information.
     addForecastWeatherInformation(cityLocation);

     //Updates favourite cities list.
     updateFavouriteCities(cityName);
}

//Capitalizes first letter in each word.
function capitalizeWords(cityName){
    let wordArray = cityName.split(' ');

    for (let i = 0; i < wordArray.length; i++) {

        //Makes the first letter upper case.
        wordArray[i] = wordArray[i].charAt(0).toUpperCase() + wordArray[i].substring(1);
    }

    return wordArray.join(' ');
}

//Updates favourite cities list.
function updateFavouriteCities(cityName){

    //Gets the current local storage (list of favourite cities).
    let storage = getLocalStorage();

    //Sets the storage to empty array if returns null.
    if(storage === null) storage = [];
    
    //Only adds the city name to list, if doesn;t exist already.
    if (!storage.includes(cityName)){
        storage.push(cityName);
    }

    //Updates the local storage.
    addUpdateLocalStorage(storage.sort());

    //Updates favourite city list.
    updateFavouriteCityList(cityName);
}

//Updates favourite city list.
function updateFavouriteCityList(searchCityName){

    //Gets the current local storage (list of favourite cities).
    let storage = getLocalStorage();
    if(storage === null) return;

    //Removes existing city names from the list.
    removeExistingCityNames();

    //Loops through each city name and list element to ul element.
    storage.forEach(cityName => {
        
        let cityNameEl = document.createElement('li');
        

        if(cityName === searchCityName){
            cityNameEl.className = `${favCityCl} ${selCityCl}`;
            cityNameEl.innerHTML = `<img class="location-tag" src="assets/images/Location-Current.png" alt="Current location pin icon">${cityName}<img class="arrow" src="assets/images/Arrow.png" alt="Arrow icon">`;
        } else {

            cityNameEl.className = favCityCl;
            cityNameEl.innerHTML = `<img class="location-tag" src="assets/images/Location.png" alt="Location pin icon">${cityName}`;
        }

        cityListEl.append(cityNameEl);
    });

    cityListEl.className = topBorderCl;
}

//Removes existing city names from the list.
function removeExistingCityNames(){

    //Gets existing city name child emelemts and removes them.
    let cityNameChildren = cityListEl.children;
    if(cityNameChildren.length === 0) return;

    let cityList = Array.from(cityNameChildren);

    cityList.forEach(cityName => cityName.remove());

    //Removes class names.
    cityListEl.className = '';
}

//Removes existing current and future weather data.
function removeExistingWeatherData(){

    //Gets child elements from present day div element and removes them. 
    let currWeatherChildren = presentDayContainer.children;
    if(currWeatherChildren.length > 0){
        let currWeatherChildrenArray = Array.from(currWeatherChildren);

        currWeatherChildrenArray.forEach(currWeatherChild => currWeatherChild.remove());
    }

    //Gets child elements from future days div element and removes them. 
    let futWeatherChildren = futureDaysContainer.children;
    if(futWeatherChildren.length > 0){
        let futWeatherChildrenArray = Array.from(futWeatherChildren);

        futWeatherChildrenArray.forEach(futWeatherChild => futWeatherChild.remove());
    }
}

async function init(){

    //Adds temporary loading text while weather data is obtained.
    let h2El = addTemporaryLoadingText();

    //Hides forecast text.
    forecastTextEl.style.visibility = 'hidden';

    //Gets lat and lon of user location.
    //Gets lat and lon of Sydney, if fails to get user location.
    let cityLocation= await getCurrentLocationData();
    if(cityLocation.lat === 0 && cityLocation.lon === 0) {
        h2El.innerHTML = `Failed to get cordinates of current location.`;
        return;
    }

    //Gets the city name from lat and lon.
    let cityName = await getCityName(cityLocation);
    if(cityName === '') return;
    
    //Adds current weather information.
    addCurrentWeatherInformation(cityLocation, h2El, cityName);

    //Adds 5 day forecast information.
    addForecastWeatherInformation(cityLocation);

    //Updates favourite cities list.
    updateFavouriteCities(cityName);
}

//Adds 5 day forecast information.
async function addForecastWeatherInformation(cityLocation){

    //Gets forecast weather for the city.
    let weatherData = await getForecastWeatherData(cityLocation);
    if(typeof(weatherData) === 'undefined'){
        return;
    }

    //Gets 5 day forecast weather.
    let forecastWeather = getFiveDayForecastWeatherData(weatherData);
    if(forecastWeather.length === 0) return;

    //Adds weather forecast for each day.
    for (let i = 0; i < forecastWeather.length; i++) {
        addForecastDayWeatherInformation(forecastWeather[i])
    }
}

//Gets 5 day forecast weather.
function getFiveDayForecastWeatherData(weatherData){

    let forecastWeather = [];

    const today = dayjs().format('DD/MM/YYYY');

    //Loops through all forecast weather data.
    //Weather data contains multiple entries for same day.
    for (let i = 0; i < weatherData.list.length; i++) {

        const data = weatherData.list[i];
        
        //Gets weather data date in local time.
        let dataDate = dayjs(data.dt * 1000).format('DD/MM/YYYY');

        //Only processes the weather data if it is not today and future data.
        if(today !== dataDate){

            //Checks whether the future date is already added to the list or not.
            //Only adds the data to the list if the data for the same day is not added already.
            let dateAdded = forecastWeather.filter(dayForecast => dayjs(dayForecast.dt * 1000).format('DD/MM/YYYY') === dataDate);

            if(dateAdded.length === 0){
                forecastWeather.push(data);
            }
        }
    }

    return forecastWeather;
}

//Adds weather forecast for each day.
function addForecastDayWeatherInformation(weatherData){

    //Creates div container that holds all forecast weather data.
    let futCondEl = document.createElement('div');
    futCondEl.className = futureDayCl;

    //Adds forecast day and date.
    addForecastDay(weatherData, futCondEl);

    //Creates div container that holds other forecast weather information.
    let dayDataCondEl = document.createElement('div');
    dayDataCondEl.className = dayDataCl;

    //Adds current weather icon and weather condition.
    addForecastWeatherConditionInformation(weatherData, dayDataCondEl);

    //Adds other weather information.
    addOtherWeatherInformation(weatherData, dayDataCondEl, false);

    futCondEl.append(dayDataCondEl);

    futureDaysContainer.append(futCondEl);
}

//Adds current weather icon and weather condition.
function addForecastWeatherConditionInformation(weatherData, dayDataCondEl){

    //Creates div element for forecast weather icon and description information.
    let futWeatherEl = document.createElement('div');
    futWeatherEl.className = futMainSummCl;

    //Gest URL for weather icon.
    let iconURL = getIconURL(weatherData.weather[0].icon);

    //Creates img element to display forecast weather icon.
    let futWeatherIconEL = document.createElement('img');
    futWeatherIconEL.className = futWeatherIconCl;
    futWeatherIconEL.src = iconURL;
    futWeatherIconEL.alt = 'Weather icon';

    //Gets forecast weather description with first letter capital in each word.
    let futWeatherDesc = getWeatherDescription(weatherData.weather[0].description);

    //Adds div element to display forecast weather description.
    let futWeatherDescEL = document.createElement('div');
    futWeatherDescEL.className = futWeatherDescCl;
    futWeatherDescEL.innerHTML = futWeatherDesc;

    futWeatherEl.append(futWeatherIconEL, futWeatherDescEL);

    dayDataCondEl.append(futWeatherEl);
}

//Adds forecast day and date.
function addForecastDay(weatherData, futCondEl){

    let dayClassName = dayValueCl;
    let dayName = dayjs(weatherData.dt* 1000).format('dddd');
    
    if(weekends.includes(dayName)){
        dayClassName += ` ${weekendCl}`;
    }

    //Creates div container that holds day and date.
    let dayCondEl = document.createElement('div');
    dayCondEl.className = dayClassName;

    //Creates div container that holds day name.
    let dayNameEl = document.createElement('div');
    dayNameEl.className = dayDateCl;
    dayNameEl.innerHTML = dayName;

    //Creates div container that holds date.
    let dateCondEl = document.createElement('div');
    dateCondEl.className = dayDateCl;
    dateCondEl.innerHTML = dayjs(weatherData.dt* 1000).format('DD/MM/YYYY');

    dayCondEl.append(dayNameEl, dateCondEl);

    futCondEl.append(dayCondEl);
}

//Gets forecast weather for the city.
async function getForecastWeatherData(cityLocation){

    let url = `${reqForecastWeatherURL}lat=${cityLocation.lat}&lon=${cityLocation.lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(url).catch(() => {});

    return response.json();
}

//Updates current weather information in browser.
async function addCurrentWeatherInformation(cityLocation, h2El, cityName){

    //Gets current weather information.
    let currentWeatherData = await getCurrentWeatherData(cityLocation);
    if(typeof(currentWeatherData) === 'undefined'){
        h2El.innerHTML= `Failed to get weather data for '${cityName}'`;
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

    //Creates div element for current weather icon and description information.
    let otherWeatherEl = document.createElement('div');
    otherWeatherEl.className = currOthInfoCl;

    //Adds other weather information.
    addOtherWeatherInformation(currentWeatherData, otherWeatherEl, true);

    currCondEl.append(otherWeatherEl);

    presentDayContainer.append(currCondEl);

    //Displays forecast text.
    forecastTextEl.style.visibility = 'visible';
}

//Adds other weather information.
function addOtherWeatherInformation(weatherData, otherWeatherEl, showHighTemp){

    let tempEl;
    let highTempEl;
    let lowTempEl;
    let sunriseEl;
    let sunsetEl;

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

        //Create div element to display sunrise time.
        sunriseEl = document.createElement('div');
        sunriseEl.className = `${lineHgt2remCl} ${flexRowJustMiddleCl}`;
        sunriseEl.innerHTML = `<img src="assets/images/Sunrise.png" alt="Sunrise icon">${dayjs(weatherData.sys.sunrise * 1000).format('hh:mm A')}`;

        //Create div element to display sunset time.
        sunsetEl = document.createElement('div');
        sunsetEl.className = `${lineHgt2remCl} ${flexRowJustMiddleCl}`;
        sunsetEl.innerHTML = `<img src="assets/images/Sunset.png" alt="Sunset icon">${dayjs(weatherData.sys.sunset * 1000).format('hh:mm A')}`;
    } else {

        //Gets high temperature with one decimal place.
        let temp = Math.round(weatherData.main.temp * 10)/ 10;

        //Create div element to display high temperature.
        tempEl = document.createElement('div');
        tempEl.className = `${lineHgt2remCl} ${flexRowJustMiddleCl}`;
        tempEl.innerHTML = `<img src="assets/images/Temperature.png" alt="Temperature icon">${temp}&#176C`;
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

    if(showHighTemp){
        otherWeatherEl.append(highTempEl, lowTempEl, windSpeedEl, humidityEl, sunriseEl, sunsetEl);
    } else{
        otherWeatherEl.append(tempEl, windSpeedEl, humidityEl);
    } 
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

    const response = await fetch(url).catch(() => {});

    return response.json();
}

//Gets the city name from lat and lon.
async function getCityName(cityLocation){

    //Gets the city name from lat and lon using API.
    let cityData = await getCityNameFromAPI(cityLocation);
    if(cityData.length === 0) return '';

    //Returns the city name from response obtained from API.
    return cityData[0].name;
}

//Gets the city name from lat and lon using API.
async function getCityNameFromAPI(cityLocation){

    //Creates a URL to fetch city name data.
    let url = `${reqCityNameURL}lat=${cityLocation.lat}&lon=${cityLocation.lon}&limit=1&appid=${apiKey}`;

    const response = await fetch(url).catch(() => {});

    return response.json();
}

//Gets lat and lon of user location.
//Gets lat and lon of Sydney, if fails to get user location.
async function getCurrentLocationData(){

    let cityLocation = {
        lat: 0,
        lon: 0
    };

    //Tries to get user location data.
    let position = await getCurrentLongAndLat().catch(() => {});

    //If fails, gets lat and lon for Sydney.
    //if(position.coords.latitude === 0 && position.coords.longitude === 0){
    if(typeof(position) === 'undefined'){

        cityLocation = await getCityCoordinates(defaultCityName);

    //If successfully gets user's location, gets lat and lon.
    } else {

        cityLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        };
    }

    //Returns city lat and lon.
    return cityLocation;
}

//Tries to get user location data by creating new promise.
function getCurrentLongAndLat() {
    return new Promise((success, error) => navigator.geolocation.getCurrentPosition(success, error));
}

//Gets lat an lon for Sydney.
async function getCityCoordinates(citName){

    let cityLocation = {
        lat: 0,
        lon: 0
    };

    //Gets lat an lon for specified city using API.
    let defaultCityLocation = await getLocationDataByCityName(citName);

    if(defaultCityLocation.length > 0){
        cityLocation.lat =  defaultCityLocation[0].lat,
        cityLocation.lon = defaultCityLocation[0].lon
    }

    return cityLocation;
}

//Gets lat an lon for specified city using API.
async function getLocationDataByCityName(cityName){

    let url = `${reqCityDataURL}${cityName}&limit=1&appid=${apiKey}`;

    const response = await fetch(url).catch(() => {});

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

//Adds temporary loading text while weather data is obtained.
function addTemporaryLoadingText(){
    let h2El = document.createElement('h2');
    h2El.textContent = "Loading..."
    presentDayContainer.append(h2El);

    return h2El;
}
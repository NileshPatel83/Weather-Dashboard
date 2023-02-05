//Constants
const storageKey = 'weather-dashboard';
const defaultCityName = 'Sydney';
const reqWeatherURL = 'https://api.openweathermap.org/data/2.5/forecast';
const reqCityDataURL = 'http://api.openweathermap.org/geo/1.0/direct?q=';
const reqCityNameURL = 'http://api.openweathermap.org/geo/1.0/reverse?';
const apiKey = '54235d685be1b7eea306dd40934a9322';

const cityNameID = 'city-name';
    
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};


init();

async function init(){

    let cityLocation= getCurrentLocationData();
    if(cityLocation.lat === 0 && cityLocation.lon === 0) return

    let cityName = await getCityName(cityLocation);

    updateCityName(cityName);

}

function updateCityName(cityName){

    let cityNameEl = document.getElementById(cityNameID);

    let innerHTML = cityNameEl.innerHTML;
    let innerText = cityNameEl.innerText;

    innerHTML = innerHTML.replace(innerText, cityName);

    cityNameEl.innerHTML = innerHTML;
}

async function getCityName(cityLocation){

    let cityData = await getCityNameFromAPI(cityLocation);

    return cityData[0].name;
}

async function getCityNameFromAPI(cityLocation){

    let url = `${reqCityNameURL}lat=${cityLocation.lat}&lon=${cityLocation.lon}&limit=1&appid=${apiKey}`;

    const response = await fetch(url);

    return response.json();
}

function getCurrentLocationData(){

    let cityLocation = {
        lat: 0,
        lon: 0
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

    let storage = getLocalStorage();
    if(storage !== null){

        cityLocation = {
            lat: storage.curLocation.lat,
            lon: storage.curLocation.lon
        };
    }

    return cityLocation;
}

async function success(pos) {

    let cityLocation = {
        lat: 0,
        lon: 0
    };

    const crd = pos.coords;

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

    addUpdateLocalStorage(storage);
}

async function getDefaultCityLocation(){

    let cityLocation = {
        lat: 0,
        lon: 0
    };

    let defaultCityLocation = await getLocationDataByCityName(defaultCityName);

    if(typeof(defaultCityLocation) !== 'undefined'){
        cityLocation.lat =  defaultCityLocation[0].lat,
        cityLocation.lon = defaultCityLocation[0].lon
    }

    return cityLocation;
}

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
  
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}
//Constants
const storageKey = 'weather-dashboard';
const defaultCityName = 'Sydney';
const reqWeatherURL = 'https://api.openweathermap.org/data/2.5/forecast';
const reqCityDataURL = 'http://api.openweathermap.org/geo/1.0/direct?q=';
const apiKey = '54235d685be1b7eea306dd40934a9322';

// let cityLocation = {
//     lat: 0,
//     lon: 0
// };
    
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};


init();

function init(){

    let cityLocation= getCurrentLocationData();
    if(cityLocation.lat === 0 && cityLocation.lon === 0) return
}

function getCurrentLocationData(){

    navigator.geolocation.getCurrentPosition(success, error, options);


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

    return location;
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
  
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}
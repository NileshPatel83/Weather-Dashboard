//Constants
const storageKey = 'weather-dashboard';
const defaultCityName = 'Sydney';
const reqWeatherURL = 'https://api.openweathermap.org/data/2.5/forecast';
const reqCityDataURL = 'http://api.openweathermap.org/geo/1.0/direct?q=';
const apiKey = '54235d685be1b7eea306dd40934a9322';

let cityLocation = {
    lat: 0,
    lon: 0
};
    
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};


init();

async function init(){

    await getCurrentLocationData();

    console.log(cityLocation);
}

async function getCurrentLocationData(){

    navigator.geolocation.getCurrentPosition(success, error, options);

    // if (navigator.geolocation) {
    //     return navigator.geolocation.watchPosition(success, error, options);
    //   } else { 
    //     cityLocation = await getDefaultCityLocation(defaultCityName);
    //   }
}

async function getDefaultCityLocation(defaultCityName){

    let defaultCityLocation = await getLocationDataByCityName(defaultCityName);
    if(typeof(defaultCityLocation) === 'undefined') return 'undefined';

    let location = {
        lat: defaultCityLocation[0].lat,
        lon: defaultCityLocation[0].lon
    };

    return location;
}

async function getLocationDataByCityName(cityName){

    let url = `${reqCityDataURL}${cityName}&limit=1&appid=${apiKey}`;

    const response = await fetch(url);

    return response.json();
}

function success(pos) {

    const crd = pos.coords;

    cityLocation = {
        lat: crd.latitude,
        lon: crd.longitude
    };

    let storage = {
      curLocation: cityLocation,
      cityNames:[]
    };

    localStorage.setItem(storageKey, JSON.stringify(storage));
}
  
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}
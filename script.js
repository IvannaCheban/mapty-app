"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class Workout {
  //any object shoud have some kind of unique identifier so we can then later identify it using that ID

  date = new Date(); //class fields
  id = (Date.now() + "").slice(-10); // IRL we usually use some library to create good id numbers
  constructor(coords, distance, duration) {
    // this.date = ...
    // this.id = ...
    this.coords = coords; //[lat,lng]
    this.distance = distance; // in km
    this.duration = duration; // minutes
  }
}

class Runnig extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }
  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

/////////////////////////////////////
// APLICATION ARCHITECTURE
class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPosition(); //calling the methods in the constructure because these elements are loaded as soon as the page loads
    form.addEventListener("submit", this._newWorkout.bind(this)); //here we also have to point to the this keyword in the _new Workout function because on default it poits to the form object
    inputType.addEventListener("change", this._toggleElevationField); // here we dont need to bind the this to the function because it does not use the external data
  }
  _getPosition() {
    //Using geolocation API
    //get current position method takes 2 argumets: first in case when location succesfuly loaded, second when its not
    if (navigator.geolocation)
      //for older browsers
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Could not get your position");
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords; //destructuring the coords object, creating objects with the same name as the prarameter we want ot extract
    const { longitude } = position.coords;
    //Displayig a map using leflet library
    //L.map is a namespace just like Intl for internationalisation, and it has couple of methods that we can use, this namespace is a global variable on the script that we loaded before ours script.js, so this script.js has acces to the lefleat script but not the other way around because its defined before. So the order of the script placement has a great deal.

    const coords = [latitude, longitude]; //creating an array with coords, first latitude and then longitude
    this.#map = L.map("map").setView(coords, 13); // spetial object created by lefleat , first coords and second is zoom level

    // console.log(map);

    //the map is made of tiles and these tiles are coming from this map, this map can be changed, this is just default map
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //handling clicks on map
    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE; //storing event on the global scope to handle it in another function
    form.classList.remove("hidden");
    inputDistance.focus(); //good for user experience
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }
  // Display marker
  _newWorkout(e) {
    e.preventDefault();

    //Clear input fields
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        "";

    const { lat, lng } = this.#mapEvent.latlng; //destructuring the mapEvent object to get values from the events location
    L.marker([lat, lng]) // specifying the array of coords
      .addTo(this.#map) // adding popup to map
      .bindPopup(
        // bind a popup to marker click
        L.popup({
          // adding custom properties for popup
          maxWithd: 250,
          minWidth: 100,
          autoClose: false, //preventing pop up from disapearing when map clicked
          closeOnClick: false,
          className: "running-popup", //specifying class to format style of each pop-up
        })
      )
      .setPopupContent("Workout") // Sets the content of the popup bound to this layer.
      .openPopup(); // and open the popup
  }
}
const app = new App();

//Managing workout data: creating classes

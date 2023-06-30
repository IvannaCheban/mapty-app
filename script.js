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

let map, mapEvent;
//Using geolocation API
//get current position method takes 2 argumets: first in case when location succesfuly loaded, second when its not
if (navigator.geolocation)
  //for older browsers
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords; //destructuring the coords object, creating objects with the same name as the prarameter we want ot extract
      const { longitude } = position.coords;
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      //Displayig a map using leflet library
      //L.map is a namespace just like Intl for internationalisation, and it has couple of methods that we can use, this namespace is a global variable on the script that we loaded before ours script.js, so this script.js has acces to the lefleat script but not the other way around because its defined before. So the order of the script placement has a great deal.

      const coords = [latitude, longitude]; //creating an array with coords, first latitude and then longitude

      map = L.map("map").setView(coords, 13); // spetial object created by lefleat , first coords and second is zoom level

      // console.log(map);

      //the map is made of tiles and these tiles are coming from this map, this map can be changed, this is just default map
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker(coords)
        .addTo(map)
        .bindPopup("A pretty CSS popup.<br> Easily customizable.")
        .openPopup();

      //handling clicks on map

      map.on("click", function (mapE) {
        mapEvent = mapE; //storing event on the global scope to handle it in another function
        form.classList.remove("hidden");
        inputDistance.focus(); //good for user experience
      });
    },
    function () {
      alert("Could not get your position");
    }
  );

// Display marker
form.addEventListener("submit", function (e) {
  e.preventDefault();

  //Clear input fields
  inputDistance.value =
    inputCadence.value =
    inputDuration.value =
    inputElevation.value =
      "";
  console.log(mapEvent);
  const { lat, lng } = mapEvent.latlng; //destructuring the mapEvent object to get values from the events location
  L.marker([lat, lng]) // specifying the array of coords
    .addTo(map) // adding popup to map
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
});
inputType.addEventListener("change", function () {
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
});

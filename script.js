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

//Using geolocation API
//get current position method takes 2 argumets: first in case when location succesfuly loaded, second when its not
if (navigator.geolocation)
  //for older browsers
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords; //destructuring the coords object, creating objects with the same name as the prarameter we want ot extract
      const { longitude } = position.coords;
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    },
    function () {
      alert("Could not get your position");
    }
  );

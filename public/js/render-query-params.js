'use strict'

var userInput;

window.onload = function() {

  userInput = getQueryParams();
  addValuesToInput(userInput.location, userInput.milerange, userInput.maxdistance, userInput.mindistance, userInput.maxelevation, userInput.minelevation);

  function getQueryParams(){
    let url = window.location.href;
    let vars = {};

    var hashes = url.split("?")[1].split('&');

    for (let i = 0; i < hashes.length; i++) {
      let params=hashes[i].split("=");
      vars[params[0]] = params[1];
      }

    return sortRangeSliders(vars)
    //return vars;
  }

  function sortRangeSliders(paramObj){
    let distance = paramObj.distancerange;
    let keyValues = distance.split('+-+');
    paramObj.mindistance = keyValues[0];
    let keyValuesMax = keyValues[1].split('+');
    paramObj.maxdistance = keyValuesMax[0];

    let elevation = paramObj.elevationrange;
    let keyValuesElevation = elevation.split('+-+');
    paramObj.minelevation = keyValuesElevation[0];
    keyValuesMax = keyValuesElevation[1].split('+');
    paramObj.maxelevation = keyValuesMax[0];
    //console.log(paramObj)
    return paramObj
  }

  function addValuesToInput(location, mileRange, maxDistance, minDistance, elevGain, elevMin){

    var inputLocation = document.getElementsByClassName("route-options-location")[0];
    location = location.substring(0, location.length - 20)
    location = location.replace(/%2C/gi,",")
    location = location.replace(/[^\w\s]/gi," ")
    inputLocation.value = location;
    var inputMileRange = document.getElementsByClassName("route-options-mile-range")[0];
    inputMileRange.value = mileRange;
    var inputMaxDistance = document.getElementsByClassName("route-options-maxdistance")[0];
    inputMaxDistance.value = maxDistance;
    var inputMinDistance = document.getElementsByClassName("route-options-mindistance")[0];
    inputMinDistance.value = minDistance;
    var inputElevGain = document.getElementsByClassName("route-options-elev-gain")[0];
    inputElevGain.value = elevGain;
    var inputElevMin = document.getElementsByClassName("route-options-elev-min")[0];
    inputElevMin.value = elevMin;
  }

}

console.log(userInput, 'this is the userInput')

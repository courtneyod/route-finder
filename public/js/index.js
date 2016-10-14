"use strict"

// initialize();
google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {


  var options = {
      types: ['(cities)'],
      componentRestrictions: { country: "us" }
}
var input = document.getElementById('location');
var locationInput = document.getElementById('locations');
var autocomplete = new google.maps.places.Autocomplete(input, options);
var autocomplete = new google.maps.places.Autocomplete(locationInput, options);

}

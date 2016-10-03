"use strict"

function initialize() {
  var options = {
      types: ['(cities)'],
      componentRestrictions: { country: "us" }
}
var input = document.getElementById('location');
var autocomplete = new google.maps.places.Autocomplete(input, options);
}
// initialize();
google.maps.event.addDomListener(window, 'load', initialize);

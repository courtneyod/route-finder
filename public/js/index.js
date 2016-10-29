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

$( function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 200,
      values: [ 50, 100 ],
      slide: function( event, ui ) {
        $( "#distance" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] + " miles");
      }
    });
    $( "#distance" ).val($( "#slider-range" ).slider( "values", 0 ) + " - " + $( "#slider-range" ).slider( "values", 1 ) +
      "  miles" );
      var minDistance = $("#slider-range").slider("values", 0);
      var maxDistance = $("#slider-range").slider("values", 1);
  });


  $( function() {
      $( "#slider-range-elevation" ).slider({
        range: true,
        min: 0,
        max: 5000,
        values: [1000, 3000],
        slide: function( event, ui ) {
          $( "#elevation" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] + " feet");
        }
      });
      $( "#elevation" ).val($( "#slider-range-elevation" ).slider( "values", 0 ) + " - " + $( "#slider-range-elevation" ).slider( "values", 1 ) +
        "  feet" );
      var minElevation = $("#slider-range-elevation").slider("values", 0);
      var maxElevation = $("#slider-range-elevation").slider("values", 1);
       $('.hidden-min-elevation').val(minElevation);
       $('.hidden-max-elevation').val(maxElevation);
    });

}

"use strict"

window.onload = function() {

  var params = {};

  function getUrls(){
    let url = window.location.href;
    let vars = {};

    var hashes = url.split("?")[1].split('&');

    for (let i = 0; i < hashes.length; i++) {
      let params=hashes[i].split("=");
      vars[params[0]] = params[1];
      }

    //console.log(vars);
    return vars;
    }

  params = getUrls();
  passInParams(params);
  //console.log(params);

  //document.getElementById('search-button').addEventListener('click', checkSearchValue);

  var routeOptions = [];

  // checkSearchValue();

  function passInParams(parameters){
    var location = parameters.location;
    var distance = parameters.distance;
    var elevGain = parameters.elevgain;
    var elevMin = parameters.elevmin;
    console.log(location, distance, elevGain, elevMin);
    // if(!location){
      //getRoutes(location, distance, elevGain, elevMin);
      addValuesToInput(location, distance, elevGain, elevMin);
    // }
  }

  function addValuesToInput(location, distance, elevGain, elevMin){
    var inputLocation = document.getElementByClassName("route-options-location");
    inputLocation.text = location;
  }

  function getRoutes(location, distance, elevGain, elevMin) {
    console.log("getting called")
    $.ajax({
      url:  `https://ridewithgps.com/find/search.js?search%5Bkeywords%5D=&search%5Bstart_location%5D=San+Francisco%2C+CA&search%5Bstart_distance%5D=${distance}&search%5Belevation_max%5D=${elevGain}&search%5Belevation_min%5D=${elevMin}&search%5Blength_max%5D=1200&search%5Blength_min%5D=50&search%5Boffset%5D=0&search%5Blimit%5D=20&search%5Bsort_by%5D=length+des`,
      method: "GET",
      dataType: "jsonp"
    })
    .done(function(data){
      console.log(data.results[0].trip);
      routeOptions = data.results;
      console.log(routeOptions);
      //renderRouteIds();
    });
  }
  //
  //
  // var renderRouteIds = function() {
  //     var routeIdArray = [];
  //     for (var i = 0; i < routeOptions.length; i++) {
  //       if(routeOptions[i].trip !== "undefined"){
  //         routeIdArray.push(routeOptions[i].trip);
  //       }
  //     }
  //     console.log(routeIdArray);
  //   }

};

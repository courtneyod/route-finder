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

    return vars;
    }

  params = getUrls();
  passInParams(params);

  //document.getElementById('search-button').addEventListener('click', checkSearchValue);

  var routeOptions = [];

  function passInParams(parameters){
    var location = parameters.location;
    var distance = parameters.distance;
    var elevGain = parameters.elevgain;
    var elevMin = parameters.elevmin;
    //console.log(location, distance, elevGain, elevMin);
    // if(!location){
      addValuesToInput(location, distance, elevGain, elevMin);
      getIdsAjax(location, distance, elevGain, elevMin);
    // }
  }

  function addValuesToInput(location, distance, elevGain, elevMin){
    var inputLocation = document.getElementsByClassName("route-options-location")[0];
    inputLocation.value = location;
    var inputDistance = document.getElementsByClassName("route-options-distance")[0];
    inputDistance.value = distance;
    var inputElevGain = document.getElementsByClassName("route-options-elev-gain")[0];
    inputElevGain.value = elevGain;
    var inputElevMin = document.getElementsByClassName("route-options-elev-min")[0];
    inputElevMin.value = elevMin;
  }

  function getIdsAjax(location, distance, elevGain, elevMin) {
    //console.log("getting called")
    $.ajax({
      url:  `https://ridewithgps.com/find/search.js?search%5Bkeywords%5D=&search%5Bstart_location%5D=San+Francisco%2C+CA&search%5Bstart_distance%5D=${distance}&search%5Belevation_max%5D=${elevGain}&search%5Belevation_min%5D=${elevMin}&search%5Blength_max%5D=1200&search%5Blength_min%5D=50&search%5Boffset%5D=0&search%5Blimit%5D=20&search%5Bsort_by%5D=length+des`,
      method: "GET",
      dataType: "jsonp"
    })
    .done(function(data){
      //console.log(data.results[0].trip);
      routeOptions = data.results;
      console.log(routeOptions);
      renderRouteIds(routeOptions);
    });
  }
  //
  //
  var renderRouteIds = function(routeOptions) {
      var routeIdArray = [];
      var routeContainerObj = {}
      for (var i = 0; i < routeOptions.length; i++) {
        if(routeOptions[i].type === "trip"){
          routeIdArray.push(routeOptions[i].trip.route_id);

          routeContainerObj[1 + i] =
          {
            "ids": routeOptions[i].trip.route_id,
            "distance": routeOptions[i].trip.distance,
            "elevation_gain": routeOptions[i].trip.elevation_gain,
            "elevation_loss": routeOptions[i].trip.elevation_loss,
            "first_lat": routeOptions[i].trip.first_lat,
            "last_lat": routeOptions[i].trip.last_lat,
            "first_lng": routeOptions[i].trip.first_lng,
            "last_lng": routeOptions[i].trip.last_lng,
            "city": routeOptions[i].trip.locality,
            "state": routeOptions[i].trip.administrative_area,
            "postal_code": routeOptions[i].trip.postal_code
           };

        } if (routeOptions[i].type === "route"){
          routeIdArray.push(routeOptions[i].route.id);

          routeContainerObj[1 + i] =
          {
            "ids": routeOptions[i].route.id,
            "distance": routeOptions[i].route.distance,
            "elevation_gain": routeOptions[i].route.elevation_gain,
            "elevation_loss": routeOptions[i].route.elevation_loss,
            "first_lat": routeOptions[i].route.first_lat,
            "last_lat": routeOptions[i].route.last_lat,
            "first_lng": routeOptions[i].route.first_lng,
            "last_lng": routeOptions[i].route.last_lng,
            "city": routeOptions[i].route.locality,
            "state": routeOptions[i].route.administrative_area,
            "postal_code": routeOptions[i].route.postal_code
           };
        }
      }
      console.log(routeIdArray);
      console.log(routeContainerObj);
      //getRoutesAjax(routeIdArray);
    };

    function getRoutesAjax(routeIdArray) {
      console.log(" getroutes array getting called");
      var routeId = routeIdArray[0];
      $.ajax({
        url:  `https://ridewithgps.com/routes/${routeId}.js`,
        method: "GET",
        dataType: "jsonp"
      })
      .done(function(data){
        console.log(data);
        console.log("it worked")
      });
    }

    

};

"use strict"

window.onload = function() {
  var mapObj;
  init();


  function init(){
    var userInput = getQueryParams();
    addValuesToInput(userInput.location, userInput.distance, userInput.elevGain, userInput.elevMin);
    var routesPromise = getMatchingRoutes(userInput.location, userInput.distance, userInput.elevGain, userInput.elevMin);

    routesPromise.done(function(data){
      var routeOptions = data.results;
      var friendlyRouteObjects = mapRoutesToFriendlyObjects(routeOptions);

      renderRideOptions(friendlyRouteObjects.routeContainerObj);

      var centerLat = friendlyRouteObjects.routeContainerObj[0].first_lat;
      var centerLong = friendlyRouteObjects.routeContainerObj[0].first_lng;

      var firstLatLongArrayForRides = latLongObject(friendlyRouteObjects.routeContainerObj)
      mapObj = initMap(centerLat, centerLong, firstLatLongArrayForRides);

    });
 }

  function getQueryParams(){
    let url = window.location.href;
    let vars = {};

    var hashes = url.split("?")[1].split('&');

    for (let i = 0; i < hashes.length; i++) {
      let params=hashes[i].split("=");
      vars[params[0]] = params[1];
      }

    return vars;
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

  function getMatchingRoutes(location, distance, elevGain, elevMin) {
    return $.ajax({
      url:  `https://ridewithgps.com/find/search.js?search%5Bkeywords%5D=&search%5Bstart_location%5D=San+Francisco%2C+CA&search%5Bstart_distance%5D=${distance}&search%5Belevation_max%5D=${elevGain}&search%5Belevation_min%5D=${elevMin}&search%5Blength_max%5D=1200&search%5Blength_min%5D=50&search%5Boffset%5D=0&search%5Blimit%5D=20&search%5Bsort_by%5D=length+des`,
      method: "GET",
      dataType: "jsonp"
    })
  }


  // TODO - refactor using .map()
  var mapRoutesToFriendlyObjects = function(routeOptions) {
    var routeIdArray = [];
    var routeContainerObj = [];
    for (var i = 0; i < routeOptions.length; i++) {
      if(routeOptions[i].type === "trip"){
        routeIdArray.push(routeOptions[i].trip.route_id);

        routeContainerObj.push({
          "ids": routeOptions[i].trip.route_id,
          "distance": routeOptions[i].trip.distance,
          "elevation_gain": routeOptions[i].trip.elevation_gain,
          "elevation_loss": routeOptions[i].trip.elevation_loss,
          "first_lat": routeOptions[i].trip.first_lat,
          "last_lat": routeOptions[i].trip.last_lat,
          "first_lng": routeOptions[i].trip.first_lng,
          "last_lng": routeOptions[i].trip.last_lng,
          "city": routeOptions[i].trip.locality,
          "duration": routeOptions[i].trip.duration,
          "state": routeOptions[i].trip.administrative_area,
          "postal_code": routeOptions[i].trip.postal_code
        });

      } if (routeOptions[i].type === "route"){
        routeIdArray.push(routeOptions[i].route.id);

        routeContainerObj.push({
          "ids": routeOptions[i].route.id,
          "distance": routeOptions[i].route.distance,
          "elevation_gain": routeOptions[i].route.elevation_gain,
          "elevation_loss": routeOptions[i].route.elevation_loss,
          "first_lat": routeOptions[i].route.first_lat,
          "last_lat": routeOptions[i].route.last_lat,
          "first_lng": routeOptions[i].route.first_lng,
          "last_lng": routeOptions[i].route.last_lng,
          "city": routeOptions[i].route.locality,
          "duration": routeOptions[i].route.duration,
          "state": routeOptions[i].route.administrative_area,
          "postal_code": routeOptions[i].route.postal_code
        });
      }
    }

    return {
      routeContainerObj,
      routeIdArray
    }

  };

  function renderRideOptions(routeObject){

    // add click handler that then calls: displayRouteOnMap (pass in routeId for a card)

    var resultsContainer = document.getElementsByClassName('number-of-results-container')[0];
    resultsContainer.innerHTML = routeObject.length + " routes match";

    var rideDetails = document.getElementsByClassName('ride-details')[0];

    for (var route of routeObject) {
      var col = document.createElement("div");
      col.className = "result-card-container";
      var card = document.createElement("div");
      card.className = "result-card";
      card.id = route.ids;
      var headline = document.createElement("h3");
      headline.className = "city-state";
      var cardMile = document.createElement("div");
      cardMile.className = "card-mile card-details";
      var cardElevGain = document.createElement("div");
      cardElevGain.className = "card-elev-gain card-details";
      var duration = document.createElement("div");
      duration.className = "card-duration card-details";

      rideDetails.appendChild(col);
      col.appendChild(card);

      headline.innerHTML = "City " + route.city + ", " + route.state;
      card.appendChild(headline);

      cardMile.innerHTML = ((route.distance)*(0.000621)).toFixed(1) + " mi";
      card.appendChild(cardMile);

      cardElevGain.innerHTML = ((route.elevation_gain)*(3.2808399)).toFixed(1) + " ft";
      card.appendChild(cardElevGain);

      duration.innerHTML = route.duration + " estimated time";
      card.appendChild(duration);

      createClickEventForEachCard('click', card);
    }

  }

  function createClickEventForEachCard(eventName, element){
    element.addEventListener(eventName, function(event) {
      var routeId = event.currentTarget.id;
      console.log(routeId, "this is the route id")
      displayRouteOnMap(routeId);
    });
  }


  function initMap(firstLat ,firstLong, locations) {
    var myLatLng = {lat: firstLat, lng: firstLong};
    var labelIndex = 0;
    var map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLng,
      zoom: 12
    });

    // var marker = new google.maps.Marker({
    //   position: myLatLng,
    //   map: map,
    //   title: 'Hello World!'
    // });

    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var markers = locations.map(function(location, i) {
            return new google.maps.Marker({
              position: location,
              label: labels[i % labels.length]
            });
          });
    //
    // var bikeLayer = new google.maps.BicyclingLayer();
    // bikeLayer.setMap(map);

    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    var directionsService = new google.maps.DirectionsService();

    return {
      map,
      directionsDisplay,
      directionsService
    }
  }


  function displayRouteOnMap(routeId){
    var routeDetailsPromise = getRouteDetails(routeId);
    routeDetailsPromise.done(function(data){
      putPathOnMap(data.track_points)
    });
  }


  function getRouteDetails(routeId) {
    return $.ajax({
      url:  `https://ridewithgps.com/routes/${routeId}.json`,
      method: "GET",
      dataType: "jsonp"
    })
  }

  function putPathOnMap(trackPoints){
    console.log(trackPoints[400]["x"])
    //console.log(trackPoints);
    var setSize = Math.floor(trackPoints.length/4);
    //console.log(setSize);

    for (var i = 3; i < trackPoints.length; i+=setSize) {
      var waypoints = [];
      if(i < trackPoints.length - setSize){
        var lastIndex = trackPoints.length - 1;

        var origin = {
          lat:trackPoints[i].x,
          lng: trackPoints[i].y
        }
        var destination = {
          lat: trackPoints[i+setSize].x ,
          lng: trackPoints[i+setSize].y
        }
        for (var j = i+150 ; j < i + setSize; j+= Math.floor((setSize/6))) {

          waypoints.push({
            location: new google.maps.LatLng(trackPoints[j]["x"], trackPoints[j]['y']),
            stopover:false
          })
        }

        createAndAppendSubRoute(origin, destination, waypoints);
      }
    }
  }

  function createAndAppendSubRoute(origin, destination, waypoints){
    console.log(waypoints)
    mapObj.directionsService.route({
      origin: origin,
      destination: destination,
      waypoints: waypoints,
      optimizeWaypoints: true,
      travelMode: 'BICYCLING'
    }, function(response){
      mapObj.directionsDisplay.setDirections(response);
    });

  }

  function latLongObject(routeObject){
    var locations = [];
    for (var route of routeObject) {
      locations.push(
      {
        "lat": route.first_lat,
        "lng": route.first_lng
      });
    }
    return locations

  }






}

// End of onload





//document.getElementById('search-button').addEventListener('click', checkSearchValue);
// function passInParams(parameters){
//   var location = parameters.location;
//   var distance = parameters.distance;
//   var elevGain = parameters.elevgain;
//   var elevMin = parameters.elevmin;
//   //console.log(location, distance, elevGain, elevMin);
//   // if(!location){
//
//
//   // }
// }

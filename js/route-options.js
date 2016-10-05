"use strict"

window.onload = function() {
  var mapObj;
  init();


  function init(){
    var userInput = getQueryParams();
    addValuesToInput(userInput.location, userInput.milerange, userInput.distance, userInput.elevgain, userInput.elevmin);

    var routesPromise = getMatchingRoutes(userInput.location, userInput.milerange, userInput.distance, userInput.elevgain, userInput.elevmin);

    routesPromise.done(function(data){
      var routeOptions = data.results;
      console.log(routeOptions)
      var friendlyRouteObjects = mapRoutesToFriendlyObjects(routeOptions);

      geoCodeLatLong(friendlyRouteObjects.routeContainerObj);

      var centerLat = friendlyRouteObjects.routeContainerObj[0].first_lat;
      var centerLong = friendlyRouteObjects.routeContainerObj[0].first_lng;

      var firstLatLongArrayForRides = latLongObject(friendlyRouteObjects.routeContainerObj)
      mapObj = initMap(centerLat, centerLong, firstLatLongArrayForRides);
      //renderRideOptions(routeContainerObj[i], routeContainerObjLength)

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

  function addValuesToInput(location, mileRange, distance, elevGain, elevMin){

    var inputLocation = document.getElementsByClassName("route-options-location")[0];
    inputLocation.value = location;
    var inputMileRange = document.getElementsByClassName("route-options-mile-range")[0];
    inputMileRange.value = mileRange;
    var inputDistance = document.getElementsByClassName("route-options-distance")[0];
    inputDistance.value = distance;
    var inputElevGain = document.getElementsByClassName("route-options-elev-gain")[0];
    inputElevGain.value = elevGain;
    var inputElevMin = document.getElementsByClassName("route-options-elev-min")[0];
    inputElevMin.value = elevMin;
  }

  function getMatchingRoutes(location, mileRange, distance, elevGain, elevMin) {
    return $.ajax({
      url:  `https://ridewithgps.com/find/search.js?search%5Bkeywords%5D=&search%5Bstart_location%5D=San+Francisco%2C+CA&search%5Bstart_distance%5D=${mileRange}&search%5Belevation_max%5D=${elevGain}&search%5Belevation_min%5D=${elevMin}&search%5Blength_max%5D=${distance}&search%5Blength_min%5D=50&search%5Boffset%5D=0&search%5Blimit%5D=20&search%5Bsort_by%5D=length+des`,
      method: "GET",
      dataType: "jsonp"
    })
  }


  // TODO - refactor using .map()
  var mapRoutesToFriendlyObjects = function(routeOptions) {
    var routeIdArray = [];
    var routeContainerObj = [];
    console.log(routeOptions[2].elevation_gain)

    for (var i = 0; i < routeOptions.length; i++) {
      if(routeOptions[i].type === "trip"){
        routeIdArray.push(routeOptions[i].trip.route_id);

        routeContainerObj.push({
          "ids": routeOptions[i].trip.route_id,
          "cityAndState": undefined,
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
          "cityAndState": undefined,
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
    renderRideOptions(routeContainerObj, routeContainerObj.length)
    return {
      routeContainerObj,
      routeIdArray
    }

  };

  function geoCodeLatLong(routeContainerObj){
    var routeContainerObjLength = routeContainerObj.length;

    for (var i = 0; i < routeContainerObj.length - 1 ; i++) {
        let lat;
        let lng;
        lat = routeContainerObj[i].first_lat;
        lng = routeContainerObj[i].first_lng;
        //console.log(lat, lng)
        // console.log(typeof lat.toFixed(3))
        // var latlng = {lat: parseFloat(lat.toFixed(3)), lng: parseFloat(lng.toFixed(3))};
        //console.log(lat, lng)
        // var geocoder = new google.maps.Geocoder;
        //var latlng = new google.maps.LatLng(lat, lng);
        // ajax with lat long interpolated into query string
       $.ajax({
          url:  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyC_9ywy5CNyw82GhC8N3b-7vRgkp-Dpmac`,
          method: "GET"
        })
        .done(function(data){
          let formatedAddress = data.results[0].formatted_address;
          routeContainerObj[i].cityAndState = ((formatedAddress).substring(0, formatedAddress.length - 15));
          //console.log(routeContainerObj[i])
          renderRideOptions(routeContainerObj[i], routeContainerObjLength)
        })
    }
  }
    // console.log(routeContainerObj)



  function renderRideOptions(routeObject, routeContainerObjLength){

    // add click handler that then calls: displayRouteOnMap (pass in routeId for a card)

    var resultsContainer = document.getElementsByClassName('number-of-results-container')[0];
    resultsContainer.innerHTML = routeContainerObjLength + " routes match";

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

      headline.innerHTML = route.cityAndState;
      card.appendChild(headline);

      cardMile.innerHTML = ((route.distance)*(0.000621)).toFixed(1) + " mi";
      card.appendChild(cardMile);

      //console.log(route.elevation_gain)
      cardElevGain.innerHTML = ((route.elevation_gain)*(3.2808399)).toFixed(1) + " ft";
      card.appendChild(cardElevGain);

      if(route.duration !== undefined && route.duration !== null){
        duration.innerHTML = route.duration + " estimated ride time";
        card.appendChild(duration);
      }

      createClickEventForEachCard('click', card);
    }

  }

  function createClickEventForEachCard(eventName, element){
    element.addEventListener(eventName, function(event) {
      var removeInnerShadow = document.getElementsByClassName('inner-shadow');
      console.log(removeInnerShadow)
      if(removeInnerShadow.length > 0){
        removeInnerShadow[0].className = 'result-card-container';
      }
      var routeId = event.currentTarget.id;
      event.currentTarget.parentElement.className += ' inner-shadow';
      //console.log(routeId, "this is the route id")
      displayRouteOnMap(routeId);
    });
  }


  function initMap(firstLat ,firstLong, locations) {
    var myLatLng = {lat: firstLat, lng: firstLong};
    var labelIndex = 0;
    var map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLng,
      zoom: 10,
      mapTypeControl: true,
          mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.TOP_CENTER
          },
          zoomControl: true,
          zoomControlOptions: {
              position: google.maps.ControlPosition.RIGHT_TOP
          },
          scaleControl: true,
          streetViewControl: true,
          streetViewControlOptions: {
              position: google.maps.ControlPosition.LEFT_TOP
          },
          fullscreenControl: true
    });



    // var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // var markers = locations.map(function(location, i) {
    //         return new google.maps.Marker({
    //           position: location,
    //           label: labels[i % labels.length]
    //         });
    //       });
    // //
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
    //console.log(routeId)
    var routeDetailsPromise = getRouteDetails(routeId);
    console.log(routeDetailsPromise)
    routeDetailsPromise.done(function(data){
      //console.log(data.track_points)
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
    var firstLatLongMaker = {lat:trackPoints[3].y,  lng: trackPoints[3].x}
    //console.log(trackPoints[3]["y"], trackPoints[3]["x"]);
    //console.log(trackPoints);
    //var setSize = Math.floor(trackPoints.length/4);
    //console.log(setSize);

    //for (var i = 3; i < trackPoints.length; i+=setSize) {
    //   var waypoints = [];
    //   if(i < trackPoints.length - setSize){
    //     var lastIndex = trackPoints.length - 1;
    //
    //     var origin = {
    //       lat:trackPoints[i].y,
    //       lng: trackPoints[i].x
    //     }
    //     var destination = {
    //       lat: trackPoints[i+setSize].y ,
    //       lng: trackPoints[i+setSize].x
    //     }
    //     for (var j = i+150 ; j < i + setSize; j+= Math.floor((setSize/6))) {
    //
    //       waypoints.push({
    //         location: new google.maps.LatLng(trackPoints[j]["y"], trackPoints[j]['x']),
    //         stopover:false
    //       })
    //     }
    //     //console.log(waypoints)
    //
    //     createAndAppendSubRoute(origin, destination, waypoints);
    //     debugger
    //   }
    // }
    var paths = [];
    //console.log(paths)
    for (var i = 3; i < trackPoints.length; i++) {
      if (trackPoints[i].y !== undefined && trackPoints[i].x !== undefined){
        paths.push({
            lat:trackPoints[i].y,
            lng: trackPoints[i].x
          })
        }
  }
  createAndAppendSubRoute(firstLatLongMaker, paths)
}


  function createAndAppendSubRoute(firstLatLongMaker, paths){
    //console.log(waypoints)
    // mapObj.directionsService.route({
    //   origin: origin,
    //   destination: destination,
    //   waypoints: waypoints,
    //   optimizeWaypoints: true,
    //   travelMode: 'BICYCLING'
    // }, function(response){
    //   mapObj.directionsDisplay.setDirections(response);
    // });
    // var request = {
    //   origin: origin,
    //   destination: destination,
    //   waypoints: waypoints,
    //   optimizeWaypoints: true,
    //   travelMode: 'BICYCLING'
    // }
    // mapObj.directionsService.route(request, function(response, status) {
    //     if (status === google.maps.DirectionsStatus.OK) {
    //         mapObj.directionsDisplay.setDirections(response);
    //     } else  {
    //      console.log("error from google");
    //  }
    // });

    var bikeRouteDirections = new google.maps.Polygon({
      paths: paths,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.0000001
  });

    // bikeRouteDirections.setMap(null);

    addLine();

    function addLine() {
      bikeRouteDirections.setMap(mapObj.map);
      }

    var marker = new google.maps.Marker({
      position: firstLatLongMaker,
      map: mapObj.map,
      title: 'Hello World!'
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

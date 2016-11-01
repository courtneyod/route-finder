"use strict"

window.curBikeLine = null;
window.marker = null;
window.elevator = null;

window.onload = function() {

  var mapObj;
  init();

  function init(){
    var userInput = getQueryParams();
    addValuesToInput(userInput.location, userInput.milerange, userInput.maxdistance, userInput.mindistance, userInput.maxelevation, userInput.minelevation);

    var routesPromise = getMatchingRoutes(userInput.location, userInput.milerange, userInput.maxdistance, userInput.mindistance, userInput.maxelevation, userInput.minelevation);

    routesPromise.done(function(data){
      $.spin('false');
      var routeOptions = data.results;
      var friendlyRouteObjects = mapRoutesToFriendlyObjects(routeOptions);

      geoCodeLatLong(friendlyRouteObjects.routeContainerObj);

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
    console.log(paramObj)
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

  // function getMatchingRoutes(location, mileRange, maxDistance, minDistance, elevGain, elevMin) {
  //   location = location.substring(0, location.length - 17)
  //   return $.ajax({
  //     url:  `https://ridewithgps.com/find/search.js?search%5Bkeywords%5D=&search%5Bstart_location%5D=${location}&search%5Bstart_distance%5D=${mileRange}&search%5Belevation_max%5D=${elevGain}&search%5Belevation_min%5D=${elevMin}&search%5Blength_max%5D=${maxDistance}&search%5Blength_min%5D=${minDistance}&search%5Boffset%5D=0&search%5Blimit%5D=20&search%5Bsort_by%5D=length+des`,
  //     method: "GET",
  //     dataType: "jsonp",
  //     beforeSend: function(xhr) {
  //     $("#baconIpsumOutput").html('');
  //     $.spin('true');
  //
  //     }
  //   })
  // }



  // TODO - refactor using .map()
  var mapRoutesToFriendlyObjects = function(routeOptions) {
    //console.log(routeOptions.length)
    var routeIdArray = [];
    var routeContainerObj = [];

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
    return {
      routeContainerObj,
      routeIdArray
    }

  };

  function geoCodeLatLong(routeContainerObj){
    var routeContainerObjLength = routeContainerObj.length;

    for (let i = 0; i < routeContainerObj.length - 1 ; i++) {
        let lat;
        let lng;
        lat = routeContainerObj[i].first_lat;
        lng = routeContainerObj[i].first_lng;

       $.ajax({
          url:  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyC_9ywy5CNyw82GhC8N3b-7vRgkp-Dpmac`,
          method: "GET"
        })
        .done(function(data){
          let formatedAddress = data.results[0].formatted_address;
          routeContainerObj[i].cityAndState = ((formatedAddress).substring(0, formatedAddress.length - 15));
          renderRideOptions(routeContainerObj[i], routeContainerObjLength)

        })
    }
  }



  function renderRideOptions(route, routeContainerObjLength){

    // add click handler that then calls: displayRouteOnMap (pass in routeId for a card)

    var resultsContainer = document.getElementById('num-results-container');
    resultsContainer.className = "num-results-container"
    resultsContainer.innerHTML = routeContainerObjLength + " routes match";

    var rideDetails = document.getElementsByClassName('ride-details')[0];

    // for (var route in routeObject) {
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

      cardElevGain.innerHTML = ((route.elevation_gain)*(3.2808399)).toFixed(1) + " ft";
      card.appendChild(cardElevGain);

      if(route.duration !== undefined && route.duration !== null){
        duration.innerHTML = route.duration + " estimated ride time";
        card.appendChild(duration);
      }

      createClickEventForEachCard('click', card);
    // }

  }

  function createClickEventForEachCard(eventName, element){
    element.addEventListener(eventName, function(event) {
      var removeInnerShadow = document.getElementsByClassName('inner-shadow');

      if(removeInnerShadow.length > 0){
        removeInnerShadow[0].className = 'result-card-container';
      }

      var routeId = event.currentTarget.id;

      event.currentTarget.parentElement.className += ' inner-shadow';

      displayRouteOnMap(routeId);
    });
  }

  //initMap(firstLat ,firstLong, locations);
  function initMap(firstLat ,firstLong, locations) {
    var myLatLng = {lat: firstLat, lng: firstLong};
    var labelIndex = 0;
    var map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLng,
      zoom: 11,
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
      $('#graph').remove(); // this is my <canvas> element
      parseDataCanvas(data.track_points);
    });
  }


  // function getRouteDetails(routeId) {
  //   return $.ajax({
  //     url:  `https://ridewithgps.com/routes/${routeId}.json`,
  //     method: "GET",
  //     dataType: "jsonp"
  //   })
  // };

  function putPathOnMap(trackPoints){
    var paths = [];
    var firstLatLongMaker = {lat:trackPoints[3].y,  lng: trackPoints[3].x}
    var lastLatLongMaker = {lat:trackPoints[trackPoints.length-1].y,  lng: trackPoints[trackPoints.length-1].x};

    for (var i = 3; i < trackPoints.length-4; i++) {
      if (trackPoints[i].y !== undefined && trackPoints[i].x !== undefined){
        paths.push({
            lat:trackPoints[i].y,
            lng: trackPoints[i].x
          });
        // paths.push( new google.maps.LatLng(trackPoints[i].y, trackPoints[i].x))
        }
  }
  createAndAppendSubRoute(firstLatLongMaker, lastLatLongMaker, paths);
}


  function createAndAppendSubRoute(firstLatLongMaker, lastLatLongMaker, paths){
    // Load the Visualization API and the columnchart package.
    google.load('visualization', '1', {callback: 'console.log("working")', packages: ['columnchart']});

    if(window.curBikeLine !== null){
      window.curBikeLine.setMap(null);
      window.marker.setMap(null);
      window.lastMarker.setMap(null);
    }

    addLine();

    function addLine() {
      window.curBikeLine = new google.maps.Polyline({
        path: paths,
        strokeColor: '#fc4c02',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        geodesic: true
      });
      window.curBikeLine.setMap(mapObj.map);

      // window.elevator = new google.maps.ElevationService;
      //
      // window.elevator.getElevationAlongPath({
      //    path: paths,
      //    samples: 10
      //  }, plotElevation);
      }

    addMarkers()

    function addMarkers(){
      window.marker = new google.maps.Marker({
        position: firstLatLongMaker,
        label: "A",
        map: mapObj.map,
        title: 'Hello World!'
      });
      window.lastMarker = new google.maps.Marker({
        position: lastLatLongMaker,
        label: "B",
        map: mapObj.map,
        title: 'Last marker!'
      });
      mapObj.map.setCenter(window.marker.getPosition())
    }

    return window.curBikeLine;
  }

  // function plotElevation(elevations, status){
  //
  //   var chartDiv = document.getElementById('elevation_chart');
  //       if (status !== 'OK') {
  //         chartDiv.className = "hide-chart-error"
  //         // Show the error code inside the chartDiv.
  //         chartDiv.innerHTML = 'Cannot show elevation: request failed because ' +
  //             status;
  //         return;
  //       }
  //       // Create a new chart in the elevation_chart DIV.
  //       var chart = new google.visualization.ColumnChart(chartDiv);
  //
  //       // Extract the data from which to populate the chart.
  //       // Because the samples are equidistant, the 'Sample'
  //       // column here does double duty as distance along the
  //       // X axis.
  //       var data = new google.visualization.DataTable();
  //       data.addColumn('string', 'Sample');
  //       data.addColumn('number', 'Elevation');
  //       for (var i = 0; i < elevations.length; i++) {
  //         data.addRow(['', elevations[i].elevation]);
  //       }
  //
  //       // Draw the chart using the data within its DIV.
  //       chart.draw(data, {
  //         height: 150,
  //         legend: 'none',
  //         titleY: 'Elevation (m)'
  //       });
  //     }


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

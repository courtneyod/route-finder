"use strict"

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

// draw route lines on to google maps
function addLine(paths) {
  window.curBikeLine = new google.maps.Polyline({
    path: paths,
    strokeColor: '#fc4c02',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    geodesic: true
  });
  window.curBikeLine.setMap(mapObj.map);
}

// add Markers to Route
function addMarkers(firstLatLongMaker, lastLatLongMaker){
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

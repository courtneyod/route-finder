"use strict";

function grabFistLatLong(lat, lng, routeContainerObj, routeContainerObjLength, i){
  return $.ajax({
     url:  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyC_9ywy5CNyw82GhC8N3b-7vRgkp-Dpmac`,
     method: "GET"
   })
   .done(function(data){
     let formatedAddress = data.results[0].formatted_address;
     routeContainerObj[i].cityAndState = ((formatedAddress).substring(0, formatedAddress.length - 15));
     renderRideOptions(routeContainerObj[i], routeContainerObjLength)
   })
}

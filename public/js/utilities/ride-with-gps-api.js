"use strict";

function getMatchingRoutes(location, mileRange, maxDistance, minDistance, elevGain, elevMin) {
  location = location.substring(0, location.length - 17)
  return $.ajax({
    url:  `https://ridewithgps.com/find/search.js?search%5Bkeywords%5D=&search%5Bstart_location%5D=${location}&search%5Bstart_distance%5D=${mileRange}&search%5Belevation_max%5D=${elevGain}&search%5Belevation_min%5D=${elevMin}&search%5Blength_max%5D=${maxDistance}&search%5Blength_min%5D=${minDistance}&search%5Boffset%5D=0&search%5Blimit%5D=20&search%5Bsort_by%5D=length+des`,
    method: "GET",
    dataType: "jsonp",
    beforeSend: function(xhr) {
    $("#baconIpsumOutput").html('');
    $.spin('true');

    }
  })
}

function getRouteDetails(routeId) {
  return $.ajax({
    url:  `https://ridewithgps.com/routes/${routeId}.json`,
    method: "GET",
    dataType: "jsonp"
  })
};

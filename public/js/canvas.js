"use strict"

var graph;
var xPadding = 30;
var yPadding = 30;


function parseDataCanvas(dataRoute){
  //console.log(dataRoute, "this is dataRoute")
  var dataR = {values: []};
  for (var i = 3; i < dataRoute.length - 2; i+= 1) {
    if (dataRoute[i].d !== undefined && dataRoute[i].e !== undefined){
    dataR.values.push({
      x: (dataRoute[i].d*(0.000621)).toFixed(1),
      y: (dataRoute[i].e*(3.2808399)).toFixed(1)
    });
  }
  }
  //console.log(dataR, "this is data values")
  drawGraph(dataR)
  return dataR;
};
// var data = parseDataCanvas()



// Returns the max Y value in our data list
  function getMaxY(data) {
      var max = 0;
      console.log(data, "for max loop", data.values.length)

      var possibleMaxNumbers = data.values.map(function(cur){
        return cur.y
      })
      max = Math.max.apply(null, possibleMaxNumbers)

      // for(var i = 0; i < data.values.length; i ++) {
      //     if(data.values[i].y > max) {
      //         max = data.values[i].y;
      //     }
      // }

      console.log(max, "this is the max")
      return max;
  }

  // Return the x pixel for a graph point
  function getXPixel(val, data) {
      return ((graph.width() - xPadding) / data.values.length) * val + (xPadding * 1.5);
  }

  // Return the y pixel for a graph point
  function getYPixel(val, data, maxY) {
      return graph.height() - (((graph.height() - yPadding) / maxY) * val) - yPadding;
  }

function drawGraph(data){
    var graphContainerDiv = $('.graph-container');
    graphContainerDiv.append('<canvas id="graph" width="900" height="400" style="border:1px solid #ccc; padding: 10px;"></canvas>');
    //console.log(data.values, "hihihihih")
    graph = $('#graph');
    //console.log(graph)
    var context = graph[0].getContext('2d');

    context.lineWidth = 2;
    context.strokeStyle = '#333';
    context.font = 'italic 8pt sans-serif';
    context.textAlign = "center";

    // Draw the axises
    context.beginPath();
    context.moveTo(xPadding, 0);
    context.lineTo(xPadding, graph.height() - yPadding);
    context.lineTo(graph.width(), graph.height() - yPadding);
    context.stroke();

    // Draw the X value texts
    for(var i = 0; i < data.values.length; i += 500) {
        context.fillText(data.values[i].x, getXPixel(i, data), graph.height() - yPadding + 20);
    }

    // Draw the Y value texts
    context.textAlign = "right"
    context.textBaseline = "middle";
    var maxY = getMaxY(data)
    for(var i = 0; i < maxY; i += 100) {
        context.fillText(i, xPadding - 10, getYPixel(i, data, maxY) );
    }

    context.strokeStyle = '#f00';

    // Draw the line graph
    context.beginPath();
    context.moveTo(getXPixel(0, data), getYPixel(data.values[0].y, data, maxY));
    for(var i = 1; i < data.values.length; i ++) {
        context.lineTo(getXPixel(i, data), getYPixel(data.values[i].y, data, maxY));
    }
    context.stroke();

    // Draw the dots
    context.fillStyle = '#333';

    for(var i = 0; i < data.values.length; i ++) {
        context.beginPath();
        context.arc(getXPixel(i, data), getYPixel(data.values[i].y, data, maxY), 4, 0, Math.PI * 2, true);
        context.fill();
    }
}

"use strict"


// canvasContext();
// function canvasContext() {
//     var canvas = document.getElementById("graph");
//     //console.log(graph, "hi")
//     var context = canvas.getContext('2d');
//     console.log(context)
//     context.fillStyle = "#FF0000";
//     context.fillRect(0,0,200,300);
// };

var graph;
var xPadding = 30;
var yPadding = 30;


function parseDataCanvas(dataRoute){
  console.log(dataRoute)
  var dataR = {values: []};
  for (var i = 3; i < dataRoute.length - 300; i+= 100) {
    if (dataRoute[i].d !== undefined && dataRoute[i].e !== undefined){
    dataR.values.push({
      x: (dataRoute[i].d*(0.000621)).toFixed(1),
      y: (dataRoute[i].e*(3.2808399)).toFixed(1)
    });
  }
  }
  console.log(dataR, "this is data values")
  drawGraph(dataR)
  return dataR;
};
// var data = parseDataCanvas()



// Returns the max Y value in our data list
  function getMaxY(data) {
      var max = 0;

      for(var i = 0; i < data.values.length; i ++) {
          if(data.values[i].y > max) {
              max = data.values[i].y;
          }
      }

      max += 10 - max % 10;
      return max;
    }

    // Return the x pixel for a graph point
    function getXPixel(val, data) {
        return ((graph.width() - xPadding) / data.values.length) * val + (xPadding * 1.5);
    }

    // Return the y pixel for a graph point
    function getYPixel(val, data) {
        return graph.height() - (((graph.height() - yPadding) / getMaxY(data)) * val) - yPadding;
    }

function drawGraph(data){
    var graphContainerDiv = $('.graph-container');
    graphContainerDiv.append('<canvas id="graph" width="900" height="100" style="border:1px solid #ccc; padding: 10px;"></canvas>');
    console.log(data.values, "hihihihih")
    graph = $('#graph');
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
    for(var i = 0; i < data.values.length; i ++) {
        context.fillText(data.values[i].x, getXPixel(i, data), graph.height() - yPadding + 20);
    }

    // Draw the Y value texts
    context.textAlign = "right"
    context.textBaseline = "middle";

    for(var i = 0; i < getMaxY(data); i += 10) {
        context.fillText(i, xPadding - 10, getYPixel(i, data));
    }

    context.strokeStyle = '#f00';

    // Draw the line graph
    context.beginPath();
    context.moveTo(getXPixel(0, data), getYPixel(data.values[0].y, data));
    for(var i = 1; i < data.values.length; i ++) {
        context.lineTo(getXPixel(i, data), getYPixel(data.values[i].y, data));
    }
    context.stroke();

    // Draw the dots
    context.fillStyle = '#333';

    for(var i = 0; i < data.values.length; i ++) {
        context.beginPath();
        context.arc(getXPixel(i, data), getYPixel(data.values[i].y, data), 4, 0, Math.PI * 2, true);
        context.fill();
    }
}

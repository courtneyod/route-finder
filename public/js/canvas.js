"use strict"

var graph;
var xPadding = 30;
var yPadding = 30;


function parseDataCanvas(dataRoute){
  let dataR = {values: []};
  let minE = getMaxX(dataRoute);

  for (var i = 3; i < dataRoute.length - 2; i+= 1) {
    if (dataRoute[i].d !== undefined && dataRoute[i].e !== undefined){
    dataR.values.push({
      x: (dataRoute[i].d*(0.000621)).toFixed(1),
      y: ((dataRoute[i].e - minE)*(3.2808399)).toFixed(1)
    });
  }
  }
  drawGraph(dataR)
  return dataR;
};

// Returns the min X value in our data list
function getMaxX(data){
  let min = 0;
  let possibleMinNumbers = data.map(function(cur){
    return cur.e;
  });
  min = Math.min.apply(null, possibleMinNumbers);
  return min;
}

// Returns the max Y value in our data list
  function getMaxY(data) {
      let max = 0;
      let possibleMaxNumbers = data.values.map(function(cur){
        return cur.y;
      })
      max = Math.max.apply(null, possibleMaxNumbers);
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
    graphContainerDiv.append('<canvas id="graph" width="1000" height="400" style="border:1px solid #ccc; padding: 10px;"></canvas>');
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
    for(var i = 0; i < data.values.length; i += 500) {
        context.fillText(data.values[i].x, getXPixel(i, data), graph.height() - yPadding + 20);
    }

    // Draw the Y value texts
    context.textAlign = "right"
    context.textBaseline = "top";
    var maxY = getMaxY(data);
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
}

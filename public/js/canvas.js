"use strict"

function canvasContext() {
    graph = document.GetElementById("graph");
    console.log(graph, "hi")
    var c = graph.getContext('2d');
};

var graph;
var xPadding = 30;
var yPadding = 30;

function canvas(arg){
  console.log(arg)
}

function parseData(routeDetails) {

}
var data = { values:[
        { X: "Jan", Y: 12 },
        { X: "Feb", Y: 28 },
        { X: "Mar", Y: 18 },
        { X: "Apr", Y: 34 },
        { X: "May", Y: 40 },
]};

function getMaxY(routeData) {
    var max = 0;

    for(var i = 0; i < routeData.length; i ++) {
        if(routeData[i].e > max) {
            max = routeData[i].e;
        }
    }

    maxY += 10 - max % 10;
    return maxY;
}

function getXPixel(routeData, maxX) {
    return ((graph.width() - 10) / routeData.length) * maxX + (10 * 1.5);
}

function getYPixel(routeData, maxY) {
    return graph.height() - (((graph.height() - 10) / getMaxY()) * maxY) - 10;
}

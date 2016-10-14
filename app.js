"use strict"
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/public', express.static('public'))

app.get('/', function(request, response){
  response.sendFile(__dirname + '/public/index.html')
})

app.listen(PORT, function(){
  console.log(`Listening on ${PORT} port`)
})

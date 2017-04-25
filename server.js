// Express initialization
var express = require('express');
var app = express();

app.get('/', function (request, response) {
  response.set('Content-Type', 'text/html');
  response.send('<p>Hey, it works!</p>');
});

app.listen(process.env.PORT || 3000);

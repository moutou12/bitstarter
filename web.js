var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.logger());

var buffer = new Buffer(fs.readFileSync('index.html','utf-8'), 'utf-8');
var textout = buffer.toString('utf-8');
app.get('/', function(request, response) {
  response.send(textout);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});

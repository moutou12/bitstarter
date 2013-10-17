var express = require('express');
var app = express();

app.use(express.logger());

var buffer = new Buffer(fs.readFileSync('indoex.html','utf-8'), 'utf-8');
var textout = buffer.toString('utf-8');
app.get('/', function(request, response) {
  response.send(textout);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

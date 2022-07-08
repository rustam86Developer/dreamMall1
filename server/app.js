var express = require('express');  
var app = express();  
app.get('/', function (req, res) {  
    console.log("home");
  res.send('Welcome to JavaTpoint!');  
});  
app.get('/enroll-ment', function (req, res) {  
    console.log("about",req.body,req.query);
    res.status(200)
    // res.send('about');  
});  
var server = app.listen(8000, function () {  
  var host = server.address().address;  
  var port = server.address().port;  
  console.log('Example app listening at http://%s:%s', host, port);  
});  
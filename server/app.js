// const config = require('./config/config.js');
const commonController = require('./controller/common.js');
var express = require('express');  
var app = express();  

app.use((request, response, next) => {
    if (request.get('x-amz-sns-message-type')) {
        request.headers['Content-Type'] = 'application/json';
    }

    response.header("Access-Control-Allow-Origin", "*"); // allow request from all origin
    response.header(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    response.header(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization, refreshToken"
    );
    // response.header("Content-Type: application/json", true);
    next();
})
app.get('/', function (req, res) {  
    console.log("home");
  res.send('Welcome to JavaTpoint!');  
});  
app.get('/enroll-ment', commonController.getData);  
app.get('/place-bit', commonController.placeBit);  
app.get('/login', commonController.login);  

var server = app.listen(8000, function () {  
  var host = server.address().address;  
  var port = server.address().port;  
  console.log('Example app listening at http://%s:%s', host, port);  
});  
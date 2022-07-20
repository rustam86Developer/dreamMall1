const commonDao = require('../dao/common.js');
// const SendOtp = require('sendotp');
var TMClient = require('textmagic-rest-client');

module.exports.getData = async function(req, res) {
    try {
        console.log("eeeeeeeeeeee",req.body,req.query);
        let kh = await commonDao.getData(req.query);
        console.log("44444444444444",kh);
        res.status(200).json({data: kh})
    } catch (error) {
        console.log("error",error);
    }
}

module.exports.placeBit = async function(req, res) {
    try {
        console.log("eeeeeeeeeeee",req.body,req.query);
        let kh = await commonDao.placeBit(req.query);
        console.log("44444444444444",kh);
        res.status(200).json({data: kh})
    } catch (error) {
        console.log("error",error);
    }
}

module.exports.login = async function(req, res) {
    try {
        console.log("eeeeeeeeeeee",req.body,req.query);
        let kh = await commonDao.getEmailPass(req.query);
        console.log("2222222",kh);
        res.status(200).json({data: kh})
    } catch (error) {
        console.log("error",error);
    }
}

const sendOtp = async function() {
    try {
        console.log("eeeeeeeeeeee");
        var c = new TMClient('username', 'C7XDKZOQZo6HvhJwtUw0MBcslfqwtp4');
        c.Messages.send({text: 'test message', phones:'9990001'}, function(err, res){
            console.log('Messages.send()', err, res);
        });    } catch (error) {
        console.log("error",error);
    }
}
sendOtp()

const commonDao = require('../dao/common.js')
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
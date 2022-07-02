
const model = require('../../models');
var sequelize = require('sequelize');
const constants = require('../../helper/utilities/constants');
const moment = require('moment');
exports.checkIfIsvApiKeyExists = function (apiKey) {
    return model.Partner.findOne({ where: { apiKey: apiKey } })
}

exports.insertIsvClientTemporaryData = function (data) {
    return model.IsvTempRegistration.create(data)
}

exports.isvClientHasTempData = function (clientToken) {
    return model.IsvTempRegistration.findOne({ where: { token: clientToken }, attributes: ['partnerId'] })
}

exports.isvClientHasEnrolled = function (clientToken) {
    return model.IsvEnrollStatus.findOne({ where: { token: clientToken }, attributes: ['id','clientId','partnerId'] })
}

exports.getClientStatus = function (clientId) {
    return model.Client.findOne({ where: { id: clientId }, attributes: ['statusId'] })
}


exports.updateIsvCallbackEndpoints = function (body, partnerId) {
    return model.IsvCallback.update({
        enrollStatusUrl: body.enroll_status_url,
        alertUrl: body.notification_url,
        callbackApiKey: body.api_key
    }, { where: { partnerId: partnerId } })
}

exports.createIsvCallbackEndpoints = function (body, partnerId) {
    return model.IsvCallback.create({
        partnerId: partnerId,
        enrollStatusUrl: body.enroll_status_url,
        alertUrl: body.notification_url,
        callbackApiKey: body.api_key
    }, { where: { partnerId: partnerId } })
}

exports.isvEndpointsExists = function (partnerId) {
    return model.IsvCallback.findOne({ where: { partnerId: partnerId }, attributes: ['id'] })
}

exports.getBorrowerInfoByParameters = function (params) {
    return model.BorrowerDatabase.findOne({
        where: {
            firstName: params.first_name,
            lastName: params.last_name,
            ssn: params.ssn,
            address: params.address,
            email: params.email,
            phoneNumber: params.phone_number,
            clientId: params.clientId
        },
        attributes: ['id']
    });
}


exports.getClientsByPartnerId = function(partnerId) {
  
    return model.IsvEnrollStatus.findAll({
        where: { partnerId:partnerId}
    })
    
   
}

exports.getBorrowersByClientId =async function(clientIds) {

    let clientDataObj=[];
    let count = await model.BorrowerDatabase.count({ where: { clientId: clientIds } });
    let noOfAlerts = Math.round((count * 2) / 100);
    data = [];
    data = await model.BorrowerDatabase.findAll({
        where:{
            clientId:clientIds
        },
        limit:noOfAlerts,
        order: [
            sequelize.fn( 'RAND' ),
          ]

    });
  
    for(i=0;i<data.length;i++){
        let isvToken = await model.IsvEnrollStatus.findOne({where:{clientId:data[i].clientId}},{attributes:['token']});
        clientDataObj[i] = {
           
           name: data[i].firstName + ' ' + data[i].lastName,
           first_name : data[i].firstName,
           last_name : data[i].lastName,
           phone_number : data[i].phoneNumber,
           address : data[i].address, 
           city : data[i].city,
           state : data[i].state, 
           zip_code : data[i].zipCode,
           ssn : data[i].ssn, 
           email : data[i].email, 
           broker_email : data[i].brokerLoEmail, 
           client_token : isvToken.token,
           alert_date : moment().format('YYYY-MM-DD') 
         
       }
   }
   
  
    return clientDataObj

 
}

exports.getIsvCallback = async function(partnerId) {
    
    return model.IsvCallback.findOne({where:{
            partnerId:partnerId
     }})
     
}

exports.createSelfPull = function (selfPull) {
    return model.SelfPull.create(selfPull)
}

exports.deleteIsvClientBorrower = function (id) {
    return model.BorrowerDatabase.update({ statusId: constants.status.TO_DELETE }, { where: { id: id } })
}

exports.updateClientStatus = function(statusId,clientId){

    return model.Client.update({statusId:statusId},{where:{
        id:clientId 
    }})
}

exports.getStatesForIsv = function(){
    return model.State.findAll({attributes:['id','stateName']});
}

exports.getCitiesForIsv = function(stateId){
    return model.City.findAll({attributes: ['id','city'],where:{stateId:stateId}});
}

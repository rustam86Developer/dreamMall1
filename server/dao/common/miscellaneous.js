const model = require('../../models');
const sequelize = require('sequelize');
Op = sequelize.Op;

// find all states 
module.exports.getState = async function (keyword) {
  
    if (keyword == "ALL") {
        var getState = await model.State.findAll({})
    }
    else {
        var getState = await model.State.findAll(
            {
                where: {
                    stateName: { [Op.like]: keyword + '%' }
                }
            }
        )
    }
    return getState
}

//find all cities
module.exports.getCity = async function (cityObj) {
  
    if (cityObj.keyword == "ALL") {
        var getCity = await model.City.findAll({ where: { stateId: cityObj.stateId } })
    }
    else {
        var getCity = await model.City.findAll({ where: { stateId: cityObj.stateId, city: { [Op.like]: cityObj.keyword + '%' } } })
    }
    return getCity
}

/**
 *  GET STATE ID
 */
exports.getStateId = async function (stateName) {
    const stateInfo = await model.State.findOne({ where: { stateName: stateName } })
    if (!stateInfo) {
        return false
    }
    else {
        return stateInfo.dataValues.id
    }

}

/**
 *  GET CITY ID
 *  IF CITY IS NOT EXIST IN DB THEN CREATE 
 */
exports.getCityId = async function (data) {
    const cityInfo = await model.City.findOne({ where: { city: data.city } })

    if (!cityInfo) {
        let cityId = await model.City.create(data)
        return cityId.id
    }
    else {
        return cityInfo.id
    }

}
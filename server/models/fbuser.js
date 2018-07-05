const mongoose = require('mongoose')
const config = require('../config/database')

const fbUSerSchema = mongoose.Schema({
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    pic: {
        type: String,
        require: true,
    },
    locale: {
        type: String,
        require: true
    },
    timezone: {
        type: String,
        require: true,
    },
    gender: {
        type: String,
        require: true,
    },
    appId:{
        type:String,
        require: true
    },
    botId:{
        type:String,
        require: true
    }
});
var fbuserModel = mongoose.model('fbuser', fbUSerSchema)
module.exports.getAllFbUser = (botID,cb)=>{
    fbuserModel.find( {botId:botID},cb)
}

module.exports.getFbUser = (botID,userId,cb)=>{
    fbuserModel.find( {botId:botID,_id:userId},cb)
}
module.exports.getFbUserByAppId = (botId,appId,cb)=>{
    fbuserModel.find({botId,appId},cb)
}
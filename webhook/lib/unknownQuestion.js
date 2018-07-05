var request = require('request')
var db = require('../config/database')
//var config = require('../config/config')
var mongoose = require('mongoose')

mongoose.connect(db.db)

const unknownSchema = mongoose.Schema({
    question: {
        type: String,
        require: true
    },
    botId:{
        type: String,
        require: true
    },
    appId:{
        type: String,
        require: true
    }
});
var unknowModel = mongoose.model('unknown', unknownSchema)

module.exports.addUnknown = (userId,botId,unknown)=>{
    let unknownQ = {
        question:unknown,
        botId:botId,
        appId:userId
    }
    unknowModel.create(unknownQ,(err,unknown)=>{
        if(err){
            console.log(err)
        }
    })
}


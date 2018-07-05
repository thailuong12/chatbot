

var request = require('request')
var db = require('../config/database')
//var config = require('../config/config')
var mongoose = require('mongoose')

const botSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        require: true
    },
    botId: {
        type: String,
        require: true,
    },
    botNumber: {
        type: Number,
        unique: true,
        require: true,
    },
    // Knowledge Base
    kbId: {
        type: String,
        require: true,
    },
    subscriptionKey: {
        type: String,
        require: true,
    },
    serviceGuid: {
        type: String,
        require: true,
    },
    // Facebook settings
    fbToken: {
        type: String,
    },
    appSecret: {
        type: String,
    }
});

mongoose.connect(db.db)

var botModel = mongoose.model('bots', botSchema)
const Bot = module.exports = botModel;

module.exports.botInfo = (botId,cb)=>{
    Bot.findById(botId,cb)
}


const mongoose = require('mongoose')
const config = require('../config/database')

// Bot model---------------------------------------------------------------------------------------------------------------------------------
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
    // Knowledge Base
    kbId: {
        type: String,
        require: true,
    },
    subscriptionKey: {
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

var botModel = mongoose.model('bots', botSchema)
const Bot = module.exports = botModel;

module.exports.getBotByNum = (number, cb) => {
    Bot.find({ botNumber: number })
}
module.exports.getAllBot = (cb) => {
    Bot.find(cb)
}
module.exports.getBot = (botId, cb) => {
    Bot.findOne({ _id: botId }, cb)
}
module.exports.addBot = function (name, kbId, subscriptionKey,fbToken,appSecret, callback) {
    let newBot = {
        name,
        kbId,
        subscriptionKey,
        fbToken,
        appSecret
    }
    Bot.create(newBot , callback)
}
module.exports.editBotFBS = (botID, fbToken,appSecret, cb) => {
    Bot.findByIdAndUpdate(botID, { "fbToken": fbToken,"appSecret":appSecret }, (err, bot) => {
        if (err) {
            return cb(false)
        }
        return cb(true)
    })
}
module.exports.editBotName = (botID, newName, cb) => {
    Bot.findByIdAndUpdate(botID, { "name": newName }, (err, bot) => {
        if (err) {
            return cb(false)
        }
        return cb(true)
    })
}
module.exports.deleteBot = (botId, kbId, cb) => {
    Bot.remove({_id: botId} , (err, bot) => {
        if (err) {

            return cb(false)
        }
        return cb(true)
    })
}

const mongoose = require('mongoose')
const config = require('../config/database')
const {
    MessengerClient
} = require('messaging-api-messenger');
const blockSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    botID: {
        type: String,
        require: true
    },
    plugin: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true
    },
    flow: {
        type: Array,
        require: true,
    }
});

var blockModel = mongoose.model('payload', blockSchema)
//const block = module.exports = blockModel
module.exports.getAllBlock = (botID, cb) => {
    blockModel.find({ botID: botID }, cb)
}
module.exports.getOneBlock = (blockID, cb) => {
    blockModel.findOne({ _id: blockID }, cb)
}
module.exports.deleteBlock = (botId, blockId, cb) => {
    blockModel.remove({ botID: botId, _id: blockId }, (err, block) => {
        if (err) {
            return cb(false)
        }
        return cb(true)
    })
}
module.exports.editBlockName = (blockID, botID, newName, cb) => {
    blockModel.findByIdAndUpdate(blockID, { "name": newName }, (err, block) => {
        if (err) {
            return cb(false)
        }
        else {

            return cb(true)



        }
    })
}
module.exports.addIdolBlock = (newIdol, cb) => {
    blockModel.create(newIdol, (err, block) => {
        if (err) {
            return cb(false)
        }
        return cb(true)

    })
}
module.exports.addTeamBlock = (newTeam, cb) => {
    blockModel.create(newTeam, (err, block) => {
        if (err) {
            return cb(false)
        }
        return cb(true)
    })
}
module.exports.editBlockText = (blockID, flowStt, newText, cb) => {
    let query = "flow." + flowStt + ".text"
    let obj = {}
    obj[query] = newText
    blockModel.findByIdAndUpdate(blockID, obj, (err, block) => {
        if (err) {
            return cb(false)
        }
        return cb(true)
    })
}
module.exports.getBlockByPlugin = (botId, plugin, cb) => {

    blockModel.find({ $and: [{ "botID": botId }, { "plugin": plugin }] }, cb)
}
module.exports.addSurveyBlock = (survey, cb) => {
    blockModel.create(survey, (err, block) => {
        if (err) {
            return cb(false)
        }
        return cb(true)
    })
}
module.exports.editBlockIdol = (blockID, flowStt, url, delToken, cb) => {
    let editUrl = "flow." + flowStt + ".url"
    let editToken = "flow." + flowStt + ".delToken"
    let obj = {}
    obj[editUrl] = url
    obj[editToken] = delToken
    blockModel.findByIdAndUpdate(blockID, obj, (err, block) => {

        if (err) {
            console.log(err)
            return cb(false)
        }
        return cb(true)
    })
}

module.exports.getBlockIdByName = (botId, blockName, cb) => {
    blockModel.findOne({ "name": blockName }, cb)
}
module.exports.addQuickReply = (blockID, quickReply, cb) => {
    blockModel.findByIdAndUpdate(blockID, { $push: { 'flow.0.quickreplies': quickReply } }, (err, block) => {
        if (err) {
            return cb(false)
        }
        return cb(true)
    })
}
module.exports.addBroadCastQuickReply = (blockID, quickReply, cb) => {
    blockModel.findByIdAndUpdate(blockID, { $push: { 'flow.0.quickreplies': quickReply } }, (err, block) => {
        if (err) {
            return cb(false)
        }
        return cb(true)
    })
}
module.exports.addBlockForBroadCastQuickReply = (newBlock, cb) => {
    blockModel.create(newBlock, cb)
}
module.exports.deleteQuickReply = (blockID, quickReplyID, cb) => {

    blockModel.findByIdAndUpdate(blockID, { $pull: { 'flow.0.quickreplies': { '_id': mongoose.mongo.ObjectID(quickReplyID) } } }, (err, block) => {
        if (err) {
            return cb(false)
        }

        return cb(true)
    })

}
module.exports.addNews = (blockID, art, cb) => {
    blockModel.findByIdAndUpdate(blockID, { $push: { 'flow.0.elements': art } }, (err, block) => {
        if (err) {
            return cb(false)

        }
        return cb(true)
    })
}
module.exports.deleteNews = (blockID, newsID, cb) => {
    blockModel.update({ "_id": blockID }, { $pull: { "flow.0.elements": { "_id": mongoose.mongo.ObjectID(newsID) } } }, { safe: true, multi: true }, (err, block) => {
        if (err) {
            return cb(false)

        }


        return cb(true)
    })
}

// broadcast
module.exports.sendSurvey = (fbToken, blockId, cb) => {
    var client = MessengerClient.connect(fbToken)
    blockModel.find({ _id: blockId }, (err, block) => {
        if (err) {
            console.log(err)
        }
        else {
            let quick = []
            for (let j = 0; j < block[0].flow[0].quickreplies.length; j++) {
                let copy = Object.assign({}, block[0].flow[0].quickreplies[j])
                delete copy._id
                delete copy.payLoadId
                quick.push(copy)
            }
            client
                .createMessageCreative([
                    {

                        "text": block[0].flow[0].text,
                        "quick_replies": quick

                    },
                ])
                .then(result => {
                    client.sendBroadcastMessage(result.message_creative_id).then(a => {
                        console.log(a);
                    });
                });

        }
    })
}
module.exports.deleteSurveyBlock = (botId, blockId, cb) => {
    blockModel.remove({ botID: botId, _id: blockId }, (err, block) => {
        if (err) {
            return cb(false)
        }
        return cb(true)
    })
}
module.exports.editGalaryTitle = (botId, blockId,newtitle, stt,cb) => {
    let query = "flow.0.elements." + stt + ".title"
    let obj = {}
    obj[query] = newtitle
    blockModel.findOneAndUpdate({ botID: botId, _id: blockId },obj,(err, block) => {
        if (err) {
            return cb(false)
        }
        return cb(true)
    })
}
module.exports.editGalarySubTitle = (botId, blockId,newsubtitle, stt,cb) => {
    let query = "flow.0.elements." + stt + ".subtitle"
    let obj = {}
    obj[query] = newsubtitle
    blockModel.findOneAndUpdate({ botID: botId, _id: blockId },obj,(err, block) => {
        if (err) {
            return cb(false)
        }
        return cb(true)
    })
}
module.exports.editGalaryImg = (botId, blockId,img,delToken, stt,cb) => {
    let query1 = "flow.0.elements." + stt + ".image_url"
    let query2 = "flow.0.elements." + stt + ".delToken"
    
    let obj = {}
    obj[query1] = img
    obj[query2] = delToken
    
    blockModel.findOneAndUpdate({ botID: botId, _id: blockId },obj,(err, block) => {
        if (err) {
            return cb(false)
        }
        return cb(true)
    })
}




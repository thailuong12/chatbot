var request = require('request')
var db = require('../config/database')
//var config = require('../config/config')
var mongoose = require('mongoose')

const {
    MessengerClient
} = require('messaging-api-messenger');




mongoose.connect(db.db)
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
    appId: {
        type: String,
        require: true
    },
    firstInter:{
        type: Object
    }
    ,
    activities: {
        type: Array
    },
    botId: {
        type: String
    },
    logChat: {
        type: Array
    },
  
});

var fbUSerModel = mongoose.model('fbuser', fbUSerSchema)

module.exports.checkUserExistAndAdd = (senderId, token,botId) => {
  //  console.log(botId)
    fbUSerModel.find({ appId: senderId, botId: botId }, (err, user) => {
        if (err) {
            console.log(err)
        } else {
            if (user.length == 0) {
                addUser(senderId, token,botId)

            }


        }


    })
}
module.exports.editVoting = (senderId, botId,voted) => {
    let query = "activities.0.voting"
    let obj = {}
    obj[query] = voted
    console.log(voted)
    fbUSerModel.findOneAndUpdate({ 'appId': senderId,'botId':botId }, obj, (err, user) => {
        if (err) {
            console.log(err)
        }

    })
}
module.exports.editFansign = (senderId, botId,idol) => {
    let query = "activities.0.fansign"
    let obj = {}
    obj[query] = idol

    fbUSerModel.findOneAndUpdate({ 'appId': senderId,'botId':botId }, obj, (err, user) => {
        if (err) {
            console.log(err)
        }


    })
}
var addUser = (appId, token,botId, cb) => {
    const client = MessengerClient.connect(token);
    let d = new Date();
    let newDate = new Date();
    Date.prototype.month = function () {
        return  (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1)
    }
    Date.prototype.year = function () {
        return  ( (this.getFullYear())) ;
    }
    client.getUserProfile(appId).then(user => {
        console.log(newDate.month, newDate.year)
        var fbUser = {
            firstname: user.first_name,
            lastname: user.last_name,
            pic: user.profile_pic,
            locale: user.locale,
            timezone: user.timezone,
            gender: user.gender,
            appId: appId,
            firstInter:{
                month : newDate.month(),
                year : newDate.year()
            },
            activities:[],
            logChat:[],
            botId: botId
        }
        fbUSerModel.create(fbUser, (err, user) => {
            if (err) {
                console.log(err)
            }

        })
    });
}
module.exports.apendLogChat = (appId, botId, userChat,botChat) => {
    let d = new Date();
    let newDate = new Date();
    Date.prototype.today = function () {
        return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
    }
    Date.prototype.timeNow = function () {
        return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
    }
    let datetime = newDate.today() + "  " + newDate.timeNow();
    fbUSerModel.findOneAndUpdate({ "appId": appId, "botId": botId }, { $push: { "logChat": { "chat": userChat, "time": datetime,"botChat":botChat } } }, (err, user) => {
        if (err) {
            console.log(err)
        }
    })
}

module.exports.addSurvey=(appId,botId,survey)=>{
   
    let d = new Date();
    let newDate = new Date();
    Date.prototype.today = function () {
        return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
    }
    Date.prototype.timeNow = function () {
        return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
    }
    let datetime = newDate.today() + "  " + newDate.timeNow();
    fbUSerModel.findOneAndUpdate({"appId":appId,"botId":botId},{$push:{"activities.0.survey":{"time":datetime,"result":survey}}},(err,user)=>{
            if(err){
                console.log(err)
            }
            else{
               // console.log(user)
            }
    })

}
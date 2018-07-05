var {
    MessengerClient
} = require('messaging-api-messenger');
//var config = require('../config/config')
var fs = require('fs');
var request = require('request')
var db = require('../config/database')

var mongo = require('mongoose')

//
var gm = require('gm')

//


var handlingPayload = require('../message/payloads')
mongo.connect(db.db)
// khai bao model
var homeModel = mongo.model('home', mongo.Schema())
var menuModel = mongo.model('menu', mongo.Schema())
var payloadModel = mongo.model('payload', mongo.Schema())
// function payload
module.exports = {
    processPayload(payload,botId ,fb_token,userID) {
      //  console.log(payload)
        const client = MessengerClient.connect(fb_token);
        // lay data tu bang payload de xu ly
        payloadModel.findOne({
            'name': payload,
            'botID':botId
        }).lean().exec((err, data) => {
           // console.log(data)
            if (err) {
                console.log(err)
            } else {
                // xet xem trong playload co bao nhieu kich ban
                if (data && data.flow.length > 0) {
                    // lấy một số thông tin cơ bản của người dùng (tên, họ, giới tính)
                    client.getUserProfile(userID).then(user => {
                      // console.log(userID)
                        for (let i = 0; i < data.flow.length; i++) {
                            // xu ly tung kich ban
                            switch (data.flow[i].type) {
                                case "template":
                                    setTimeout(() => {
                                        handlingPayload.sendTemplate(data.flow[i], data,fb_token,userID, user)                                      
                                    }, 1500);
                                    break
                                case "gallery":
                                    handlingPayload.sendGallery(data.flow[i].elements,fb_token,userID)
                                    break
                                case "quickreplies":
                                    handlingPayload.sendQuickReplies(data.flow[i], fb_token,userID, user)
                                    break
                                case "image":
                                    handlingPayload.sendImage(data.flow[i].url, data,fb_token,userID,user)
                                    break
                                case "text":
                                    handlingPayload.sendText(data.flow[i].text,data, fb_token,userID, user)
                                    break                                               
                            }
                        }
                    })
                }
            }
        })
    },
    setMenu() {
        menuModel.find().lean().exec((err, data) => {
            var menu = [];
            for (let i = 0; i < data.length; i++) {
                menu.push({
                    title: data[i].title,
                    type: data[i].type,
                    payload: data[i].payload
                })
            }
            client.setPersistentMenu([{
                locale: 'default',
                call_to_actions: menu
            }, ]);
        })
    }
}



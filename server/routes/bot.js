const express = require('express')
const router = express.Router();
const botConfig = require('../models/bot')
const blockModel = require('../models/block')

const jwt = require('jsonwebtoken')
const passport = require('passport')
const config = require('../config/database')
const mongo = require('mongoose')
const article = require('article')
const request = require('request')
const qna = require('../config/qna')
const configkModel = require('../models/configure')
var baseQnaUrl = "https://westus.api.cognitive.microsoft.com/qnamaker/v2.0"
router.get('/getAllBot', (req, res) => {
    botConfig.getAllBot((err, bots) => {
        if (err) {
            res.json({ success: false, message: err });
        }
        else {
            res.json({ success: true, bots: bots });
        }
    })
})

router.get('/getBot/:botId', (req, res) => {
    let botId = req.params.botId

    botConfig.getBot(botId, (err, bots) => {
        if (err) {
            res.json({ success: false, message: err });
        }
        else {
            res.json({ success: true, bots: bots });
        }
    })
})
router.post('/addBot', async (req, res) => {
    if (!req.body.name) {
        res.json({
            success: false,
            message: "You must provide a name"
        });
    } else {
        request({
            url: baseQnaUrl + '/knowledgebases/create',
            method: 'POST',
            json: true,
            body: { name: req.body.name },
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': qna.SubscriptionKey,
            }
        }, function (error, response, body) {

            let kbId = body.kbId;
            let name = req.body.name;
            let subscriptionKey = qna.SubscriptionKey;
            let fbToken = "";
            let appSecret = "";

            botConfig.addBot(name, kbId, subscriptionKey, fbToken, appSecret, (err, bot) => {
                if (err) {
                    res.json({
                        success: false,
                        message: "Could not save bots. Error: "
                    });

                } else {
                    listDefaulBlock = [
                        {

                            "name": "Chọn Idol",
                            "plugin": "fansign",
                            "botID": bot._id,
                            "flow": [
                                {
                                    "_id": mongo.Types.ObjectId()
                                    ,
                                    "type": "quickreplies",
                                    "text": "",
                                    "quickreplies": []
                                }
                            ],

                        },
                        {
                            "name": "Xem tin tức",
                            "plugin": "news",
                            "botID": bot._id,
                            "flow": [
                                {
                                    "_id": mongo.Types.ObjectId(),
                                    "type": "gallery",
                                    "elements": [
                                    ]
                                }
                            ]
                        },
                        {

                            "name": "Tham Gia Dự Đoán",
                            "plugin": "minigame",
                            "botID": bot._id,
                            "flow": [
                                {
                                    "_id": mongo.Types.ObjectId(),
                                    "type": "quickreplies",
                                    "text": "",
                                    "quickreplies": [

                                    ]
                                }
                            ]
                        },
                        {
                            "name": "home",
                            "plugin": "home",
                            "botID": bot._id,
                            "flow": [
                                {
                                    "_id": mongo.Types.ObjectId(),

                                    "type": "gallery",
                                    "elements": [
                                        {
                                            "_id": mongo.Types.ObjectId(),
                                            "title": "Fansign",
                                            "subtitle": "Cùng đón nhận những lời chúc từ các huấn luyện viên Nào !!",
                                            "delToken": "",
                                            "image_url": "https://i.ytimg.com/vi/5iTAPJw8Wm0/maxresdefault.jpg",
                                            "buttons": [
                                                {
                                                    "_id": mongo.Types.ObjectId(),
                                                    "type": "postback",
                                                    "payload": "Chọn Idol",
                                                    "title": "Nhận Fansign"
                                                }
                                            ]
                                        },
                                        {
                                            "_id": mongo.Types.ObjectId(),
                                            "title": "Tin tức mới nhất từ chương trình ",
                                            "subtitle": "Nơi cập nhật tin tức mới nhất từ chương trình ",
                                            "delToken": "",
                                            "image_url": "https://res.cloudinary.com/asdasdasdasdasd/image/upload/v1517637938/iqxiefw0aogf7e565ypv.jpg",
                                            "buttons": [
                                                {
                                                    "_id": mongo.Types.ObjectId(),
                                                    "type": "postback",
                                                    "payload": "Xem tin tức",
                                                    "title": "Xem Tin Tức"
                                                },
                                                {
                                                    "_id": mongo.Types.ObjectId(),
                                                    "type": "postback",
                                                    "payload": "theodoitintuc",
                                                    "title": "Theo Dõi Tin Tức"
                                                }
                                            ]
                                        },
                                        {
                                            "_id": mongo.Types.ObjectId(),
                                            "title": "Video Full | The Voice Kids 2018",
                                            "subtitle": "Xem lại các tập",
                                            "delToken": "",
                                            "image_url": "https://i.ytimg.com/vi/5iTAPJw8Wm0/maxresdefault.jpg",
                                            "buttons": [
                                                {
                                                    "_id": mongo.Types.ObjectId(),
                                                    "type": "web_url",
                                                    "url": "google.com",
                                                    "title": "Xem lại tập đã phát"
                                                }
                                            ]
                                        },
                                        {
                                            "_id": mongo.Types.ObjectId(),
                                            "title": "Dự đoán kết quả và giành lấy cơ hội nhận quà",
                                            "subtitle": "Tham gia dự đoán kết quả của cuộc thi để nhận được những phần quà hấp dẫn",
                                            "delToken": "",
                                            "image_url": "http://res.cloudinary.com/asdasdasdasdasd/image/upload/v1511530893/sample.jpg",
                                            "buttons": [
                                                {
                                                    "_id": mongo.Types.ObjectId(),
                                                    "type": "postback",
                                                    "payload": "Tham Gia Dự Đoán",
                                                    "title": "Voting Game"
                                                }
                                            ]
                                        },
                                        {
                                            "_id": mongo.Types.ObjectId(),
                                            "title": "About Us",
                                            "subtitle": "Theo dõi chương trình...",
                                            "delToken": "",
                                            "image_url": "http://res.cloudinary.com/asdasdasdasdasd/image/upload/v1511530893/sample.jpg",
                                            "buttons": [
                                                {
                                                    "_id": mongo.Types.ObjectId(),
                                                    "type": "postback",
                                                    "payload": "gioithieu",
                                                    "title": "Giới Thiệu"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }

                    ]

                    for (let j = 0; j < listDefaulBlock.length; j++) {
                        console.log(j)
                        blockModel.addTeamBlock(listDefaulBlock[j], cb => {

                        })
                    }
                    res.json({
                        success: true,
                        message: "Bot saved!"
                    });
                }
            });
        });



    }
});
router.post('/editBot/:botID', (req, res) => {
    let botID = req.params.botID
    let newName = req.body.newname
    botConfig.editBotName(botID, newName, cb => {
        if (!cb) {
            res.json({ success: false, message: "Update Bot Failed" });
        }
        else {
            res.json({ success: true, message: "Bot Updated!" });
        }

    })
})
router.post('/editBotFBS/:botID', (req, res) => {
    let botID = req.params.botID
    let fbToken = req.body.fbToken
    let appSecret = req.body.appSecret
    botConfig.editBotFBS(botID, fbToken, appSecret, cb => {
        if (!cb) {
            res.json({ success: false, message: "Update Bot Failed" });
        }
        else {
            res.json({ success: true, message: "Bot Updated!" });
        }

    })
})
router.post('/deleteBot/:botID', (req, res) => {

    var botID = req.params.botID
    var kbId = req.body.kbId
    botConfig.deleteBot(botID, kbId, async cb => {
        if (!cb) {
            res.json({
                success: false,
                message: "Could not delete bots. Error "
            });
        }
        else {
            request({
                url: baseQnaUrl + '/knowledgebases/' + kbId,
                method: 'DELETE',
                json: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': qna.SubscriptionKey,
                }
            }, function (error, response, body) {
                res.json({
                    success: true,
                    message: "Bot Deleted!"
                });
            });


            blockModel.getAllBlock(botID, (err, bots) => {
                for (let j = 0; j < bots.length; j++) {
                    blockModel.deleteBlock(botID, bots[j]._id, cb => {
                    })
                }
            })

        }

    })
})
// plugin --------------------------------------------------------------------------------------------------------------------------------

module.exports = router;
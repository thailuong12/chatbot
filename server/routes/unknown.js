const express = require('express')
const router = express.Router();
const unknownModel = require('../models/unknown')
const faqModel = require('../models/faq')
const jwt = require('jsonwebtoken')
const botModel = require('../models/bot')
const configkModel = require('../models/configure')

const passport = require('passport')
const config = require('../config/database')
const mongo = require('mongoose')

const request = require('request')
const qna = require('../config/qna')
var type = "qna-api"
var baseQnaUrl = "https://westus.api.cognitive.microsoft.com/qnamaker/"

router.get('/getallunknown/:botId', (req, res) => {
    var botId = req.params.botId
    unknownModel.getAllUnknown(botId, (err, unknowns) => {
        if (err) {
            res.json({ success: false })
        }
        res.json({ success: true, unknown: unknowns })
    })
})

router.delete('/deleteunknown/:botId/:unknownId', (req, res) => {
    var botId = req.params.botId
    var unknownId = req.params.unknownId
    unknownModel.deleteUnknown(botId, unknownId, cb => {
        if (!cb) {
            res.json({ success: false })
        }
        res.json({ success: true })
    })
})

router.post('/addfaqfromunknown/:botId', (req, res) => {
    var botId = req.params.botId
    var question = req.body.question
    var answer = req.body.answer
    var list = req.body.listIdUnknown
    var amount = 0
    botModel.getBot(botId, (err, bot) => {
        if (bot) {
            faqModel.addFaq(botId, question, answer, amount, cb => {

                if (!cb) {
                    res.json({ success: false });
                }
                else {
                   
                    let body =
                        {
                            "qnaPairs": [
                                {
                                    "answer": answer,
                                    "question": question
                                }
                            ]

                        }
                    configkModel.findType(type, (err, configures) => {
                        var version = configures.content[0].version
                        request({
                            url: baseQnaUrl + version + '/knowledgebases/' + bot.kbId,
                            method: 'PATCH',
                            json: true,
                            body: { add: body },
                            headers: {
                                'Content-Type': 'application/json',
                                'Ocp-Apim-Subscription-Key': qna.SubscriptionKey,
                            }
                        }, async function (error, response, body) {
                            await request({
                                url: baseQnaUrl + version + '/knowledgebases/' + bot.kbId,
                                method: 'PUT',
                                headers: {

                                    'Ocp-Apim-Subscription-Key': qna.SubscriptionKey,
                                }
                            })
                            unknownModel.deleteMultiUnknown(botId, list, cb => {
                                if (cb) {
                                    res.json({ success: true })
                                }
                            })
                        });
                    })


                }

            })
        }
    })
    // faqModel.addFaq(botId, question, answer, amount, cb => {
    //     if (!cb) {
    //         res.json({ success: false })
    //     } else {
    //         unknownModel.deleteMultiUnknown(botId,list,cb=>{
    //             if(cb){
    //                 res.json({ success:true  })
    //                 let body =
    //                 {
    //                     "qnaPairs": [
    //                         {
    //                             "answer": answer,
    //                             "question": question
    //                         }
    //                     ]

    //                 }
    //             request({
    //                 url: 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/' + qna.serviceGuid,
    //                 method: 'PATCH',
    //                 json: true,
    //                 body: { add: body },
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Ocp-Apim-Subscription-Key': qna.SubscriptionKey,
    //                 }
    //             }, function (error, response, body) {
    //                 request({
    //                     url: 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/' + qna.serviceGuid,
    //                     method: 'PUT',
    //                     headers: {

    //                         'Ocp-Apim-Subscription-Key': qna.SubscriptionKey,
    //                     }
    //                 },function(err,response,body){


    //                 })


    //             });
    //             }
    //         })

    //     }

    // })
})





/////
module.exports = router;

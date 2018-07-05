const express = require('express')
const router = express.Router();
const faqModel = require('../models/faq')
const botModel = require('../models/bot')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const config = require('../config/database')
const mongo = require('mongoose')

const request = require('request')
const qna = require('../config/qna')
const configkModel = require('../models/configure')
var baseQnaUrl = "https://westus.api.cognitive.microsoft.com/qnamaker/"
var type = "qna-api"
router.get('/faqlist/:botID', (req, res) => {

    var botID = req.params.botID
    faqModel.getAllFaqs(botID, (err, list) => {
        if (err) {
            res.json({ success: false, message: err });
        }
        else {
            res.json({ success: true, list: list });
        }

    })
})
router.post('/editquestionfaq/:botID', (req, res) => {

    var botID = req.params.botID
    var faqId = req.body.faqid
    var newquestion = req.body.newquestion
    var question = req.body.question
    var answer = req.body.answer

    faqModel.editQuestionFaq(botID, faqId, newquestion, question, answer, cb => {
        if (!cb) {
            res.json({ success: false });
        }
        else {
            res.json({ success: true });
        }

    })
})
router.post('/editanswerfaq/:botID', (req, res) => {

    var botID = req.params.botID
    var faqId = req.body.faqid
    var newanswer = req.body.newanswer
    var question = req.body.question
    var answer = req.body.answer

})
router.post('/addfaq/:botID', (req, res) => {

    var botID = req.params.botID
    var question = req.body.question
    var amount = 0;
    var answer = req.body.answer
    botModel.getBot(botID, (err, bot) => {
        if (bot) {
            faqModel.addFaq(botID, question, answer, amount, cb => {

                if (!cb) {
                    res.json({ success: false });
                }
                else {
                    res.json({ success: true });
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
                        }, function (error, response, body) {
                            request({
                                url: baseQnaUrl + version + '/knowledgebases/' + bot.kbId,
                                method: 'PUT',
                                headers: {

                                    'Ocp-Apim-Subscription-Key': qna.SubscriptionKey,
                                }
                            })


                        });
                    })


                }

            })
        }
    })
})
router.post('/deletefaq/:botID', (req, res) => {

    var botID = req.params.botID
    var question = req.body.question
    var answer = req.body.answer
    botModel.getBot(botID, (err, bot) => {
        if (bot) {
            faqModel.deleteFaq(botID, question, answer, cb => {
                if (!cb) {
                    res.json({ success: false });
                }
                else {
                    res.json({ success: true });
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
                            url: baseQnaUrl + version +'/knowledgebases/' + bot.kbId,
                            method: 'PATCH',
                            json: true,
                            body: { delete: body },
                            headers: {
                                'Content-Type': 'application/json',
                                'Ocp-Apim-Subscription-Key': qna.SubscriptionKey,
                            }
                        }, function (error, response, body) {

                            request({
                                url: baseQnaUrl + version +'/knowledgebases/' + bot.kbId,
                                method: 'PUT',
                                headers: {

                                    'Ocp-Apim-Subscription-Key': qna.SubscriptionKey,
                                }
                            })

                        });

                    })

                }

            })
        }
    })

})

module.exports = router;

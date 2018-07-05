var express = require('express')
var bodyparser = require('body-parser')
var request = require('request')
//var config = require('./config/config')
var template = require('./message/templates')
var message = require('./message/message')
var fbUser = require('./lib/fbUser')
var unknown = require('./lib/unknownQuestion')
var bot = require('./lib/bot')

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

var app = express()
//port set to 2000 so it won't be conflict with Portal Server
app.set('port', (process.env.PORT || 2000))

var botInfo

app.use(bodyparser.urlencoded({
    extended: false
}))
app.use(bodyparser.json())

// GET / to check if the server is running
app.get('/', (req, res) => {
    res.send('Bot server is online!')
})

// Verify webhook by 'verify_token'
app.get('/webhook/:botId', async (req, res) => {
    let botId = req.params.botId

    bot.botInfo(botId, (err, bot) => {
        if (err) {
            console.log(err)
        }
        else {
            botInfo = bot
            if (req.query['hub.verify_token'] === botInfo.appSecret) {
                res.send(req.query['hub.challenge']);
            } else {
                res.send('Error, wrong validation token');

            }
        }

    })
});

// Handle the message ins message.js
app.post('/webhook/:botId', (req, res) => {
    
    let botId = req.params.botId

    bot.botInfo(botId, async (err, bot) => {
        if (bot) {
            botInfo = bot
           // console.log(botInfo.fbToken)
            let messaging_events = req.body.entry[0].messaging
            let sender = messaging_events[0].sender.id
           // console.log(sender)
            await fbUser.checkUserExistAndAdd(sender, botInfo.fbToken ,botId)
            for (let i = 0; i < messaging_events.length; i++) {
                let event = messaging_events[i]
                if (event.message) {
                    try {
                        let payload = event.message.quick_reply.payload.toString()
                        template.processPayload(payload, botId, botInfo.fbToken,sender)
                        i = messaging_events.length

                    } catch (error) {
                        if (event.message.text.length > 0) {
                            let text = event.message.text
                            var getAnswer = async () => {
                                var rawData = null
                                //  await message.setUp(botInfo.kbId,botInfo.subscriptionKey,botInfo)
                                await message.processText(text, botInfo.kbId, botInfo.subscriptionKey).then(res => rawData = res, err => console.log(err))
                            console.log( rawData.answers[0].score)
                            
                                if (rawData.answers[0].score >= 55) {
                                    message.sendText(sender, botInfo.fbToken, entities.decode(rawData.answers[0].answer))
                                     fbUser.apendLogChat(sender, botId, text,entities.decode(rawData.answers[0].answer))
                                    
                                } else {
                                    unknown.addUnknown(sender,botId,text)
                                    message.sendText(sender, botInfo.fbToken, "Hiện tại mình chưa có dữ liệu về câu hỏi của bạn, mình sẽ cập nhật và trả lời cho bạn sớm nhất!!")
                                    fbUser.apendLogChat(sender, botId, text,"Hiện tại mình chưa có dữ liệu về câu hỏi của bạn, mình sẽ cập nhật và trả lời cho bạn sớm nhất!!")
                                    
                                }
                            }
                            getAnswer()
                            i = messaging_events.length
                        }
                    }
                } else if (event.postback && event.postback.payload) {
                    let payload = event.postback.payload
                   
                    template.processPayload(payload,botId,botInfo.fbToken ,sender)

                    i = messaging_events.length
                }
            }
            res.sendStatus(200)
        }


    })

})
app.listen(app.get('port'), () => {

    console.log('running port');
})
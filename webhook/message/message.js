//handling message here
//var config = require('../config/config')
var qna = require('../lib/qnamaker')
var request = require('request')



module.exports = {
    processText(question, kbId, subKey) {
        let QNAmaker = new qna(kbId, subKey)
        return new Promise((resolve, reject) => {
            let answer = QNAmaker.answer(question)
            if (answer) {
                return resolve(answer)
            } else {
                reject(new Err("Loi"))
            }
        })
    },
    sendText(sender, fb_token, text) {

        let messageData = {
            text: text
        }
        request({
            url: "https://graph.facebook.com/v2.6/me/messages",
            qs: {
                access_token: fb_token
            },
            method: "POST",
            json: {
                recipient: {
                    id: sender
                },
                message: messageData,
            }
        }, function (error, response, body) {

            if (error) {
                console.log("sending error")
            } else if (response.body.error) {
                console.log("response body error")
            }


        })
    }
}

var request = require('request')
const fs = require('fs');
var db = require('../config/database')

const dbUser = require('../lib/fbUser')

const {
    MessengerClient
} = require('messaging-api-messenger');

var cloudinary = require("cloudinary")

cloudinary.config({ 
    cloud_name: 'asdasdasdasdasd', 
    api_key: '536732917838833', 
    api_secret: '51AAmK-FdoMPraG-7QRqGI2VRoQ' 
  });



module.exports = {
    sendGallery: (data, token,userID) => {
        let client = MessengerClient.connect(token);
        let message = [];
        let button = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].buttons.length; j++) {
                // tao mot ban copy cua object button bo qua thuoc tinh _id
                var copy = Object.assign({}, data[i].buttons[j])
                delete copy._id
                delete copy.hash
                delete copy.date
                button.push(copy)
            }
            message.push({
                title: data[i].title,
                subtitle: data[i].subtitle,
                image_url: data[i].image_url,
                buttons: button
            })
            button = []
        }
        let messageData = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": message
                }
            }
        }
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: token
            },
            method: 'POST',
            json: {
                recipient: {
                    id: userID
                },
                message: messageData,
            }
        }, function (error, response, body) {
            if (error) {
                console.log('Erroraaa sending messages: ', error)
            } else if (response.body.error) {
                console.log('Erroraaa: ', response.body.error)
            }
        })
    },
    sendTemplate: async (data, data1, token,userID, user) => {
        let client = MessengerClient.connect(token);
        
        if (data1.plugin == "minigame" && data1.name != "minigamevoting") {


            dbUser.editVoting(userID, data1.botID,data1.name)

        } else {

        }
        var button = [];
        let text = "";
        let text1 = "";
        for (let j = 0; j < data.buttons.length; j++) {
            // tao mot ban copy cua object button bo qua thuoc tinh _id
            var copy = Object.assign({}, data.buttons[j])
            console.log(copy)
                  
            delete copy._id
            button.push(copy)
        }
        text = data.text.replace(/{{firstname}}/g, user.first_name)
        text1 = text.replace(/{{lastname}}/g, user.last_name)
        await client.sendTemplate(userID, {
            template_type: 'button',
            text: text,
            buttons: button
        });

    },
    sendQuickReplies: async (data,token, userID, user) => {
        let client = MessengerClient.connect(token);
        
        var button = [];
        let text = "";
        let text1 = "";
        for (let j = 0; j < data.quickreplies.length; j++) {
            // tao mot ban copy cua object button bo qua thuoc tinh _id
            var copy = Object.assign({}, data.quickreplies[j])
            delete copy._id
            delete copy.blockID
            delete copy.payLoadId
            button.push(copy)
        }
        text = data.text.replace(/{{firstname}}/g, user.first_name)
        text1 = text.replace(/{{lastname}}/g, user.last_name)

        client.sendText(userID, text1, {
            quick_replies: button
        });

    },
    sendImage: (data, data1,token,userID,user) => {
        let client = MessengerClient.connect(token);
        if(data1.plugin =="fansign"){
            let imgName = data.slice(data.lastIndexOf('/')+1)    
            let text = `Tặng%20bạn%20${user.first_name +"%20"+user.last_name}%20tấm%20hình%20nè%20:)`  
            let url = `https://res.cloudinary.com/drgltnono/image/upload/w_500/l_text:Neucha_26_bold:${text},x_-50,y_-150/${imgName}`
            client.sendImage(userID, url);
           
            dbUser.editFansign(userID, data1.botID,data1.name)
           
        }
        else{
            client.sendImage(userID, data);

        }
    },
    sendImageLocal: (data, data1, token,userID) => {
        let client = MessengerClient.connect(token);
        
        client.sendImage(userID, fs.createReadStream(data));
        dbUser.editFansign(userID, data1.botID,data1.name)
    },
    sendText: (data,data1,token, userID, user) => {
        let client = MessengerClient.connect(token);
        if (data1.plugin == "blockOfBroadCastQuick") {

             
           dbUser.addSurvey(userID, data1.botID,data1.name)

        }
        client.sendText(userID, data)
    }

}





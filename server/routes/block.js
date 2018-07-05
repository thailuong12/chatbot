const express = require('express')
const router = express.Router();
const blockModel = require('../models/block')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const config = require('../config/database')
const mongo = require('mongoose')
const article = require('article')
const request = require('request')
const BitlyClient = require('bitly')
var token = require('../config/bitly')
const bitly = BitlyClient(token.accessToken)

router.get('/blocklist/:botID', (req, res) => {

    var botID = req.params.botID
    blockModel.getAllBlock(botID, (err, blocks) => {
        if (err) {
            res.json({
                success: false,
                message: err
            });
        } else {
            res.json({
                success: true,
                blocks: blocks
            });
        }

    })
})
router.get('/block/:blockID', (req, res) => {

    var blockID = req.params.blockID
    blockModel.getOneBlock(blockID, (err, blocks) => {
        if (err) {
            res.json({
                success: false,
                message: err
            });
        } else {
            res.json({
                success: true,
                blocks: blocks
            });
        }

    })
})
router.post('/addSurveyBlock/:botId', (req, res) => {
    let botId = req.params.botId
    let name = req.body.name
    let newSurvey = {
        botID: botId,
        name,
        plugin: "survey",
        flow: [{
            _id: mongo.Types.ObjectId(),
            type: "quickreplies",
            text: "",
            quickreplies: []
        }

        ]
    }
    blockModel.addSurveyBlock(newSurvey, cb => {
        if (!cb) {
            res.json({ success: false });
        }
        else {
            res.json({ success: true });
        }
    })
})
router.post('/addblock/addTeamBlock/:botId', (req, res) => {
    let botId = req.params.botId
    let team = req.body.Team
    let newTeam = {
        name: team.name,
        plugin: "minigame",
        botID: botId,
        flow:
            [
                {
                    _id: mongo.Types.ObjectId(),
                    type: "image",
                    url: team.imgUrl,
                    delToken: team.deleteToken,
                    text: ""
                },
                {
                    _id: mongo.Types.ObjectId(),
                    type: "template",
                    text: "",
                    buttons: [
                        {
                            type: "postback",
                            payload: "minigamevotingthamgiadudoan",
                            title: "Bình chọn lại",
                            _id: mongo.Types.ObjectId()
                        },
                        {
                            type: "postback",
                            payload: "home",
                            title: "Home",
                            _id: mongo.Types.ObjectId()
                        }
                    ]

                }
            ]

    }
    blockModel.addTeamBlock(newTeam, cb => {
        if (cb == true) {
            res.json({ success: true })
        }
        else {
            res.json({ success: false })

        }

    })
})

router.post('/blocklist/editblockname/:blockID', (req, res) => {
    let botID = req.body.botid
    let blockID = req.params.blockID
    let newName = req.body.newname
  
    blockModel.editBlockName(blockID, botID,newName, cb => {
        if (!cb) {
            res.json({
                success: false
            });
        } else {
            res.json({
                success: true
            });
        }

    })
})
router.post('/blocklist/addBroadCastQuickReply', async (req, res) => {
    let broadCastBlock = req.body.broadCastBlock
    // console.log(broadCastBlock)
    let newQuickReply = req.body.newquickreply

    var quickReply
    let newBlockForQuickRepLy = {
        name: broadCastBlock.name + " : " + newQuickReply.name,
        plugin: "blockOfBroadCastQuick",
        botID: newQuickReply.botId,
        flow: [{
            _id: mongo.Types.ObjectId(),
            type: "text",
            text: "Chân thành cảm ơn bạn đã đóng góp ý kiến !"
        }]

    }
    //  console.log(newBlockForQuickRepLy)
    blockModel.addBlockForBroadCastQuickReply(newBlockForQuickRepLy, (err, block) => {
        if (err) {
            console.log(err)
        }
        else {
            quickReply = {
                content_type: "text",
                title: newQuickReply.name,
                payload: block.name,
                payLoadId: block._id,
                _id: mongo.Types.ObjectId()
            }
            blockModel.addBroadCastQuickReply(broadCastBlock._id, quickReply, cb => {
                if (!cb) {
                    res.json({ success: false });
                }
                else {
                    res.json({ success: true });
                }
            })
        }
    })
})

router.post('/blocklist/editblocktext/:blockID', (req, res) => {

    let blockID = req.params.blockID
    let newText = req.body.newtext
    let flowStt = req.body.flowstt
    blockModel.editBlockText(blockID, flowStt, newText, cb => {
        if (!cb) {
            res.json({
                success: false
            });

        } else {
            res.json({
                success: true
            });
        }

    })
})
router.post('/blocklist/editblockidol/:blockID', (req, res) => {

    let blockID = req.params.blockID
    let url = req.body.url
    let delToken = req.body.delToken
    let flowStt = req.body.flowStt
    blockModel.editBlockIdol(blockID, flowStt, url, delToken, cb => {
        if (!cb) {
            res.json({
                success: false
            });

        } else {
            res.json({
                success: true
            });
        }

    })
})
router.post('/blocklist/addQuickReply/:blockID', async (req, res) => {
    let blockID = req.params.blockID
    let newQuickReply = req.body.newquickreply
    let botID = req.body.botID
    var quickReply
    await blockModel.getBlockIdByName(botID, newQuickReply.blockname, (err, payload) => {
        if (err) {
            console.log(err)
        }
        quickReply = {
            content_type: "text",
            title: newQuickReply.name,
            payload: newQuickReply.blockname,
            payLoadId: payload._id,
            _id: mongo.Types.ObjectId()
        }
        blockModel.addQuickReply(blockID, quickReply, cb => {
            if (!cb) {
                res.json({
                    success: false
                });

            } else {
                res.json({
                    success: true
                });


            }
        })
    })


})

router.post('/blocklist/deleteQuickReply/:blockID/:quickReplyID', (req, res) => {
    let blockID = req.params.blockID
    let quickReplyID = req.params.quickReplyID

    blockModel.deleteQuickReply(blockID, quickReplyID, cb => {
        if (!cb) {
            res.json({
                success: false
            });

        } else {
            res.json({
                success: true
            });
        }
    })
})
router.post('/blocklist/addNews/:blockID', (req, res) => {
    let blockID = req.params.blockID
    let link = req.body.link
    let date = Date.now()
    bitly.shorten(link).then((cb) => {

        var url = cb.data.url
        var hash = cb.data.hash
  
        request(url).pipe(article(url, function (err, result) {
            if (err){
                res.json({
                    result: err
                });
            }
            else{
                let art = {
                    title: result.title,
                    subtitle: result.text.substring(0, 60),
                    image_url: result.image,
                    buttons: [{
    
                        "_id": mongo.Types.ObjectId(),
                        "type": "web_url",
                        "url": url,
                        "title": "Đọc tin",
                        "hash": hash,
                        "date": date
    
                    },
                    {
                        "_id": mongo.Types.ObjectId(),
                        "type": "postback",
                        "payload": "home",
                        "title": "Về Home"
                    }
    
                    ],
                    _id: mongo.Types.ObjectId()
                }
                blockModel.addNews(blockID, art, cb => {
                    if (!cb) {
                        res.json({
                            success: false
                        });
    
                    } else {
                        res.json({
                            success: true
                        });
    
    
                    }
                })
            }
           
        }));
    });
})

router.put('/blocklist/deleteNews/:blockID/:newID', (req, res) => {
    let blockID = req.params.blockID
    let newsId = req.params.newID

    blockModel.deleteNews(blockID, newsId, cb => {
        if (!cb) {
            res.json({
                success: false
            });

        } else {
            res.json({
                success: true
            });


        }
    })
})
router.post('/addblock/addIdolBlock/:botId', (req, res) => {
    let botId = req.params.botId
    let idol = req.body.Idol
    let newIdol = {
        name: idol.name,
        plugin: "fansign",
        botID: botId,
        flow:
            [
                {
                    _id: mongo.Types.ObjectId(),
                    type: "text",
                    text: ""
                },
                {
                    _id: mongo.Types.ObjectId(),
                    type: "image",
                    url: idol.imgUrl,
                    delToken: idol.deleteToken
                }
            ]

    }
    blockModel.addIdolBlock(newIdol, cb => {
        if (cb == true) {
            res.json({ success: true })
        }
        else {
            res.json({ success: false })

        }

    })
})
router.post('/deleteBlock/:botId', (req, res) => {
    let botId = req.params.botId
    let blockId = req.body.blockId
    blockModel.deleteBlock(botId, blockId, cb => {
        if (!cb) {
            res.json({ success: false });
        }
        else {
            res.json({ success: true });
        }

    })
})
router.post('/deleteSurveyBlock/:botId', (req, res) => {
    let botId = req.params.botId
    let blockId = req.body.blockId
    blockModel.deleteSurveyBlock(botId, blockId, cb => {
        if (!cb) {
            res.json({ success: false });
        }
        else {
            res.json({ success: true });
        }

    })
})
router.post('/blocklist/editGalaryTitle/:botId/:blockId',(req,res)=>{
  //  console.log("asdasdasd")
    let botId = req.params.botId
    let blockId = req.params.blockId
    let stt = req.body.stt
    let newTitle = req.body.newTitle
    blockModel.editGalaryTitle(botId,blockId,newTitle,stt,cb=>{
        if (!cb) {
            res.json({ success: false });
        }
        else {
            res.json({ success: true });
        }
    })
})
router.post('/blocklist/editGalarySubTitle/:botId/:blockId',(req,res)=>{
    //  console.log("asdasdasd")
      let botId = req.params.botId
      let blockId = req.params.blockId
      let stt = req.body.stt
      let newSubTitle = req.body.newSubTitle
      blockModel.editGalarySubTitle(botId,blockId,newSubTitle,stt,cb=>{
          if (!cb) {
              res.json({ success: false });
          }
          else {
              res.json({ success: true });
          }
      })
  })
  router.post('/blocklist/editGalaryImg/:botId/:blockId',(req,res)=>{
    //  console.log("asdasdasd")
      let botId = req.params.botId
      let blockId = req.params.blockId
      let stt = req.body.stt
      let img = req.body.img
      let deltoken = req.body.deltoken
      
      blockModel.editGalaryImg(botId,blockId,img,deltoken,stt,cb=>{
          if (!cb) {
              res.json({ success: false });
          }
          else {
              res.json({ success: true });
          }
      })
  })
module.exports = router;
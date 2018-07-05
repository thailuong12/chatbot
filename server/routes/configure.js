const express = require('express')
const router = express.Router();
const configkModel = require('../models/configure')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const config = require('../config/database')
const mongo = require('mongoose')
const article = require('article')
const request = require('request')
router.post('/getConfig',(req, res) =>{
    let type= req.body.type
    configkModel.findType(type, (err,configures)=>{
        if(err){
            res.json({
                success: false,
                message: err
            });
        }else{
            if(!configures){
                res.json({
                    success: false,
                    message: "Not a valid type"
                });
            }
            else{
              res.json({
                    success: true,
                    configures: configures,
                });
           }
        }
    })
})

router.post('/addAccountEmail/:botID', (req, res) => {
    let botId = req.params.botID
    let newEmail= {
        botID: botId,
        type: req.body.type,
        content:
            [
                {
                    _id: mongo.Types.ObjectId(),
                    url: req.body.url
                },
            ]

    }
    configkModel.addAccountEmail(newEmail, cb => {
        if (cb == true) {
            res.json({ success: true })
        }
        else{
            res.json({ success: false })

        }

    })
})

router.post('/editAccountEmail', (req, res) => {
    let newPass = req.body.newPass
    let newEmail = req.body.newEmail
    let type= req.body.type
    configkModel.findType(type, (err,config) =>{
        if(err){
            res.json({
                success: false,
                message: err
            });
        }else{
            if(!config){
                res.json({
                    success: false,
                    message: "Not a valid email"
                });
            }else{
                let configId = config._id
                configkModel.editAccountEmail(configId, newEmail, newPass, cb => {
                    if (!cb) {
                        res.json({
                            success: false,
                            message: "Update failed"
                        });
                    } else {
                        res.json({
                            success: true,
                            message: "Update successfully"
                        });
                    }
            
                })
            }
        }
    })
   
})

router.post('/editQNA_API', (req, res) => {
    let newVersion = req.body.newVersion
    let type= req.body.type
    configkModel.findType(type, (err,config) =>{
        if(err){
            res.json({
                success: false,
                message: err
            });
        }else{
            if(!config){
                res.json({
                    success: false,
                    message: "Not a valid qna-api-version"
                });
            }else{
                let configId = config._id
                configkModel.editQNA_API(configId, newVersion, cb => {
                    if (!cb) {
                        res.json({
                            success: false,
                            message: "Update failed"
                        });
                    } else {
                        res.json({
                            success: true,
                            message: "Update successfully"
                        });
                    }
            
                })
            }
        }
    })
   
})


router.post('/addWebhookUrl', (req, res) => {
    let newWebhookUrl= {
        type: "webhookurl",
        content:
            [
                {
                    _id: mongo.Types.ObjectId(),
                    url: req.body.url
                },
            ]

    }
    configkModel.addWebhookUrl(newWebhookUrl, cb => {
        if (cb == true) {
            res.json({ success: true })
        }
        else{
            res.json({ success: false })

        }

    })
})
router.post('/editWebhookUrl', (req, res) => {
    let newWebhookUrl = req.body.newWebhookUrl
    let type= req.body.type
    configkModel.findType(type, (err,callback) =>{
        if(err){
            res.json({
                success: false,
                message: err
            });
        }else{
            if(!callback){
                res.json({
                    success: false,
                    message: "Not a valid webhookurl"
                });
            }else{
                let _id = callback._id
                configkModel.editWebhookUrl(_id, newWebhookUrl, cb => {
                    if (!cb) {
                        res.json({
                            success: false,
                            message: "Update failed"
                        });
                    } else {
                        res.json({
                            success: true,
                            message: "Update successfully"
                        });
                    }
            
                })
            }
        }
    })
   
})




module.exports = router;

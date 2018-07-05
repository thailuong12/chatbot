const express = require('express')
const router = express.Router();
const fbuserModel = require('../models/fbuser')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const config = require('../config/database')
const mongo = require('mongoose')
const request = require('request')

router.get('/getAllfbuser/:botID',(req,res)=>{
    let botId = req.params.botID
    fbuserModel.getAllFbUser(botId,(err,list)=>{
        if(err){
            res.json({ success: false });
        }
        res.json({ success: true,fbuser:list });
    })

})
router.get('/getFbUserByAppId/:botId/:appId', (req, res) => {
    let botId = req.params.botId
    let appId = req.params.appId
    fbuserModel.getFbUserByAppId(botId,appId, (err, user) => {
        if (err) {
            res.json({ success: false })
        }
        res.json({ success: true, user })
    })
})
router.get('/getfbuser/:botID/:userId',(req,res)=>{
    let botId = req.params.botID
    let userId = req.params.userId
    fbuserModel.getFbUser(botId,userId,(err,user)=>{
        if(err){
            res.json({ success: false });
        }
        res.json({ success: true,fbuser:user });
    })

})
module.exports = router;

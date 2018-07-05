const express = require('express')
const router = express.Router();
const blockModel = require('../models/block')
const botModel = require('../models/bot')
const broadcastModel = require('../models/broadcast')

const jwt = require('jsonwebtoken')
const passport = require('passport')
const config = require('../config/database')
const mongo = require('mongoose')

const request = require('request')



router.get('/getBroadCast/:botId',(req,res)=>{
    let botId = req.params.botId
    blockModel.getBlockByPlugin(botId,"survey",(err,block)=>{
        if(err){
            res.json({success:false})
        }
        else{
            res.json({success:true,broadcast:block})

        }
    })

})


router.get('/sendSurvey/:blockId/:botId',(req,res)=>{
    let botId = req.params.botId
    let blockId =req.params.blockId
    botModel.getBot(botId,(err,bot)=>{
        if(err){
            console.log(err)
        }
        else
        {
            blockModel.sendSurvey(bot.fbToken,blockId,(err,block)=>{
                if(err){
                    res.json({success:false})
                }
                else{
                    res.json({success:true})
        
                }
            }) 
         //   console.log(bot)
        }
    })


})


module.exports = router;

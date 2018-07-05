const express = require('express')
const router = express.Router();
const faqModel = require('../models/faq')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const config = require('../config/database')
const mongo = require('mongoose')
const blockModel = require('../models/block')
const request = require('request')
const BitlyClient = require('bitly')
var token = require('../config/bitly')
const bitly = BitlyClient(token.accessToken)


router.get('/blocknews/:botId', (req, res) => {

    var botId = req.params.botId
    var plugin = "news"
    blockModel.getBlockByPlugin(botId, plugin, (err, blocks) => {
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
router.post('/urlclick', (req, res) => {
    var hash = req.body.hash
    bitly.clicks(hash).then((result) => {
        res.json({
            success: true,
            result: result
        });
    });
});

router.post('/urlinfo', (req, res) => {
    var url = req.body.url
    bitly.info(url).then((result) => {
        res.json({
            success: true,
            result: result
        });
    });
});
router.post('/urlexpand', (req, res) => {
    var url = req.body.url
    bitly.expand(url).then((result) => {
        res.json({
            success: true,
            result: result
        });
    });
});
router.post('/urlcountry', (req, res) => {
    var url = req.body.url
    bitly.countries(url).then((result) => {
        res.json({
            success: true,
            result: result
        });
    });
});
router.post('/urlreferrer', (req, res) => {
    var url = req.body.url
    bitly.referrers(url).then((result) => {
        res.json({
            success: true,
            result: result
        });
    });
});






module.exports = router;

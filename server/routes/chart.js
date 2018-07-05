const express = require('express')
const router = express.Router();
const faqModel = require('../models/faq')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const config = require('../config/database')
const mongo = require('mongoose')
const request = require('request')
const BitlyClient = require('bitly')
var token = require('../config/bitly')
const bitly = BitlyClient(token.accessToken)

router.post('/urlclick', (req, res) => {
    var hash = req.body.hash
    bitly.clicks(hash).then((result) => {
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
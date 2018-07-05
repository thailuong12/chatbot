const mongoose = require('mongoose')
const config = require('../config/database')

const configSchema = mongoose.Schema({
    botID: {
        type: String,
        require: false
    },
    type: {
        type: String,
        require: true
    },
    content: {
        type: Array,
        require: true,
    }
});
var configModel = mongoose.model('configure', configSchema)
module.exports.addAccountEmail = (newEmail,cb)=>{
    configModel.create(newEmail,(err,block)=>{
        if(err){
            return cb(false)
        }
        return cb(true)
       
    })
}
module.exports.findType = function (type, callback) {
    var query = {
        type: type
    };
    configModel.findOne(query, callback);
}
module.exports.editQNA_API = (configId, version, cb) => {
    let editVersion = "content."+ 0 + ".version"
    let obj = {}
    obj[editVersion] = version
    configModel.findByIdAndUpdate(configId, obj, (err, block) => {
        
        if (err) {
            return cb(false)
        }
        return cb(true)
    })
}
module.exports.editAccountEmail = (configId, email, password, cb) => {
    let editEmail = "content." + 0 + ".email"
    let editPass = "content."+ 0 + ".password"
    let obj = {}
    obj[editEmail] = email
    obj[editPass] = password
    configModel.findByIdAndUpdate(configId, obj, (err, block) => {
        
        if (err) {
            return cb(false)
        }
        return cb(true)
    })
}

module.exports.addWebhookUrl = (newWebhook,cb)=>{
    configModel.create(newWebhook,(err, webhookurl)=>{
        if(err){
            return cb(false)
        }
        return cb(true)
       
    })
}
module.exports.editWebhookUrl = (_id, newUrl, cb) => {
    let editUrl = "content."+ 0 + ".url"
    let obj = {}
    obj[editUrl] = newUrl
    configModel.findByIdAndUpdate(_id, obj, (err, url) => {
        
        if (err) {
            return cb(false)
        }
        return cb(true)
    })
}
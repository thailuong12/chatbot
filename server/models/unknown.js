const mongoose = require('mongoose')
const config = require('../config/database')


const unknownSchema = mongoose.Schema({
    question:{
        type:String,
        require:true
    },
    botId:{
        type:String,
        require:true
    }
})

var unknownModel = mongoose.model('unknown',unknownSchema)
var Unknown = module.exports= unknownModel
module.exports.getAllUnknown = (botId,cb)=>{
    Unknown.find({botId},cb)
}
module.exports.deleteUnknown = (botId,unknownId,cb)=>{
    Unknown.findByIdAndRemove(unknownId,(err,unknown)=>{
        if(err){
            return cb(false)
        }
        return cb(true)
    })
}
module.exports.deleteMultiUnknown = (botId,listId,cb)=>{
    Unknown.remove({_id:{$in:listId}},(err,unknown)=>{
        if(err){
           return cb(false)
        }
        return cb(true)
      
    })
}
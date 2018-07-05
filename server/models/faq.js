const mongoose = require('mongoose')
const config = require('../config/database')


const faqSchema = mongoose.Schema({
    question: {
        type: String,
        require: true
    },
    answer: {
        type: String,
        require: true
    },
    botId: {
        type: String,
        require: true,
    },
    amount: {
        type: Number,
        require: true
    }
});
var faqModel = mongoose.model('faq', faqSchema)
module.exports.getAllFaqs = (botID,cb)=>{
    faqModel.find({ botId: botID }, cb)
}
module.exports.editQuestionFaq = (botID,faqId,newquestion,question,answer,cb)=>{
    
    faqModel.findByIdAndUpdate(faqId, {question:newquestion},(err,faq)=>{
        if(err){
           
            return cb(false)
        }
       
       
        return cb(true)
    })
}
module.exports.editAnswerFaq = (botID,faqId,newanswer,question,answer,cb)=>{
    
    faqModel.update({_id:faqId}, {answer:newanswer},(err,faq)=>{
        if(err){
           
            return cb(false)
        }
        return cb(true)
    })
}
module.exports.addFaq = (botId,question,answer,amount,cb)=>{
    let faq = {
        question,
        answer,
        amount:0,
        botId
    }
    faqModel.create(faq,(err,faq)=>{
        if(err){
            return cb(false)
        }
        
        return cb(true)
    })
}
module.exports.deleteFaq = (botId,question,answer,cb)=>{
    faqModel.remove({question:question,answer:answer},(err,faq)=>{
        if(err){
           
            return cb(false)
        }
        return cb(true)
    })
}
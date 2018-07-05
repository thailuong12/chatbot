const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const account = require('../models/account')
const configs = require('../config/database')

module.exports = function(passport){
    var opts = {}
    opts.jwtFromRequest =  ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = configs.secret
    passport.use(new JwtStrategy(opts,(jwt_payload, done)=>{

        account.getAccountById(jwt_payload.data._id,(err,account)=>{
            if(err) {
                return done( err,false) 
            }if(account){
                return done(null,account)
            }else{
                return done(null,false)
            }
            
        })
    }))
}
const mongoose = require('mongoose')
const config = require('../config/database')
const bcrypt = require('bcryptjs')


//Validate Function to check e-mail
let emailLengthChecker = (email) => {
    if (!email) {
        return false;
    } else {
        if (email.length < 5 || email.length > 30) {
            return false;
        } else {
            return true;
        }
    }
};

let validEmailChecker = (email) => {
    if (!email) {
        return false;
    } else {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
};

const emailValidators = [{
        validator: emailLengthChecker,
        message: 'E-mail must be at least 5 characters but no more than 30'
    },
    {
        validator: validEmailChecker,
        message: 'Must be a valid email'
    }
];

// Validate Function to check username
let usernameLengthChecker = (username) => {
    if (!username) {
        return false;
    } else {
        if (username.length < 3 || username.length > 15) {
            return false;
        } else {
            return true;
        }
    }
};

let validUsername = (username) => {
    if (!username) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
};

const usernameValidators = [{
        validator: usernameLengthChecker,
        message: 'Username must be at least 3 characters but no more than 15'
    },
    {
        validator: validUsername,
        message: 'Username must not have any special characters'
    }
];

// Validate Function to check password
let passwordLengthChecker = (password) => {
    if (!password) {
        return false;
    } else {
        if (password.length < 8 || username.length > 35) {
            return false;
        } else {
            return true;
        }
    }
};

let validPassword = (password) => {
    if (!password) {
        return false;
    } else {
        const regExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,35}$/);
        return regExp.test(password);
    }
};

const passwordValidators = [{
        validator: passwordLengthChecker,
        message: 'Password must be at least 8 characters but no more than 35'
    },
    {
        validator: validPassword,
        message: 'Password must have at least one uppercase, lowercase, and number'
    }
];

// tao user schema
const accountSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        validate: usernameValidators
    },
    password: {
        type: String,
        require: true
        //  validate: passwordValidators
    },
    email: {
        type: String,
        require: true,
        validate: emailValidators
    },
    resetPasswordToken: {
        type: String
       
    },
    resetPasswordExpires:{
        type: Date
    }
});

// tao model tu schema
var accountModel = mongoose.model('account', accountSchema)
const Account = module.exports = accountModel;

// lenh query
module.exports.getAccountByID = (id, cb) => {
    Account.findById(id, callback);
}

module.exports.findAccountByUsername = function (username, callback) {
    var query = {
        username: username
    };
    console.log(username);
    Account.findOne(query, callback);
}

module.exports.findAccountByEmail = function (email, callback) {
    var query = {
        email: email
    };
    Account.findOne(query, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) {
            console.log(err);
        }
        callback(null, isMatch);
    })
}

module.exports.addAccount = function (newAccount, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAccount.password, salt, (err, hash) => {
            if (err) throw err;
            newAccount.password = hash;
            newAccount.save(callback);
        });
    });
}

module.exports.getAllAccount = function (callback) {
    Account.find(callback).sort({
        '_id': -1
    });
}

module.exports.getSingleAccount = function (_id, callback) {
    var query = {
        _id: _id
    };
    Account.findOne(query, callback);
}

module.exports.updateAccount = function (password, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;
            callback(err, hash);
        });
    });
}

module.exports.editTokenFP = function (email, token, cb){
    Account.findOne({email: email}, function (err, account){
        if(err) throw err;
        account.resetPasswordToken = token;
        account.resetPasswordExpires = Date.now() + 3600000;
        account.save(cb);
    });
}
module.exports.resetPass = function (token, cb){
    var query = {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    };
    Account.findOne(query, cb);
}
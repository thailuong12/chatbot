const mongoose = require('mongoose')
const config = require('../config/database')

let validPayload = (payload) => {
    if (!payload) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-z0-9]+$/);
        return regExp.test(payload);
    }
};
const payloadValidators = [
{
    validator: validPayload,
    message: 'Payload can not have capital letters'
}
];

const menuSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    payload: {
        type: String,
        require: true,
        validate: payloadValidators
    },
    status: {
        type: String,
        require: true
    },
});


// tao model tu schema
var menuModel = mongoose.model('menu', menuSchema)
const Menu = module.exports = menuModel;


module.exports.getAllMenu =  (callback)=> {
    Menu.findOne(callback)
}


module.exports.addMenu = function (newMenu, callback) {
    newMenu.save(callback);
}

module.exports.getSingleMenu = function (_id, callback) {
    var query = {
        _id: _id
    };
    Menu.findOne(query, callback);
}

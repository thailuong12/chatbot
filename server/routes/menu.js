const express = require('express')
const router = express.Router();
const Menu = require('../models/menu')
const BotModel = require('../models/bot')

const jwt = require('jsonwebtoken')
const passport = require('passport')
const config = require('../config/database')
const {
    MessengerClient
} = require('messaging-api-messenger');
router.get('/getAllMenu', (req, res) => {
    Menu.getAllMenu((err, menus) => {
        if (err) {
            res.json({ success: false, message: err });
        }
        else {
            res.json({ success: true, menus: menus });
        }

    });
});
router.post('/addmenu', (req, res) => {
    if (!req.body.title) {
        res.json({
            success: false,
            message: "You must provide a title"
        });
    } else {
        // if (!req.body.type) {
        //     res.json({
        //         success: false,
        //         message: "You must provide a type"
        //     });
        // }
        // else{
        if (!req.body.payload) {
            res.json({
                success: false,
                message: "You must provide a payload"
            });
        }
        else {
            if (!req.body.status) {
                res.json({
                    success: false,
                    message: "You must provide a status"
                });
            }
            else {
                let newMenu = new Menu({
                    title: req.body.title,
                    type: 'postback',
                    payload: req.body.payload,
                    status: req.body.status
                });
                Menu.addMenu(newMenu, (err, menu) => {
                    if (err) {
                        if (err.errors) {
                            if (err.errors.payload) {
                                res.json({
                                    success: false,
                                    message: err.errors.payload.message
                                });
                            } else {
                                res.json({
                                    success: false,
                                    message: err
                                });
                            }
                        }
                        else {
                            res.json({
                                success: false,
                                message: "Could not save menus. Error: ",
                                err
                            });
                        }
                    } else {
                        res.json({
                            success: true,
                            message: "Menu saved!"
                        });
                    }
                });
            }
        }
        // }
    }
});
router.get('/singleMenu/:id', (req, res) => {
    var _id = req.params.id
    if (!_id) {
        res.json({
            success: false,
            message: 'No menu ID was provided'
        });
    } else {
        Menu.getSingleMenu(_id, (err, menu) => {
            if (err) {
                res.json({
                    success: false,
                    message: "Not a valid menu ID"
                });
            } else {
                if (!menu) {
                    res.json({
                        success: false,
                        message: "Menu ID not found"
                    });
                } else {
                    res.json({
                        success: true,
                        menu: menu
                    })
                }
            }
        });
    }
});
router.put('/updateMenu/:_id', (req, res) => {
    var _id = req.params._id
    if (!_id) {
        res.json({
            success: false,
            message: 'No menu id provided'
        })
    } else {
        Menu.getSingleMenu(_id, (err, menu) => {
            if (err) {
                res.json({
                    success: false,
                    message: "Not a valid menu ID"
                });
            } else {
                if (!menu) {
                    res.json({
                        success: false,
                        message: "Menu ID not found"
                    });
                } else {
                    if (!req.body.title) {
                        res.json({
                            success: false,
                            message: "You must provide an title"
                        });
                    }
                    else {
                        if (!req.body.status) {
                            res.json({
                                success: false,
                                message: "You must provide an status"
                            });
                        }
                        else {
                            menu.title = req.body.title;
                            menu.status = req.body.status;
                            menu.save((err) => {
                                if (err) {
                                    if (err.errors) {
                                        if (err.errors.title) {
                                            res.json({
                                                success: false,
                                                message: err.errors.title.message
                                            });
                                        } else {
                                            if (err.errors.status) {
                                                res.json({
                                                    success: false,
                                                    message: err.errors.status.message
                                                });
                                            } else {
                                                res.json({
                                                    success: false,
                                                    message: err
                                                });
                                            }
                                        }
                                    } else {
                                        res.json({
                                            success: false,
                                            message: "Could not save menu. Error: ",
                                            err
                                        });
                                    }
                                } else {
                                    res.json({
                                        success: true,
                                        message: "Menu Updated!"
                                    });
                                }
                            })
                        }
                    }
                }
            }
        });
    }
});
router.delete('/deletemenu/:_id', (req, res) => {
    var _id = req.params._id;
    if (!_id) {
        res.json({
            success: false,
            message: "No ID provided"
        })
    } else {
        Menu.getSingleMenu(_id, (err, menu) => {
            if (err) {
                res.json({
                    success: false,
                    message: "Invalid ID"
                })
            } else {
                if (!menu) {
                    res.json({
                        success: false,
                        message: "Menu was not found"
                    })
                } else {
                    menu.remove((err) => {
                        if (err) {
                            res.json({
                                success: false,
                                message: err
                            })
                        } else {
                            res.json({
                                success: true,
                                message: "Menu deleted!"
                            })
                        }
                    });
                }
            }
        });
    }
})

router.post('/setPersistentMenu/:botId', (req, res) => {

    let botId = req.params.botId
    BotModel.getBot(botId, (err, bot) => {
        Menu.getAllMenu((err, menus) => {
          
            var client = MessengerClient.connect(bot.fbToken)
            if (err) {
                res.json({ success: false});
            }
            else {

                var menu = [];
              
                    menu.push({
                        title: menus.title,
                        type: menus.type,
                        payload: menus.payload
                    })
                
                client.setPersistentMenu([{
                    locale: 'default',
                    call_to_actions: menu
                },]);

                res.json({ success: true });
            }

        });
    })

});
router.post('/deletePersistentMenu/:botId', (req, res) => {

    let botId = req.params.botId
    BotModel.getBot(botId, (err, bot) => {
        if(err){
            res.json({ success: false });
            
        } else{
            var client = MessengerClient.connect(bot.fbToken)
        client.deletePersistentMenu();
            res.json({ success: true });
            
        }
        
       
    })

});

module.exports = router;
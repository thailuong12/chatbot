const express = require('express')
const router = express.Router();
const Account = require('../models/account')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const config = require('../config/database')
const async = require('async')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const configkModel = require('../models/configure')
// authenticate
router.post('/authenticate', (req, res) => {
    var username = req.body.username
    var password = req.body.password

    Account.findAccountByUsername(username, (err, account) => {
        if (err) {
            console.log("err")
        }
        if (!account) {
            return res.json({ success: false, log: 'Invalid Login or Username!' })
        }
        if (account) {
            Account.comparePassword(password, account.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    usernamelogin = account.username;
                    const token = jwt.sign({
                        data: account
                    }, config.secret, {
                            expiresIn: 604800
                        });
                    res.json({

                        success: true,
                        token: 'JWT ' + token,
                        account: account.name
                    })
                }
                else {
                    return res.json({ success: false, log: 'Invalid Login or Password!' })
                }
            })
        }
    })
})
// router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
//     var id = req.params.id
//     Account.findById(id, (err, account) => {
//         res.json({ account: account })
//     });
// })
router.get('/list', (req, res) => {
    Account.getAllAccount((err, accounts) => {
        if (err) {
            res.json({
                success: false,
                message: err
            });
        } else {
            if (!accounts) {
                res.json({
                    success: false,
                    message: "No accounts found."
                });
            } else {
                res.json({
                    success: true,
                    accounts: accounts
                });
            }
        }
    });
});

router.post('/add', (req, res) => {
    if (!req.body.email) {
        res.json({
            success: false,
            message: "You must provide an e-mail"
        });
    } else {
        if (!req.body.username) {
            res.json({
                success: false,
                message: "You must provide a username"
            });
        } else {
            if (!req.body.password) {
                res.json({
                    success: false,
                    message: "You must provide a password"
                });
            } else {
                if (!req.body.name) {
                    res.json({
                        success: false,
                        message: "You must provide a name"
                    });
                } else {
                    var username = req.body.username
                    var email = req.body.email
                    Account.findAccountByUsername(username, (err, account) => {
                        if (err) {
                            console.log("err")
                        } else if (account) {
                            res.json({
                                success: false,
                                message: 'Username already exists'
                            })
                        } else {
                            Account.findAccountByEmail(email, (err, account) => {
                                if (err) {
                                    console.log("err")
                                } else if (account) {
                                    res.json({
                                        success: false,
                                        message: 'Email already exists'
                                    })
                                } else {
                                    let newAccount = new Account({
                                        name: req.body.name,
                                        username: req.body.username,
                                        password: req.body.password,
                                        email: req.body.email
                                    });

                                    Account.addAccount(newAccount, (err, account) => {
                                        if (err) {
                                            if (err.errors) {
                                                if (err.errors.username) {
                                                    res.json({
                                                        success: false,
                                                        message: err.errors.username.message
                                                    });
                                                } else {
                                                    if (err.errors.email) {
                                                        res.json({
                                                            success: false,
                                                            message: err.errors.email.message
                                                        });
                                                    } else {
                                                        if (err.errors.password) {
                                                            res.json({
                                                                success: false,
                                                                message: err.errors.password.message
                                                            });
                                                        } else {
                                                            res.json({
                                                                success: false,
                                                                message: err
                                                            });
                                                        }
                                                    }
                                                }
                                            } else {
                                                res.json({
                                                    success: false,
                                                    message: "Could not save account. Error: ",
                                                    err
                                                });
                                            }
                                        } else {
                                            res.json({
                                                success: true,
                                                message: "Account saved!"
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        }
    }
});
router.get('/singleAccount/:id', (req, res) => {
    var _id = req.params.id
    if (!_id) {
        res.json({
            success: false,
            message: 'No account ID was provided'
        });
    } else {
        Account.getSingleAccount(_id, (err, account) => {
            if (err) {
                res.json({
                    success: false,
                    message: "Not a valid account ID"
                });
            } else {
                if (!account) {
                    res.json({
                        success: false,
                        message: "Account ID not found"
                    });
                } else {
                    res.json({
                        success: true,
                        account: account
                    })
                }
            }
        });
    }
});
router.put('/updateAccount/:_id', (req, res) => {
    var _id = req.params._id
    if (!_id) {
        res.json({
            success: false,
            message: 'No account id provided'
        })
    } else {
        Account.getSingleAccount(_id, (err, account) => {
            if (err) {
                res.json({
                    success: false,
                    message: "Not a valid account ID"
                });
            } else {
                if (!account) {
                    res.json({
                        success: false,
                        message: "Account ID not found"
                    });
                } else {
                    var password = req.body.password
                    Account.updateAccount(password, (err, hash) => {
                        if (err) {
                            res.json({
                                success: false,
                                message: err
                            });
                        } else {
                            account.name = req.body.name;
                            account.email = req.body.email;
                            account.password = hash;
                            account.save((err) => {
                                if (err) {
                                    if (err.errors) {
                                        if (err.errors.email) {
                                            res.json({
                                                success: false,
                                                message: err.errors.email.message
                                            });
                                        } else {
                                            if (err.errors.password) {
                                                res.json({
                                                    success: false,
                                                    message: err.errors.password.message
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
                                            message: "Could not save account. Error: ",
                                            err
                                        });
                                    }
                                } else {
                                    res.json({
                                        success: true,
                                        message: "Account Updated!"
                                    });
                                }
                            })
                        }
                    });
                }
            }
        });
    }
});

// xoa
router.delete('/delete/:_id', (req, res) => {
    var _id = req.params._id;
    if (!_id) {
        res.json({
            success: false,
            message: "No ID provided"
        })
    } else {
        Account.getSingleAccount(_id, (err, account) => {
            if (err) {
                res.json({
                    success: false,
                    message: "Invalid ID"
                })
            } else {
                if (!account) {
                    res.json({
                        success: false,
                        message: "Account was not found"
                    })
                } else {
                    account.remove((err) => {
                        if (err) {
                            res.json({
                                success: false,
                                message: err
                            })
                        } else {
                            res.json({
                                success: true,
                                message: "Account deleted!"
                            })
                        }
                    });
                }
            }
        });
    }
})
router.post('/forgot', (req, res) => {
    var email = req.body.email
    Account.findAccountByEmail(email, (err, cb) => {
        if (err) {
            res.json({
                success: false,
                message: "Not a valid email"
            });
        }
        else {
            if (!cb) {
                res.json({
                    success: false,
                    message: "No account with that email exists"
                });
            }
            else {
                async.waterfall([
                    function (done) {
                        crypto.randomBytes(5, function (err, buf) {
                            var token = buf.toString('hex');
                            done(err, token);
                        })
                    },
                    function (token, done) {
                        Account.editTokenFP(email, token, (err, account) => {
                            done(err, token, account);
                        });
                    },
                    function (token, account, done) {
                        var type = "email"
                        configkModel.findType(type, (err, configures) => {
                            var email = configures.content[0].email
                            var password = configures.content[0].password
                            var smtpTransport = nodemailer.createTransport({
                                service: 'Gmail',
                                auth: {
                                    user: email,
                                    pass: password
                                }
                            });
                            var mailOptions = {
                                to: account.email,
                                from: email,
                                subject: 'BTB System Password Reset',
                                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                    'At your request, we reset your password to default. \n\n' +
                                    'Password: '+ token + '\n\n' +
                                    'Please reset your password when you login successfully. Thank you!!! \n'
                            };
                            smtpTransport.sendMail(mailOptions, function (err) {
                                if (err) {
                                    res.json({
                                        success: false,
                                        message: err
                                    })
                                }
                                else {
                                    res.json({
                                        success: true,
                                        message: "An e-mail has been sent to " + account.email + " with further instructions."
                                    })
                                }

                            });
                        });
                        var password = token
                        Account.resetPass(token, (err, account) => {
                            if (err) {
                                res.json({
                                    success: false,
                                    message: err
                                });
                            } else {
                                if (!account) {
                                    res.json({
                                        success: false,
                                        message: "Password reset token is invalid or has expired."
                                    });
                                } else {
                                    Account.updateAccount(password, (err, hash) => {
                                        if (err) {
                                            res.json({
                                                success: false,
                                                message: err
                                            });
                                        } else {
                                            account.password = hash;
                                            account.save((err) => {
                                                if (err) {
                                                    if (err.errors) {
                                                        if (err.errors.password) {
                                                            res.json({
                                                                success: false,
                                                                message: err.errors.password.message
                                                            });
                                                        } else {
                                                            res.json({
                                                                success: false,
                                                                message: err
                                                            });
                                                        }
                                                    } else {
                                                        res.json({
                                                            success: false,
                                                            message: "Could not reset password. Error: ",
                                                            err
                                                        });
                                                    }
                                                } else {
                                                    res.json({
                                                        success: true,
                                                        message: "Your password has been changed"
                                                    });
                                                }
                                            })
                                        }
                                    });
                                }
                            }
                        });
                    }
                ], function (err) {
                    if (err) {
                        res.json({
                            success: false,
                            message: err
                        })
                    }
                }
                );
            }
        }
    });

})

module.exports = router;
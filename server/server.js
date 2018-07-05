var express = require('express');
var body = require('body-parser')
var app = express();
var passport = require('passport');
var cors = require('cors');
var mongo = require('mongoose')
var db = require('./config/database')
var path = require('path')
app.use(express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || 8080;


app.listen(port, () => {
    console.log("adasd" + port)
});

// cau hinh db
mongo.connect(db.database);
mongo.connection.on('connected', () => {
    console.log('connected to databse ' + db.database)
})
//body parser
app.use(body.urlencoded({ extended: true }));
app.use(body.json())
// khai bao cros
app.use(cors())
// su dung routes
const account = require('./routes/account');
const bot = require('./routes/bot')
const block = require('./routes/block')
const menu = require('./routes/menu')
const faq = require('./routes/faq')
const chart = require('./routes/chart')
const unknown = require('./routes/unknown')
const broadcast = require('./routes/broadcast')
const fbuser = require('./routes/fbuser')
const dashboard = require('./routes/dashboard')
const configure = require('./routes/configure')


app.use('/account', account);
app.use('/bot', bot)
app.use('/bot', menu)
app.use('/bot', block)
app.use('/bot', faq)
app.use('/bot', chart)
app.use('/bot', unknown)
app.use('/bot', broadcast)
app.use('/bot', dashboard)
app.use('/bot', fbuser)
app.use('/bot', configure)



// passport
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

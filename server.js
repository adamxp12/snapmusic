var express = require('express'),
    app = express(),
    session = require('express-session'),
    csrf = require('csurf'),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    nunjucks = require('nunjucks'),
    config = require('./config'),
    mongoose = require('mongoose'),
    db = require('./func/db')
    func = require('./func/func');

mongoose.connect(config.dbconnect, { useNewUrlParser: true});
var snapUser = mongoose.model('snapUser', db.user);
mongoose.connection.on('error',function (err) {  
    console.log('Database connection error: ' + err);
    process.exit();
}); 

app.use(helmet.dnsPrefetchControl())
app.use(helmet.frameguard())
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.xssFilter())
app.use(session({
    secret: config.sessionkey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
app.use(bodyParser.urlencoded({extended: true}));
nunjucks.configure('templates', {
    autoescape: true,
    express: app
});
app.use('/public', express.static('public'))

// API routes above here to prevent CSRF validation checks
app.use(csrf())

app.get('/test', func.ensureAuthenticated, function(req, res) {
    res.send("logged in");
})

app.use('/login', require('./routes/login'));

mongoose.connection.on('connected', function () { 
    if(config.sessionkey=="changeme") {
        console.log('Server Not Started');
        console.log('Reason: Session Key default');
        console.log('See config.js for more info');
        console.log('');
        process.exit();
    } else {
        app.listen(config.port, function() {
            func.isNewInstall(function(c) {
                if(c) {
                    console.log("Is new install");
                } else {
                    console.log("Is not new install");
                }
            })
            console.log("SnapMusic listening on *:"+config.port);
        });
    }
});
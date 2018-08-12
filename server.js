var express = require('express'),
    app = express(),
    session = require('express-session'),
    csrf = require('csurf'),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    nunjucks = require('nunjucks'),
    mongoose = require('mongoose'),
    func = require('./func');

app.use(helmet.dnsPrefetchControl())
app.use(helmet.frameguard())
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.xssFilter())
app.use(session({
    secret: 'keyboard cat',
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

app.listen(3000, function() {
    console.log("Done")
})
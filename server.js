var express = require('express'),
    app = express(),
    session = require('express-session'),
    csrf = require('csurf'),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    nunjucks = require('nunjucks');

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

app.get('/', function(req, res) {
    res.send("Hello World");
})

app.listen(3000, function() {
    console.log("Done")
})
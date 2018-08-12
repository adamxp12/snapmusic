var mongoose = require('mongoose'),
bcrypt = require('bcrypt-nodejs'),

db = require('./db');

var snapUser = mongoose.model('snapUser', db.user);

module.exports = {
    isNewInstall: function(callback) {
        snapUser.findOne({}, function(err, user) {
            if(user === null) {
                // no users, must be a new install
                callback(true);
            } else {
                callback(false);
            }
        });
    },

    createUser: function(username, password, email, callback) {
        var newuser = new snapUser({
            username    : username,
            email     : email,
            password      : bcrypt.hashSync(password)
    
        });
        newuser.save(function(err, newuser) {
              if(err) callback(false);
              callback(true);
        });
    },

    ensureAuthenticated: function(req, res, next) {
        if (req.session.user) { return next(); } else {
            res.redirect('/login');
        } 
      },

    ensureUnAuthenticated: function(req, res, next) {
        if (req.session.user) { return res.redirect('/'); }
        next();
      }
}
module.exports = {
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
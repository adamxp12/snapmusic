var express = require('express'),
    router = express.Router(),
    func = require('../func');

router.get('/', func.ensureUnAuthenticated, function(req, res) {
    res.render('login.njk', {
        csrfToken: req.csrfToken()
    })
});

module.exports = router
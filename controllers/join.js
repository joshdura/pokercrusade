var express = require('express'),
	router = express.Router(),
	User = require('../models/user');

router.get('/', function(req, res) {
	res.render('join', { message: req.flash('joinMessage') });
});

router.post('/', global.passport.authenticate('local-signup', {
	successRedirect: '/',
	failureRedirect: '/join',
	failureFlash: true
}));

module.exports = router;
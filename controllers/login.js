var express = require('express'),
	router = express.Router();

router.get('/', function(req, res) {
	res.render('login', { message: req.flash('loginMessage') });
});

router.post('/', global.passport.authenticate('local-login', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

module.exports = router;
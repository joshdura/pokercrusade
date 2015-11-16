var express = require('express'),
	router = express.Router(),
	authentication = require('../middleware/authentication'),
	Lobby = require('../models/lobby');

router.use('/join', require('./join'));
router.use('/table', authentication, require('./tables'));
router.use('/login', require('./login'));
router.use('/logout', require('./logout'));

router.get('/', function(req, res) {
	if(req.isAuthenticated()){
		// TODO: Do we want to use multiple lobbies?
		var lobby = new Lobby(1);
		lobby.getTables().then(function(tables) {
			res.render('index', {tables: tables});
		});
	} else {
		res.render('login', { message: req.flash('loginMessage') });
	}
});

module.exports = router;
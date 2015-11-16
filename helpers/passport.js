var LocalStrategy = require('passport-local').Strategy,
	User = require('../models/user');

module.exports = function(passport) {
	var user = new User();

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		user.findById(id).done(function(user) {
			done(null, user);
		});
	});

	// Local Authentication Sign Up
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		user.join(email, password)
			.then(function(user) {
				return done(null, user);
			})
			.catch(function(error) {
				return done(null, false, req.flash('joinMessage', error));
			});
	}));

	// Local Authentication Sign In
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		user.findByEmail(email)
			.then(function(foundUser) {
				if(user.validPassword(password)){
					return done(null, foundUser);
				} else {
					return done(null, false, req.flash('loginMessage', 'Incorrect password.'));
				}
			})
			.catch(function(error) {
				return done(null, false, req.flash('loginMessage', error));
			});
	}));

	global.passport = passport;
};
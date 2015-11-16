var database = require('../models/database'),
	Promise = require('bluebird'),
	bcrypt = require('bcrypt-nodejs');

var User = function() {
	this.email = '';
	this.password = '';
	this.name = '';
};

User.prototype.findById = function(id) {
	var deferred = Promise.defer();

	database.readRow('users', id)
		.then(function(user) {
			this.email = user.email;
			this.password = user.password;
			this.name = user.name;

			deferred.resolve(user);
		}.bind(this))
		.catch(function(error) {
			console.log('error reading row');
			console.log(error);
		});

	return deferred.promise;
};

User.prototype.findByEmail = function(email) {
	var deferred = Promise.defer();

	database.getUserInfo(email)
		.then(function(user) {
			this.email = user.email;
			this.password = user.password;
			this.name = user.name;

			deferred.resolve(user);
		}.bind(this))
		.catch(function(error){
			deferred.reject(error);
		});

	return deferred.promise;
};

User.prototype.join = function(email, password) {
	var deferred = Promise.defer();
	// TODO: check for an actual email address
	database.createUser(email, this.generateHash(password))
		.then(function(user) {
			deferred.resolve(user);
		})
		.catch(function(error) {
			deferred.reject(error);
		});

	return deferred.promise;
};

User.prototype.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.prototype.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = User;
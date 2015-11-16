var database = require('../models/database'),
	_ = require('lodash'),
	Promise = require('bluebird');

var Table = function(id) {
	this.id = id;
	this.name = '';
	this.numSeats = 0;
	this.users = [];
	this.seats = [];
};

Table.prototype.getInfo = function() {
	var deferred = Promise.defer();

	database.readRow('tables', this.id).then(function(table){
		this.id = table.id;
		this.name = table.name;
		this.numSeats = table.seats;
		this.seats = table.seatMap || [];
		this.users = JSON.parse(table.users) || [];
		return deferred.resolve();
	}.bind(this));

	return deferred.promise;
};

Table.prototype.join = function(user) {
	// TODO: remove the password, we don't want that.

	// store the user in the database, but only unique users
	this.users.push(user);
	var users = _.uniq(this.users, 'email');
	this.users = users;

	database.updateRow('tables', this.id, 'users', JSON.stringify(this.users))
		.then(function(table) {
			this.users = JSON.parse(table.users);
		}.bind(this));
};

Table.prototype.leave = function(user) {
	// remove the user from the database
};

module.exports = Table;
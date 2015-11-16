var database = require('../models/database'),
	Promise = require('bluebird');

var Lobby = function(id) {
	this.id = id;
};

Lobby.prototype.getTables = function() {
	var deferred = Promise.defer();

	database.readRows('tables', 'lobby_id', this.id).then(function(tables){
		return deferred.resolve(tables);
	});

	return deferred.promise;
};

module.exports = Lobby;
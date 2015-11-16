var pg = require('pg'),
	Promise = require('bluebird');

var user = process.env.POKERCRUSADE_DATABASE_USER;
var pass = process.env.POKERCRUSADE_DATABASE_PASS;
var connectionString = 'postgres://localhost:5432/pokercrusade';

/*var database = new pg.Client(connectionString);
database.connect();*/

module.exports = {
	// generic read methods
	readTable: function(table) {
		var deferred = Promise.defer();

		pg.connect(connectionString, function(err, client, done) {
			// Handle connection errors to the database
			if(err) {
				done();
				deferred.reject(err);
				return;
			};

			var results = [];
			var query = client.query('SELECT * FROM ' + table + ' ORDER BY id ASC;');
			query.on('error', function(error) {
				deferred.reject(error);
			});
			query.on('row', function(row) {
				results.push(row);
			});
			query.on('end', function() {
				done();
				deferred.resolve(results);
			});
		});

		return deferred.promise;
	},
	readRows: function(table, field, id) {
		var deferred = Promise.defer();

		pg.connect(connectionString, function(err, client, done) {
			if(err) {
				done();
				deferred.reject();
				return;
			}

			var results = [];
			var query = client.query('SELECT * FROM ' + table + ' WHERE ' + field + '=' + id + ';');
			query.on('error', function(error) {
				deferred.reject(error);
			});
			query.on('row', function(row) {
				results.push(row);
			});
			query.on('end', function() {
				done();
				deferred.resolve(results);
			});
		});

		return deferred.promise;
	},
	readRow: function(table, id) {
		var deferred = Promise.defer();

		pg.connect(connectionString, function(err, client, done) {
			if(err) {
				done();
				deferred.reject();
				return;
			}

			var result = {};
			var query = client.query('SELECT * FROM ' + table + ' WHERE id=' + id + ';');
			query.on('error', function(error) {
				deferred.reject(error);
			});
			query.on('row', function(row) {
				result = row;
			});
			query.on('end', function() {
				done();

				if(result.id){
					deferred.resolve(result);
				} else {
					deferred.reject();
				}
			});
		});

		return deferred.promise;
	},
	// generic update methods
	updateRow: function(table, id, column, value) {
		var deferred = Promise.defer();

		pg.connect(connectionString, function(err, client, done) {
			if(err) {
				done();
				deferred.reject();
				return;
			}

			var result = {};

			client.query('UPDATE ' + table + ' SET ' + column + '=$2 WHERE id=$1;', [id, value]);

			var query = client.query('SELECT * FROM ' + table + ' WHERE id=$1;', [id]);
			query.on('row', function(row) {
				result = row;
			});
			query.on('end', function() {
				done();
				deferred.resolve(result);
			});
		});

		return deferred.promise;
	},
	// user methods
	getUserInfo: function(email) {
		var deferred = Promise.defer();

		pg.connect(connectionString, function(err, client, done) {
			if(err) {
				done();
				deferred.reject(err);
				return;
			}

			var result = {};
			var query = client.query('SELECT * FROM users WHERE email=$1;', [email]);
			query.on('error', function(error) {
				deferred.reject(error);
			});
			query.on('row', function(row) {
				result = row;
			});
			query.on('end', function() {
				done();

				if(result.id){
					deferred.resolve(result);
				} else {
					deferred.reject('No user with that email address exists');
				}
			});
		});

		return deferred.promise;
	},
	createUser: function(userEmail, userPassword) {
		var deferred = Promise.defer();

		pg.connect(connectionString, function(err, client, done) {
			if(err) {
				done();
				deferred.reject(err);
				return;
			}

			client.query('INSERT INTO users(email, password) values($1, $2) RETURNING id, email, password, name', [userEmail, userPassword], function(err, result) {
				done();

				if(err){
					switch(err.code) {
						case '23505':
							deferred.reject('That email address is already registered.');
						break;

						default:
							deferred.reject(err.detail);
						break;
					}

					return;
				};

				deferred.resolve(result.rows[0]);
			});
		});

		return deferred.promise;
	}
};
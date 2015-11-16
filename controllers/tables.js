var express = require('express'),
	router = express.Router(),
	Table = require('../models/table');

router.get('/:id', function(req, res) {
	var io = req.app.get('io');
	var socket = req.app.get('socket');
	var tableName = 'table.' + req.params.id;

	socket.join(tableName);

	var room = io.sockets.in(tableName);
	//room.on('table-action', handleAction);

	socket.on('disconnect', function() {
		io.emit('user-disconnect');
		socket.leave(tableName);
	});

	var table = new Table(req.params.id);
	table.getInfo().then(function() {
		table.join(req.user);

		var seats = table.seats;
		for(var i=0; i<seats.length; i++){
			console.log(seats[i].user);
		}

		res.render('tables/table', {id: req.params.id, name: table.name, users: table.users, numSeats: table.numSeats, seats: table.seats});
	});
});

module.exports = router;
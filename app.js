var express = require('express'),
	passport = require('passport'),
	flash = require('connect-flash'),
	session = require('express-session'),
	app = express(),
	http = require('http').createServer(app),
	io = require('socket.io')(http),
	bodyParser = require('body-parser'),
	port = process.env.PORT || 8000;

// Setup view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Setup body parser and public views.
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Setup passport authentication
app.use(session({ secret: 'pokerisfun', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Store the io object
app.set('io', io);
// Store the socket object
io.on('connection', function(socket) {
	console.log('connection');
	app.set('socket', socket);
});

// Load the passportjs config
require('./helpers/passport')(passport);
// Load our controllers and routes
app.use(require('./controllers'));

// Let's get this party started
http.listen(port, function() {
	console.log('Listening on port ' + port);
});
var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var os = require('os');
var fs = require('fs');
var host = os.platform() === 'win32' ? '127.0.0.1' : '0.0.0.0';
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: true
}));

app.set('port', process.env.PORT || 8001);
var port = process.env.PORT || 8001;
var server = http.createServer(app);

// Use the below 2 lines while running server directly
console.log('Server listening to http://' + host + ':' + port);
app.listen(port, host); 
app.use(express.static(__dirname));

app.get('/', function(req, res) {	
	var pathArray = __dirname.split("\\");
	pathArray.splice(pathArray.length-1, 1);
	var path = pathArray.join("\\");
	res.sendFile(path+'/index.html');
})

app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	next();
});

app.get('/getData', function(req, res) {
	
});





// export start module to start server via grunt file
module.exports = {
	start: function(port) {
		server.listen(port);
	}
}
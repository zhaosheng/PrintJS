var http = require('http');
var io = require('socket.io')(server);
var fs = require('fs');
var sys = require('sys')
var spawn = require('child_process').spawn;

var server = http.createServer(function(request, response) {
	console.log('Connected.');
	fs.readFile('./print.html', {'encoding': 'utf-8'}, function(err, data) {
		console.log('reading file.');
		if (err) {
			console.log('error');
			response.writeHead(404);
			response.write('Error!');
		} else {
			response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
			response.write(data);
		}
		response.end();
	});
});

server.listen(8081);
io.listen(server);
io.on('connection', function(socket) {
	var i = 0;
	setInterval(function() {
		socket.emit('message', {'mess': 'Hello World! ' + i++});
	}, 10000);
	var exec =spawn('tail', ['-f', '/tmp/foo']);

	exec.stdout.on('data', function(stdout) {
		socket.emit('sys', {'stdout': stdout.toString('utf-8')});
		// console.log(stdout);
	});
	exec.on('close', function(code) {
		socket.emit('sys', {'stdout': 'Process exited with {' + code + '}'});
	});
});


const WebSocket = require('ws');

function authenticatePlugin() {
	var port = grabPort();
	const ws = new WebSocket('ws://localhost:' + port);
	console.log('Attaching to port ' + port);

	ws.on('open', function open() {
		ws.send('WOOHOOO IM A PLUGIN');
	});

	ws.on('message', function incoming(data) {
		console.log(data);
	});
}
exports.authenticatePlugin = authenticatePlugin;

//Grab the port to listen on from launch args
function grabPort() {
	var matchFound = false;
	for (var i = 0; i < process.argv.length; i++) {
		if (process.argv[i] == '--port') {
			matchFound = i;
		}
	}
	if (matchFound) {
		return parseInt(process.argv[matchFound + 1]);
	} else {
		throw new Error('ERR: Unable to grab port from launch arguments');
	}
}

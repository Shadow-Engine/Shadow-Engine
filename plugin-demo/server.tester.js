const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
	console.log('Client Connected, Waiting for authentication');

	ws.on('message', function incoming(message) {
		console.log('recevied: ' + message);
		parseIncomingMessage(message);
	});
});

function parseIncomingMessage(message) {}

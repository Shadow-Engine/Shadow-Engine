const WebSocket = require('ws');
const fs = require('fs');
const os = require('os');

function authenticatePlugin(callback) {
	var port = grabPort();
	const ws = new WebSocket('ws://localhost:' + port);
	console.log('Attaching to port ' + port);

	var authToken = getAuthentication();

	ws.on('open', function open() {
		ws.send(
			JSON.stringify({
				token: authToken
			})
		);
	});

	ws.on('message', function incoming(data) {
		console.log(data);
	});
}
exports.authenticatePlugin = authenticatePlugin;

function getAuthentication() {
	var authloc = getShadowEngineDataDir() + '/plugins/auth.sec';
	var filter = /\n/g;
	if (fs.existsSync(authloc)) {
		var data = fs.readFileSync(authloc, 'utf-8').substr(6);
		return data.replace(filter, '');
	} else {
		throw new Error("Authentication file doesn't exist!");
	}
}

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

// Stolen directly from the compiled source of the Shadow Engine Utilities Manager
function getShadowEngineDataDir() {
	var directory;
	if (process.platform == 'win32') {
		directory = os.homedir() + '/AppData/Roaming/Shadow';
	} else {
		directory = os.homedir() + '/Shadow';
	}
	return directory;
}

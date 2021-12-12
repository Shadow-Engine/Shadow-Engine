const { WebSocketServer } = require('ws');
const portfinder = require('portfinder');
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const child_process = require("child_process");

var authtoken = uuidv4();

portfinder.getPort(function(err, port) {
	if (err) throw err;

	//fs.writeFileSync("/home/vince/.config/Shadow/engine-data/port", port.toString());
	//fs.writeFileSync("/home/vince/.config/Shadow/engine-data/authtoken", authtoken);
	const wss = new WebSocketServer({ port: port });
	
	wss.on('connection', function connection(ws) {

		ws.id = uuidv4();

		ws.on('message', function message(data) {
			console.log("Received \n\t" + data + "\nFrom client\n\t" + ws.id);
		});

	});

	child_process.exec(`deno run --allow-net=localhost:${port} plugin.ts ${port} ${authtoken}`, (error, stdout, stderr) => {
		if (error) throw error;
		if (stderr) throw stderr;
		console.log(stdout);
	});
})



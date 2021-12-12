// To be run with: deno run --allow-read=/home/vince/.config/Shadow/engine-data plugin.ts

// Old way
// const portStr = await Deno.readTextFile("/home/vince/.config/Shadow/engine-data/port");
// const token = await Deno.readTextFile("/home/vince/.config/Shadow/engine-data/authtoken");
// const port = parseInt(portStr)

console.log(Deno.args);

const portstr = Deno.args[0];
const port = parseInt(Deno.args[0]);
const token = Deno.args[1];

const ws = new WebSocket("ws://localhost:" + portstr);

ws.onopen = function() {

	ws.send(JSON.stringify({
		"packetType": "Authentication",
		"content": token
	}));

}
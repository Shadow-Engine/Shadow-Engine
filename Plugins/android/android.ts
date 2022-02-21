let port: string = Deno.args[0];
let authtoken: string = Deno.args[1];

const ws: WebSocket = new WebSocket(
	'ws://localhost:' + port + '?token=' + authtoken
);

ws.onopen = function () {
	console.log('WebSocket Connection opened');
};

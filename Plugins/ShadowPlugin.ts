let portStr: string = Deno.args[0];
let port: number = parseInt(portStr);
let token: string = Deno.args[1];

let ws: WebSocket;

export function connectToShadow(callback: Function) {
	ws = new WebSocket('ws://localhost:' + port + '?token=' + token);

	ws.onopen = function () {
		ws.send(
			JSON.stringify({
				packetType: 'Console',
				data: 'Console log test'
			})
		);
	};
}

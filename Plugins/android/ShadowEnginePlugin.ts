// DENO FILE

let pluginID = 'com.unset.plugin';

export function setPluginID(id: string) {
	pluginID = id;
}

export function connectToShadow(): WebSocket {
	let engineWsPort: number | null = null;
	for (let i = 0; i < Deno.args.length; i++) {
		if (Deno.args[i] == '--port') {
			engineWsPort = parseInt(Deno.args[i + 1]); // Set the one after the found port text
		}
	}

	if (!engineWsPort) {
		throw new Error('ERR: Could not get port to start plugin on');
	}

	return new WebSocket('ws://localhost:' + engineWsPort);
}

export function authenticate(websocket: WebSocket) {
	websocket.send(
		JSON.stringify({
			header: 'auth',
			id: pluginID,
			payload: 'TODO FOR VINCE, READ THE AUTH FILE'
		})
	);
}

export let ShadowAPI: object = {
	config: {},
	utils: {}
};

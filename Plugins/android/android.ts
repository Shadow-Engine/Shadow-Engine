//DENO FILE

import {
	setPluginID,
	connectToShadow,
	authenticate
} from './ShadowEnginePlugin';

setPluginID('tk.a77zsite.shadow.android');
const ws: WebSocket = connectToShadow();
ws.onopen = function () {
	authenticate(ws);
};

/* const ws = new WebSocket('ws://localhost:8000');

ws.onopen = function () {
	setInterval(function () {
		ws.send('HELLO');
	}, 2000);
};
 */

// THIS IS A RENDERER SCRIPT

import { ipcRenderer } from 'electron';

window.onload = function () {
	ipcRenderer.on('packageId', (_event, data) => {
		document.getElementById('visiblePluginId').innerText =
			sanatizePluginId(data);
	});
};

function sanatizePluginId(id: string): string {
	return id.replace(/\//g, '');
}

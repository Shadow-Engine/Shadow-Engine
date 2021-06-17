// THIS IS A RENDERER SCRIPT

import { ipcRenderer } from 'electron';
import got = require('got');
import * as Product from '../product.json';

window.onload = function () {
	ipcRenderer.on('packageId', (_event, data) => {
		let id: string = sanatizePluginId(data);
		document.getElementById('visiblePluginId').innerText = id;

		ipcRenderer.send('PluginInstall.fetchPluginConfig', id);

		(async () => {
			try {
				const response = await got(
					Product.ProductWebsite + '/x/' + id + '/icon.png'
				);
				let imageElement = document.createElement('img');
				imageElement.height = 90;
				imageElement.width = 90;
				console.log(response.body);
				imageElement.src = URL.createObjectURL(response.body);
				document.getElementById('icon-col').appendChild(imageElement);
			} catch (error) {
				console.log(error);
			}
		})();
	});

	/* ipcRenderer.on('Main.pluginConfigReturn', (_event, data) => {
		document.getElementById('name').innerText = readConfig(data, 'pretty');
		document.getElementById('verAndAuthor').innerText =
			'Version ' +
			readConfig(data, 'version') +
			' By ' +
			readConfig(data, 'author');
	});*/

	/* ipcRenderer.on('Main.pluginIconReturn', (_event, data) => {
		var imageElement = document.createElement('img');
		imageElement.height = 90;
		imageElement.width = 90;
		imageElement.src = data;
		document.getElementById('icon-col').appendChild(imageElement);
	}); */
};

function sanatizePluginId(id: string): string {
	return id.replace(/\//g, '');
}

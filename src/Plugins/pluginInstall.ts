// THIS IS A RENDERER SCRIPT

import { ipcRenderer } from 'electron';
import * as Product from '../product.json';

window.onload = function () {
	let site: string = Product.ProductWebsite;
	ipcRenderer.on('packageId', (_event, data) => {
		let id: string = sanatizePluginId(data);
		document.getElementById('visiblePluginId').innerText = id;

		ipcRenderer.send('PluginInstall.fetchPluginConfig', id);

		// Sometimes I think a little too hard for solutions to problems,
		// when I could've just set the img's src to the icon url -_-
		let imageElement = document.createElement('img');
		imageElement.height = 90;
		imageElement.width = 90;
		imageElement.src = site + '/x/' + id + '/icon.png';
		document.getElementById('icon-col').appendChild(imageElement);
	});

	ipcRenderer.on(
		'Main.pluginConfigReturn',
		(_event, pretty, version, author) => {
			document.getElementById('name').innerText = pretty;
			document.getElementById('verAndAuthor').innerText =
				'Version ' + version + ' By ' + author;
		}
	);

	ipcRenderer.on('Main.pluginIconReturn', (_event, data) => {
		/* console.log('Got Image Data');
		console.log(data);
		var imageElement = document.createElement('img');
		imageElement.height = 90;
		imageElement.width = 90;
		imageElement.src = URL.createObjectURL(data.blob());
		document.getElementById('icon-col').appendChild(imageElement); */
	});
};

function sanatizePluginId(id: string): string {
	return id.replace(/\//g, '');
}

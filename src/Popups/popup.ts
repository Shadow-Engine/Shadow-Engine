// THIS IS A RENDERER SCRIPT

import { ipcRenderer } from 'electron';

window.onload = function () {
	ipcRenderer.on('type', (_event, type: string) => {
		if (type == 'error') {
			document
				.getElementById('icon')
				.setAttribute('src', '../../media/Error.svg');
		}
		if (type == 'info') {
			document
				.getElementById('icon')
				.setAttribute('src', '../../media/Info.svg');
		}

		console.log(type);
	});

	ipcRenderer.on('title', (_event, title: string) => {
		document.getElementById('title').innerText = title;
		document.title = title;
	});

	ipcRenderer.on('content', (_event, content) => {
		document.getElementById('content').innerText = content;
	});
};

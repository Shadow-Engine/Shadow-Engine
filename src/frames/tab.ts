// THIS IS A RENDERER SCRIPT

import { ipcRenderer } from 'electron';

window.onload = function () {
	ipcRenderer.on('windowConstructionOptions', (_event, constructionOptions) => {
		if (constructionOptions.useNativeTitlebar) {
			document.getElementById('close').style.display = 'none';
		}
	});

	let tabgrabber = document.getElementById('tabgrabber');
	let isGrabbing: boolean = false;

	tabgrabber.addEventListener('mousedown', () => {
		tabgrabber.style.cursor = 'grabbing';
		isGrabbing = true;
	});

	tabgrabber.addEventListener('mouseup', () => {
		tabgrabber.style.cursor = 'grab';
		isGrabbing = false;
	});

	tabgrabber.addEventListener('mousemove', () => {
		if (isGrabbing) {
			// Has to be done this way because dragstart wasnt working
			ipcRenderer.send('dragTabEvent');
			isGrabbing = false; // change this so function only gets called once
		}
	});

	if (process.platform == 'darwin') {
		// MacOS Detected, remove standard nav button
		document.getElementById('close').style.display = 'none';
	}
};

// THIS IS A RENDERER SCRIPT

import { ipcRenderer } from 'electron';

window.onload = function () {
	ipcRenderer.on('windowConstructionOptions', (_event, constructionOptions) => {
		if (constructionOptions.useNativeTitlebar) {
			document.getElementById('close').style.display = 'none';
			document.getElementById('minimize').style.display = 'none';
			document.getElementById('maximize').style.display = 'none';
		}
	});

	document.getElementById('maximize').addEventListener('click', () => {
		ipcRenderer.send('WindowManager.maximizeToggle');
	});

	document.getElementById('minimize').addEventListener('click', () => {
		ipcRenderer.send('WindowManager.minimize');
	});

	if (process.platform == 'darwin') {
		// MacOS Detected, move woodmark to right,
		// create space for traffic lights, and
		// remove standard nav buttons
		document.getElementById('woodmark').classList.add('macos-woodmark');
		document
			.getElementById('tab-container')
			.classList.add('macos-tab-container');

		document.getElementById('close').style.display = 'none';
		document.getElementById('minimize').style.display = 'none';
		document.getElementById('maximize').style.display = 'none';
	}
};

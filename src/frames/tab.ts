// THIS IS A RENDERER SCRIPT

import { ipcRenderer } from 'electron';

window.onload = function () {
	ipcRenderer.on('windowConstructionOptions', (_event, constructionOptions) => {
		if (constructionOptions.useNativeTitlebar) {
			document.getElementById('close').style.display = 'none';
		}
	});

	if (process.platform == 'darwin') {
		// MacOS Detected, remove standard nav button
		document.getElementById('close').style.display = 'none';
	}
};

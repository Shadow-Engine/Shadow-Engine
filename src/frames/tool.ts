// THIS IS A RENDERER SCRIPT

import { ipcRenderer } from 'electron';

window.onload = function () {
	ipcRenderer.on('windowConstructionOptions', (_event, constructionOptions) => {
		if (constructionOptions.useNativeTitlebar) {
			document.getElementById('titlebar').style.display = 'none';
		}

		document.title = constructionOptions.windowTitle;
		document.getElementById('windowtitle').innerText =
			constructionOptions.windowTitle;
	});

	if (process.platform == 'darwin') {
		// MacOS Detected, remove standard nav button
		document.getElementById('close').style.display = 'none';
	}
};

// THIS IS A RENDERER SCRIPT

import { ipcRenderer } from 'electron';

window.onload = function () {
	ipcRenderer.on('windowConstructionOptions', (_event, constructionOptions) => {
		if (constructionOptions.useNativeTitlebar) {
			document.getElementById('titlebar').style.display = 'none';
		}

		//TODO: Delete me
		document.write(constructionOptions.args.toString());
	});

	document.getElementById('maximize').addEventListener('click', function () {
		ipcRenderer.send('WindowManager.maximizeToggle');
	});

	document.getElementById('minimize').addEventListener('click', function () {
		ipcRenderer.send('WindowManager.minimize');
	});

	if (process.platform == 'darwin') {
		// MacOS Detected, remove standard nav buttons
		document.getElementById('close').style.display = 'none';
		document.getElementById('minimize').style.display = 'none';
		document.getElementById('maximize').style.display = 'none';
	}
};

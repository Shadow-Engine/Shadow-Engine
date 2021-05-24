// THIS IS A RENDERER SCRIPT

import { ipcRenderer } from 'electron';

window.onload = function () {
	ipcRenderer.on('windowConstructionOptions', (event, constructionOptions) => {
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
};

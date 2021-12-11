// RENDERER SCRIPT

import { ipcRenderer } from 'electron';

let streamSelector = document.getElementById(
	'streamselector'
) as HTMLSelectElement;

let databox = document.getElementById('data') as HTMLTextAreaElement;

streamSelector.addEventListener('change', function () {
	databox.value += streamSelector.value;
});

ipcRenderer.on('Main.Update', function (_event, streams) {
	console.log('Got data!');
	console.log(streams);

	while (streamSelector.firstChild)
		streamSelector.removeChild(streamSelector.firstChild);

	for (let i = 0; i < streams.length; i++) {
		let optionElement: HTMLOptionElement = document.createElement('option');
		optionElement.value = i.toString();
		optionElement.appendChild(document.createTextNode(streams[i].name));
		streamSelector.appendChild(optionElement);
	}
});

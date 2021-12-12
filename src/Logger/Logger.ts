// RENDERER SCRIPT

import { ipcRenderer } from 'electron';
import { StreamInterface } from '../toplevel/Logger';

let globalStreams: StreamInterface[];
let selectedStream = 0;

let streamSelector = document.getElementById(
	'streamselector'
) as HTMLSelectElement;

let databox = document.getElementById('data') as HTMLTextAreaElement;

function printToDatabox(data: string): void {
	databox.value += data;
}

function clearDatabox(): void {
	databox.value = '';
}

function updateStream() {
	clearDatabox();
	printToDatabox('Switching to Stream: ' + selectedStream + '\n');

	printToDatabox(globalStreams[selectedStream].data);

	databox.scrollTop = databox.scrollHeight;
}

streamSelector.addEventListener('change', function () {
	selectedStream = parseInt(streamSelector.value);
	updateStream();
});

ipcRenderer.on('Main.Update', function (_event, streams: StreamInterface[]) {
	globalStreams = streams;

	while (streamSelector.firstChild)
		streamSelector.removeChild(streamSelector.firstChild);

	for (let i = 0; i < streams.length; i++) {
		let optionElement: HTMLOptionElement = document.createElement('option');
		optionElement.value = i.toString();
		optionElement.appendChild(document.createTextNode(streams[i].name));
		streamSelector.appendChild(optionElement);
	}

	updateStream();
});

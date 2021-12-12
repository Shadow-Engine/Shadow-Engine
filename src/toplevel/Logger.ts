// Renderer safe

import { ipcRenderer } from 'electron';

export interface StreamInterface {
	name: string;
	data: string;
}

export function createNewStream(streamName: string): void {
	ipcRenderer.send('Logger.createNewStream', streamName);
}

export function writeToStream(
	streamName: string,
	data: string | number | object
): void {
	let outdata: string;

	if (typeof data == 'number') {
		outdata = data.toString();
	} else if (typeof data == 'string') {
		outdata = data;
	} else if (typeof data == 'object') {
		outdata = JSON.stringify(data, null, '\t');
	}

	ipcRenderer.send('Logger.writeToStream', streamName, outdata);
}

export function openLogger(): void {
	ipcRenderer.send('Logger.openLogger');
}

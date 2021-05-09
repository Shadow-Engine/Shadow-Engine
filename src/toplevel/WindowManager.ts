// Manager for sending IPC messages between windows and creating windows

import { BrowserWindow } from 'electron';

export function openProjectBrowser() {}

interface Window {
	decorations: windowDecorations;
	x: number;
	y: number;
	height: number;
	width: number;
}
type windowDecorations = 'basic' | 'undecorated' | 'tabbed' | 'tool';

export function createWindow() {
	let window = new BrowserWindow({
		width: 800,
		height: 400
	});

	window.loadURL(`file://${__dirname}/index.html`);
	window.show();
	window.on('closed', function () {
		window = null;
	});
}

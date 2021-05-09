// Manager for sending IPC messages between windows and creating windows

import { BrowserWindow } from 'electron';
import { getEngineConfig } from './ConfigurationManager';

let useNativeTitlebar = getEngineConfig().useNativeTitleBar;

export function openProjectBrowser() {}

interface WindowOptions {
	decorations: windowDecorations;
	x?: number;
	y?: number;
	height: number;
	width: number;
}
type windowDecorations = 'basic' | 'undecorated' | 'tabbed' | 'tool';

export function createWindow(settings: WindowOptions) {
	let window = new BrowserWindow({
		width: settings.width,
		height: settings.height,
		center: true,
		x: settings.x,
		y: settings.y,
		darkTheme: true,
		frame: useNativeTitlebar // if useNativeTitlebar is true, then so is the frame
	});

	window.loadURL(`file://${__dirname}/index.html`);
	window.show();
	window.on('closed', function () {
		window = null;
	});
}

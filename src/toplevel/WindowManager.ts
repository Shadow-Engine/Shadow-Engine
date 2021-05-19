// Manager for sending IPC messages between windows and creating windows

import { BrowserWindow } from 'electron';
import { writeFileSync } from 'fs';
import { getEngineConfig } from './ConfigurationManager';

let useNativeTitlebar: boolean = getEngineConfig().useNativeTitleBar;

export function openProjectBrowser() {}

export interface WindowOptions {
	decorations: windowDecorations;
	x?: number;
	y?: number;
	height: number;
	width: number;
	url: string;
}

//A Basic type decoration is just a window that will follow useNativeTitlebar rules
//Tabbed decoration is the type used on the main editor and it's really just a container for 'tab' decorations
//undecorated type decorations might be a context menu, popup, or tooltip. Note that the undecorated type is not limited to just those types
type windowDecorations = 'basic' | 'undecorated' | 'tabbed' | 'tab' | 'tool';

export function createWindow(settings: WindowOptions) {
	//TODO this actual calling function probably has to be called from the main process with ipc so renderers can execute it
	let window = new BrowserWindow({
		width: settings.width,
		height: settings.height,
		center: true,
		x: settings.x,
		y: settings.y,
		darkTheme: true,
		frame: useNativeTitlebar, // if useNativeTitlebar is true, then so is the frame
		webPreferences: { nodeIntegration: true }
	});

	/* let frame = new BrowserWindow({
		width: 800,
		height: 450,
		webPreferences: {
			offscreen: true
		}
	});

	frame.loadURL('https://github.com');
	frame.webContents.on('paint', function (event, dirty, image) {
		writeFileSync('C:\\Users\\Owner\\Documents\\frame.png', image.toPNG());
	});
	frame.webContents.setFrameRate(60); */

	//window.webContents.openDevTools();

	window.loadFile(settings.url);
	window.show();
	window.on('closed', function () {
		window = null;
	});
	window.webContents.on('did-finish-load', () => {});
}

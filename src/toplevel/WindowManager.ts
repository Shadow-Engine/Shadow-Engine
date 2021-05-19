// Manager for sending IPC messages between windows and creating windows

import { BrowserView, BrowserWindow } from 'electron';
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
		webPreferences: { nodeIntegration: true },
		minWidth: 100,
		minHeight: 100
	});

	window.loadFile('../dom/frames/basic.html');
	window.show();
	window.on('closed', function () {
		window = null;
	});
	window.webContents.on('did-finish-load', () => {
		// Send settings data to the window so it knows how to handle the current situation
		window.webContents.send('windowConstructionOptions', {
			useNativeTitlebar: useNativeTitlebar
		});
	});

	// Load the actual content

	let frame = new BrowserView({
		webPreferences: {
			nodeIntegration: true
		}
	});
	window.setBrowserView(frame);
	frame.setBounds({
		width: settings.width,
		x: 0,
		height: useNativeTitlebar ? settings.height : settings.height - 29,
		y: useNativeTitlebar ? 0 : 29
	});
	frame.webContents.loadFile(settings.url);
	frame.setAutoResize({
		height: true,
		width: true
	});
}

import { app, BrowserWindow, ipcMain } from 'electron';
import {
	getEngineConfig,
	initializeConfig
} from './toplevel/ConfigurationManager';
import { createWindow, WindowOptions } from './toplevel/WindowManager';

/*
	Prepare Shadow Engine config files, windows and whatnot
*/
function initMain() {
	initializeConfig();

	createWindow({
		height: 450,
		width: 800,
		decorations: 'basic',
		url: '../dom/frames/basic.html'
	});
}

app.on('ready', () => {
	initMain();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) initMain();
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// Utilities Manager
ipcMain.on('main.createPopup', () => {});

// Window Manager

ipcMain.on('WindowManager.createWindow', (event, settings: WindowOptions) => {
	let useNativeTitlebar: boolean = getEngineConfig().useNativeTitleBar;

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

	window.loadFile(settings.url);
	window.show();
	window.on('closed', function () {
		window = null;
	});

	event.returnValue = window;
});

import { app, BrowserWindow, ipcMain } from 'electron';
import { initializeConfig } from './toplevel/ConfigurationManager';
import { createWindow } from './toplevel/WindowManager';

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

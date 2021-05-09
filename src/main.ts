import { app, BrowserWindow } from 'electron';
import { initializeConfig } from './toplevel/ConfigurationManager';
import { createWindow } from './toplevel/WindowManager';

let mainWindow: BrowserWindow;

/*
	Prepare Shadow Engine config files, windows and whatnot
*/
function initMain() {
	initializeConfig();

	createWindow();
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

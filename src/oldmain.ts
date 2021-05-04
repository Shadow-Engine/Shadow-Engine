/*

! THIS FILE SHOULD BE DISCARDED, IN IT'S CURRENT STATE,
! IT'S ONLY USED AS REFERENCE

*/

//Global
let shadowEngineDataDir: string;
if (process.platform == 'linux') {
	shadowEngineDataDir = require('os').homedir + '/Shadow Engine';
} else if (process.platform == 'win32') {
	shadowEngineDataDir =
		require('os').homedir + '\\AppData\\Roaming\\Shadow Engine';
}

import { app, BrowserWindow } from 'electron';

let mainWindow;
function createWindow() {
	mainWindow = new BrowserWindow({
		height: 450,
		width: 800,
		webPreferences: {
			nodeIntegration: true
		}
	});

	mainWindow.loadURL(`file://${__dirname}/../dom/index.html`);

	mainWindow.on('closed', function () {
		mainWindow = null;
	});
}

app.on('ready', function () {
	createWindow();

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

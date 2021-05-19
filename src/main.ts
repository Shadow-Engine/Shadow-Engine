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
		url: '../dom/index.html'
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
	// stub
});

ipcMain.on('WindowManager.maximizeToggle', () => {
	//This works because when you click the maximize button even when
	//you're not focused on the window, the act of clicking focuses it,
	//unless the window's focusable value is false
	if (BrowserWindow.getFocusedWindow().isMaximized()) {
		BrowserWindow.getFocusedWindow().unmaximize();
	} else {
		BrowserWindow.getFocusedWindow().maximize();
	}
});

ipcMain.on('WindowManager.minimize', () => {
	//This works because when you click the minimize button even when
	//you're not focused on the window, the act of clicking focuses it,
	//unless the window's focusable value is false
	BrowserWindow.getFocusedWindow().minimize();
});

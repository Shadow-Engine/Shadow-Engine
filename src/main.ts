import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import { openProcessManager } from './scripts/ProcessManager';
import { initializeConfig } from './toplevel/ConfigurationManager';
import { createWindow, WindowOptions } from './toplevel/WindowManager';
import { resolve as pathresolve } from 'path';
import electronIsDev = require('electron-is-dev');
import { repoPluginInstall } from './toplevel/PluginManager';

const globalMenuTemplate: object[] = [
	{
		label: 'Shadow Engine',
		submenu: [
			{
				label: 'Quit',
				accelerator: 'CmdOrCtrl+Q',
				click() {
					app.quit();
				}
			},
			{
				label: 'Close Window',
				accelerator: 'CmdOrCtrl+W',
				click() {
					BrowserWindow.getFocusedWindow().close();
				}
			},
			{ type: 'separator' },
			{
				label: 'Toggle Parent DevTools',
				accelerator: 'CmdOrCtrl+Shift+I',
				click() {
					BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
					BrowserWindow.getFocusedWindow().getBrowserView().setBounds({
						height: 100,
						width: 100,
						x: 0,
						y: 29
					});
				}
			},
			{
				label: 'Toggle Child DevTools',
				accelerator: 'CmdOrCtrl+Shift+C',
				click() {
					BrowserWindow.getFocusedWindow()
						.getBrowserView()
						.webContents.toggleDevTools();
				}
			},
			{ type: 'separator' },
			{
				label: 'Open Process Manager',
				accelerator: 'CmdOrCtrl+Shift+`',
				click() {
					openProcessManager();
				}
			}
		]
	}
];

/*
	Prepare Shadow Engine config files, windows and whatnot
*/
function initMain() {
	initializeConfig();

	const menu = Menu.buildFromTemplate(globalMenuTemplate);
	Menu.setApplicationMenu(menu);

	//Check launch arguments for things like protocol handlers and launch arguments
	for (let i: number = 0; i < process.argv.length; i++) {
		if (process.argv[i].startsWith('shadow-engine://plugin')) {
			repoPluginInstall(process.argv[i]);
			return; // No need to execute any more of the program
		}
	}

	createWindow({
		height: 450,
		width: 800,
		decorations: 'basic',
		url: '../dom/index.html'
	});

	/* createWindow({
		height: 800,
		width: 200,
		decorations: 'undecorated',
		url: '../dom/index.html',
		x: 10,
		y: 10
	}); */

	/* createWindow({
		height: 450,
		width: 800,
		decorations: 'tool',
		url: '../dom/index.html'
	}); */
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

app.removeAsDefaultProtocolClient('shadow-engine');
app.setAsDefaultProtocolClient('shadow-engine');

if (electronIsDev && process.platform === 'win32') {
	app.setAsDefaultProtocolClient('shadow-engine', process.execPath, [
		pathresolve(process.argv[1])
	]);
} else {
	app.setAsDefaultProtocolClient('shadow-engine');
}

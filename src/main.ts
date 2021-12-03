import {
	app,
	BrowserView,
	BrowserWindow,
	dialog,
	ipcMain,
	Menu,
	WebContents
} from 'electron';
import { openProcessManager } from './scripts/ProcessManager';
import {
	getEngineConfig,
	initializeConfig,
	readConfig
} from './toplevel/ConfigurationManager';
import { createWindow, WindowOptions } from './toplevel/WindowManager';
import { resolve as pathresolve } from 'path';
import electronIsDev = require('electron-is-dev');
import {
	initializePluginAuthentication,
	getPluginTable,
	repoPluginInstall,
	startPluginHost
} from './toplevel/PluginManager';
import {
	contentMenuItemOptions,
	contextMenuOptions,
	createErrorPopup
} from './toplevel/UtilitiesManager';
import * as Product from './product.json';
import fetch from 'node-fetch';
import { getMouseX, getMouseY } from './native/IOUtils';
// import { DownloadManager } from 'electron-download-manager';

//Check launch arguments to see if debugger should enable,
//yes we also have an argument check in the initMain function
console.log(process.argv);
for (let i: number = 0; i < process.argv.length; i++) {
	console.log(process.argv[i]);
	if (process.argv[i].startsWith('debug')) {
		app.commandLine.appendSwitch('remote-debugging-port', '9222');
		console.log('Shadow Engine Remote Debugger started on port 9222');
	}
}

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
				label: 'Toggle Parent DevTools Without Child WebView interference',
				accelerator: 'CmdOrCtrl+Shift+O',
				click() {
					BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
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
			},
			{
				label: 'Reload Window',
				accelerator: 'CmdOrCtrl+R',
				click() {
					BrowserWindow.getFocusedWindow().reload();
				}
			},
			{
				label: 'Reload Child',
				accelerator: 'CmdOrCtrl+Shift+R',
				click() {
					BrowserWindow.getFocusedWindow()
						.getBrowserView()
						.webContents.reload();
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
	initializePluginAuthentication();

	const menu = Menu.buildFromTemplate(globalMenuTemplate);
	Menu.setApplicationMenu(menu);

	//Check launch arguments for things like protocol handlers and launch arguments
	for (let i: number = 0; i < process.argv.length; i++) {
		if (process.argv[i].startsWith('shadow-engine://plugin')) {
			repoPluginInstall(process.argv[i]);
			return; // No need to execute any more of the program
		}
	}

	// startPluginHost();

	launchProjectManager();

	console.log(getPluginTable());
	//createErrorPopup('Shadow Engine Internal Error', 'AHhhhhh');
}

let projectManager: BrowserWindow;
let editorWindow: BrowserWindow;

function launchProjectManager() {
	projectManager = createWindow({
		decorations: 'tool',
		height: 450,
		width: 800,
		url: '../dom/editor/ProjectManager.html',
		windowTitle: 'Project Manager'
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
ipcMain.on('util.createErrorPopup', (_event, title, content) => {
	createErrorPopupFromMAIN(title, content);
});

export function createErrorPopupFromMAIN(title: string, content: string) {
	if (getEngineConfig().useNativePopups) {
		//Native Error Dialog
		dialog.showErrorBox(title, content);
	} else {
		//Shadow Error Dialog
		createWindow({
			decorations: 'undecorated',
			height: 300,
			width: 600,
			url: '../dom/Popups/popup.html',
			ipcData: [
				'type:error',
				`title:${title}`,
				`content:${content}`,
				'buttons:'
			],
			onTop: true
		});
	}
}

// Window Manager

ipcMain.on('WindowManager.createWindow', (event, settings: WindowOptions) => {
	// stub
});

// Tab Manager

ipcMain.on('dragTabEvent', (event) => {
	/* event.sender.getOwnerBrowserWindow(). */
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

// Plugin Installer

ipcMain.on('PluginInstall.fetchPluginConfig', (event, packageId) => {
	let site: string = Product.ProductWebsite;

	console.log('Fetching Plugin Data...');

	fetch(site + '/x/' + packageId + '/plug.sec').then(async (response: any) => {
		if (!response.ok) {
			throw new Error('ERR: HTTP Error ' + response.statusText);
		}
		let data = await response.text();
		event.sender.send(
			'Main.pluginConfigReturn',
			readConfig(data, 'pretty'),
			readConfig(data, 'version'),
			readConfig(data, 'author')
		);
		console.log('Sending Meta-Data...');
	});
});

ipcMain.on('createEditorWindow', (_event, projectName) => {
	editorWindow = createWindow({
		height: 900,
		width: 1500,
		decorations: 'basic',
		windowTitle: 'Shadow Editor',
		url: '../dom/editor/Main.html'
	});

	editorWindow.webContents.on('did-finish-load', function () {
		if (projectManager !== null) {
			projectManager.close();
		}
	});
});

let lastOpenedContextMenu: WebContents;

ipcMain.on(
	'util.internal.createContextMenu',
	(event, stringoptions: string /* , callback: contentMenuItemOptions */) => {
		let x: number;
		let y: number;
		let options: contextMenuOptions = JSON.parse(stringoptions);

		if (options.screenPositionX && options.screenPositionY) {
			//Use provided position
			x = options.screenPositionX;
			y = options.screenPositionY;
		} else {
			//Use mouse cursor position
			x = getMouseX();
			y = getMouseY();
		}

		let contextMenuWindow: BrowserWindow = createWindow({
			height: options.items.length * 20,
			width: 200,
			decorations: 'undecorated',
			url: '../dom/Popups/context-menu.html',
			onTop: true,
			windowTitle: 'Context Menu',
			x: x,
			y: y
		});

		contextMenuWindow.webContents.on('did-finish-load', function () {
			contextMenuWindow.webContents.send(
				'main.createContextMenu',
				JSON.stringify(options) /* ,
				callback */
			);
		});

		contextMenuWindow.on('blur', function () {
			contextMenuWindow.close();
		});

		lastOpenedContextMenu = event.sender;
	}
);

ipcMain.on('context-menu.return-value', function (_event, index) {
	console.log(index);
	lastOpenedContextMenu.send('context-menu-callback', index);
});

ipcMain.on('util.setWindowOnTop', function () {
	BrowserWindow.getFocusedWindow().setAlwaysOnTop(true);
});

/* app.on('browser-window-created', function () {
	console.log('NEW BROWSER WINDOW!');
	refreshContextMenus();
}); */

/* app.on('web-contents-created', function () {
	console.log('WEBCONTENTS CREATED');
	refreshContextMenus();
}); */

// Function to refresh default context menus on webContents
// for things like right-click copy/paste menus.
// This code is nice but it's kinda buggy.
/* function refreshContextMenus() {
	let allWindows: BrowserWindow[] = BrowserWindow.getAllWindows();
	for (let i: number = 0; i < allWindows.length; i++) {
		allWindows[i].webContents.on('context-menu', (e, props) =>
			createMenuListener(e, props, allWindows[i])
		);

		let allBrowserViews: BrowserView[] = allWindows[i].getBrowserViews();
		for (let j: number = 0; j < allBrowserViews.length; j++) {
			allBrowserViews[j].webContents.on('context-menu', (e, props) =>
				createMenuListener(e, props, allWindows[i])
			);
		}
	}

	function createMenuListener(e: any, props: any, window: BrowserWindow) {
		const EditTextMenu = Menu.buildFromTemplate([
			{ role: 'cut' },
			{ role: 'copy' },
			{ role: 'paste' },
			{ type: 'separator' },
			{ role: 'undo' },
			{ role: 'redo' }
		]);
		const { inputFieldType } = props;
		if (inputFieldType === 'plainText') {
			EditTextMenu.popup({
				window: window
			});
		}
	}
} */

app.removeAsDefaultProtocolClient('shadow-engine');
app.setAsDefaultProtocolClient('shadow-engine');

if (electronIsDev && process.platform === 'win32') {
	app.setAsDefaultProtocolClient('shadow-engine', process.execPath, [
		pathresolve(process.argv[1])
	]);
} else {
	app.setAsDefaultProtocolClient('shadow-engine');
}

// shadow-engine://plugin,tk.a77zsite.shadow.tscore

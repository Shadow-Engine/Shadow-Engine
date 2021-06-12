// Manager for sending IPC messages between windows and creating windows

import { BrowserView, BrowserWindow } from 'electron';
import { getEngineConfig } from './ConfigurationManager';

export function openProjectBrowser() {}

export interface WindowOptions {
	decorations: windowDecorations;
	x?: number;
	y?: number;
	height: number;
	width: number;
	url: string;
	onTop?: boolean;
	ipcData?: string[]; // formatted like so: ["thisIsTheChannel:ThisIsTheContent", "thisIsTheChannel:ThisIsTheContent"]
	windowTitle?: string;
}

//A Basic type decoration is just a window that will follow useNativeTitlebar rules
//Tabbed decoration is the type used on the main editor and it's really just a container for 'tab' decorations
//undecorated type decorations might be a context menu, popup, or tooltip. Note that the undecorated type is not limited to just those types
//A tool window is a window that follows useNativeTitlebar rules, but refuses to be resized, minimized, or maximized
type windowDecorations = 'basic' | 'undecorated' | 'tabbed' | 'tab' | 'tool';

export function createWindow(settings: WindowOptions) {
	let useNativeTitlebar: boolean = getEngineConfig().useNativeTitleBar;

	switch (settings.decorations) {
		case 'basic': {
			//TODO this actual calling function probably has to be called from the main process with ipc so renderers can execute it
			let window = new BrowserWindow({
				width: settings.width,
				height: settings.height,
				center: true,
				x: settings.x,
				y: settings.y,
				darkTheme: true,
				frame: useNativeTitlebar, // if useNativeTitlebar is true, then so is the frame
				webPreferences: { nodeIntegration: true, contextIsolation: false },
				minWidth: 100,
				minHeight: 100,
				alwaysOnTop: settings.onTop,
				backgroundColor: '#222222',
				autoHideMenuBar: true,
				titleBarStyle: useNativeTitlebar ? 'default' : 'hidden', // For MacOS
				trafficLightPosition: { x: 5, y: 5 }
			});

			window.loadFile('../dom/frames/basic.html');
			window.show();
			window.on('closed', function () {
				window = null;
			});
			window.webContents.on('did-finish-load', () => {
				// Send settings data to the window so it knows how to handle the current situation
				window.webContents.send('windowConstructionOptions', {
					useNativeTitlebar: useNativeTitlebar,
					windowTitle: settings.windowTitle ? settings.windowTitle : '' // If == undefined send an empty string
				});
			});

			// Load the actual content

			let frame = new BrowserView({
				webPreferences: {
					nodeIntegration: true,
					contextIsolation: false
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

			// Pass IPC Data
			frame.webContents.on('did-finish-load', function () {
				if (settings.ipcData !== undefined) {
					for (let i: number = 0; i < settings.ipcData.length; i++) {
						let channel = settings.ipcData[i].split(':')[0];

						// Get content by chopping off the length of the channel + 1 (for the colon)
						let content = settings.ipcData[i].substr(channel.length + 1);

						frame.webContents.send(channel, content);
					}
				}
			});

			break;
		}
		case 'undecorated': {
			let window = new BrowserWindow({
				width: settings.width,
				height: settings.height,
				center: true,
				x: settings.x,
				y: settings.y,
				darkTheme: true,
				frame: false,
				webPreferences: { nodeIntegration: true, contextIsolation: false },
				minWidth: 100,
				minHeight: 100,
				alwaysOnTop: settings.onTop,
				resizable: false,
				minimizable: false,
				maximizable: false,
				skipTaskbar: true,
				backgroundColor: '#222222',
				autoHideMenuBar: true
			});

			//TODO: Support newer IPC data in other decoration types
			//NOTE: This is a newer IPC function that allows colons ( : ) in the content

			window.webContents.on('did-finish-load', function () {
				if (settings.ipcData !== undefined) {
					for (let i: number = 0; i < settings.ipcData.length; i++) {
						let channel = settings.ipcData[i].split(':')[0];

						// Get content by chopping off the length of the channel + 1 (for the colon)
						let content = settings.ipcData[i].substr(channel.length + 1);

						window.webContents.send(channel, content);
					}
				}
			});

			window.loadFile(settings.url);
			window.show();
			window.on('closed', function () {
				window = null;
			});

			break;
		}
		case 'tool': {
			let window = new BrowserWindow({
				width: settings.width,
				height: settings.height,
				center: true,
				x: settings.x,
				y: settings.y,
				darkTheme: true,
				frame: useNativeTitlebar, // if useNativeTitlebar is true, then so is the frame
				webPreferences: { nodeIntegration: true, contextIsolation: false },
				minWidth: 100,
				minHeight: 100,
				alwaysOnTop: settings.onTop,
				resizable: false,
				minimizable: false,
				maximizable: false,
				backgroundColor: '#222222',
				autoHideMenuBar: true,
				titleBarStyle: useNativeTitlebar ? 'default' : 'hidden', // For MacOS
				trafficLightPosition: { x: 5, y: 5 }
			});

			window.loadFile('../dom/frames/tool.html');
			window.show();
			window.on('closed', function () {
				window = null;
			});
			window.webContents.on('did-finish-load', () => {
				// Send settings data to the window so it knows how to handle the current situation
				window.webContents.send('windowConstructionOptions', {
					useNativeTitlebar: useNativeTitlebar,
					windowTitle: settings.windowTitle ? settings.windowTitle : '' // If == undefined send an empty string
				});
			});

			// Load the actual content

			let frame = new BrowserView({
				webPreferences: {
					nodeIntegration: true,
					contextIsolation: false
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

			frame.webContents.on('did-finish-load', function () {
				if (settings.ipcData !== undefined) {
					for (let i: number = 0; i < settings.ipcData.length; i++) {
						let channel = settings.ipcData[i].split(':')[0];

						// Get content by chopping off the length of the channel + 1 (for the colon)
						let content = settings.ipcData[i].substr(channel.length + 1);

						frame.webContents.send(channel, content);
					}
				}
			});

			break;
		}
		case 'tabbed': {
			let window = new BrowserWindow({
				width: settings.width,
				height: settings.height,
				center: true,
				x: settings.x,
				y: settings.y,
				darkTheme: true,
				frame: useNativeTitlebar, // if useNativeTitlebar is true, then so is the frame
				webPreferences: { nodeIntegration: true, contextIsolation: false },
				minWidth: 100,
				minHeight: 100,
				alwaysOnTop: settings.onTop,
				backgroundColor: '#222222',
				autoHideMenuBar: true,
				titleBarStyle: useNativeTitlebar ? 'default' : 'hidden', // For MacOS
				trafficLightPosition: { x: 5, y: 5 }
			});

			window.loadFile('../dom/frames/tabbed.html');
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

			// Here's where we would normally create the BrowserView for the window,
			// tabbed windows are special in that they can't hold content, only tabs.
			// So in this case, when the user specifies settings.url, we're really just
			// creating a 'tab' window and attaching it to this one

			break;
		}
		case 'tab': {
			//A tab can be a child to a tabbed window or be standalone

			let window = new BrowserWindow({
				width: settings.width,
				height: settings.height,
				center: true,
				x: settings.x,
				y: settings.y,
				darkTheme: true,
				frame: useNativeTitlebar, // if useNativeTitlebar is true, then so is the frame
				webPreferences: { nodeIntegration: true, contextIsolation: false },
				minWidth: 100,
				minHeight: 100,
				alwaysOnTop: settings.onTop,
				backgroundColor: '#222222',
				maximizable: false,
				minimizable: false,
				resizable: true,
				autoHideMenuBar: true,
				titleBarStyle: useNativeTitlebar ? 'default' : 'hidden', // For MacOS
				trafficLightPosition: { x: 5, y: 5 }
			});

			window.loadFile('../dom/frames/tab.html');
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
					nodeIntegration: true,
					contextIsolation: false
				}
			});
			window.setBrowserView(frame);
			frame.setBounds({
				width: settings.width,
				x: 0,
				height: useNativeTitlebar ? settings.height : settings.height - 18,
				y: useNativeTitlebar ? 0 : 18
			});
			frame.webContents.loadFile(settings.url);
			frame.setAutoResize({
				height: true,
				width: true
			});

			// Pass IPC Data
			frame.webContents.on('did-finish-load', function () {
				if (settings.ipcData !== undefined) {
					for (let i: number = 0; i < settings.ipcData.length; i++) {
						let channel = settings.ipcData[i].split(':')[0];

						// Get content by chopping off the length of the channel + 1 (for the colon)
						let content = settings.ipcData[i].substr(channel.length + 1);

						frame.webContents.send(channel, content);
					}
				}
			});

			break;
		}
	}
}

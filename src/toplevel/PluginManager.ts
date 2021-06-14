import { modConfigFile, readConfigFile } from './ConfigurationManager';
import { assertMacroPath } from './PathManager';
import { createWindow } from './WindowManager';
import { v4 } from 'uuid';
import { readdir } from 'fs';
import { getShadowEngineDataDir, isDirectory } from './UtilitiesManager';
import { existsSync, readdirSync } from 'original-fs';
import { getPort } from 'portfinder';
import { Server } from 'ws';
import * as colors from 'colors';

export function repoPluginInstall(inputUri: string) {
	createWindow({
		decorations: 'tool',
		height: 600,
		width: 800,
		url: '../dom/Plugins/pluginInstall.html',
		onTop: true,
		ipcData: [`packageId:${inputUri.split(',')[1]}`]
	});
}

// Initialize the system for authenticating plugins,
// this is in place
export function initializePluginAuthentication(): void {
	let path: string = '#sddr/plugins/auth.sec';
	assertMacroPath(path);
	modConfigFile(path, 'token', v4());
}

// This array stores all the loaded plugins and their configuations, read more at
// the refreshPluginTable function
export let pluginTable: object[] = [];

interface PluginTableCallback {
	(pluginTable: string[]): void;
}

// Should be run after uninstall of a plugin, install of a plugin, and launch of Shadow.
// Creates an array of a plugins configuation such as it's id and permissions. This is so
// that when a plugin calls a Shadow API, the engine can verify it has permission to do so.
// callback string[] of valid plugins
// NOTE: I hate this function
export function refreshPluginTable(callback: PluginTableCallback) {
	let sddr: string = getShadowEngineDataDir(); // store here so we're not calling this function a bunch
	let validPlugins: string[] = [];
	{
		//Get plugin folders. For each folder in #sddr/plugins check if it has a plug.sec file
		readdir(`${sddr}/plugins`, (err, files) => {
			//TODO: This should probably be synchronous
			if (err) throw err;
			// console.log(files);
			for (let i: number = 0; i < files.length; i++) {
				if (isDirectory(`${sddr}/plugins/${files[i]}`)) {
					// This path is a directory so we can look into it to see if theres a plug.sec file
					if (existsSync(`${sddr}/plugins/${files[i]}/plug.sec`)) {
						//Plug.sec exists so add the folder name to an array of valid plugins
						validPlugins.push(files[i]);
					}
				}
			}

			createPluginTable();
		});
	}

	// AKA Part 2
	function createPluginTable() {
		// console.log(validPlugins);
		callback(validPlugins);

		let newPluginTable: object[] = [];

		//Loop through all valid plugins
		for (let i: number = 0; i < validPlugins.length; i++) {
			let path: string = `#sddr/plugins/${validPlugins[i]}/plug.sec`;
			assertMacroPath(path);

			newPluginTable.push({
				id: readConfigFile(path, 'id'),
				pretty: readConfigFile(path, 'pretty'),
				version: readConfigFile(path, 'version'),
				copyright: readConfigFile(path, 'copyright'),
				author: readConfigFile(path, 'author')
			});
		}
	}
}

// Returns an array of plugins in the #sddr/plugins folder
export function getPluginArray(): string[] {
	let sddr: string = getShadowEngineDataDir();
	let validPlugins: string[] = [];

	let files: string[] = readdirSync(`${sddr}/plugins`);
	for (let i: number = 0; i < files.length; i++) {
		// Check if entry is a folder and has a plug.sec file
		if (
			isDirectory(`${sddr}/plugins/${files[i]}`) &&
			existsSync(`${sddr}/plugins/${files[i]}/plug.sec`)
		) {
			validPlugins.push(files[i]);
		}
	}

	return validPlugins;
}

// TODO: This is a stub
// This function is designed to loop through every single js file in a plugin
// and add a similar piece of code that can be found in dumbPermissionTest.js
// that's designed to override the require function so that plugins have to
// state what modules they will be requiring in their plug.sec config, then
// Shadow Engine will allow use of the specified modules. This is in place so
// that the end user installing plugins knows what plugins have access to
// before they actually install the plugin.
export function lockdownPlugins() {}

// Set to null before startPluginHost Changes it
let pluginHostPort: number = null;
export function getPluginHostPort(): number {
	return pluginHostPort;
}

// The plugin host is the WebSocket Server that Shadow Engine is running that
// will listen for plugin connections, handle authentication, manage API calls
// and whatnot
export function startPluginHost() {
	getPort(function (err, port) {
		//Async function that looks for an open port
		if (err) throw err;
		console.log(`PluginHost Listening on port ${port}`);
		pluginHostPort = port;
		pluginHostServer(port);
	});

	function pluginHostServer(port: number) {
		const wss = new Server({ port: port });

		wss.on('listening', () => {
			let plugins: string[] = getPluginArray();
			for (let i: number = 0; i < plugins.length; i++) {
				logAsPluginHost('Loading Plugin ' + plugins[i]);
			}
		});

		wss.on('connection', function connection(ws) {
			ws.on('message', function incoming(message: string) {
				logAsPluginHost('From plugin: ' + message);
			});
		});
	}

	function logAsPluginHost(message: string) {
		console.log(colors.magenta('[PluginHost] ') + message);
	}
}

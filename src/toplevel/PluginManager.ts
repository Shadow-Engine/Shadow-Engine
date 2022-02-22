import { modConfigFile, readConfigFile } from './ConfigurationManager';
import { assertMacroPath } from './PathManager';
import { createWindow } from './WindowManager';
import { v4 } from 'uuid';
import { readdir } from 'fs';
import { getShadowEngineDataDir, isDirectory } from './UtilitiesManager';
import { existsSync, readdirSync, readFileSync } from 'original-fs';
import { getPort } from 'portfinder';
import { Server } from 'ws';
import * as colors from 'colors';
import { exec, spawn } from 'child_process';
import * as URLParse from 'url-parse';
import { MAINloggerCreateNewStream, MAINloggerWriteToStream } from '../main';

interface pluginSocket extends WebSocket {
	runtimeToken: string;
	authenticated: boolean;
}

interface Plugin {
	id: string;
	pretty: string;
	version: string;
	copyright: string;
	author: string;
	launchscript: string;
	permissions: string[];
	allowedReadPaths: string[];
	allowedWritePaths: string[];
	allowedDomains: string[];
}

interface runtimePlugin extends Plugin {
	runtimeToken: string;
}

let authtoken: string = v4();

//Table of plugin attributes loaded just before a plugin is started,
//each plugin in the table contains info like the runtimeToken, used
//to securly identify a plugin, and the plugin info like permissions
let runtimeTokenTable: runtimePlugin[];

export function startPluginHost() {
	getPort(function (err, port) {
		if (err) throw err;

		MAINloggerCreateNewStream('plugins');
		MAINloggerWriteToStream('plugins', 'Starting PluginHost on port ' + port);
		MAINloggerWriteToStream('plugins', 'Waiting for plugins to connect');

		const wss = new Server({ port: port });

		wss.on('connection', function connection(ws: pluginSocket, req) {
			const parameters = URLParse(req.url, true);
			ws.runtimeToken = parameters.query.runtimeToken;
			ws.authenticated = false;
			if (parameters.query.token == authtoken) ws.authenticated = true;
			if (ws.authenticated)
				MAINloggerWriteToStream(
					'plugins',
					`plugin with token: ${ws.runtimeToken} authenticated`
				);
		});

		startPlugins(port);
	});
}

function startPlugins(port: number) {
	let sddr: string = getShadowEngineDataDir();
	MAINloggerWriteToStream(
		'plugins',
		'Searching plugin directory for valid plugins'
	);
	let validPlugins = getPluginArray();
	MAINloggerWriteToStream(
		'plugins',
		'Valid plugins: ' + JSON.stringify(validPlugins)
	);

	for (let i = 0; i < validPlugins.length; i++) {
		//Generated runtime token used to identify the plugin internally
		let runtimeToken: string = v4();

		MAINloggerCreateNewStream('plugin ' + validPlugins[i]);
		let pluginData: Plugin = JSON.parse(
			readFileSync(`${sddr}/plugins/${validPlugins[i]}/plugin.json`, 'utf-8')
		);

		// exec(
		// 	`deno run --allow-net=localhost:${port} ${sddr}/plugins/${validPlugins[i]}/${pluginData.launchscript} ${port} ${authtoken}`,
		// 	{ env: { NO_COLOR: '' } },
		// 	(error, stdout, stderr) => {
		// 		if (error)
		// 			MAINloggerWriteToStream('plugins', 'Plugin exec error: ' + error);
		// 		if (stderr)
		// 			MAINloggerWriteToStream('plugins', 'Plugin error: ' + stderr); // Change errors to show as a notification in the future
		// 		if (stdout)
		// 			MAINloggerWriteToStream('plugin ' + validPlugins[i], stdout);
		// 	}
		// );

		let currentPluginProcess = spawn(
			'deno',
			[
				'run',
				`--allow-net=localhost:${port}`,
				`${sddr}/plugins/${validPlugins[i]}/${pluginData.launchscript}`,
				port.toString(),
				authtoken,
				runtimeToken
			],
			{ env: { NO_COLOR: '' } }
		);

		//Add runtimePlugin entry to the runtimeTokenTable
		runtimeTokenTable.push({
			id: pluginData.id,
			pretty: pluginData.pretty,
			version: pluginData.version,
			copyright: pluginData.copyright,
			author: pluginData.author,
			launchscript: pluginData.launchscript,
			permissions: pluginData.permissions,
			allowedReadPaths: pluginData.allowedReadPaths,
			allowedWritePaths: pluginData.allowedWritePaths,
			allowedDomains: pluginData.allowedDomains,
			runtimeToken: runtimeToken
		});

		// Setup IO handlers for process

		currentPluginProcess.stdout.on('data', (data) => {
			MAINloggerWriteToStream('plugin ' + validPlugins[i], data);
		});

		currentPluginProcess.stderr.on('data', (data) => {
			MAINloggerWriteToStream(
				'plugins',
				`PLUGIN INTERNAL ERROR (${validPlugins[i]}): ${data}`
			);
		});

		currentPluginProcess.on('close', (code) => {
			MAINloggerWriteToStream(
				'plugin ' + validPlugins[i],
				'Plugin process exited with code: ' + code
			);
			MAINloggerWriteToStream(
				'plugins',
				'Plugin process exited with code: ' + code
			);
		});
	}
}

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

// Should be run after uninstall of a plugin, install of a plugin, and launch of Shadow.
// Returns an array of a plugins configuation such as it's id and permissions. This is so
// that when a plugin calls a Shadow API, the engine can verify it has permission to do so.
// NOTE: I made this function a lot better :)
// export function getPluginTable(): Plugin[] {
// 	let sddr: string = getShadowEngineDataDir(); // store here so we're not calling this function a bunch
// 	let validPlugins: string[] = getPluginArray();

// 	let newPluginTable: Plugin[] = [];

// 	for (let i: number = 0; i < validPlugins.length; i++) {
// 		let pluginConfigPath: string =
// 			'#sddr/plugins/' + validPlugins[i] + '/plug.sec';
// 		assertMacroPath(pluginConfigPath);

// 		newPluginTable.push({
// 			id: readConfigFile(pluginConfigPath, 'id'),
// 			pretty: readConfigFile(pluginConfigPath, 'pretty'),
// 			version: readConfigFile(pluginConfigPath, 'version'),
// 			copyright: readConfigFile(pluginConfigPath, 'copyright'),
// 			author: readConfigFile(pluginConfigPath, 'author'),
// 			launchscript: readConfigFile(pluginConfigPath, 'launchscript')
// 		});
// 	}

// 	// return final table
// 	return newPluginTable;
// }

// Returns an array of plugins in the #sddr/plugins folder
export function getPluginArray(): string[] {
	let sddr: string = getShadowEngineDataDir();
	let validPlugins: string[] = [];

	let files: string[] = readdirSync(`${sddr}/plugins`);
	for (let i: number = 0; i < files.length; i++) {
		// Check if entry is a folder and has a plug.sec file
		if (
			isDirectory(`${sddr}/plugins/${files[i]}`) &&
			existsSync(`${sddr}/plugins/${files[i]}/plugin.json`)
		) {
			validPlugins.push(files[i]);
		}
	}

	return validPlugins;
}

// The plugin host is the WebSocket Server that Shadow Engine is running that
// will listen for plugin connections, handle authentication, manage API calls
// and whatnot
// export function startPluginHost() {
// 	getPort(function (err, port) {
// 		//Async function that looks for an open port
// 		if (err) throw err;
// 		logAsPluginHost(`Listening on port ${port}`);
// 		pluginHostPort = port;
// 		pluginHostServer(port);
// 	});

// 	function pluginHostServer(port: number) {
// 		const wss = new Server({ port: port });

// 		wss.on('listening', () => {
// 			let plugins: string[] = getPluginArray();
// 			for (let i: number = 0; i < plugins.length; i++) {
// 				logAsPluginHost('Loading Plugin ' + plugins[i]);
// 				// exec("deno run --allow-net=localhost", () => {});
// 			}
// 		});

// 		wss.on('connection', function connection(ws) {
// 			ws.on('message', function incoming(message: string) {
// 				logAsPluginHost('From plugin: ' + message);
// 			});
// 		});
// 	}

// 	function logAsPluginHost(message: string) {
// 		console.log(colors.magenta('[PluginHost] ') + message);
// 	}
// }

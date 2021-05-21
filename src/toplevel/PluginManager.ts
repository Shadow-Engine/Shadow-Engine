import { modConfigFile } from './ConfigurationManager';
import { assertMacroPath } from './PathManager';
import { createWindow } from './WindowManager';
import { v4 } from 'uuid';

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

//General Utils such as math functions, uuid generation, basic popups, etc...

import { readFileSync } from 'fs';
import { parse } from 'json5';
import { homedir } from 'os';
import { getEngineConfig, readConfigFile } from './ConfigurationManager';
import { assertMacroPath } from './PathManager';

export function getShadowEngineDataDir(): string {
	let directory: string;
	if (process.platform == 'win32') {
		directory = homedir() + '/AppData/Roaming/Shadow';
	} else {
		//Everything else includes Linux, FreeBSD, OpenBSD, NetBSD, and Darwin, maybe more
		directory = homedir() + '/Shadow';
	}
	return directory;
}

/*
	Get the currently open project, returns null if none is open (AS A STRING).
*/
export function getOpenProject(): string {
	// Synchronous to prevent future bugs :)
	let path: string = '#sddr/engine-config/project.sec';
	assertMacroPath(path);
	return readConfigFile(path, 'project');
}

export interface popupOptions {}

export function createPopup(options: popupOptions) {
	let useNativePopups: boolean = getEngineConfig().useNativePopups;
}

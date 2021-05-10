//General Utils such as math functions, uuid generation, basic popups, etc...

import { readFileSync } from 'fs';
import { parse } from 'json5';
import { homedir } from 'os';
import { getEngineConfig } from './ConfigurationManager';

export function getShadowEngineDataDir() {
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
export function getOpenProject() {
	// Synchronous to prevent future bugs :)
	return parse(
		readFileSync(
			getShadowEngineDataDir() + '/engine-data/project.json5',
			'utf-8'
		)
	).project;
}

export interface popupOptions {}

export function createPopup(options: popupOptions) {
	let useNativePopups: string = getEngineConfig().useNativePopups;
}

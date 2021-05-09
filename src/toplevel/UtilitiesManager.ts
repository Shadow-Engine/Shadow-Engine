//General Utils such as math functions, uuid generation, basic popups, etc...

import { readFileSync } from 'fs';
import { homedir } from 'os';

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
	return readFileSync(
		getShadowEngineDataDir() + '/engine-data/project.json',
		'utf-8'
	);
}

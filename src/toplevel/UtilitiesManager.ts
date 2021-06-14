//General Utils such as math functions, uuid generation, basic popups, etc...

import { homedir } from 'os';
import { readConfigFile } from './ConfigurationManager';
import { assertMacroPath } from './PathManager';
import { exec } from 'child_process';
import { lstatSync } from 'fs';
import { ipcRenderer } from 'electron';
import * as isRenderer from 'is-electron-renderer';
import { createErrorPopupFromMAIN } from '../main';
import * as Product from '../product.json';
import * as colors from 'colors';

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

// When we create popups we don't want the Utilites Manager to handle
// everything, instead we pass it on to the main process so that we
// can create native dialogs when the config is set to that, and so
// that any renderer script can create a popup, because making
// BrowserWindows from within BrowserWindow is not the best idea
export interface popupOptions {}

export function createInformationPopup(options: popupOptions) {}

export function createErrorPopup(title: string, content: string) {
	if (isRenderer) {
		ipcRenderer.send('util.createErrorPopup', title, content);
	} else {
		createErrorPopupFromMAIN(title, content);
	}
}

export function isAdmin(): boolean {
	if (process.platform == 'win32') {
		exec('NET SESSION', (error, stdout, stderr) => {
			return stderr.length === 0 ? true : false;
		});
	} else {
		//Assume POXIX / UNIX
		return process.getgid() === 0 ? true : false;
	}
}

//Gets the line ending type of a string, most commonly used for checking file line endings
//Returns a string of which line ending type is used
export function getLineEnding(fileContent: string): string {
	const indexOfLF = fileContent.indexOf('\n', 1); // No need to check first-character
	if (indexOfLF === -1) {
		if (fileContent.indexOf('\r') !== -1) return '\r';
		return '\n';
	}
	if (fileContent[indexOfLF - 1] === '\r') return '\r\n';
	return '\n';
}

// Check if a specified path is a directory,
// Returns boolean
export function isDirectory(path: string): boolean {
	return lstatSync(path).isDirectory();
}

export function getEngineVersion(): string {
	return `${Product.ProductVersionMajor}.${Product.ProductVersionMinor}.${Product.ProductVersionPatch}`;
}

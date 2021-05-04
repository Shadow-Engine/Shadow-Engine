// Used for managing configuration files such as the editor config, or project specific configs, reading and writing values from them

import {
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync
} from 'original-fs';
import { expandPath } from './PathManager';
import { getShadowEngineDataDir } from './UtilitiesManager';
import { parse } from 'json5';

/* interface configInitalizationArrayInterface {
	file: object {
		type: string;
	}
}; */

let shadowDataDir: string = getShadowEngineDataDir(); // String to use to prevent tons of function calls
let configInitalizationArray = [
	{
		type: 'folder', // This is the inital Shadow Engine folder
		location: shadowDataDir
	},
	{
		type: 'folder',
		location: shadowDataDir + '/engine-data'
	},
	{
		type: 'folder',
		location: shadowDataDir + '/projects'
	},
	{
		type: 'file',
		location: shadowDataDir + '/engine-data/config.json5',
		data: '{}'
	},
	{
		type: 'file',
		location: shadowDataDir + '/engine-data/project.json5',
		data: 'null'
	}
];

/*
	Initailization function that creates directories and config files for Shadow to use.
*/
export function initializeConfig() {
	if (existsSync(shadowDataDir)) {
		return;
	}

	for (let i: number = 0; i < configInitalizationArray.length; i++) {
		//Foreach object in array, run node fs operation
		if (configInitalizationArray[i].type == 'folder') {
			mkdirSync(configInitalizationArray[i].location);
		} else if (configInitalizationArray[i].type == 'file') {
			writeFileSync(
				configInitalizationArray[i].location,
				configInitalizationArray[i].data
			);
		}
	}
}

/*
	Modifies selected config file, if file doesn't exist, the function creates it.
	* WARNING THIS FUNCTION HAS MACRO EXPANSION (SEE expandPath() IN src/toplevel/PathManager.ts)
	* TO SPECIFY A PLAIN DIRECTORY, PREFIX A $ (Example: $/home/vn20/Desktop OR $C:/Users/vn20/Desktop)
*/
export function modConfigFile(
	macroPath: string,
	setting: string,
	value: string
) {
	// Pass macroPath through the path expander (PathManager.ts)
	let expandedFilePath: string = expandPath(macroPath);
	let config: object = {
		c: []
	};

	if (existsSync(expandedFilePath)) {
		config = parse(readFileSync(expandedFilePath, 'utf-8'));
	}

	if (
		setting.includes(':') ||
		setting.includes(';') ||
		value.includes(':') ||
		value.includes(';')
	) {
		throw new Error(
			'E: The characters ":" and ";" aren\'t allowed in config files'
		);
	}

	// ANCHOR something like this??
	//config.c.push()

	writeFileSync(expandedFilePath, '');
	//TODO: Finish this function
}

/*
	Reads and returns a specific value from a config file
	* WARNING THIS FUNCTION HAS MACRO EXPANSION (SEE expandPath() IN src/toplevel/PathManager.ts)
	* TO SPECIFY A PLAIN DIRECTORY, PREFIX A $ (Example: $/home/vn20/Desktop OR $C:/Users/vn20/Desktop)
*/
export function readConfigFile(macroPath: string, setting: string) {
	// Pass macroPath through the path expander (PathManager.ts)
	let expandedFilePath: string = expandPath(macroPath);

	//TODO: Finish this function
	//NOTE Keep this function 100% synchronous otherwise you might have some problems

	return 'stub string';
}

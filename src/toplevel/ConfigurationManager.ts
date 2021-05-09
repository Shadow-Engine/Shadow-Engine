// Used for managing configuration files such as the editor config, or project specific configs, reading and writing values from them

import {
	appendFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync
} from 'fs';
import { expandPath } from './PathManager';
import { getShadowEngineDataDir } from './UtilitiesManager';
import { parse, stringify } from 'json5';
import { engineConfig } from '../res/engine-config';

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
		data: stringify(engineConfig, null, 4)
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

	// If file doesn't exist, create it
	if (!existsSync(expandedFilePath)) {
		writeFileSync(expandedFilePath, '');
	}

	let config: string = readFileSync(expandedFilePath, 'utf-8');
	let configSplit = config.split('\n');
	let settingMatch = null; // stores weather a pre-existing value is already in the config file
	for (let i = 0; i < configSplit.length; i++) {
		if (configSplit[i].split(':')[0] == setting) {
			// Compare settings
			settingMatch = i;
			return; // save some loops
		}
	}

	// settingMatch contains the line number of where the setting is stored
	// so we can use that to split, splice and substr our way to overwrite
	// the value inside the setting without having to move the line at all

	if (settingMatch !== null) {
		// TODO: This part doesn't work
		// If there is a pre-existing setting, settingMatch will have the number and not be equal to null
		let splicedInSetting: string = `${setting}:${value}`; // Construct the insert string
		configSplit.splice(settingMatch, 1, splicedInSetting); // Splice the string in the array
		writeFileSync(expandedFilePath, configSplit.join('\n')); // Join and write the final file
	} else {
		// If settingMatch is null, append the new setting to the end of the file
		appendFileSync(expandedFilePath, `\n${setting}:${value}`);
	}
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

export function getEngineConfig() {
	//Returns the whole engine configuration in an object
	return parse(
		readFileSync(
			getShadowEngineDataDir() + '/engine-data/config.json5',
			'utf-8'
		)
	);
}

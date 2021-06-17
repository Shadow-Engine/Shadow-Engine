// Used for managing configuration files such as the editor config, or project specific configs, reading and writing values from them

import {
	appendFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync
} from 'fs';
import { expandPath, MacroPath } from './PathManager';
import { getShadowEngineDataDir } from './UtilitiesManager';
import { parse, stringify } from 'json5';
import { engineConfig, engineConfigInterface } from '../res/engine-config';

/*
	Initailization function that creates directories and config files for Shadow to use.
*/
export function initializeConfig() {
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
			type: 'folder',
			location: shadowDataDir + '/plugins'
		},
		{
			type: 'file',
			location: shadowDataDir + '/engine-data/config.json5',
			data: stringify(engineConfig, null, 4)
		},
		{
			type: 'file',
			location: shadowDataDir + '/engine-data/project.sec',
			data: 'project:none'
		}
	];
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
	console.log('Initialized Config');
}

/*
	Modifies selected config file, if file doesn't exist, the function creates it.
	* WARNING THIS FUNCTION HAS MACRO EXPANSION (SEE expandPath() IN src/toplevel/PathManager.ts)
	* TO SPECIFY A PLAIN DIRECTORY, PREFIX A $ (Example: $/home/vn20/Desktop OR $C:/Users/vn20/Desktop)
*/
export function modConfigFile(
	macroPath: MacroPath,
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
	for (let i: number = 0; i < configSplit.length; i++) {
		if (configSplit[i].split(':')[0] == setting) {
			// Compare settings
			settingMatch = i;
			break; // save some loops
		}
	}

	// settingMatch contains the line number of where the setting is stored
	// so we can use that to split, splice and substr our way to overwrite
	// the value inside the setting without having to move the line at all

	if (settingMatch !== null) {
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
export function readConfigFile(macroPath: MacroPath, setting: string): string {
	//NOTE Keep this function 100% synchronous otherwise you might have some problems

	// Pass macroPath through the path expander (PathManager.ts)
	let expandedFilePath: string = expandPath(macroPath);

	// If file doesn't exist, throw error
	if (!existsSync(expandedFilePath)) {
		throw new Error(`File ${expandedFilePath} doesn't exist`);
	}

	let config: string = readFileSync(expandedFilePath, 'utf-8');
	let split: string[] = config.split('\n');

	for (let i: number = 0; i < split.length; i++) {
		if (split[i].split(':')[0] == setting) {
			// Some string manipulation to grab the value
			return split[i].substr(setting.length + 1).replace('\r', ''); // and get rid of those nasty carriage returns if the file is CRLF
		}
	}

	//Return null if value isn't found
	return null;
}

// Same as readConfigFile but does not read from file, only the input
// Returns result as string
export function readConfig(config: string, setting: string): string {
	let split: string[] = config.split('\n');

	for (let i: number = 0; i < split.length; i++) {
		if (split[i].split(':')[0] == setting) {
			// Some string manipulation to grab the value
			return split[i].substr(setting.length + 1).replace('\r', ''); // and get rid of those nasty carriage returns if the input is CRLF
		}
	}

	return null;
}

export function getEngineConfig(): engineConfigInterface {
	//Returns the whole engine configuration in an object
	return parse(
		readFileSync(
			getShadowEngineDataDir() + '/engine-data/config.json5',
			'utf-8'
		)
	);
}

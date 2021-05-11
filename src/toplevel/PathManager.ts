// Working with paths in Shadow Engine can be tricky because of things like path macro expansion where #sddr takes you to the Shadow Data Dir
// Not only that but Shadow is a cross-platform application, so directory structures can be weird across platforms, with naming conventions and all that.

import { getOpenProject, getShadowEngineDataDir } from './UtilitiesManager';
import { homedir } from 'os';

/*
	Expand and reveal the true location of a path.
	Example:
		input:  #home/file.txt
		output: /home/vn20/file.txt OR C:/Users/vn20/file.txt
*/
export function expandPath(inputPath: string): string {
	let macroDir: string; // The part of the location string that expands
	let macroLength: number; // The length of the macro is stored so the macro can be cut off later

	// The first character is what defines the kind of macro
	switch (inputPath.charAt(0)) {
		case '#': // This macro can expand to become a certain directory on the system.
			// 4 characters define what directory this macro expands to.
			switch (inputPath.substr(1, 5)) {
				case 'home': // Expands to the home directory on the system
					macroDir = homedir();
					macroLength = 5;
					break;
				case 'sddr': // Expands to the Shadow Engine Data Directory
					macroDir = getShadowEngineDataDir();
					macroLength = 5;
					break;
			}
			break;

		case '$': // $ is the full directory (Ex. $C:/Users/vn20/Desktop)
			macroDir = '';
			macroLength = 1;
			break;
		case '/': // / is the current working project directory, don't call this if theres no project open... just don't... (returns null if you do)
			macroDir = getShadowEngineDataDir() + '/projects/' + getOpenProject();
			macroLength = 0;
			break;
	}

	let dirAfterMacroRemoval: string = inputPath.slice(macroLength); // Slices off the macro character( # $ / )
	return macroDir + dirAfterMacroRemoval;
}

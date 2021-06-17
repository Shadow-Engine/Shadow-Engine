// Working with paths in Shadow Engine can be tricky because of things like path macro expansion where #sddr takes you to the Shadow Data Dir
// Not only that but Shadow is a cross-platform application, so directory structures can be weird across platforms, with naming conventions and all that.

import { getOpenProject, getShadowEngineDataDir } from './UtilitiesManager';
import { homedir } from 'os';

declare const validMacroPath: unique symbol;

export type MacroPath = string & {
	[validMacroPath]: true;
};

/*
	Expand and reveal the true location of a path.
	Example:
		input:  #home/file.txt
		output: /home/vn20/file.txt OR C:/Users/vn20/file.txt
*/
export function expandPath(inputPath: MacroPath): string {
	let macroDir: string; // The part of the location string that expands
	let macroLength: number; // The length of the macro is stored so the macro can be cut off later

	// The first character is what defines the kind of macro
	switch (inputPath.charAt(0)) {
		case '#': // This macro can expand to become a certain directory on the system.
			// 4 characters define what directory this macro expands to.
			switch (inputPath.substr(1, 4)) {
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

export function assertMacroPath(input: string): asserts input is MacroPath {
	let inputValid: boolean = false;
	let validStarters: string[] = ['/', '$', '#home', '#sddr'];
	for (let i: number = 0; i < validStarters.length; i++) {
		if (input.startsWith(validStarters[i])) {
			inputValid = true;
		}
	}

	if (!inputValid) {
		throw new Error(`The string ${input} is not a valid MacroPath`);
	}
}

// Checks for valid filenames that everyone agrees with (Windows, Linux, Shadow, File Systems)
// Returns the boolean true if the name is valid, returns a string with the error for the
// user to fix on invalid names
export function fileNameChecker(filename: string): boolean | string {
	if (filename == '') {
		return "Name can't be blank";
	} else {
		// ELSE IF TOWER OF DOOM
		if (filename == 'CON') {
			return 'CON is a name reserved by Windows';
		} else if (filename == 'PRN') {
			return 'PRN is a name reserved by Windows';
		} else if (filename == 'AUX') {
			return 'AUX is a name reserved by Windows';
		} else if (filename == 'NUL') {
			return 'NUL is a name reserved by Windows';
		} else if (filename == 'COM1') {
			return 'COM1 is a name reserved by Windows';
		} else if (filename == 'COM2') {
			return 'COM2 is a name reserved by Windows';
		} else if (filename == 'COM3') {
			return 'COM3 is a name reserved by Windows';
		} else if (filename == 'COM4') {
			return 'COM4 is a name reserved by Windows';
		} else if (filename == 'COM5') {
			return 'COM5 is a name reserved by Windows';
		} else if (filename == 'COM6') {
			return 'COM6 is a name reserved by Windows';
		} else if (filename == 'COM7') {
			return 'COM7 is a name reserved by Windows';
		} else if (filename == 'COM8') {
			return 'COM8 is a name reserved by Windows';
		} else if (filename == 'COM9') {
			return 'COM9 is a name reserved by Windows';
		} else if (filename == 'LPT1') {
			return 'LPT1 is a name reserved by Windows';
		} else if (filename == 'LPT2') {
			return 'LPT2 is a name reserved by Windows';
		} else if (filename == 'LPT3') {
			return 'LPT3 is a name reserved by Windows';
		} else if (filename == 'LPT4') {
			return 'LPT4 is a name reserved by Windows';
		} else if (filename == 'LPT5') {
			return 'LPT5 is a name reserved by Windows';
		} else if (filename == 'LPT6') {
			return 'LPT6 is a name reserved by Windows';
		} else if (filename == 'LPT7') {
			return 'LPT7 is a name reserved by Windows';
		} else if (filename == 'LPT8') {
			return 'LPT8 is a name reserved by Windows';
		} else if (filename == 'LPT9') {
			return 'LPT9 is a name reserved by Windows';
		} else if (filename == '.') {
			return 'Just a dot is not allowed by Windows, Linux, And other filesystems';
		} else if (filename == '..') {
			return 'Two dots are not allowed by Windows, Linux, And other filesystems';
		} else if (filename == ' ') {
			return 'Just a space is not allowed by Windows';
		} else if (filename == 'null') {
			return 'null is not allowed by Shadow Engine';
		} else if (filename == 'tooldebug') {
			return 'tooldebug is reserved by the Shadow Engine Recovery Tool';
		} else if (filename == 'none') {
			return 'none is not allowed by Shadow Engine';
		} else {
			//Further Checks
			//Check for a space or period at the start and end of the string.

			if (filename.charAt(0) == ' ') {
				return 'Windows does not allow a space at the beginning';
			} else if (filename.charAt(0) == '.') {
				return 'Shadow Engine does not allow a dot at the beginning';
			} else if (filename.charAt(filename.length - 1) == ' ') {
				return 'Windows does not allow a space at the end';
			} else if (filename.charAt(filename.length - 1) == '.') {
				return 'Windows does not allow a dot at the end';
			} else {
				//MORE CHECKS
				//This time, with a regualar expression
				let charactorsNotAllowed = /[/\\<>:"|?* ]/;
				if (filename.match(charactorsNotAllowed)) {
					return 'It is not allowed to have the following characters: / \\ < > : " | ? * space';
				} else {
					if (filename.length > 100) {
						return "Name can't be longer than 100 characters";
					} else {
						// All checks passed
						return true;
					}
				}
			}
		}
	}
}

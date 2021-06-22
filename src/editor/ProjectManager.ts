// THIS IS A RENDERER SCRIPT

// import { createProject } from '../toplevel/ProjectManager';

// import { ahh, fileNameChecker } from '../toplevel/PathManager';

let newProjectSectionOpen: boolean = false;
document.getElementById('newprojectbtn').addEventListener('click', function () {
	if (newProjectSectionOpen === false) {
		document.getElementById('new-project-section').style.clipPath =
			'circle(141.5% at 100% 100%)';
		document.getElementById('newprojectbtn').style.transform = 'rotate(45deg)';
		newProjectSectionOpen = true;
	} else {
		document.getElementById('new-project-section').style.clipPath =
			'circle(0% at 100% 100%)';
		document.getElementById('newprojectbtn').style.transform = 'rotate(0deg)';
		newProjectSectionOpen = false;
	}
});

let vaildProjectName: boolean = false; // always starts false because name is blank

setInterval(() => {
	let projectName = (document.getElementById('projectname') as HTMLInputElement)
		.value;
	// Check for errors in project name
	if (fileNameChecker(projectName) !== true) {
		//Errors in name, tell user.
		//@ts-expect-error
		document.getElementById('err').innerText = fileNameChecker(projectName);
		document
			.getElementById('project-creation-button')
			.classList.add('disabled-button');
		vaildProjectName = false;
	} else {
		document.getElementById('err').innerText = '';
		document
			.getElementById('project-creation-button')
			.classList.remove('disabled-button');
		vaildProjectName = true;
	}
}, 100);

document
	.getElementById('project-creation-button')
	.addEventListener('click', function () {
		let projectName = (
			document.getElementById('projectname') as HTMLInputElement
		).value;
		if (vaildProjectName) {
			// createProject(projectName, 'TypeScript');
		} else {
			var newProjectSection = document.getElementById('new-project-section');
			newProjectSection.classList.add('shake');
			setTimeout(function () {
				newProjectSection.classList.remove('shake');
			}, 500);
		}
	});

// Imported from src/toplevel/PathManager.ts because something
// funky was happening when I tried to import it.
function fileNameChecker(filename: string): boolean | string {
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

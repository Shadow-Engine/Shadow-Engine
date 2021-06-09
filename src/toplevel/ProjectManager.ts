import { lstatSync, readdirSync } from 'original-fs';
import { getShadowEngineDataDir } from './UtilitiesManager';

export function createProject() {}

// Returns a string array with the folder names of all projects in the sddr/projects folder.
// NOTE: This should probably be updated in the future to return more properties about the
// project in an object array such as the preview icon and copyright info.
export function getProjects(): string[] {
	let sddr: string = getShadowEngineDataDir();

	let files: string[] = readdirSync(sddr + '/projects');
	let directories: string[] = [];
	for (let i: number = 0; i < files.length; i++) {
		if (lstatSync(`${sddr}/projects/${files[i]}`).isDirectory()) {
			directories.push(files[i]);
		}
	}

	return directories;
}

export function openProject() {}

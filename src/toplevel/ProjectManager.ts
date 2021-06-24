import { ipcRenderer } from 'electron';
import { existsSync, lstatSync, mkdirSync, readdirSync } from 'original-fs';
import { modConfigFile } from './ConfigurationManager';
import { assertMacroPath } from './PathManager';
import { getEngineVersion, getShadowEngineDataDir } from './UtilitiesManager';

type languages = 'JavaScript' | 'TypeScript';

// Create a new project, throws error if project already exists.
export function createProject(name: string, language: languages) {
	let sddr: string = getShadowEngineDataDir();
	if (doesProjectExist(name)) {
		throw new Error('ERR: Project named: ' + name + ' already exists');
	} else {
		mkdirSync(`${sddr}/projects/${name}`); // Create the container dir
		let projConfigPath: string = `#sddr/projects/${name}/project.sec`;
		assertMacroPath(projConfigPath);
		modConfigFile(projConfigPath, 'name', name);
		modConfigFile(projConfigPath, 'language', language);
		modConfigFile(projConfigPath, 'engine-version', getEngineVersion());
		modConfigFile(projConfigPath, 'default-scene', 'Default.Scene');
		mkdirSync(`${sddr}/projects/${name}/Assets`);
		mkdirSync(`${sddr}/projects/${name}/Source`);
		mkdirSync(`${sddr}/projects/${name}/Bin`);
	}
}

// Checks if a project exists and returns a boolean
export function doesProjectExist(name: string): boolean {
	return existsSync(`${getShadowEngineDataDir()}/projects/${name}`);
}

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

export function openProject(name: string) {
	if (doesProjectExist(name)) {
		ipcRenderer.send('createEditorWindow', name);
	} else {
		throw new Error('ERR: Project named: ' + name + " doesn't exist");
	}
}

// THIS IS A RENDERER SCRIPT

import {
	createContextMenu,
	getShadowEngineDataDir,
	makeWindowOnTop,
	randomRange
} from '../toplevel/UtilitiesManager';
import { fileNameChecker } from '../toplevel/PathManager';
import {
	createProject,
	getProjects,
	openProject
} from '../toplevel/ProjectManager';

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

// When the project name box is focused, replace all spaces with hyphens
{
	let projectNameInput = document.getElementById(
		'projectname'
	) as HTMLInputElement;

	projectNameInput.addEventListener('focus', () => {
		console.log('a');
	});

	projectNameInput.addEventListener('blur', () => {});

	projectNameInput.addEventListener('keydown', function (e) {
		if (e.key == ' ') {
			// Spacebar
			e.preventDefault();
			projectNameInput.value = projectNameInput.value + '-';
		}
	});
}

// Pick a random loading animation to use
{
	let images: string[] = [
		'../../media/loadinganims/crane.gif',
		'../../media/loadinganims/kris.gif',
		'../../media/loadinganims/wis.gif'
	];

	let img: HTMLImageElement = document.createElement('img');
	img.src = images[randomRange(0, images.length - 1)];
	img.draggable = false;
	document.getElementById('loading').appendChild(img);
}

document
	.getElementById('project-creation-button')
	.addEventListener('click', function () {
		let projectName = (
			document.getElementById('projectname') as HTMLInputElement
		).value;
		if (vaildProjectName) {
			showLoading();
			makeWindowOnTop();
			createProject(projectName, 'TypeScript');
			openProject(projectName);
		} else {
			var newProjectSection = document.getElementById('new-project-section');
			newProjectSection.classList.add('shake');
			setTimeout(function () {
				newProjectSection.classList.remove('shake');
			}, 500);
		}
	});

{
	//Initialize project list
	var projects = getProjects();
	let sddr: string = getShadowEngineDataDir();
	for (let i: number = 0; i < projects.length; i++) {
		let projectName: string = projects[i];

		let projectElement: HTMLDivElement = document.createElement('div');
		let coverImageElement: HTMLImageElement = document.createElement('img');
		let projectNameElement: HTMLSpanElement = document.createElement('span');

		// Create Events
		projectElement.addEventListener('dblclick', function () {
			makeWindowOnTop();
			showLoading();
			openProject(projectName);
		});

		projectElement.addEventListener('contextmenu', function () {
			console.log('Ctx menu');
			createContextMenu(
				{
					items: [
						{
							label: 'Find',
							title: 'Hovered'
						},
						{
							label: 'Replace',
							title: 'Hovered'
						},
						{ type: 'separator' },
						{
							label: 'Cut',
							title: 'Hovered'
						},
						{
							label: 'Copy',
							title: 'Hovered'
						},
						{
							label: 'Paste',
							title: 'Hovered'
						}
					]
				},
				(index) => {}
			);
		});

		// Make focusable
		projectElement.tabIndex = 0;

		// Set Image Properties
		coverImageElement.src = `${sddr}/projects/${projectName}/cover.png`;
		coverImageElement.draggable = false;

		// Set Name Properties
		projectNameElement.innerText = projectName;

		// Build Final Element
		projectElement.appendChild(coverImageElement);
		projectElement.appendChild(projectNameElement);
		document.getElementById('projects').appendChild(projectElement);
	}
}

function showLoading() {
	document.getElementById('loading').style.clipPath = 'circle(200% at 50% 50%)';
}

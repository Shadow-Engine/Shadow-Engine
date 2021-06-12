// THIS IS A RENDERER SCRIPT

let newProjectSectionOpen: boolean = false;
document.getElementById('newprojectbtn').addEventListener('click', function () {
	if (newProjectSectionOpen === false) {
		document.getElementById('new-project-section').style.clipPath =
			'circle(141.5% at 100% 100%)';
		document.getElementById('newprojectbtn').style.transform = 'rotate(45deg)';
		newProjectSectionOpen = true;
		console.log('going up');
	} else {
		document.getElementById('new-project-section').style.clipPath =
			'circle(0% at 100% 100%)';
		document.getElementById('newprojectbtn').style.transform = 'rotate(0deg)';
		newProjectSectionOpen = false;
		console.log('going back');
	}
});

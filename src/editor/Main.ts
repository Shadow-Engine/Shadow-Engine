// THIS IS A RENDERER SCRIPT

import { openLogger, writeToStream } from '../toplevel/Logger';

// document.querySelectorAll('.leftpanel-button').forEach(function () {
// 	this.addEventListener('click', function () {
// 		//openLogger();
// 	});
// });

document.getElementById('showlog').addEventListener('click', function () {
	openLogger();
});

document
	.getElementById('writetexttolog')
	.addEventListener('click', function () {
		writeToStream('top', 'Hello, World!');
	});

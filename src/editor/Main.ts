// THIS IS A RENDERER SCRIPT

import { ipcRenderer } from 'electron';
import { openLogger, writeToStream } from '../toplevel/Logger';

window.onload = function () {
	ipcRenderer.send('Plugin.startPluginHost');
};

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

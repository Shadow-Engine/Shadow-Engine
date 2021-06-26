import { ipcRenderer } from 'electron';
import {
	contextMenuCallback,
	contextMenuOptions
} from '../toplevel/UtilitiesManager';

window.onload = function () {
	ipcRenderer.on(
		'main.createContextMenu',
		(_event, options: contextMenuOptions, callback: contextMenuCallback) => {
			console.log('lmao');
		}
	);
};

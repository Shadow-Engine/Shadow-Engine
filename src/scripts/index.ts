import { createWindow } from '../toplevel/WindowManager';

window.onload = function () {
	setTimeout(function () {
		createWindow({
			decorations: 'basic',
			height: 200,
			width: 200,
			url: 'wow'
		});
	}, 6000);
};

import { createWindow } from '../toplevel/WindowManager';

export function openProcessManager() {
	createWindow({
		decorations: 'tool',
		height: 200,
		width: 900,
		url: '../dom/ProcessManager/ProcessManager.html',
		onTop: true
	});
}

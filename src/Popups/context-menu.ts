import { ipcRenderer } from 'electron';
import {
	contextMenuCallback,
	contextMenuOptions,
	contextMenuOptionType
} from '../toplevel/UtilitiesManager';

window.onload = function () {
	ipcRenderer.on(
		'main.createContextMenu',
		(_event, optionsstring: string /* , callback: contextMenuCallback */) => {
			let options: contextMenuOptions = JSON.parse(optionsstring);
			console.log(options);
			for (let i: number = 0; i < options.items.length; i++) {
				let type: contextMenuOptionType;

				if (options.items[i].type == undefined) {
					type = 'text';
				} else {
					type = options.items[i].type;
				}

				createContextMenuOption(
					type,
					options.items[i].label,
					options.items[i].title
				);
			}
		}
	);
};

function createContextMenuOption(
	type: contextMenuOptionType,
	label: string,
	title: string
) {
	switch (type) {
		case 'text': {
			let item: HTMLLIElement = document.createElement('li');
			item.innerText = label;
			item.title = title;
			document.getElementById('contextMenuItems').appendChild(item);
			break;
		}

		case 'separator': {
			let item: HTMLLIElement = document.createElement('li');
			item.classList.add('separator');
			document.getElementById('contextMenuItems').appendChild(item);
			break;
		}

		default: {
			throw new Error('Unknown contextMenuOptionType');
		}
	}
}

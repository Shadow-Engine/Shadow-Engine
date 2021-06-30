import { ipcRenderer } from 'electron';
import {
	contextMenuOptions,
	contextMenuOptionType
} from '../toplevel/UtilitiesManager';

let optionIndex: number = 0;

window.onload = function () {
	ipcRenderer.on('main.createContextMenu', (_event, optionsstring: string) => {
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
	});
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
			item.title = title ? title : ''; // if title is set use title else set to none
			let thisItemsValue: number = optionIndex;
			item.addEventListener('click', function () {
				ipcRenderer.send('context-menu.return-value', thisItemsValue);
				window.close();
			});
			document.getElementById('contextMenuItems').appendChild(item);
			optionIndex++;
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

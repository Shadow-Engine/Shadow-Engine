export let engineConfig = {
	language: 'en_US',
	useNativeTitleBar: false,
	useNativePopups: false,
	codeEditor: {
		editorBackend: 'monaco',
		showLineNumbers: true,
		autoSave: false,
		indentSize: 4,
		indentType: 'tabs',
		rightToLeft: false,
		lineWrapping: false,
		codeLinting: true,
		miniMap: false
	},
	linuxSpecific: {
		notificationHelper: 'electron',
		customNotificationHelper: '',
		popupHelper: 'electron',
		customPopupHelper: ''
	}
};

export interface engineConfigInterface {
	language: string;
	useNativeTitleBar: boolean; // Useful on Linux systems with minimalist/none titlebars
	useNativePopups: boolean;
	codeEditor: {
		editorBackend: 'monaco' | 'ace' | 'codemirror'; // the type of code editor to use
		showLineNumbers: boolean; // weather to show the column of numbers on the left
		autoSave: boolean; // the editor will automatically save after you finish typing
		indentSize: number; // How big should one indent be
		indentType: 'tabs' | 'spaces'; // determines the type of tab to use for indenting
		rightToLeft: boolean; // if true, the text will flow from right to left
		lineWrapping: boolean; // Controls line wrapping
		codeLinting: boolean; // Controls weather to check code for errors
		miniMap: boolean; // Show a minimap on the right side of the code editor
	};
	linuxSpecific: {
		notificationHelper: 'electron' | 'notify-send' | 'zenity' | 'custom';
		customNotificationHelper: string; // Command executed when the notif helper is set to custom
		popupHelper: 'electron' | 'zenity' | 'custom'; // Only used if useNativePopups is set to true
		customPopupHelper: string; // Command executed when the popup helper is set to custom
	};
}

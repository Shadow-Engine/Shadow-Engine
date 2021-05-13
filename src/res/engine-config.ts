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
	}
};

export interface engineConfigInterface {
	language: string;
	useNativeTitleBar: boolean;
	useNativePopups: boolean;
	codeEditor: {
		editorBackend: string;
		showLineNumbers: boolean;
		autoSave: boolean;
		indentSize: number;
		indentType: string;
		rightToLeft: boolean;
		lineWrapping: boolean;
		codeLinting: boolean;
		miniMap: boolean;
	};
}

var CoreModule = require('module');
var require = function (module) {
	var ogRequire = CoreModule.prototype.require;

	console.log('Wants ' + module);
	if (module == 'fs') {
		//allow
		return ogRequire(module);
	} else {
		throw new Error('Denied Access to ' + module);
	}
};

module.constructor._load = function (module) {
	var ogRequire = CoreModule.prototype.require;

	console.log('Wants ' + module);
	if (module == 'fs') {
		//allow
		return ogRequire(module);
	} else {
		throw new Error('Denied Access to ' + module);
	}
};

// Compare allowed modules against a whitelist array???

// This doesn't work
const child_process = require('child_process');

// This works
const fs = require('fs');

// This doesn't work
const child_process = module.constructor._load('child_process');

// This works
const fs = module.constructor._load('fs');

// This function completly bugs out the system, and i like it. No workarounds
const fs = CoreModule.prototype.require('fs');

const IOUtils = require('./dist/native/IOUtils');

while (true) {
	console.log('x: ' + IOUtils.getMouseX() + ' y: ' + IOUtils.getMouseY());
}

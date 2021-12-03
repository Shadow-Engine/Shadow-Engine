const IOUtils = require('./build/Release/IOUtils.node');

function getMouseX() {
	return IOUtils.getMouseX();
}

function getMouseY() {
	return IOUtils.getMouseY();
}

console.log(getMouseX());
console.log(getMouseY());

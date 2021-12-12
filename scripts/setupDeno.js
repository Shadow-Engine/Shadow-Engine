// This script is to be run before Shadow Engine is built.
// It will install a Deno executable into the Deno folder so that it can be packaged with Shadow.

const download = require('download');

var target = 'unknown';

if (process.platform == 'linux') target = 'x86_64-unknown-linux-gnu';
if (process.platform == 'win32') target = 'x86_64-pc-windows-msvc';
if (process.platform == 'darwin') target = 'x86_64-apple-darwin';

download(
	`https://github.com/denoland/deno/releases/latest/download/deno-${target}.zip`
);

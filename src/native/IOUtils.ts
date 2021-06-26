//@ts-expect-error
import * as IOUtils from '../../build/Release/IOUtils.node';

export function getMouseX(): number {
	return IOUtils.getMouseX();
}

export function getMouseY(): number {
	return IOUtils.getMouseY();
}

#include "mouse.h"
#include <stdlib.h>
#include <string.h>
#include "xmouse.h"

#if defined(_WIN32)
#include <windows.h>
#endif

int getMousePos(int x) {
#if defined(_WIN32)
	POINT point;
	if (GetCursorPos(&point)) {
		if (x == 1) {
			//Return X Location
			return point.x;
		} else {
			//Return Y Location
			return point.y;
		}
	} else {
		return 0;
	}

#elif defined(linux)
	// Check for general X Server support
	if (strcmp(getenv("DISPLAY"), "") == 0) {
		//No X Support
		return 0;
	} else {
		// Check to see if using Wayland
		if (strcmp(getenv("WAYLAND_DISPLAY"), "") == 0) {
			// Not using Wayland, assume X Server
			xgetmousepos(x);

		} else {
			// Using Wayland, run Wayland code
			return 0;
		}
	}
#else
	return 0;
#endif
}

int getMouseX() {
	return getMousePos(1);
}
int getMouseY() {
	return getMousePos(0);
}

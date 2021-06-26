#include "mouse.h"
#include <stdlib.h>
#include <string.h>

#if defined(_WIN32)
#include <windows.h>
#endif

#if defined(linux)
#include <X11/Xlib.h>
#include <assert.h>
#include <unistd.h>
#include <malloc.h>

static int XErrorHandler(Display *display, XErrorEvent *event) {
	return 1;
}
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
			Bool result;
			Window window_returned;
			int root_x;
			int root_y;
			int win_x;
			int win_y;
			unsigned int mask_return;

			Display *display = XOpenDisplay(NULL);
			assert(display);
			XSetErrorHandler(XErrorHandler);
			int numScreens = XScreenCount(display);
			Window *root_windows = malloc(sizeof(Window) * numScreens);
			for (int i = 0; i < numScreens; i++) {
				root_windows[i] = XRootWindow(display, i);
			}
			for (int i = 0; i < numScreens; i++) {
				result = XQueryPointer(display, root_windows[i], &window_returned, &window_returned, &root_x, &root_y, &win_x, &win_y, &mask_return);
				if (result == True) {
					break;
				}
			}
			if (result != True) {
				// No mouse
				return 0;
			}
			
			if (x == 1) {
				//Return X Location
				return root_x;
			} else {
				//Return Y Location
				return root_y;
			}

			free(root_windows);
			XCloseDisplay(display);

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
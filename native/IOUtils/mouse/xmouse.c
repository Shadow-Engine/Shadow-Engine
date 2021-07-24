#ifdef linux
#include <X11/Xlib.h>
#include <assert.h>
#include <unistd.h>
#include <malloc.h>

int xgetmousepos(int isX) {
	int number_of_screens;
	int i;
	Bool result;
	Window *root_windows;
	Window window_returned;
	int root_x, root_y;
	int win_x, win_y;
	unsigned int mask_return;

	Display *display = XOpenDisplay(NULL);
	assert(display);
	number_of_screens = XScreenCount(display);
	root_windows = malloc(sizeof(Window) * number_of_screens);
	for (i = 0; i < number_of_screens; i++) {
		root_windows[i] = XRootWindow(display, i);
	}
	for (i = 0; i < number_of_screens; i++) {
		result = XQueryPointer(display, root_windows[i], &window_returned,
			&window_returned, &root_x, &root_y, &win_x, &win_y,
			&mask_return);
		if (result == True) {
		    break;
		}
	}
	if (result != True) {
		return 0;
	}

	free(root_windows);
	XCloseDisplay(display);

	if (isX == 1) {
		return root_x;
	} else {
		return root_y;
	}
}

#else

int xgetmousepos(int isX) {
	return 0;
}

#endif

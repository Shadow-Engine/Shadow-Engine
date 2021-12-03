#include "xmouse_linux.h"

#include <X11/Xlib.h>
#include <stdlib.h>
#include <stdio.h>
#include <xdo.h>

int xgetmousepos(int isX) {
	xdo_t *xdo = xdo_new(NULL);
	int *x;
	int *y;
	int *screen;
	xdo_get_mouse_location(xdo, x, y, screen);

	if (isX)
		return x;
	else
		return y;
}

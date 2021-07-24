{
	"targets": [
		{
			"target_name": "IOUtils",
			"cflags!": [ "-fno-exceptions -lX11" ],
			"cflags_cc!": [ "-fno-exceptions -lX11" ],
			"sources": [
				"./native/IOUtils/mouse/mouse.cpp",
				"./native/IOUtils/mouse/xmouse.c",
				"./native/IOUtils/index.cpp"
			],
			"include_dirs": [
				"<!@(node -p \"require('node-addon-api').include\")"
			],
			"defines": [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
		}
	]
}

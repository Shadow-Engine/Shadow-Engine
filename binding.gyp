{
	"targets": [
		{
			"target_name": "IOUtils",
			"cflags!": [ "-fno-exceptions" ],
			"cflags_cc!": [ "-fno-exceptions" ],
			"sources": [
				"./native/IOUtils/mouse/mouse.cpp",
				"./native/IOUtils/index.cpp"
			],
			"include_dirs": [
				"<!@(node -p \"require('node-addon-api').include\")"
			],
			"defines": [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
		}
	]
}
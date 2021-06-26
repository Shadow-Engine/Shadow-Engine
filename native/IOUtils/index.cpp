#include <napi.h>
#include "mouse/mouse.h"

Napi::Number User_GetMouseX(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	int result = getMouseX();
	return Napi::Number::New(env, result);
}

Napi::Number User_GetMouseY(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	int result = getMouseY();
	return Napi::Number::New(env, result);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
	exports.Set(
		Napi::String::New(env, "getMouseX"),
		Napi::Function::New(env, User_GetMouseX)
	);

	exports.Set(
		Napi::String::New(env, "getMouseY"),
		Napi::Function::New(env, User_GetMouseY)
	);

	return exports;
}

NODE_API_MODULE(IOUtils, Init);
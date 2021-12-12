# Deno

"Deno is a simple, modern and secure runtime for JavaScript and TypeScript that uses V8 and is built in Rust." -- Deno website https://deno.land

Deno's primary use in Shadow Engine is plugins, a Deno executable is shipped alongside every build of Shadow Engine. Deno is chosen for Plugins because of its built in security. This security allows Shadow Engine to manage Plugins and what permissions they get, if a plugin wants access to a certain file at runtime, it can request the user via Shadow Engine notification for specfic permission 
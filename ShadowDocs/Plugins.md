# Plugins
The plugin system for Shadow Engine consists of two parts: The PluginHost and each individual plugin.

The PluginHost is built into Shadow Engine directly and is the controller of all plugins. When the Shadow Engine Editor is launched, so is the PluginHost as it finds an open port on the system to host a WebSocket Server. Then it launches each individual valid plugin it can find in [[SDDR]]/plugins with [[Deno]], which is the secure JavaScript and TypeScript runtime that Shadow Engine uses to launch plugins. You can see the reasoning for picking Deno in the [[Deno]] page.
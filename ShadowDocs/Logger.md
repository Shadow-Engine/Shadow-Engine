# Logger

Information about Shadow Engine's built in Logger

A Stream is a log file that contains data from whatever decided to write to that Stream. It's a simple way to filter out log messages without it all going out to one giant log

## Methods
* src/toplevel/Logger.ts (Renderer safe file)
	* createNewStream(streamName: string): void
	* writeToStream(streamName: string, data: string | number | object): void
	* openLogger(): void
* src/main.ts (These are all methods that can be called from main)
	* MAINcreateNewStream(streamName: string): void
	* MAINwriteToStream(streamName: string, data: string | number | object): void
	* MAINopenLogger(): void

## IPC Calls
* `Logger.createNewStream`
* `Logger.writeToStream`
* `Logger.openLogger`

## Examples
```typescript
ipcRenderer.send('Logger.createNewStream', "ExampleStream");
ipcRenderer.send('Logger.writeToStream', "ExampleStream", "Hello, World!");
```

```typescript
import { createNewStream, writeToStream } from '../toplevel/Logger';

createNewStream("ExampleStream");
writeToStream("ExampleStream", "Hello, World!");
```
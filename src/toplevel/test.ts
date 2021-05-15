/* import { modConfigFile, readConfigFile } from './ConfigurationManager';
import { assertMacroPath } from './PathManager';

let path: string = '$' + __dirname + '\\test.txt';
assertMacroPath(path);
//modConfigFile(path, 'lastname', 'richter');

console.log(readConfigFile(path, 'Lastname'));
 */

import { isAdmin } from './UtilitiesManager';

console.log(isAdmin());

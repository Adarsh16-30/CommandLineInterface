// colors.js
// CLI color helpers with theme support.

import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import os from "os";

// Load user's theme or fallback to dark.
const configPath = path.join(os.homedir(), ".mycli-config.json");
let theme = "dark";
try {
 if (fs.existsSync(configPath)) {
 const config = fs.readJsonSync(configPath);
 theme = config.theme || "dark";
 }
} catch { theme = "dark"; }

const colors = theme === "light"
 ? { successColor: chalk.green, infoColor: chalk.blue, warnColor: chalk.yellow, errorColor: chalk.red }
 : { successColor: chalk.greenBright, infoColor: chalk.cyanBright, warnColor: chalk.yellowBright, errorColor: chalk.redBright };

export const success = (msg) => console.log(colors.successColor(msg));
export const info = (msg) => console.log(colors.infoColor(msg));
export const warn = (msg) => console.log(colors.warnColor(msg));
export const error = (msg) => console.log(colors.errorColor(msg));

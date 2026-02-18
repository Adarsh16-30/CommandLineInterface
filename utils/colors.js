// colors.js
// Shared color helpers that respect the user's chosen theme.
// Commands should use these instead of calling chalk directly so the
// output stays consistent across the whole CLI.

import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import os from "os";

// Try to read the saved theme from the user's config file.
// If the file doesn't exist or can't be parsed, we fall back to "dark".
const configPath = path.join(os.homedir(), ".mycli-config.json");
let theme = "dark";
try {
  if (fs.existsSync(configPath)) {
    const config = fs.readJsonSync(configPath);
    theme = config.theme || "dark";
  }
} catch { theme = "dark"; }

// Light themes use softer colors; dark themes use the brighter variants.
const colors = theme === "light"
  ? { successColor: chalk.green, infoColor: chalk.blue, warnColor: chalk.yellow, errorColor: chalk.red }
  : { successColor: chalk.greenBright, infoColor: chalk.cyanBright, warnColor: chalk.yellowBright, errorColor: chalk.redBright };

export const success = (msg) => console.log(colors.successColor(msg));
export const info = (msg) => console.log(colors.infoColor(msg));
export const warn = (msg) => console.log(colors.warnColor(msg));
export const error = (msg) => console.log(colors.errorColor(msg));


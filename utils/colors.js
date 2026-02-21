
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import os from "os";

const userConfigurationFilePath = path.join(os.homedir(), ".mycli-config.json");
let selectedUserTheme = "dark";
try {
  if (fs.existsSync(userConfigurationFilePath)) {
    const parsedConfiguration = fs.readJsonSync(userConfigurationFilePath);
    selectedUserTheme = parsedConfiguration.theme || "dark";
  }
} catch { selectedUserTheme = "dark"; }

const themeColorPalette = selectedUserTheme === "light"
  ? { successColor: chalk.green, infoColor: chalk.blue, warnColor: chalk.yellow, errorColor: chalk.red }
  : { successColor: chalk.greenBright, infoColor: chalk.cyanBright, warnColor: chalk.yellowBright, errorColor: chalk.redBright };

export const success = (outputMessage) => console.log(themeColorPalette.successColor(outputMessage));
export const info = (outputMessage) => console.log(themeColorPalette.infoColor(outputMessage));
export const warn = (outputMessage) => console.log(themeColorPalette.warnColor(outputMessage));
export const error = (outputMessage) => console.log(themeColorPalette.errorColor(outputMessage));

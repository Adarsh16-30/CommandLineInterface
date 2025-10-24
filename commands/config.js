// config.js
// Update/view CLI config.

import inquirer from "inquirer";
import { loadConfig, saveConfig } from "../utils/helpers.js";
import chalk from "chalk";

export default (program) => {
  program
    .command("config")
    .description("Manage your mycli configuration")
    .action(async () => {
      const current = await loadConfig();
      console.log(chalk.cyan("Current Config:"), current);
      const answers = await inquirer.prompt([
        { name: "username", message: "Your username:", default: current.username || "" },
        { name: "theme", message: "Preferred theme:", default: current.theme || "light" }
      ]);
      await saveConfig(answers);
      console.log(chalk.greenBright("Configuration saved successfully!"));
    });
};

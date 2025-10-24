import { execSync } from "child_process";
import ora from "ora";
import chalk from "chalk";
// Import package.json to read the *current* version
import pkg from "../package.json" with { type: "json" };

export default (program) => {
  program
    .command("update")
    .description("Update mycli to the latest version")
    .action(async () => {
      const spinner = ora("Checking for updates...").start();
      try {
        // Force-update the global package
        execSync("npm install -g mycli@latest", { stdio: "ignore" });
        spinner.succeed(`Updated to latest version.`);
        console.log(chalk.greenBright(`Current version: ${pkg.version}`));
      } catch {
        spinner.fail("Failed to update. Try again later.");
      }
    });
};
// run.js
// Runs an npm script from the current project and streams its output live.

import { exec } from "child_process";
import ora from "ora";
import chalk from "chalk";

export default (program) => {
  program
    .command("run <script>")
    .description("Run a custom npm/yarn/pnpm script")
    .action((script) => {
      const spinner = ora(`Running ${script}...`).start();
      // TODO: Add support for yarn/pnpm later
      const cmd = `npm run ${script}`;

      // Use async 'exec' to handle potentially long-running scripts
      const child = exec(cmd);

      // Stream stdout/stderr directly to the console
      child.stdout.on("data", (data) => console.log(chalk.gray(data.toString())));
      child.stderr.on("data", (data) => console.log(chalk.red(data.toString())));

      // Check the exit code when the script finishes
      child.on("close", (code) => {
        if (code === 0) spinner.succeed("Script completed successfully!");
        else spinner.fail("Script failed.");
      });
    });
};
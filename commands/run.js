
import { exec } from "child_process";
import ora from "ora";
import chalk from "chalk";

export default (program) => {
  program
    .command("run <script>")
    .description("Run a custom npm/yarn/pnpm script")
    .action((script) => {
      const spinner = ora(`Running ${script}...`).start();
      const cmd = `npm run ${script}`;

      const child = exec(cmd);

      child.stdout.on("data", (data) => console.log(chalk.gray(data.toString())));
      child.stderr.on("data", (data) => console.log(chalk.red(data.toString())));

      child.on("close", (code) => {
        if (code === 0) spinner.succeed("Script completed successfully!");
        else spinner.fail("Script failed.");
      });
    });
};

import simpleGit from "simple-git";
import ora from "ora";
import chalk from "chalk";
import inquirer from "inquirer";

export default (program) => {
  program
    .command("git <action>")
    .description("Perform Git operations: init | commit | push | status")
    .action(async (action) => {
      const git = simpleGit();
      const spinner = ora("Running Git command...").start();
      try {
        switch (action) {
          case "init":
            await git.init();
            spinner.succeed(chalk.green("Initialized Git repository."));
            break;
          case "commit":
            await git.add(".");
            spinner.stop();
            const { message } = await inquirer.prompt([
              { type: "input", name: "message", message: "Commit message:" }
            ]);
            spinner.start("Committing...");
            await git.commit(message || "Update from mycli");
            spinner.succeed(chalk.green("Changes committed."));
            break;
          case "push":
            await git.push();
            spinner.succeed(chalk.green("Changes pushed to remote."));
            break;
          case "status":
            const status = await git.status();
            spinner.stop();
            console.log(chalk.cyan("Git Status:"), status);
            break;
          default:
            spinner.fail(chalk.red("Unknown action. Use: init | commit | push | status"));
        }
      } catch (err) {
        spinner.fail("Git operation failed.");
        console.error(err.message);
      }
    });
};

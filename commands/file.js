
import fs from "fs-extra";
import chalk from "chalk";

export default (program) => {
  program
    .command("file [action] [filename]")
    .description("Perform file operations: create, read, delete")
    .action(async (action, filename) => {
      if (!action || !filename) return console.log(chalk.red("Usage: mycli file <create|read|delete> <filename>"));
      switch (action) {
        case "create":
          await fs.writeFile(filename, "This is a new file created by mycli!");
          console.log(chalk.green(`File '${filename}' created.`));
          break;
        case "read":
          if (!fs.existsSync(filename)) return console.log(chalk.red("File not found."));
          const content = await fs.readFile(filename, "utf-8");
          console.log(chalk.cyanBright(content));
          break;
        case "delete":
          if (!fs.existsSync(filename)) return console.log(chalk.red("File not found."));
          await fs.remove(filename);
          console.log(chalk.yellow(`File '${filename}' deleted.`));
          break;
        default:
          console.log(chalk.red("Invalid action. Use: create | read | delete"));
      }
    });
};


import chalk from "chalk";

export default (program) => {
  program
    .command("time")
    .description("Show current system time")
    .action(() => {
      const now = new Date();
      console.log(
        chalk.yellowBright(`${now.toLocaleTimeString()} — ${now.toDateString()}`)
      );
    });
};

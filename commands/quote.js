import chalk from "chalk";
import ora from "ora";
import axios from "axios";

export default (program) => {
  program
    .command("quote")
    .description("Show a motivational quote")
    .action(async () => {
      const spinner = ora("Fetching quote...").start();
      try {
        const res = await axios.get("https://zenquotes.io/api/random");
        spinner.succeed("Here’s a thought:");
        console.log(chalk.magentaBright(`💬 "${res.data[0].q}" — ${res.data[0].a}`));
      } catch {
        spinner.fail("Couldn’t fetch quote. Try again later!");
      }
    });
};

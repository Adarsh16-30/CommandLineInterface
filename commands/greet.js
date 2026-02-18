// greet.js
// A simple greeting command — useful for testing the CLI is working
// and for showing off the --uppercase flag as an example of options.

import chalk from "chalk";

export default (program) => {
  program
    .command("greet <name>") // <name> is required
    .description("Greet a user by name")
    .option("-u, --uppercase", "Print the greeting in uppercase")
    .action((name, options) => {
      let message = `Hello, ${name}!`;
      if (options.uppercase) message = message.toUpperCase();
      console.log(chalk.greenBright(message));
    });
};

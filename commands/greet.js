import chalk from "chalk";

export default (program) => {
 program
 .command("greet <name>") // <name> is a required argument
 .description("Greet a user by name")
 .option("-u, --uppercase", "Make greeting uppercase") // -u is an optional flag
 .action((name, options) => {
 let message = `Hello, ${name}!`;
 if (options.uppercase) message = message.toUpperCase();
 console.log(chalk.greenBright(message));
 });
};
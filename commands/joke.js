import chalk from "chalk";
import ora from "ora";
import axios from "axios";

export default (program) => {
 program
 .command("joke")
 .description("Get a random programming joke")
 .action(async () => {
 const spinner = ora("Fetching a funny joke...").start();
 try {
 // Simple, no-auth API for jokes
 const res = await axios.get("https://official-joke-api.appspot.com/jokes/programming/random");
 const joke = res.data[0]; // This API returns an array
 spinner.succeed("Got one!");
 console.log(chalk.cyanBright(`${joke.setup}\n${joke.punchline}`));
 } catch {
 spinner.fail("Couldn’t fetch a joke!");
 }
 });
};
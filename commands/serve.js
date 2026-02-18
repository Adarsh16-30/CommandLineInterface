import express from "express";
import chalk from "chalk";
import open from "open";

export default (program) => {
 program
 .command("serve [port]")
 .description("Run a simple local dev server (default: 3000)")
 .action((port = 3000) => {
 const app = express();

 app.use(express.static(process.cwd()));

 app.listen(port, async () => {
 const url = `http://localhost:${port}`;
 console.log(chalk.greenBright(`Server running at ${url}`));
 await open(url);
 });
 });
};

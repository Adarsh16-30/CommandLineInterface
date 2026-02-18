// serve.js
// Spins up a quick static file server from the current directory and opens it
// in the browser. Great for previewing HTML files without a full dev setup.

import express from "express";
import chalk from "chalk";
import open from "open";

export default (program) => {
  program
    .command("serve [port]")
    .description("Run a simple local dev server (default: 3000)")
    .action((port = 3000) => {
      const app = express();

      // Serve everything in the current working directory as static files
      app.use(express.static(process.cwd()));

      app.listen(port, async () => {
        const url = `http://localhost:${port}`;
        console.log(chalk.greenBright(`Server running at ${url}`));
        await open(url);
      });
    });
};


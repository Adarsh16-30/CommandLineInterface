#!/usr/bin/env node
// CLI main entry: initializes all commands using Commander.

import { Command } from "commander";
import chalk from "chalk";
import figlet from "figlet";
import dotenv from "dotenv";
dotenv.config();

import greet from "./commands/greet.js";
import time from "./commands/time.js";
import quote from "./commands/quote.js";
import init from "./commands/init.js";
import config from "./commands/config.js";
import joke from "./commands/joke.js";
import file from "./commands/file.js";
import git from "./commands/git.js";
import serve from "./commands/serve.js";
import update from "./commands/update.js";
import info from "./commands/info.js";
import run from "./commands/run.js";
import ai from "./commands/ai.js";
import template from "./commands/template.js";
import dockerCmd from "./commands/docker.js";
import githubCmd from "./commands/github.js";
import todoCmd from "./commands/todo.js";
import secret from "./commands/secret.js";
import lint from "./commands/lint.js";
import audit from "./commands/audit.js";
import openCmd from "./commands/open.js";
import theme from "./commands/theme.js";

// Output CLI banner.
console.log(
  chalk.cyanBright(figlet.textSync("My CLI", { horizontalLayout: "fitted" }))
);

// Register commands.
const program = new Command();
program
  .name("mycli")
  .description("A fully featured Node.js CLI toolkit")
  .version("2.0.0");

greet(program);
time(program);
quote(program);
init(program);
config(program);
joke(program);
file(program);
git(program);
serve(program);
update(program);
info(program);
run(program);
ai(program);
template(program);
dockerCmd(program);
githubCmd(program);
openCmd(program);
todoCmd(program);
secret(program);
lint(program);
audit(program);
theme(program);

program.parse(process.argv); // Start CLI parsing.

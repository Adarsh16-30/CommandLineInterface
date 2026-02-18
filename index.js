#!/usr/bin/env node

import { Command } from "commander";
import { createRequire } from "module";

import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

import greet from "./commands/greet.js";
import time from "./commands/time.js";
import quote from "./commands/quote.js";
import config from "./commands/config.js";
import joke from "./commands/joke.js";
import file from "./commands/file.js";
import git from "./commands/git.js";
import serve from "./commands/serve.js";
import info from "./commands/info.js";
import run from "./commands/run.js";
import ai from "./commands/ai.js";
import githubCmd from "./commands/github.js";
import todoCmd from "./commands/todo.js";
import secret from "./commands/secret.js";
import lint from "./commands/lint.js";
import audit from "./commands/audit.js";
import openCmd from "./commands/open.js";
import theme from "./commands/theme.js";
import tuiDemo from "./commands/tui-demo.js";
import monitor from "./commands/monitor.js";
import processCmd from "./commands/process.js";
import network from "./commands/network.js";
import disk from "./commands/disk.js";
import http from "./commands/http.js";
import jsonTools from "./commands/json-tools.js";
import utilsCmd from "./commands/utils.js";
import regex from "./commands/regex.js";
import dockerManager from "./commands/docker.js";
import ssh from "./commands/ssh.js";
import deploy from "./commands/deploy.js";
import focus from "./commands/focus.js";
import notesCmd from "./commands/notes.js";
import passwordCmd from "./commands/password.js";
import ticker from "./commands/ticker.js";
import clipboardCmd from "./commands/clipboard.js";
import scaffold from "./commands/scaffold.js";
import selfupdate from "./commands/selfupdate.js";
import buildCmd from "./commands/build.js";
import helpAll from "./commands/help-all.js";

const banner = [
  chalk.bold.cyan("  ███╗   ███╗██╗   ██╗ ██████╗██╗     ██╗"),
  chalk.bold.cyan("  ████╗ ████║╚██╗ ██╔╝██╔════╝██║     ██║"),
  chalk.bold.cyan("  ██╔████╔██║ ╚████╔╝ ██║     ██║     ██║"),
  chalk.bold.cyan("  ██║╚██╔╝██║  ╚██╔╝  ██║     ██║     ██║"),
  chalk.bold.cyan("  ██║ ╚═╝ ██║   ██║   ╚██████╗███████╗██║"),
  chalk.bold.cyan("  ╚═╝     ╚═╝   ╚═╝    ╚═════╝╚══════╝╚═╝"),
  chalk.dim("  A fully featured Node.js CLI toolkit  |  v3.0.0"),
].join("\n");

console.log("\n" + banner + "\n");

const program = new Command();
program
  .name("mycli")
  .description("A fully featured Node.js CLI toolkit")
  .version("3.0.0");

greet(program);
time(program);
quote(program);
config(program);
joke(program);
file(program);
git(program);
serve(program);
info(program);
run(program);
ai(program);
githubCmd(program);
openCmd(program);
todoCmd(program);
secret(program);
lint(program);
audit(program);
theme(program);
tuiDemo(program);
monitor(program);
processCmd(program);
network(program);
disk(program);
http(program);
jsonTools(program);
utilsCmd(program);
regex(program);
dockerManager(program);
ssh(program);
deploy(program);
focus(program);
notesCmd(program);
passwordCmd(program);
ticker(program);
clipboardCmd(program);
scaffold(program);
selfupdate(program);
buildCmd(program);
helpAll(program);

program.parse(process.argv);

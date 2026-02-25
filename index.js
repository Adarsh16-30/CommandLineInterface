#!/usr/bin/env node
// CLI main entry: initializes all commands using Commander.

import { Command } from "commander";
import chalk from "chalk";
import figlet from "figlet";
import dotenv from "dotenv";

dotenv.config();

import fs from "fs-extra";
import path from "path";
import { logger } from "./utils/logger.js";
import { fileURLToPath, pathToFileURL } from "url";
import { loadConfig } from "./utils/helpers.js";
import https from "https";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", { message: err.message, stack: err.stack });
  console.error(chalk.red("\n✖ [Fatal Error] An unexpected issue occurred within the CLI:"));
  console.error(chalk.red(err.message));
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", { reason });
  console.error(chalk.red("\n✖ [Promise Error] A background task failed unexpectedly:"));
  console.error(chalk.red(reason.stack || reason));
  process.exit(1);
});

const ci = process.env.CI === "true" || process.argv.includes("--ci");
const jsonOut = process.argv.includes("--output") && process.argv.includes("json");

if (!ci && !jsonOut) {
  console.log(chalk.cyanBright(figlet.textSync("My CLI", { horizontalLayout: "fitted" })));
}

const SECRETS_PATTERNS = [/sk-[a-zA-Z0-9]{32,}/, /ghp_[a-zA-Z0-9]{36}/, /AKIA[0-9A-Z]{16}/];
if (process.argv.some(arg => SECRETS_PATTERNS.some(p => p.test(arg)))) {
  logger.warn("Potential secret leak detected in command arguments.");
  console.error(chalk.bgRed.white.bold("\n ⚠️ WARNING: Potential secret passed in plain text. Please use secure config profiles instead. \n"));
}

const config = await loadConfig();

// --- TELEMETRY IMPLEMENTATION ---
// Sends an anonymous ping when a command is executed if telemetry is enabled.
const sendTelemetry = (commandName) => {
  if (config.telemetryEnabled) {
    const data = JSON.stringify({
      event: "command_executed",
      command: commandName,
      os: process.platform,
      node_version: process.version,
      timestamp: new Date().toISOString()
    });

    const req = https.request("https://reqres.in/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length
      }
    });

    // We don't want telemetry to crash the CLI or block execution
    req.on("error", () => { });
    req.write(data);
    req.end();
  }
};
// --------------------------------

const program = new Command();

program
  .name("mycli")
  .description("A fully featured Node.js CLI toolkit")
  .version("3.0.0")
  .option("--ci", "Run in CI mode")
  .option("--output <format>", "Output format");

async function loadCommands() {
  const commandsDir = path.join(__dirname, "commands");
  const files = await fs.readdir(commandsDir);

  for (const file of files) {
    if (file.endsWith(".js")) {
      const fileUrl = pathToFileURL(path.join(commandsDir, file)).href;
      const { default: registerCommand } = await import(fileUrl);
      if (typeof registerCommand === "function") {
        registerCommand(program);
      }
    }
  }

  // Dynamic Plugin Interface Loading
  const pluginsDir = path.join(process.cwd(), "node_modules", "@mycli");
  if (fs.existsSync(pluginsDir)) {
    const plugins = await fs.readdir(pluginsDir);
    for (const plugin of plugins) {
      if (plugin.startsWith("plugin-")) {
        try {
          const { default: p } = await import(path.join("file://", pluginsDir, plugin, "index.js"));
          if (p && p.commands) {
            p.commands.forEach(cmd => {
              program.command(cmd.name).description(`[Plugin] ${cmd.description} `).action(cmd.action);
            });
          }
        } catch (err) {
          logger.error(`Failed to load plugin: ${plugin} `, { error: err.message });
        }
      }
    }
  }
}

loadCommands().then(() => {
  // Intercept command execution for telemetry
  program.hook('preAction', (thisCommand) => {
    const commandedArgs = thisCommand.args;
    if (commandedArgs.length > 0) {
      sendTelemetry(commandedArgs[0]);
    } else {
      sendTelemetry(thisCommand.name());
    }
  });

  program.parse(process.argv);
});

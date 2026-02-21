import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { userConfigurationFilePath } from "../utils/helpers.js";

export default function registerSyncCommand(program) {
    program
        .command("config:sync [action] [destination]")
        .description("Centralized State Sync: push or pull configuration")
        .action(async (syncAction, destinationServer = "./team-config.json") => {
            try {
                if (syncAction === "push") {
                    console.log(chalk.cyan(`☁️ Pushing config state to remote state destination...`));
                    await fs.copy(userConfigurationFilePath, path.resolve(process.cwd(), destinationServer));
                    console.log(chalk.green(`✔ Configuration securely synced to ${destinationServer}`));
                } else if (syncAction === "pull") {
                    console.log(chalk.cyan(`⬇️ Pulling remote config state...`));
                    await fs.copy(path.resolve(process.cwd(), destinationServer), userConfigurationFilePath);
                    console.log(chalk.green(`✔ Local configuration state refreshed from ${destinationServer}`));
                } else {
                    console.log(chalk.red("✖ Unknown sync command. Use 'push' or 'pull'."));
                    process.exit(2);
                }
            } catch (syncError) {
                console.error(chalk.red("✖ Remote synchronization failed: ") + syncError.message);
                process.exit(1);
            }
        });
}

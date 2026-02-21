import chalk from "chalk";
import { loadConfig, saveConfig } from "../utils/helpers.js";

export default function registerTelemetryCommand(program) {
    program
        .command("telemetry")
        .description("Opt-in / Opt-out of anonymous enterprise CLI usage telemetry")
        .option("--enable", "Opt into anonymous telemetry")
        .option("--disable", "Opt out of telemetry")
        .action(async (telemetryOptions) => {
            const config = await loadConfig();

            if (telemetryOptions.enable) {
                config.telemetryEnabled = true;
                await saveConfig(config);
                console.log(chalk.green("✔ Anonymous telemetry enabled. Thank you for helping improve the CLI!"));
            } else if (telemetryOptions.disable) {
                config.telemetryEnabled = false;
                await saveConfig(config);
                console.log(chalk.gray("ℹ Anonymous telemetry disabled. No analytics will be sent."));
            } else {
                const isEnabled = config.telemetryEnabled;
                console.log(chalk.cyan("\n Telemetry Status\n"));
                console.log(chalk.bold("Enabled:"), isEnabled ? chalk.green("True") : chalk.red("False"));
                console.log(chalk.gray("\nUse --enable or --disable to modify.\n"));
            }
        });
}

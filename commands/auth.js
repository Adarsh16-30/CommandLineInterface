import inquirer from "inquirer";
import chalk from "chalk";
import { storeSecureIdentity, retrieveSecureIdentity, loadConfig, saveConfig } from "../utils/helpers.js";
import { logger } from "../utils/logger.js";

export default function registerAuthCommand(program) {
    program
        .command("auth [action]")
        .description("Enterprise identity management: login | profile")
        .action(async (actionName = "login") => {
            const isCI = process.env.CI === "true" || process.argv.includes("--ci");
            const isJson = process.argv.includes("--output") && process.argv.includes("json");

            try {
                const userConfiguration = await loadConfig();
                const activeProfileName = userConfiguration.defaultProfile || "default";

                if (actionName === "login") {
                    if (isCI) {
                        console.error(chalk.red("✖ Interactive login is disabled in CI environments."));
                        process.exit(1);
                    }

                    const { identityProvider, secureToken } = await inquirer.prompt([
                        {
                            type: "list",
                            name: "identityProvider",
                            message: "Select API Provider:",
                            choices: ["HuggingFace", "GitHub", "AWS"]
                        },
                        {
                            type: "password",
                            name: "secureToken",
                            message: "Enter secure token:",
                            mask: "*"
                        }
                    ]);

                    await storeSecureIdentity(activeProfileName, identityProvider.toLowerCase(), secureToken);
                    logger.info(`Secure login successful for profile ${activeProfileName} to provider ${identityProvider}`);

                    if (isJson) {
                        console.log(JSON.stringify({ status: "success", profile: activeProfileName, provider: identityProvider }));
                    } else {
                        console.log(chalk.green(`✔ Identity stored securely in OS keychain for profile: ${activeProfileName}`));
                    }
                } else if (actionName === "profile") {
                    if (isCI) {
                        console.log("Current profile:", activeProfileName);
                        process.exit(0);
                    }

                    const { chosenProfile } = await inquirer.prompt([
                        {
                            type: "input",
                            name: "chosenProfile",
                            message: "Enter profile name to switch to:",
                            default: activeProfileName
                        }
                    ]);

                    userConfiguration.defaultProfile = chosenProfile;
                    await saveConfig(userConfiguration);

                    console.log(chalk.green(`✔ Active profile switched to: ${chosenProfile}`));
                } else {
                    console.log(chalk.red("✖ Unknown action. Use 'login' or 'profile'."));
                    process.exit(2);
                }
            } catch (authError) {
                logger.error("Authentication command failed", { error: authError.message });
                console.error(chalk.red("✖ Authentication failed. Please check logs."));
                process.exit(1);
            }
        });
}

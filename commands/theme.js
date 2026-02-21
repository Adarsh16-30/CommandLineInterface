import { loadConfig, saveConfig } from "../utils/helpers.js";
import { success, error, info } from "../utils/colors.js";
import chalk from "chalk";

export async function getCurrentTheme() {
  const config = await loadConfig();
  return config.theme || "dark"; // default to dark
}

export function getThemedColors(theme) {
  if (theme === "light") {
    return {
      primary: chalk.blue,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red,
      info: chalk.cyan,
      text: chalk.black,
      dim: chalk.gray,
      highlight: chalk.bgYellow.black,
    };
  } else {
    return {
      primary: chalk.blueBright,
      success: chalk.greenBright,
      warning: chalk.yellowBright,
      error: chalk.redBright,
      info: chalk.cyanBright,
      text: chalk.white,
      dim: chalk.gray,
      highlight: chalk.bgCyanBright.black,
    };
  }
}

export default function (program) {
  program
    .command("theme [mode]")
    .description("Set or view terminal color preferences (light|dark)")
    .action(async (mode) => {
      try {
        const config = await loadConfig();

        if (!mode) {
          const current = config.theme || "dark";
          info(`Current theme: ${current}`);
          
          console.log("\n" + "─".repeat(40));
          const colors = getThemedColors(current);
          console.log(colors.success("✓ Success message"));
          console.log(colors.error("✗ Error message"));
          console.log(colors.warning("⚠ Warning message"));
          return;
        }

        const validModes = ["light", "dark"];
        if (!validModes.includes(mode.toLowerCase())) {
          error(`Invalid theme. Use: ${validModes.join(" or ")}`);
          return;
        }

        const newTheme = mode.toLowerCase();
        config.theme = newTheme;
        await saveConfig(config);

        console.log("\n" + "─".repeat(40));
        const colors = getThemedColors(newTheme);
        console.log(colors.info(`Theme activated: ${newTheme}`));
        
      } catch (err) {
        error(`Failed to set theme: ${err.message}`);
      }
    });
}
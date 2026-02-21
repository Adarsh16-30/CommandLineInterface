import { execSync } from "child_process";
import { success, error, info } from "../utils/colors.js";
import fs from "fs-extra";
import ora from "ora";

export default function (program) {
  program
    .command("lint <folder>")
    .description("Run eslint/prettier across project")
    .option("-f, --fix", "Auto-fix issues")
    .action(async (folder, options) => {
      const spinner = ora("Running linters...").start();
      
      try {
        if (!fs.existsSync(folder)) {
          spinner.fail(`Folder not found: ${folder}`);
          return;
        }

        const hasEslint = fs.existsSync("node_modules/.bin/eslint") || 
                          fs.existsSync("node_modules/eslint");
        const hasPrettier = fs.existsSync("node_modules/.bin/prettier") || 
                            fs.existsSync("node_modules/prettier");

        const results = [];

        if (hasEslint) {
          spinner.text = "Running ESLint...";
          try {
            const fixFlag = options.fix ? "--fix" : "";
            execSync(`npx eslint ${folder} ${fixFlag}`, { 
              stdio: "inherit",
              encoding: "utf8"
            });
            results.push("ESLint passed");
          } catch (err) {
            results.push("ESLint found issues");
          }
        } else {
          results.push("ESLint not installed");
        }

        if (hasPrettier) {
          spinner.text = "Running Prettier...";
          try {
            const fixFlag = options.fix ? "--write" : "--check";
            execSync(`npx prettier ${fixFlag} "${folder}/**/*.{js,jsx,ts,tsx,json,css}"`, { 
              stdio: "inherit",
              encoding: "utf8"
            });
            results.push("Prettier passed");
          } catch (err) {
            results.push("Prettier found formatting issues");
          }
        } else {
          results.push("Prettier not installed");
        }

        spinner.succeed("Linting complete!");
        results.forEach(r => info(r));

        if (!hasEslint || !hasPrettier) {
          info("\nInstall missing tools:");
          if (!hasEslint) info("   npm install --save-dev eslint");
          if (!hasPrettier) info("   npm install --save-dev prettier");
        }

      } catch (err) {
        spinner.fail("Linting failed");
        error(err.message);
      }
    });
}
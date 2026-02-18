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

 // Check if the tools are even installed in node_modules
 const hasEslint = fs.existsSync("node_modules/.bin/eslint") ||
 fs.existsSync("node_modules/eslint");
 const hasPrettier = fs.existsSync("node_modules/.bin/prettier") ||
 fs.existsSync("node_modules/prettier");

 const results = [];

 // Run ESLint
 if (hasEslint) {
 spinner.text = "Running ESLint...";
 try {
 const fixFlag = options.fix ? "--fix" : "";
 // Use execSync and 'inherit' to show eslint output in real-time
 execSync(`npx eslint ${folder} ${fixFlag}`, {
 stdio: "inherit",
 encoding: "utf8"
 });
 results.push("ESLint passed");
 } catch (err) {
 // execSync throws on non-zero exit, which eslint does on lint errors
 results.push("ESLint found issues");
 }
 } else {
 results.push("ESLint not installed");
 }

 // Run Prettier
 if (hasPrettier) {
 spinner.text = "Running Prettier...";
 try {
 // Prettier's fix flag is --write, not --fix
 const fixFlag = options.fix ? "--write" : "--check";
 execSync(`npx prettier ${fixFlag} "${folder}/**/*.{js,jsx,ts,tsx,json,css}"`, {
 stdio: "inherit",
 encoding: "utf8"
 });
 results.push("Prettier passed");
 } catch (err) {
 // Prettier also throws on non-zero exit code
 results.push("Prettier found formatting issues");
 }
 } else {
 results.push("Prettier not installed");
 }

 spinner.succeed("Linting complete!");
 results.forEach(r => info(r));

 // Helpful message if tools are missing
 if (!hasEslint || !hasPrettier) {
 info("\nInstall missing tools:");
 if (!hasEslint) info(" npm install --save-dev eslint");
 if (!hasPrettier) info(" npm install --save-dev prettier");
 }

 } catch (err) {
 // This catches *unexpected* errors, not the lint failures
 spinner.fail("Linting failed");
 error(err.message);
 }
 });
}
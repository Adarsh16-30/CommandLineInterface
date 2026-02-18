import { execSync } from "child_process";
import { success, error, info, warn } from "../utils/colors.js";
import ora from "ora";

export default function (program) {
  program
    .command("audit [folder]")
    .description("Run npm audit and display summary")
    .option("-f, --fix", "Auto-fix vulnerabilities")
    .action(async (folder = ".", options) => {
      const spinner = ora("Running security audit...").start();
      
      try {
        // Allow running audit in a different directory
        process.chdir(folder);

        if (options.fix) {
          spinner.text = "Fixing vulnerabilities...";
          const output = execSync("npm audit fix", { encoding: "utf8" });
          spinner.succeed("Audit fix complete!");
          console.log(output);
        } else {
          spinner.text = "Analyzing dependencies...";
          try {
            // Run with --json to get parsable output
            const output = execSync("npm audit --json", { encoding: "utf8" });
            const audit = JSON.parse(output);
            
            spinner.succeed("Audit complete!");
            
            // Display our own custom summary
            console.log("\n" + "=".repeat(50));
            info("📊 Security Audit Summary");
            console.log("=".repeat(50));
            
            const vulnerabilities = audit.metadata?.vulnerabilities || {};
            
            console.log(`\nCritical: ${vulnerabilities.critical || 0}`);
            console.log(`High:     ${vulnerabilities.high || 0}`);
            console.log(`Moderate: ${vulnerabilities.moderate || 0}`);
            console.log(`Low:      ${vulnerabilities.low || 0}`);
            console.log(`ℹInfo:     ${vulnerabilities.info || 0}`);
            
            const total = Object.values(vulnerabilities).reduce((a, b) => a + b, 0);
            
            if (total === 0) {
              success("\nNo vulnerabilities found!");
            } else {
              warn(`\nTotal vulnerabilities: ${total}`);
              info("\nRun 'mycli audit --fix' to attempt automatic fixes");
            }
            
          } catch (auditErr) {
            // npm audit exits with code 1 if vulns are found, this is expected
            // We can just log its standard output in this case
            spinner.succeed("Audit complete (vulnerabilities found)");
            console.log(auditErr.stdout);
          }
        }

      } catch (err) {
        spinner.fail("Audit failed");
        error(err.message);
      }
    });
}
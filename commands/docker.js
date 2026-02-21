
import { execFile } from "child_process";
import fs from "fs-extra";
import path from "path";
import ora from "ora";
import chalk from "chalk";
import { recordAuditEntry } from "../utils/audit.js";

export default program => {
  program
    .command("docker [action] [identifier]")
    .description("Enterprise docker helpers: createfile | build | run")
    .action(async (actionType, containerIdentifier = "myapp") => {
      const ci = process.env.CI === "true" || process.argv.includes("--ci");
      const jsonOut = process.argv.includes("--output") && process.argv.includes("json");

      let loadingSpinner;
      if (!ci && !jsonOut) loadingSpinner = ora().start();

      try {
        if (actionType === "createfile") {
          const dockerfileContent = `# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "index.js"]`;
          await fs.writeFile(path.join(process.cwd(), "Dockerfile"), dockerfileContent);
          if (loadingSpinner) loadingSpinner.succeed("Dockerfile provisioned successfully");
          if (jsonOut) console.log(JSON.stringify({ status: "success", action: "createfile", file: "Dockerfile" }));
        } else if (actionType === "build") {
          if (loadingSpinner) loadingSpinner.text = "Building container image...";
          recordAuditEntry("docker build", [containerIdentifier, "latest", "."]);

          execFile("docker", ["build", "-t", `${containerIdentifier}:latest`, "."], (buildError, standardOutput, standardError) => {
            if (buildError) {
              if (loadingSpinner) loadingSpinner.fail("Container build failed");
              console.error(jsonOut ? JSON.stringify({ error: standardError }) : standardError);
              process.exit(1);
            } else {
              if (loadingSpinner) loadingSpinner.succeed("Container built successfully");
              console.log(jsonOut ? JSON.stringify({ status: "success", action: "build", image: containerIdentifier }) : standardOutput);
            }
          });
        } else if (actionType === "run") {
          if (loadingSpinner) loadingSpinner.text = "Initializing container instance...";
          recordAuditEntry("docker run", ["-d", containerIdentifier, "3000:3000"]);

          execFile("docker", ["run", "-d", "--name", containerIdentifier, "-p", "3000:3000", `${containerIdentifier}:latest`], (runError, standardOutput, standardError) => {
            if (runError) {
              if (loadingSpinner) loadingSpinner.fail("Container initialization failed");
              console.error(jsonOut ? JSON.stringify({ error: standardError }) : standardError);
              process.exit(1);
            } else {
              if (loadingSpinner) loadingSpinner.succeed("Container instance running");
              if (jsonOut) console.log(JSON.stringify({ status: "success", action: "run", container: containerIdentifier }));
            }
          });
        } else {
          if (loadingSpinner) loadingSpinner.fail("Unrecognized Docker operational action");
          process.exit(2);
        }
      } catch (fatalError) {
        if (loadingSpinner) loadingSpinner.fail("Critical Docker helper failure");
        console.error(jsonOut ? JSON.stringify({ error: fatalError.message }) : fatalError.message);
        process.exit(1);
      }
    });
};

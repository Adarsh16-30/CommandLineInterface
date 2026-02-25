
import { execFile } from "child_process";
import fs from "fs-extra";
import path from "path";
import ora from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
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
          if (loadingSpinner) loadingSpinner.stop();
          const { projectType } = await inquirer.prompt([
            {
              type: "list",
              name: "projectType",
              message: "Select project type for Dockerfile:",
              choices: ["Node.js", "Python", "Static HTML"]
            }
          ]);

          let dockerfileContent = "";
          if (projectType === "Node.js") {
            dockerfileContent = `# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "index.js"]`;
          } else if (projectType === "Python") {
            dockerfileContent = `# syntax=docker/dockerfile:1
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "main.py"]`;
          } else if (projectType === "Static HTML") {
            dockerfileContent = `# syntax=docker/dockerfile:1
FROM nginx:alpine
COPY . /usr/share/nginx/html`;
          }

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
          if (loadingSpinner) loadingSpinner.stop();
          const { hostPort, containerPort } = await inquirer.prompt([
            { type: "input", name: "hostPort", message: "Host port:", default: "3000" },
            { type: "input", name: "containerPort", message: "Container port:", default: "3000" }
          ]);

          if (loadingSpinner) loadingSpinner.start("Initializing container instance...");
          recordAuditEntry("docker run", ["-d", containerIdentifier, `${hostPort}:${containerPort}`]);

          execFile("docker", ["run", "-d", "--name", containerIdentifier, "-p", `${hostPort}:${containerPort}`, `${containerIdentifier}:latest`], (runError, standardOutput, standardError) => {
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

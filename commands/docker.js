// docker.js
// Docker helper commands for the CLI.

import { exec } from "child_process";
import fs from "fs-extra";
import path from "path";
import ora from "ora";
import chalk from "chalk";

export default program => {
  program
    .command("docker [action] [name]")
    .description("docker helpers: createfile | build | run")
    .action(async (action, name = "myapp") => {
      const spinner = ora().start();
      try {
        if (action === "createfile") {
          // Write a Dockerfile to the project root.
          const df = `# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "index.js"]`;
          await fs.writeFile(path.join(process.cwd(), "Dockerfile"), df);
          spinner.succeed("Dockerfile created");
        } else if (action === "build") {
          // Build the Docker image from Dockerfile.
          spinner.text = "Building image...";
          exec(`docker build -t ${name}:latest .`, (err, stdout, stderr) => {
            if (err) { spinner.fail("Build failed"); console.error(stderr); }
            else { spinner.succeed("Built image"); console.log(stdout); }
          });
        } else if (action === "run") {
          // Run the built Docker image.
          spinner.text = "Running container...";
          exec(`docker run -d --name ${name} -p 3000:3000 ${name}:latest`, (err, stdout, stderr) => {
            if (err) { spinner.fail("Run failed"); console.error(stderr); }
            else spinner.succeed("Container running");
          });
        } else {
          spinner.fail("Unknown action");
        }
      } catch (err) {
        spinner.fail("Docker helper failed");
        console.error(err);
      }
    });
};

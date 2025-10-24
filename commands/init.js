import fs from "fs-extra";
import path from "path";
import ora from "ora";
import chalk from "chalk";
import { exec } from "child_process";
import simpleGit from "simple-git";

export default program => {
  program.command("init <projectName>")
    .description("Scaffold a new project (options: --template react|express|python|nextjs|node_api|vite_react)")
    .option("-t, --template <template>", "template type")
    .option("-g, --git", "initialize git")
    .option("-i, --install", "install dependencies")
    .action(async (name, opts) => {
      const spinner = ora("Initializing project...").start();
      const dir = path.resolve(process.cwd(), name);

      try {
        if (fs.existsSync(dir)) throw new Error("Folder already exists");
        await fs.ensureDir(dir);

        const template = opts.template?.toLowerCase();

        // --- 1. Template Scaffolding ---
        if (template) {
          spinner.text = `Scaffolding ${template} template...`;

          // Handle external scaffolders (vite, next)
          if (template === "react" || template === "vite_react") {
            exec(`npm create vite@latest ${name} -- --template react -y`, { stdio: "inherit" }, (err) => {
              if (err) spinner.fail(`${template} template failed`);
              else spinner.succeed(`${template} project scaffolded`);
            });
            return; // External command handles its own lifecycle
          }
          else if (template === "nextjs") {
            exec(`npx create-next-app@latest ${name} --ts --eslint --tailwind`, { stdio: "inherit" }, (err) => {
              if (err) spinner.fail("Next.js template failed");
              else spinner.succeed("Next.js project scaffolded");
            });
            return; // External command
          }
          // Handle manual scaffolding
          else if (template === "express" || template === "node_api") {
            await fs.writeJson(path.join(dir, "package.json"), { name, version: "1.0.0", main: "index.js", scripts: { start: "node index.js" } }, { spaces: 2 });
            const mainFile = path.join(dir, template === "express" ? "index.js" : "server.js");
            await fs.writeFile(mainFile, "..."); // (Original file content)
            spinner.succeed(`${template} project scaffolded`);
          }
          else if (template === "python") {
            await fs.ensureDir(dir);
            await fs.writeFile(path.join(dir, "app.py"), `print("Hello from Python starter")`);
            await fs.writeFile(path.join(dir, "requirements.txt"), "");
            spinner.succeed("Python project scaffolded");
          }
          else {
            spinner.fail("Unknown template type");
            return;
          }
        }
        // If no template, just a basic node project
        else {
          await fs.writeJson(path.join(dir, "package.json"), { name, version: "1.0.0", scripts: { start: "node index.js" } }, { spaces: 2 });
          await fs.writeFile(path.join(dir, "index.js"), 'console.log("Hello world");');
          spinner.succeed("Basic project created");
        }

        // --- 2. Post-Scaffolding Steps ---

        // Git init
        if (opts.git) {
          const git = simpleGit(dir);
          await git.init();
          await git.add('.');
          await git.commit('Initial commit by mycli');
          console.log(chalk.green("Git repository initialized"));
        }

        // Install dependencies
        if (opts.install) {
          spinner.text = "Installing dependencies...";
          // Run npm install *inside* the new directory
          exec(`cd ${dir} && npm install`, (err) => {
            if (err) console.error(err);
            else spinner.succeed("Dependencies installed");
          });
        }

      } catch (err) {
        spinner.fail(err.message || "Project initialization failed");
      }
    });
};
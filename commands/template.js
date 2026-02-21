import { exec } from "child_process";
import fs from "fs-extra";
import path from "path";
import ora from "ora";
import chalk from "chalk";

export default (program) => {
  program.command("template <type> <name>")
    .description("Create a project from a template (react | express | python | nextjs | node_api | vite_react)")
    .action(async (type, name) => {
      const cwd = process.cwd();
      const target = path.join(cwd, name);
      if (fs.existsSync(target)) return console.error(chalk.red("Folder exists"));

      const spinner = ora(`Creating ${type} project ${name}...`).start();
      try {
        if (type === "react") {
          exec(`npm create vite@latest ${name} -- --template react -y`, { stdio: 'inherit' }, (err) => {
            if (err) {
              spinner.fail("React template failed");
              console.error(err);
            } else {
              spinner.succeed("React app created (via create-vite). See docs: vite.dev");
            }
          });
        } else if (type === "express") {
          await fs.ensureDir(target);
          await fs.writeJson(path.join(target, "package.json"), {
            name, version: "1.0.0", main: "index.js",
            scripts: { start: "node index.js" }
          }, { spaces: 2 });
          await fs.writeFile(path.join(target, "index.js"), `import express from "express"; const app = express(); app.get("/", (req,res)=>res.send("Hello")); app.listen(3000);`);
          spinner.succeed("Express starter created");
        } else if (type === "python") {
          await fs.ensureDir(target);
          await fs.writeFile(path.join(target, "app.py"), `print("Hello from Python starter")`);
          await fs.writeFile(path.join(target, "requirements.txt"), "");
          spinner.succeed("Python starter created");
        } else if (type === "nextjs") {
          exec(`npx create-next-app@latest ${name} --ts --eslint --tailwind`, { stdio: 'inherit' }, (err) => {
            if (err) {
              spinner.fail("Next.js template failed");
              console.error(err);
            } else {
              spinner.succeed("Next.js app created. See docs: nextjs.org");
            }
          });
        } else if (type === "node_api") {
          await fs.ensureDir(target);
          await fs.writeJson(path.join(target, "package.json"), {
            name, version: "1.0.0", main: "server.js",
            scripts: { start: "node server.js" }
          }, { spaces: 2 });
          await fs.writeFile(path.join(target, "server.js"), `import express from "express"; const app = express(); app.use(express.json()); app.get("/", (req,res)=>res.send("Hello from Node API")); app.listen(3000);`);
          spinner.succeed("Node API starter created");
        } else if (type === "vite_react") {
          exec(`npm create vite@latest ${name} -- --template react -y`, { stdio: 'inherit' }, (err) => {
            if (err) {
              spinner.fail("Vite React template failed");
              console.error(err);
            } else {
              spinner.succeed("Vite React app created (via create-vite). See docs: vite.dev");
            }
          });
        } else {
          spinner.fail("Unknown template");
        }
      } catch (err) {
        spinner.fail("Template creation failed");
        console.error(err);
      }
  });
};
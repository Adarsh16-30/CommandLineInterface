
import { Octokit } from "@octokit/rest";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";

export default (program) => {
  program
    .command("gh [action] [name]")
    .description("GitHub helpers: create-repo | create-issue | upload-files")
    .action(async (action, name) => {
      const token = process.env.GITHUB_TOKEN;
      if (!token) return console.error(chalk.red("GITHUB_TOKEN missing"));

      const octokit = new Octokit({ auth: token });

      try {
        if (action === "create-repo") {
          const { description, isPrivate } = await inquirer.prompt([
            { type: "input", name: "description", message: "Repository description:" },
            { type: "confirm", name: "isPrivate", message: "Make repository private?", default: false }
          ]);
          const resp = await octokit.rest.repos.createForAuthenticatedUser({
            name,
            private: isPrivate,
            description
          });
          console.log(chalk.green("Repo created:"), resp.data.html_url);
        } else if (action === "create-issue") {
          const [owner, repo] = name.split("/");
          const { title, body } = await inquirer.prompt([
            { type: "input", name: "title", message: "Issue title:" },
            { type: "editor", name: "body", message: "Issue body (markdown):" }
          ]);
          const issue = await octokit.rest.issues.create({
            owner,
            repo,
            title,
            body
          });
          console.log(chalk.green("Issue created:"), issue.data.html_url);
        } else if (action === "upload-files") {
          const [owner, repo] = name.split("/");
          const { uploadPath } = await inquirer.prompt([
            { type: "input", name: "uploadPath", message: "Path to file to upload (relative to current directory):" }
          ]);
          const filePath = path.join(process.cwd(), uploadPath);
          if (!await fs.pathExists(filePath)) {
            console.log(chalk.red(`File not found: ${filePath}`));
            return;
          }
          const content = await fs.readFile(filePath, "utf8");
          const fileName = path.basename(filePath);
          await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: fileName,
            message: `Add ${fileName} via mycli`,
            content: Buffer.from(content).toString("base64"),
            committer: { name: "mycli", email: "mycli@example.com" }
          });
          console.log(chalk.green(`Uploaded ${fileName}`));
        } else {
          console.log(chalk.red("Unknown action. Use create-repo | create-issue | upload-files"));
        }
      } catch (err) {
        console.error(chalk.red("GitHub action failed:"), err.message);
      }
    });
};

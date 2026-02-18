import fs from "fs-extra";
import path from "path";
import os from "os";
import chalk from "chalk";

// Store the todo list as a JSON file in the user's home directory
const DB = path.join(os.homedir(), ".mycli-todos.json");

// Helper functions to read/write the DB
async function readDB(){ return fs.existsSync(DB) ? fs.readJson(DB) : []; }
async function writeDB(data){ await fs.writeJson(DB, data, { spaces: 2 }); }

export default (program) => {
  program
    .command("todo <action> [textOrId]")
    .description("todo add <task> | list | done <id> | remove <id>")
    .action(async (action, textOrId) => {
      const todos = await readDB();

      // Simple switch-case for the 4 CRUD actions
      if (action === "add") {
        if (!textOrId) return console.log(chalk.red("Please provide a task"));
        todos.push({ id: Date.now(), task: textOrId, done: false, created: new Date() });
        await writeDB(todos);
        console.log(chalk.green("Added"));
      } else if (action === "list") {
        todos.forEach(t => console.log(`${t.id} [${t.done ? "x" : " "}] ${t.task}`));
      } else if (action === "done") {
        const id = Number(textOrId);
        const t = todos.find(x => x.id === id);
        if (t) { t.done = true; await writeDB(todos); console.log(chalk.green("Marked done")); }
        else console.log(chalk.red("Not found"));
      } else if (action === "remove") {
        const id = Number(textOrId);
        const newTodos = todos.filter(x => x.id !== id);
        await writeDB(newTodos);
        console.log(chalk.green("Removed"));
      } else {
        console.log(chalk.red("Unknown action"));
      }
    });
};
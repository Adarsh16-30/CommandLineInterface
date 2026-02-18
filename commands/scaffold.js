import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import ora from 'ora';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const templates = {
 'node-express': {
 name: 'Node.js + Express API',
 files: {
 'package.json': JSON.stringify({
 name: 'my-express-app',
 version: '1.0.0',
 type: 'module',
 scripts: {
 start: 'node index.js',
 dev: 'node --watch index.js'
 },
 dependencies: {
 express: '^4.18.2',
 cors: '^2.8.5',
 dotenv: '^16.0.3'
 }
 }, null, 2),
 'index.js': `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
 res.json({ message: 'Hello from Express!' });
});

app.listen(PORT, () => {
 console.log(\`Server running on port \${PORT}\`);
});
`,
 '.env': 'PORT=3000\n',
 '.gitignore': 'node_modules\n.env\n'
 }
 },
 'react-vite': {
 name: 'React + Vite',
 command: 'npm create vite@latest . -- --template react'
 },
 'next': {
 name: 'Next.js App',
 command: 'npx create-next-app@latest . --use-npm'
 }
};

export default function (program) {
 const scaffold = program.command('scaffold').description('Project scaffolding tool');

 scaffold
 .command('list')
 .description('List available templates')
 .action(() => {
 console.log(chalk.bold.cyan('\n Available Templates\n'));
 Object.entries(templates).forEach(([key, template]) => {
 console.log(chalk.cyan(` ${key}`) + chalk.gray(` - ${template.name}`));
 });
 console.log();
 });

 scaffold
 .command('create <template> [directory]')
 .description('Create new project from template')
 .action(async (templateName, directory) => {
 const template = templates[templateName];

 if (!template) {
 console.log(chalk.red(`\n Template not found: ${templateName}`));
 console.log(chalk.yellow('Run "mycli scaffold list" to see available templates\n'));
 return;
 }

 const targetDir = directory || process.cwd();

 const { confirm } = await inquirer.prompt([{
 type: 'confirm',
 name: 'confirm',
 message: `Create ${template.name} in ${targetDir}?`,
 default: true
 }]);

 if (!confirm) {
 console.log(chalk.yellow('Cancelled.'));
 return;
 }

 const spinner = ora('Creating project...').start();

 try {
 await fs.ensureDir(targetDir);

 if (template.command) {
 spinner.text = 'Running template generator...';
 await execAsync(`cd ${targetDir} && ${template.command}`, { shell: true });
 } else if (template.files) {
 for (const [filename, content] of Object.entries(template.files)) {
 const filepath = path.join(targetDir, filename);
 await fs.writeFile(filepath, content);
 }
 }

 spinner.succeed(chalk.green('Project created!'));
 console.log(chalk.cyan(`\n Location: ${targetDir}`));
 console.log(chalk.gray('\nNext steps:'));
 console.log(chalk.white(' cd ' + (directory || '.')));
 console.log(chalk.white(' npm install'));
 console.log(chalk.white(' npm start\n'));
 } catch (err) {
 spinner.fail('Failed to create project');
 console.error(chalk.red(err.message));
 }
 });

 scaffold
 .command('interactive')
 .alias('i')
 .description('Interactive project scaffolder')
 .action(async () => {
 const answers = await inquirer.prompt([
 {
 type: 'list',
 name: 'template',
 message: 'Select template:',
 choices: Object.entries(templates).map(([key, t]) => ({
 name: t.name,
 value: key
 }))
 },
 {
 type: 'input',
 name: 'directory',
 message: 'Project directory:',
 default: './my-project'
 }
 ]);

 program.parse(['node', 'mycli', 'scaffold', 'create', answers.template, answers.directory]);
 });
}

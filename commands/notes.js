import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import inquirer from 'inquirer';

const NOTES_DIR = path.join(os.homedir(), '.mycli-notes');

async function ensureNotesDir() {
 await fs.ensureDir(NOTES_DIR);
}

export default function (program) {
 const notes = program.command('notes').description('Markdown notes manager');

 notes
 .command('new <title>')
 .description('Create new note')
 .action(async (title) => {
 await ensureNotesDir();

 const { content } = await inquirer.prompt([{
 type: 'editor',
 name: 'content',
 message: 'Enter note content (markdown):',
 default: `# ${title}\n\n`
 }]);

 const filename = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
 const filepath = path.join(NOTES_DIR, filename);

 await fs.writeFile(filepath, content);
 console.log(chalk.green(`\n Note saved: ${filename}\n`));
 });

 notes
 .command('list')
 .alias('ls')
 .description('List all notes')
 .action(async () => {
 await ensureNotesDir();

 const files = await fs.readdir(NOTES_DIR);
 const mdFiles = files.filter(f => f.endsWith('.md'));

 if (mdFiles.length === 0) {
 console.log(chalk.yellow('\nNo notes found. Create one with "mycli notes new <title>"\n'));
 return;
 }

 console.log(chalk.bold.cyan('\n Your Notes\n'));
 console.log(chalk.gray('─'.repeat(50)));

 for (const file of mdFiles) {
 const filepath = path.join(NOTES_DIR, file);
 const stats = await fs.stat(filepath);
 const content = await fs.readFile(filepath, 'utf-8');
 const firstLine = content.split('\n')[0].replace(/^#\s*/, '');

 console.log(chalk.cyan(`\n ${file}`));
 console.log(chalk.gray(` ${firstLine.substring(0, 60)}...`));
 console.log(chalk.gray(` Modified: ${stats.mtime.toLocaleDateString()}`));
 }
 console.log();
 });

 notes
 .command('view <title>')
 .description('View note')
 .action(async (title) => {
 await ensureNotesDir();

 const filename = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
 const filepath = path.join(NOTES_DIR, filename);

 if (!await fs.pathExists(filepath)) {
 console.log(chalk.red(`\n Note not found: ${filename}\n`));
 return;
 }

 const content = await fs.readFile(filepath, 'utf-8');
 console.log(chalk.cyan('\n' + content + '\n'));
 });

 notes
 .command('edit <title>')
 .description('Edit note')
 .action(async (title) => {
 await ensureNotesDir();

 const filename = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
 const filepath = path.join(NOTES_DIR, filename);

 if (!await fs.pathExists(filepath)) {
 console.log(chalk.red(`\n Note not found: ${filename}\n`));
 return;
 }

 const currentContent = await fs.readFile(filepath, 'utf-8');

 const { content } = await inquirer.prompt([{
 type: 'editor',
 name: 'content',
 message: 'Edit note:',
 default: currentContent
 }]);

 await fs.writeFile(filepath, content);
 console.log(chalk.green(`\n Note updated: ${filename}\n`));
 });

 notes
 .command('delete <title>')
 .alias('rm')
 .description('Delete note')
 .action(async (title) => {
 await ensureNotesDir();

 const filename = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
 const filepath = path.join(NOTES_DIR, filename);

 if (!await fs.pathExists(filepath)) {
 console.log(chalk.red(`\n Note not found: ${filename}\n`));
 return;
 }

 const { confirm } = await inquirer.prompt([{
 type: 'confirm',
 name: 'confirm',
 message: `Delete note "${filename}"?`,
 default: false
 }]);

 if (confirm) {
 await fs.remove(filepath);
 console.log(chalk.green(`\n Note deleted: ${filename}\n`));
 } else {
 console.log(chalk.yellow('Deletion cancelled.'));
 }
 });

 notes
 .command('search <query>')
 .description('Search notes')
 .action(async (query) => {
 await ensureNotesDir();

 const files = await fs.readdir(NOTES_DIR);
 const mdFiles = files.filter(f => f.endsWith('.md'));
 const results = [];

 for (const file of mdFiles) {
 const filepath = path.join(NOTES_DIR, file);
 const content = await fs.readFile(filepath, 'utf-8');

 if (content.toLowerCase().includes(query.toLowerCase())) {
 results.push({ file, content });
 }
 }

 if (results.length === 0) {
 console.log(chalk.yellow(`\n No notes found matching "${query}"\n`));
 return;
 }

 console.log(chalk.bold.cyan(`\n Search Results for "${query}"\n`));
 console.log(chalk.gray('─'.repeat(50)));

 results.forEach(({ file, content }) => {
 const firstLine = content.split('\n')[0].replace(/^#\s*/, '');
 console.log(chalk.cyan(`\n ${file}`));
 console.log(chalk.gray(` ${firstLine.substring(0, 60)}...`));
 });
 console.log();
 });
}

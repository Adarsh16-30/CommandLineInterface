import chalk from 'chalk';
import clipboardy from 'clipboardy';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default function (program) {
 const clip = program.command('clip').description('Clipboard utilities');

 clip
 .command('copy <text>')
 .description('Copy text to clipboard')
 .action(async (text) => {
 try {
 await clipboardy.write(text);
 console.log(chalk.green(' Copied to clipboard'));
 } catch (err) {
 console.error(chalk.red('Failed to copy:'), err.message);
 }
 });

 clip
 .command('paste')
 .description('Paste from clipboard')
 .action(async () => {
 try {
 const text = await clipboardy.read();
 console.log(text);
 } catch (err) {
 console.error(chalk.red('Failed to paste:'), err.message);
 }
 });

 clip
 .command('file <filepath>')
 .description('Copy file contents to clipboard')
 .action(async (filepath) => {
 try {
 const content = await fs.readFile(filepath, 'utf-8');
 await clipboardy.write(content);
 console.log(chalk.green(` Copied ${filepath} to clipboard`));
 } catch (err) {
 console.error(chalk.red('Failed to copy file:'), err.message);
 }
 });

 clip
 .command('clear')
 .description('Clear clipboard')
 .action(async () => {
 try {
 await clipboardy.write('');
 console.log(chalk.green(' Clipboard cleared'));
 } catch (err) {
 console.error(chalk.red('Failed to clear:'), err.message);
 }
 });
}

import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import inquirer from 'inquirer';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const SSH_CONFIG_FILE = path.join(os.homedir(), '.mycli-ssh-config.json');

async function loadConnections() {
 try {
 if (await fs.pathExists(SSH_CONFIG_FILE)) {
 return await fs.readJson(SSH_CONFIG_FILE);
 }
 } catch (err) {
 console.error(chalk.yellow('Could not load SSH config'));
 }
 return [];
}

async function saveConnections(connections) {
 try {
 await fs.writeJson(SSH_CONFIG_FILE, connections, { spaces: 2 });
 } catch (err) {
 console.error(chalk.red('Failed to save SSH config'));
 }
}

export default function (program) {
 const ssh = program.command('ssh').description('SSH connection manager');

 ssh
 .command('add')
 .description('Add new SSH connection')
 .action(async () => {
 const answers = await inquirer.prompt([
 {
 type: 'input',
 name: 'name',
 message: 'Connection name:',
 validate: (input) => input.length > 0 || 'Name is required'
 },
 {
 type: 'input',
 name: 'host',
 message: 'Host:',
 validate: (input) => input.length > 0 || 'Host is required'
 },
 {
 type: 'input',
 name: 'user',
 message: 'Username:',
 validate: (input) => input.length > 0 || 'Username is required'
 },
 {
 type: 'input',
 name: 'port',
 message: 'Port:',
 default: '22'
 },
 {
 type: 'input',
 name: 'keyPath',
 message: 'SSH key path (optional):'
 }
 ]);

 const connections = await loadConnections();
 connections.push(answers);
 await saveConnections(connections);

 console.log(chalk.green(`\n Added connection: ${answers.name}`));
 });

 ssh
 .command('list')
 .alias('ls')
 .description('List saved SSH connections')
 .action(async () => {
 const connections = await loadConnections();

 if (connections.length === 0) {
 console.log(chalk.yellow('\nNo saved connections. Use "mycli ssh add" to add one.\n'));
 return;
 }

 console.log(chalk.bold.cyan('\n Saved SSH Connections\n'));
 console.log(chalk.gray('─'.repeat(70)));

 connections.forEach((conn, i) => {
 console.log(chalk.bold(`${i + 1}. ${conn.name}`));
 console.log(chalk.gray(` ${conn.user}@${conn.host}:${conn.port}`));
 if (conn.keyPath) console.log(chalk.gray(` Key: ${conn.keyPath}`));
 console.log();
 });
 });

 ssh
 .command('connect <name>')
 .description('Connect to saved SSH server')
 .action(async (name) => {
 const connections = await loadConnections();
 const conn = connections.find(c => c.name === name);

 if (!conn) {
 console.log(chalk.red(`\n Connection "${name}" not found\n`));
 return;
 }

 const keyFlag = conn.keyPath ? `-i ${conn.keyPath}` : '';
 const sshCmd = `ssh ${keyFlag} -p ${conn.port} ${conn.user}@${conn.host}`;

 console.log(chalk.cyan(`\n Connecting to ${conn.name}...\n`));
 console.log(chalk.gray(`Command: ${sshCmd}\n`));

 try {
 const { spawn } = await import('child_process');
 const sshProcess = spawn('ssh', [
 ...(conn.keyPath ? ['-i', conn.keyPath] : []),
 '-p', conn.port,
 `${conn.user}@${conn.host}`
 ], { stdio: 'inherit' });

 sshProcess.on('close', (code) => {
 console.log(chalk.gray(`\nConnection closed (exit code: ${code})`));
 });
 } catch (err) {
 console.error(chalk.red('Connection failed:'), err.message);
 }
 });

 ssh
 .command('remove <name>')
 .alias('rm')
 .description('Remove saved SSH connection')
 .action(async (name) => {
 const connections = await loadConnections();
 const index = connections.findIndex(c => c.name === name);

 if (index === -1) {
 console.log(chalk.red(`\n Connection "${name}" not found\n`));
 return;
 }

 connections.splice(index, 1);
 await saveConnections(connections);

 console.log(chalk.green(`\n Removed connection: ${name}\n`));
 });

 ssh
 .command('edit <name>')
 .description('Edit saved SSH connection')
 .action(async (name) => {
 const connections = await loadConnections();
 const conn = connections.find(c => c.name === name);

 if (!conn) {
 console.log(chalk.red(`\n Connection "${name}" not found\n`));
 return;
 }

 const answers = await inquirer.prompt([
 {
 type: 'input',
 name: 'host',
 message: 'Host:',
 default: conn.host
 },
 {
 type: 'input',
 name: 'user',
 message: 'Username:',
 default: conn.user
 },
 {
 type: 'input',
 name: 'port',
 message: 'Port:',
 default: conn.port
 },
 {
 type: 'input',
 name: 'keyPath',
 message: 'SSH key path:',
 default: conn.keyPath
 }
 ]);

 Object.assign(conn, answers);
 await saveConnections(connections);

 console.log(chalk.green(`\n Updated connection: ${name}\n`));
 });
}

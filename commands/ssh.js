
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import inquirer from 'inquirer';
import { recordAuditEntry } from '../utils/audit.js';

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

export default function registerSshCommand(program) {
    const sshCmdGroup = program.command('ssh').description('Secure Shell connection manager');

    sshCmdGroup
        .command('add')
        .description('Add new SSH connection')
        .action(async () => {
            const userProvidedInputs = await inquirer.prompt([
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

            const savedConnections = await loadConnections();
            savedConnections.push(userProvidedInputs);
            await saveConnections(savedConnections);

            console.log(chalk.green(`\n Added connection: ${userProvidedInputs.name}`));
        });

    sshCmdGroup
        .command('list')
        .alias('ls')
        .description('List saved SSH connections')
        .action(async () => {
            const savedConnections = await loadConnections();

            if (savedConnections.length === 0) {
                console.log(chalk.yellow('\nNo saved connections. Use "mycli ssh add" to add one.\n'));
                return;
            }

            const jsonOut = process.argv.includes("--output") && process.argv.includes("json");
            if (jsonOut) {
                console.log(JSON.stringify(savedConnections));
                return;
            }

            console.log(chalk.bold.cyan('\n Saved SSH Connections\n'));
            console.log(chalk.gray('─'.repeat(70)));

            savedConnections.forEach((connectionDetails, i) => {
                console.log(chalk.bold(`${i + 1}. ${connectionDetails.name}`));
                console.log(chalk.gray(` ${connectionDetails.user}@${connectionDetails.host}:${connectionDetails.port}`));
                if (connectionDetails.keyPath) console.log(chalk.gray(` Key: ${connectionDetails.keyPath}`));
                console.log();
            });
        });

    sshCmdGroup
        .command('connect <name>')
        .description('Connect to saved SSH server (Privileged)')
        .action(async (connectionNameId) => {
            const savedConnections = await loadConnections();
            const targetConnection = savedConnections.find(c => c.name === connectionNameId);

            if (!targetConnection) {
                console.log(chalk.red(`\n Connection "${connectionNameId}" not found\n`));
                process.exit(1);
            }

            const keyFlag = targetConnection.keyPath ? `-i ${targetConnection.keyPath}` : '';
            const sshConnectionString = `ssh ${keyFlag} -p ${targetConnection.port} ${targetConnection.user}@${targetConnection.host}`;

            console.log(chalk.cyan(`\n Authenticating to enterprise server: ${targetConnection.name}...\n`));

            recordAuditEntry('ssh connect', [targetConnection.host, targetConnection.user, targetConnection.port]);

            try {
                const { spawn } = await import('child_process');
                const secureShellProcess = spawn('ssh', [
                    ...(targetConnection.keyPath ? ['-i', targetConnection.keyPath] : []),
                    '-p', targetConnection.port,
                    `${targetConnection.user}@${targetConnection.host}`
                ], { stdio: 'inherit' });

                secureShellProcess.on('close', (exitCode) => {
                    console.log(chalk.gray(`\nRemote session terminated (exit code: ${exitCode})`));
                    process.exit(exitCode);
                });
            } catch (connectionError) {
                console.error(chalk.red('Enterprise connection instantiation failed:'), connectionError.message);
                process.exit(1);
            }
        });

    sshCmdGroup
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

    sshCmdGroup
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

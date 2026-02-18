// selfupdate.js
// Checks the npm registry for a newer version of mycli and optionally installs it.
// Use --check to just see if an update is available without installing anything.

import chalk from 'chalk';
import axios from 'axios';
import ora from 'ora';
import inquirer from 'inquirer';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';

const execAsync = promisify(exec);

export default function (program) {
    program
        .command('selfupdate')
        .description('Check for updates and update CLI')
        .option('--check', 'Only check for updates')
        .action(async (options) => {
            const spinner = ora('Checking for updates...').start();

            try {
                const currentVersion = '3.0.0';
                const response = await axios.get('https://registry.npmjs.org/@adarsht0912/mycli/latest');
                const latestVersion = response.data.version;

                spinner.stop();

                console.log(chalk.bold.cyan('\n Update Status\n'));
                console.log(chalk.bold('Current version:'), chalk.white(currentVersion));
                console.log(chalk.bold('Latest version:'), chalk.green(latestVersion));

                if (currentVersion === latestVersion) {
                    console.log(chalk.green('\n You are on the latest version!\n'));
                    return;
                }

                console.log(chalk.yellow('\n Update available!\n'));

                if (options.check) {
                    console.log(chalk.gray('Run "mycli selfupdate" to update\n'));
                    return;
                }

                const { confirm } = await inquirer.prompt([{
                    type: 'confirm',
                    name: 'confirm',
                    message: `Update to v${latestVersion}?`,
                    default: true
                }]);

                if (!confirm) {
                    console.log(chalk.yellow('Update cancelled.'));
                    return;
                }

                const updateSpinner = ora('Updating...').start();

                await execAsync('npm install -g @adarsht0912/mycli@latest');

                updateSpinner.succeed(chalk.green('Update complete!'));
                console.log(chalk.cyan(`\n Updated to v${latestVersion}\n`));
            } catch (err) {
                spinner.fail('Update check failed');
                if (err.response?.status === 404) {
                    console.log(chalk.yellow('\nPackage not found on npm registry.'));
                    console.log(chalk.gray('Make sure you have published your package.\n'));
                } else {
                    console.error(chalk.red(err.message));
                }
            }
        });
}

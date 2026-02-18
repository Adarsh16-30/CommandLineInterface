// build.js
// Compiles your Node.js project into a standalone executable (exe/bin).
// Uses Vercel's 'pkg' under the hood so you can ship a single file.

import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

const execAsync = promisify(exec);

export default function (program) {
    program
        .command('build')
        .description('Compile project into a standalone executable')
        .option('-t, --target <platform>', 'Target platform (win, linux, macos)', 'win')

        .option('-o, --output <name>', 'Output filename', 'mycli')
        .action(async (options) => {
            console.log(chalk.bold.cyan('\n Building Executable\n'));

            const targets = {
                win: 'node18-win-x64',
                linux: 'node18-linux-x64',
                macos: 'node18-macos-x64',
                all: 'node18-win-x64,node18-linux-x64,node18-macos-x64'
            };

            const target = targets[options.target] || targets.win;
            const outputName = options.output;

            console.log(chalk.gray(`Target: ${options.target}`));
            console.log(chalk.gray(`Output: ${outputName}\n`));

            const spinner = ora('Compiling binary...').start();

            try {
                // Check if pkg is installed
                try {
                    await execAsync('npx pkg --version');
                } catch (err) {
                    spinner.fail('pkg not found');
                    console.log(chalk.yellow('\nInstalling pkg...\n'));
                    await execAsync('npm install -g pkg');
                }

                // Build the binary
                const cmd = `npx pkg index.js --target ${target} --output dist/${outputName}`;
                await execAsync(cmd);

                spinner.succeed(chalk.green('Build complete!'));

                console.log(chalk.cyan('\n Output:'));
                const distFiles = await fs.readdir('dist');
                distFiles.forEach(file => {
                    console.log(chalk.white(` dist/${file}`));
                });

                console.log(chalk.gray('\nYou can now distribute the executable!\n'));
            } catch (err) {
                spinner.fail('Build failed');
                console.error(chalk.red(err.message));
                console.log(chalk.yellow('\nMake sure pkg is installed: npm install -g pkg\n'));
            }
        });
}

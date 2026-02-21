
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';
import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

const execAsync = promisify(exec);

export default function (program) {
    const deploy = program.command('deploy').description('Deployment utilities');

    deploy
        .command('static <directory>')
        .description('Deploy a static folder to GitHub Pages')
        .option('-b, --branch <name>', 'Branch to push to', 'gh-pages')
        .action(async (directory, options) => {

            const spinner = ora('Checking directory...').start();

            if (!await fs.pathExists(directory)) {
                spinner.fail(`Directory not found: ${directory}`);
                return;
            }

            spinner.text = 'Initializing git...';

            try {
                await execAsync('git --version');
            } catch (err) {
                spinner.fail('Git is not installed');
                return;
            }

            const { confirm } = await inquirer.prompt([{
                type: 'confirm',
                name: 'confirm',
                message: `Deploy ${directory} to branch ${options.branch}?`,
                default: false
            }]);

            if (!confirm) {
                spinner.stop();
                console.log(chalk.yellow('Deployment cancelled.'));
                return;
            }

            spinner.start('Deploying...');

            try {
                const commands = [
                    `cd ${directory}`,
                    'git init',
                    'git add -A',
                    'git commit -m "Deploy to GitHub Pages"',
                    `git push -f origin HEAD:${options.branch}`
                ];

                for (const cmd of commands) {
                    await execAsync(cmd);
                }

                spinner.succeed(chalk.green('Deployment successful!'));
                console.log(chalk.cyan(`\n Deployed to branch: ${options.branch}\n`));
            } catch (err) {
                spinner.fail('Deployment failed');
                console.error(chalk.red(err.message));
            }
        });

    deploy
        .command('netlify <directory>')
        .description('Deploy to Netlify (requires Netlify CLI)')
        .option('-p, --prod', 'Deploy to production')
        .action(async (directory, options) => {
            const spinner = ora('Checking Netlify CLI...').start();

            try {
                await execAsync('netlify --version');
            } catch (err) {
                spinner.fail('Netlify CLI not installed');
                console.log(chalk.yellow('\nInstall with: npm install -g netlify-cli\n'));
                return;
            }

            if (!await fs.pathExists(directory)) {
                spinner.fail(`Directory not found: ${directory}`);
                return;
            }

            spinner.text = 'Deploying to Netlify...';

            try {
                const prodFlag = options.prod ? '--prod' : '';
                const { stdout } = await execAsync(`netlify deploy --dir=${directory} ${prodFlag}`);

                spinner.succeed('Deployment successful!');
                console.log(chalk.cyan('\n' + stdout));
            } catch (err) {
                spinner.fail('Deployment failed');
                console.error(chalk.red(err.message));
            }
        });

    deploy
        .command('vercel <directory>')
        .description('Deploy to Vercel (requires Vercel CLI)')
        .option('-p, --prod', 'Deploy to production')
        .action(async (directory, options) => {
            const spinner = ora('Checking Vercel CLI...').start();

            try {
                await execAsync('vercel --version');
            } catch (err) {
                spinner.fail('Vercel CLI not installed');
                console.log(chalk.yellow('\nInstall with: npm install -g vercel\n'));
                return;
            }

            if (!await fs.pathExists(directory)) {
                spinner.fail(`Directory not found: ${directory}`);
                return;
            }

            spinner.text = 'Deploying to Vercel...';

            try {
                const prodFlag = options.prod ? '--prod' : '';
                const { stdout } = await execAsync(`cd ${directory} && vercel ${prodFlag}`);

                spinner.succeed('Deployment successful!');
                console.log(chalk.cyan('\n' + stdout));
            } catch (err) {
                spinner.fail('Deployment failed');
                console.error(chalk.red(err.message));
            }
        });

    deploy
        .command('info')
        .description('Show deployment tool status')
        .action(async () => {
            console.log(chalk.bold.cyan('\n Deployment Tools Status\n'));

            const tools = [
                { name: 'Git', cmd: 'git --version' },
                { name: 'Netlify CLI', cmd: 'netlify --version' },
                { name: 'Vercel CLI', cmd: 'vercel --version' },
                { name: 'GitHub CLI', cmd: 'gh --version' }
            ];

            for (const tool of tools) {
                try {
                    const { stdout } = await execAsync(tool.cmd);
                    console.log(chalk.green(` ${tool.name}`), chalk.gray(stdout.split('\n')[0]));
                } catch (err) {
                    console.log(chalk.red(` ${tool.name}`), chalk.gray('Not installed'));
                }
            }

            console.log();
        });
}

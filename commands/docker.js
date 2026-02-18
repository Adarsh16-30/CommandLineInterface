import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';
import ora from 'ora';
import inquirer from 'inquirer';

const execAsync = promisify(exec);

async function runCommand(cmd) {
 try {
 const { stdout, stderr } = await execAsync(cmd);
 return { success: true, output: stdout, error: stderr };
 } catch (err) {
 return { success: false, error: err.message };
 }
}

export default function (program) {
 const docker = program.command('docker').description('Docker container management');

 docker
 .command('ps')
 .description('List running containers')
 .option('-a, --all', 'Show all containers (default shows just running)')
 .action(async (options) => {
 const spinner = ora('Fetching containers...').start();
 const cmd = options.all ? 'docker ps -a' : 'docker ps';

 const result = await runCommand(cmd);

 if (result.success) {
 spinner.succeed('Containers retrieved\n');
 console.log(result.output);
 } else {
 spinner.fail('Failed to fetch containers');
 console.error(chalk.red(result.error));
 }
 });

 docker
 .command('images')
 .description('List Docker images')
 .action(async () => {
 const spinner = ora('Fetching images...').start();

 const result = await runCommand('docker images');

 if (result.success) {
 spinner.succeed('Images retrieved\n');
 console.log(result.output);
 } else {
 spinner.fail('Failed to fetch images');
 console.error(chalk.red(result.error));
 }
 });

 docker
 .command('logs <container>')
 .description('View container logs')
 .option('-f, --follow', 'Follow log output')
 .option('-n, --tail <lines>', 'Number of lines to show', '100')
 .action(async (container, options) => {
 const followFlag = options.follow ? '-f' : '';
 const tailFlag = `--tail ${options.tail}`;
 const cmd = `docker logs ${followFlag} ${tailFlag} ${container}`;

 console.log(chalk.cyan(`\n Logs for ${container}\n`));

 const result = await runCommand(cmd);

 if (result.success) {
 console.log(result.output);
 } else {
 console.error(chalk.red(result.error));
 }
 });

 docker
 .command('stop <container>')
 .description('Stop a running container')
 .action(async (container) => {
 const spinner = ora(`Stopping ${container}...`).start();

 const result = await runCommand(`docker stop ${container}`);

 if (result.success) {
 spinner.succeed(`Stopped ${container}`);
 } else {
 spinner.fail('Failed to stop container');
 console.error(chalk.red(result.error));
 }
 });

 docker
 .command('start <container>')
 .description('Start a stopped container')
 .action(async (container) => {
 const spinner = ora(`Starting ${container}...`).start();

 const result = await runCommand(`docker start ${container}`);

 if (result.success) {
 spinner.succeed(`Started ${container}`);
 } else {
 spinner.fail('Failed to start container');
 console.error(chalk.red(result.error));
 }
 });

 docker
 .command('exec <container> <command...>')
 .description('Execute command in running container')
 .action(async (container, command) => {
 const cmd = `docker exec -it ${container} ${command.join(' ')}`;

 console.log(chalk.cyan(`\n Executing in ${container}...\n`));

 const result = await runCommand(cmd);

 if (result.success) {
 console.log(result.output);
 } else {
 console.error(chalk.red(result.error));
 }
 });

 docker
 .command('stats')
 .description('Display container resource usage statistics')
 .option('--no-stream', 'Disable streaming stats')
 .action(async (options) => {
 const streamFlag = options.stream ? '' : '--no-stream';
 const cmd = `docker stats ${streamFlag}`;

 console.log(chalk.cyan('\n Container Statistics\n'));

 const result = await runCommand(cmd);

 if (result.success) {
 console.log(result.output);
 } else {
 console.error(chalk.red(result.error));
 }
 });

 docker
 .command('clean')
 .description('Clean up unused Docker resources')
 .action(async () => {
 const { confirm } = await inquirer.prompt([{
 type: 'confirm',
 name: 'confirm',
 message: 'Remove all stopped containers, unused networks, dangling images?',
 default: false
 }]);

 if (!confirm) {
 console.log(chalk.yellow('Cleanup cancelled.'));
 return;
 }

 const spinner = ora('Cleaning up Docker resources...').start();

 const result = await runCommand('docker system prune -f');

 if (result.success) {
 spinner.succeed('Cleanup complete');
 console.log(chalk.green('\n' + result.output));
 } else {
 spinner.fail('Cleanup failed');
 console.error(chalk.red(result.error));
 }
 });
}

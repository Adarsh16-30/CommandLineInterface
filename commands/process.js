import chalk from 'chalk';
import si from 'systeminformation';
import inquirer from 'inquirer';

export default function (program) {
 program
 .command('process')
 .description('Interactive process manager')
 .option('-s, --search <name>', 'Search for process by name')
 .action(async (options) => {
 try {
 const processes = await si.processes();

 let filteredProcs = processes.list;
 if (options.search) {
 filteredProcs = processes.list.filter(p =>
 p.name.toLowerCase().includes(options.search.toLowerCase())
 );
 }

 const topProcs = filteredProcs
 .sort((a, b) => b.cpu - a.cpu)
 .slice(0, 20);

 console.log(chalk.bold.cyan('\n Top Processes by CPU Usage\n'));
 console.log(chalk.gray('─'.repeat(80)));
 console.log(
 chalk.bold('PID'.padEnd(8)) +
 chalk.bold('Name'.padEnd(30)) +
 chalk.bold('CPU'.padEnd(10)) +
 chalk.bold('Memory'.padEnd(12)) +
 chalk.bold('State')
 );
 console.log(chalk.gray('─'.repeat(80)));

 topProcs.forEach(p => {
 const cpuColor = p.cpu > 50 ? chalk.red : p.cpu > 20 ? chalk.yellow : chalk.green;
 console.log(
 chalk.white(p.pid.toString().padEnd(8)) +
 chalk.cyan(p.name.substring(0, 28).padEnd(30)) +
 cpuColor(`${p.cpu.toFixed(1)}%`.padEnd(10)) +
 chalk.magenta(`${(p.mem / 1024 / 1024).toFixed(0)}MB`.padEnd(12)) +
 chalk.gray(p.state)
 );
 });

 console.log(chalk.gray('─'.repeat(80)));
 console.log(chalk.dim(`\nTotal Processes: ${processes.all}`));
 console.log(chalk.dim(`Running: ${processes.running} | Sleeping: ${processes.sleeping}\n`));

 const { action } = await inquirer.prompt([{
 type: 'list',
 name: 'action',
 message: 'What would you like to do?',
 choices: [
 { name: ' Search for a process', value: 'search' },
 { name: ' Refresh list', value: 'refresh' },
 { name: ' Exit', value: 'exit' }
 ]
 }]);

 if (action === 'search') {
 const { searchTerm } = await inquirer.prompt([{
 type: 'input',
 name: 'searchTerm',
 message: 'Enter process name to search:'
 }]);

 if (searchTerm) {
 const found = processes.list.filter(p =>
 p.name.toLowerCase().includes(searchTerm.toLowerCase())
 );

 if (found.length > 0) {
 console.log(chalk.green(`\n Found ${found.length} process(es):\n`));
 found.slice(0, 10).forEach(p => {
 console.log(chalk.cyan(` ${p.name}`) + chalk.gray(` (PID: ${p.pid}, CPU: ${p.cpu.toFixed(1)}%)`));
 });
 } else {
 console.log(chalk.yellow('\n No processes found matching that name.'));
 }
 }
 } else if (action === 'refresh') {
 console.log(chalk.yellow('\n Refreshing...\n'));
 program.parse(['node', 'mycli', 'process']);
 }

 } catch (err) {
 console.error(chalk.red('Error fetching processes:'), err.message);
 }
 });
}

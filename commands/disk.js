// disk.js
// Disk space visualizer and cleaner. Helps you find what's eating your storage
// and provides a dedicated tool for finding and deleting node_modules folders.

import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import ora from 'ora';

// Recursively calculates the size of a directory.
async function getDirSize(dirPath) {
    let totalSize = 0;

    try {
        const files = await fs.readdir(dirPath);

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            try {
                const stats = await fs.stat(filePath);

                if (stats.isDirectory()) {
                    totalSize += await getDirSize(filePath);
                } else {
                    totalSize += stats.size;
                }
            } catch (err) {
                continue;
            }
        }
    } catch (err) {
        return 0;
    }

    return totalSize;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function (program) {
    const disk = program.command('disk').description('Disk usage analyzer and cleaner');

    disk
        .command('analyze [directory]')
        .description('Visualize disk usage for the current or specified folder')
        .action(async (directory) => {

            const targetDir = directory || process.cwd();
            const spinner = ora(`Analyzing ${targetDir}...`).start();

            try {
                const items = await fs.readdir(targetDir);
                const sizes = [];

                for (const item of items) {
                    const itemPath = path.join(targetDir, item);
                    try {
                        const stats = await fs.stat(itemPath);
                        const size = stats.isDirectory() ? await getDirSize(itemPath) : stats.size;
                        sizes.push({ name: item, size, isDir: stats.isDirectory() });
                    } catch (err) {
                        continue;
                    }
                }

                sizes.sort((a, b) => b.size - a.size);
                spinner.succeed(`Analysis complete for ${targetDir}\n`);

                console.log(chalk.bold.cyan(' Disk Usage Analysis\n'));
                console.log(chalk.gray('─'.repeat(70)));
                console.log(
                    chalk.bold('Item'.padEnd(40)) +
                    chalk.bold('Size'.padEnd(15)) +
                    chalk.bold('Type')
                );
                console.log(chalk.gray('─'.repeat(70)));

                sizes.slice(0, 20).forEach(item => {
                    const icon = item.isDir ? '' : '';
                    const sizeColor = item.size > 100 * 1024 * 1024 ? chalk.red :
                        item.size > 10 * 1024 * 1024 ? chalk.yellow : chalk.green;

                    console.log(
                        chalk.cyan(`${icon} ${item.name.substring(0, 36)}`.padEnd(40)) +
                        sizeColor(formatBytes(item.size).padEnd(15)) +
                        chalk.gray(item.isDir ? 'Directory' : 'File')
                    );
                });

                console.log(chalk.gray('─'.repeat(70)));
                const totalSize = sizes.reduce((acc, item) => acc + item.size, 0);
                console.log(chalk.bold(`\nTotal Size: ${chalk.yellow(formatBytes(totalSize))}\n`));

            } catch (err) {
                spinner.fail('Analysis failed');
                console.error(chalk.red(err.message));
            }
        });

    disk
        .command('clean')
        .description('Find and remove node_modules directories')
        .option('-d, --dry-run', 'Show what would be deleted without deleting')
        .action(async (options) => {
            const spinner = ora('Searching for node_modules directories...').start();

            try {
                const nodeModulesDirs = [];

                async function findNodeModules(dir, depth = 0) {
                    if (depth > 5) return;

                    try {
                        const items = await fs.readdir(dir);

                        for (const item of items) {
                            if (item === 'node_modules') {
                                const nmPath = path.join(dir, item);
                                const size = await getDirSize(nmPath);
                                nodeModulesDirs.push({ path: nmPath, size });
                            } else {
                                const itemPath = path.join(dir, item);
                                const stats = await fs.stat(itemPath);
                                if (stats.isDirectory() && !item.startsWith('.')) {
                                    await findNodeModules(itemPath, depth + 1);
                                }
                            }
                        }
                    } catch (err) {
                        return;
                    }
                }

                await findNodeModules(process.cwd());
                spinner.succeed(`Found ${nodeModulesDirs.length} node_modules directories\n`);

                if (nodeModulesDirs.length === 0) {
                    console.log(chalk.yellow('No node_modules directories found.'));
                    return;
                }

                console.log(chalk.bold.cyan(' Found node_modules directories:\n'));
                nodeModulesDirs.forEach((nm, i) => {
                    console.log(chalk.cyan(`${i + 1}. ${nm.path}`));
                    console.log(chalk.gray(` Size: ${formatBytes(nm.size)}\n`));
                });

                const totalSize = nodeModulesDirs.reduce((acc, nm) => acc + nm.size, 0);
                console.log(chalk.bold(`Total reclaimable space: ${chalk.yellow(formatBytes(totalSize))}\n`));

                if (options.dryRun) {
                    console.log(chalk.yellow(' Dry run mode - no files were deleted.'));
                    return;
                }

                const { confirm } = await inquirer.prompt([{
                    type: 'confirm',
                    name: 'confirm',
                    message: `Delete all ${nodeModulesDirs.length} node_modules directories?`,
                    default: false
                }]);

                if (confirm) {
                    const deleteSpinner = ora('Deleting node_modules...').start();
                    for (const nm of nodeModulesDirs) {
                        await fs.remove(nm.path);
                    }
                    deleteSpinner.succeed(chalk.green(` Deleted ${nodeModulesDirs.length} directories, freed ${formatBytes(totalSize)}`));
                } else {
                    console.log(chalk.yellow('Operation cancelled.'));
                }

            } catch (err) {
                spinner.fail('Search failed');
                console.error(chalk.red(err.message));
            }
        });
}

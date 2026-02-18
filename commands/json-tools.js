// json-tools.js
// utilities for working with JSON files: validate syntax, format/prettify,
// view with syntax highlighting, and query specific fields using dot notation.

import chalk from 'chalk';
import fs from 'fs-extra';
import inquirer from 'inquirer';

export default function (program) {
    const json = program.command('json').description('JSON viewer, validator, and formatter');

    json
        .command('validate <file>')
        .description('Check if a file contains valid JSON')
        .action(async (file) => {

            try {
                const content = await fs.readFile(file, 'utf-8');
                JSON.parse(content);
                console.log(chalk.green(' Valid JSON'));
            } catch (err) {
                console.log(chalk.red(' Invalid JSON'));
                console.error(chalk.yellow(err.message));
            }
        });

    json
        .command('format <file>')
        .description('Pretty print JSON file')
        .option('-m, --minify', 'Minify instead of prettify')
        .action(async (file, options) => {
            try {
                const content = await fs.readFile(file, 'utf-8');
                const parsed = JSON.parse(content);

                if (options.minify) {
                    console.log(JSON.stringify(parsed));
                } else {
                    console.log(JSON.stringify(parsed, null, 2));
                }
            } catch (err) {
                console.error(chalk.red('Error:'), err.message);
            }
        });

    json
        .command('view <file>')
        .description('View JSON file with syntax highlighting')
        .action(async (file) => {
            try {
                const content = await fs.readFile(file, 'utf-8');
                const parsed = JSON.parse(content);

                console.log(chalk.bold.cyan('\n JSON Content:\n'));
                displayJSON(parsed, 0);
                console.log();
            } catch (err) {
                console.error(chalk.red('Error:'), err.message);
            }
        });

    json
        .command('query <file> <path>')
        .description('Query JSON using dot notation (e.g., user.name)')
        .action(async (file, path) => {
            try {
                const content = await fs.readFile(file, 'utf-8');
                const parsed = JSON.parse(content);

                const result = path.split('.').reduce((obj, key) => obj?.[key], parsed);

                if (result !== undefined) {
                    console.log(chalk.green('\n Result:\n'));
                    console.log(JSON.stringify(result, null, 2));
                    console.log();
                } else {
                    console.log(chalk.yellow('Path not found'));
                }
            } catch (err) {
                console.error(chalk.red('Error:'), err.message);
            }
        });
}

function displayJSON(obj, indent = 0) {
    const spaces = ' '.repeat(indent);

    if (Array.isArray(obj)) {
        console.log(chalk.gray('['));
        obj.forEach((item, i) => {
            process.stdout.write(spaces + ' ');
            displayJSON(item, indent + 1);
            if (i < obj.length - 1) process.stdout.write(chalk.gray(','));
            console.log();
        });
        process.stdout.write(spaces + chalk.gray(']'));
    } else if (typeof obj === 'object' && obj !== null) {
        console.log(chalk.gray('{'));
        const entries = Object.entries(obj);
        entries.forEach(([key, value], i) => {
            process.stdout.write(spaces + ' ' + chalk.cyan(`"${key}"`) + chalk.gray(': '));
            displayJSON(value, indent + 1);
            if (i < entries.length - 1) process.stdout.write(chalk.gray(','));
            console.log();
        });
        process.stdout.write(spaces + chalk.gray('}'));
    } else if (typeof obj === 'string') {
        process.stdout.write(chalk.green(`"${obj}"`));
    } else if (typeof obj === 'number') {
        process.stdout.write(chalk.yellow(obj.toString()));
    } else if (typeof obj === 'boolean') {
        process.stdout.write(chalk.magenta(obj.toString()));
    } else if (obj === null) {
        process.stdout.write(chalk.gray('null'));
    }
}

// regex.js
// Interactive Regular Expression tester. Type a pattern and a test string,
// and see matches highlighted in real-time. Great for debugging complex regex.

import chalk from 'chalk';
import inquirer from 'inquirer';

export default function (program) {
    program
        .command('regex')
        .description('Interactive regex tester and debugger')
        .action(async () => {

            console.log(chalk.bold.cyan('\n Regex Tester\n'));

            const { pattern, flags, testString } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'pattern',
                    message: 'Enter regex pattern:',
                    validate: (input) => input.length > 0 || 'Pattern is required'
                },
                {
                    type: 'input',
                    name: 'flags',
                    message: 'Enter flags (g, i, m, s, u, y):',
                    default: 'g'
                },
                {
                    type: 'input',
                    name: 'testString',
                    message: 'Enter test string:',
                    validate: (input) => input.length > 0 || 'Test string is required'
                }
            ]);

            try {
                const regex = new RegExp(pattern, flags);
                const matches = [...testString.matchAll(regex)];

                if (matches.length > 0) {
                    console.log(chalk.green(`\n Found ${matches.length} match(es):\n`));

                    matches.forEach((match, i) => {
                        console.log(chalk.bold(`Match ${i + 1}:`), chalk.yellow(match[0]));
                        console.log(chalk.gray(` Index: ${match.index}`));

                        if (match.length > 1) {
                            console.log(chalk.gray(' Groups:'));
                            match.slice(1).forEach((group, gi) => {
                                console.log(chalk.gray(` ${gi + 1}: ${group}`));
                            });
                        }
                        console.log();
                    });

                    let highlightedString = testString;
                    matches.reverse().forEach(match => {
                        const start = match.index;
                        const end = start + match[0].length;
                        highlightedString =
                            highlightedString.slice(0, start) +
                            chalk.bgGreen.black(match[0]) +
                            highlightedString.slice(end);
                    });

                    console.log(chalk.bold('Highlighted:'));
                    console.log(highlightedString);
                    console.log();
                } else {
                    console.log(chalk.yellow('\n No matches found\n'));
                }

                const { again } = await inquirer.prompt([{
                    type: 'confirm',
                    name: 'again',
                    message: 'Test another pattern?',
                    default: false
                }]);

                if (again) {
                    program.parse(['node', 'mycli', 'regex']);
                }
            } catch (err) {
                console.error(chalk.red('\n Invalid regex:'), err.message);
            }
        });
}

// http.js
// A lightweight HTTP client for testing APIs directly from the terminal.
// Supports GET, POST, custom headers, and pretty-printed JSON responses.

import axios from 'axios';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';

export default function (program) {
    const http = program.command('http').description('HTTP client for API testing');

    http
        .command('get <url>')
        .description('Send a GET request to the specified URL')
        .option('-h, --headers <headers>', 'JSON string of request headers')
        .action(async (url, options) => {
            const spinner = ora(`Sending GET request to ${url}...`).start();


            try {
                const headers = options.headers ? JSON.parse(options.headers) : {};
                const response = await axios.get(url, { headers });

                spinner.succeed(`${response.status} ${response.statusText}`);

                console.log(chalk.bold.cyan('\n Response:\n'));
                console.log(chalk.bold('Status:'), chalk.green(`${response.status} ${response.statusText}`));
                console.log(chalk.bold('Headers:'));
                Object.entries(response.headers).forEach(([key, value]) => {
                    console.log(chalk.gray(` ${key}: ${value}`));
                });

                console.log(chalk.bold('\nBody:'));
                console.log(chalk.white(JSON.stringify(response.data, null, 2)));
                console.log();
            } catch (err) {
                spinner.fail('Request failed');
                console.error(chalk.red(err.message));
                if (err.response) {
                    console.log(chalk.yellow(`Status: ${err.response.status}`));
                    console.log(chalk.gray(JSON.stringify(err.response.data, null, 2)));
                }
            }
        });

    http
        .command('post <url>')
        .description('Send POST request')
        .option('-d, --data <data>', 'Request body as JSON string')
        .option('-h, --headers <headers>', 'Headers as JSON string')
        .action(async (url, options) => {
            const spinner = ora(`POST ${url}`).start();

            try {
                const data = options.data ? JSON.parse(options.data) : {};
                const headers = options.headers ? JSON.parse(options.headers) : { 'Content-Type': 'application/json' };
                const response = await axios.post(url, data, { headers });

                spinner.succeed(`${response.status} ${response.statusText}`);

                console.log(chalk.bold.cyan('\n Response:\n'));
                console.log(chalk.bold('Status:'), chalk.green(`${response.status} ${response.statusText}`));
                console.log(chalk.bold('\nBody:'));
                console.log(chalk.white(JSON.stringify(response.data, null, 2)));
                console.log();
            } catch (err) {
                spinner.fail('Request failed');
                console.error(chalk.red(err.message));
                if (err.response) {
                    console.log(chalk.yellow(`Status: ${err.response.status}`));
                    console.log(chalk.gray(JSON.stringify(err.response.data, null, 2)));
                }
            }
        });

    http
        .command('interactive')
        .alias('i')
        .description('Interactive HTTP client')
        .action(async () => {
            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'method',
                    message: 'Select HTTP method:',
                    choices: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
                },
                {
                    type: 'input',
                    name: 'url',
                    message: 'Enter URL:',
                    validate: (input) => input.length > 0 || 'URL is required'
                },
                {
                    type: 'confirm',
                    name: 'hasBody',
                    message: 'Include request body?',
                    default: false,
                    when: (answers) => ['POST', 'PUT', 'PATCH'].includes(answers.method)
                },
                {
                    type: 'editor',
                    name: 'body',
                    message: 'Enter request body (JSON):',
                    default: '{\n \n}',
                    when: (answers) => answers.hasBody
                }
            ]);

            const spinner = ora(`${answers.method} ${answers.url}`).start();

            try {
                const config = {
                    method: answers.method.toLowerCase(),
                    url: answers.url,
                    headers: { 'Content-Type': 'application/json' }
                };

                if (answers.body) {
                    config.data = JSON.parse(answers.body);
                }

                const response = await axios(config);
                spinner.succeed(`${response.status} ${response.statusText}`);

                console.log(chalk.bold.cyan('\n Response:\n'));
                console.log(chalk.bold('Status:'), chalk.green(`${response.status} ${response.statusText}`));
                console.log(chalk.bold('\nBody:'));
                console.log(chalk.white(JSON.stringify(response.data, null, 2)));
                console.log();
            } catch (err) {
                spinner.fail('Request failed');
                console.error(chalk.red(err.message));
                if (err.response) {
                    console.log(chalk.yellow(`Status: ${err.response.status}`));
                    console.log(chalk.gray(JSON.stringify(err.response.data, null, 2)));
                }
            }
        });
}

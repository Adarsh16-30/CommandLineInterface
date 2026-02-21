
import chalk from 'chalk';
import crypto from 'crypto';
import inquirer from 'inquirer';

function generatePassword(length, options) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (options.lowercase) chars += lowercase;
    if (options.uppercase) chars += uppercase;
    if (options.numbers) chars += numbers;
    if (options.symbols) chars += symbols;

    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
}

function analyzeStrength(password) {
    let score = 0;
    const checks = {
        length: password.length >= 12,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        symbols: /[^a-zA-Z0-9]/.test(password),
        longLength: password.length >= 16
    };

    if (checks.length) score += 20;
    if (checks.lowercase) score += 15;
    if (checks.uppercase) score += 15;
    if (checks.numbers) score += 15;
    if (checks.symbols) score += 20;
    if (checks.longLength) score += 15;

    let strength = 'Weak';
    let color = chalk.red;

    if (score >= 80) {
        strength = 'Very Strong';
        color = chalk.green;
    } else if (score >= 60) {
        strength = 'Strong';
        color = chalk.cyan;
    } else if (score >= 40) {
        strength = 'Medium';
        color = chalk.yellow;
    }

    return { score, strength, color, checks };
}

export default function (program) {
    const password = program.command('password').description('Password generator and analyzer');

    password
        .command('generate')
        .alias('gen')
        .description('Generate secure password')
        .option('-l, --length <number>', 'Password length', '16')
        .option('--no-lowercase', 'Exclude lowercase letters')
        .option('--no-uppercase', 'Exclude uppercase letters')
        .option('--no-numbers', 'Exclude numbers')
        .option('--no-symbols', 'Exclude symbols')
        .option('-n, --count <number>', 'Number of passwords to generate', '1')
        .action((options) => {
            const length = parseInt(options.length);
            const count = parseInt(options.count);

            console.log(chalk.bold.cyan('\n Generated Passwords\n'));

            for (let i = 0; i < count; i++) {
                const pwd = generatePassword(length, {
                    lowercase: options.lowercase,
                    uppercase: options.uppercase,
                    numbers: options.numbers,
                    symbols: options.symbols
                });

                const analysis = analyzeStrength(pwd);
                console.log(chalk.white(pwd), analysis.color(`(${analysis.strength})`));
            }
            console.log();
        });

    password
        .command('analyze <password>')
        .description('Analyze password strength')
        .action((pwd) => {
            const analysis = analyzeStrength(pwd);

            console.log(chalk.bold.cyan('\n Password Analysis\n'));
            console.log(chalk.bold('Password:'), chalk.white(pwd));
            console.log(chalk.bold('Length:'), pwd.length);
            console.log(chalk.bold('Strength:'), analysis.color(analysis.strength));
            console.log(chalk.bold('Score:'), `${analysis.score}/100`);

            console.log(chalk.bold('\nChecks:'));
            console.log(analysis.checks.length ? chalk.green('') : chalk.red(''), 'Length >= 12');
            console.log(analysis.checks.lowercase ? chalk.green('') : chalk.red(''), 'Lowercase letters');
            console.log(analysis.checks.uppercase ? chalk.green('') : chalk.red(''), 'Uppercase letters');
            console.log(analysis.checks.numbers ? chalk.green('') : chalk.red(''), 'Numbers');
            console.log(analysis.checks.symbols ? chalk.green('') : chalk.red(''), 'Symbols');
            console.log(analysis.checks.longLength ? chalk.green('') : chalk.red(''), 'Length >= 16');

            console.log(chalk.bold('\nRecommendations:'));
            if (!analysis.checks.length) console.log(chalk.yellow(' Use at least 12 characters'));
            if (!analysis.checks.longLength) console.log(chalk.yellow(' Consider using 16+ characters'));
            if (!analysis.checks.symbols) console.log(chalk.yellow(' Add special symbols'));
            if (analysis.score >= 80) console.log(chalk.green(' Password is very strong!'));

            console.log();
        });

    password
        .command('interactive')
        .alias('i')
        .description('Interactive password generator')
        .action(async () => {
            const answers = await inquirer.prompt([
                {
                    type: 'number',
                    name: 'length',
                    message: 'Password length:',
                    default: 16,
                    validate: (input) => input > 0 || 'Length must be positive'
                },
                {
                    type: 'confirm',
                    name: 'lowercase',
                    message: 'Include lowercase letters?',
                    default: true
                },
                {
                    type: 'confirm',
                    name: 'uppercase',
                    message: 'Include uppercase letters?',
                    default: true
                },
                {
                    type: 'confirm',
                    name: 'numbers',
                    message: 'Include numbers?',
                    default: true
                },
                {
                    type: 'confirm',
                    name: 'symbols',
                    message: 'Include symbols?',
                    default: true
                },
                {
                    type: 'number',
                    name: 'count',
                    message: 'How many passwords?',
                    default: 3
                }
            ]);

            console.log(chalk.bold.cyan('\n Generated Passwords\n'));

            for (let i = 0; i < answers.count; i++) {
                const pwd = generatePassword(answers.length, answers);
                const analysis = analyzeStrength(pwd);
                console.log(chalk.white(pwd), analysis.color(`(${analysis.strength})`));
            }
            console.log();
        });
}

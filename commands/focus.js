
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function (program) {
    program
        .command('focus')
        .description('Start a Pomodoro focus timer')

        .option('-w, --work <minutes>', 'Work duration in minutes', '25')
        .option('-b, --break <minutes>', 'Break duration in minutes', '5')
        .option('-r, --rounds <count>', 'Number of rounds', '4')
        .action(async (options) => {
            const workDuration = parseInt(options.work) * 60;
            const breakDuration = parseInt(options.break) * 60;
            const rounds = parseInt(options.rounds);

            console.log(chalk.bold.cyan('\n Pomodoro Focus Timer\n'));
            console.log(chalk.gray(`Work: ${options.work}min | Break: ${options.break}min | Rounds: ${rounds}\n`));

            const { start } = await inquirer.prompt([{
                type: 'confirm',
                name: 'start',
                message: 'Start timer?',
                default: true
            }]);

            if (!start) {
                console.log(chalk.yellow('Timer cancelled.'));
                return;
            }

            for (let round = 1; round <= rounds; round++) {
                console.log(chalk.bold.green(`\n Round ${round}/${rounds} - WORK TIME\n`));

                for (let i = workDuration; i >= 0; i--) {
                    process.stdout.write(`\r${chalk.cyan('⏱ ' + formatTime(i))} `);
                    await sleep(1000);
                }

                console.log(chalk.green('\n\n Work session complete!'));

                if (round < rounds) {
                    console.log(chalk.bold.yellow(`\n Break Time (${options.break} min)\n`));

                    for (let i = breakDuration; i >= 0; i--) {
                        process.stdout.write(`\r${chalk.yellow('⏱ ' + formatTime(i))} `);
                        await sleep(1000);
                    }

                    console.log(chalk.yellow('\n\n Break complete!'));
                }
            }

            console.log(chalk.bold.green('\n\n All rounds complete! Great work!\n'));
        });
}

// network.js
// Network diagnostic tools: IP lookup, speed test, and bandwidth monitoring.
// Helps you troubleshoot connectivity issues without opening a browser.

import chalk from 'chalk';
import si from 'systeminformation';
import FastSpeedtest from 'fast-speedtest-api';
import ora from 'ora';


export default function (program) {
    const net = program.command('net').description('Network utilities suite');

    net
        .command('ip')
        .description('Show local and public IP addresses')
        .action(async () => {
            const spinner = ora('Fetching IP information...').start();


            try {
                const networkInterfaces = await si.networkInterfaces();

                spinner.succeed('IP Information Retrieved\n');

                console.log(chalk.bold.cyan(' Network Information\n'));

                console.log(chalk.bold('Local Interfaces:'));
                networkInterfaces.forEach(iface => {
                    if (iface.ip4 && iface.ip4 !== '127.0.0.1') {
                        console.log(chalk.cyan(`\n ${iface.iface}:`));
                        console.log(chalk.gray(` IPv4: ${iface.ip4}`));
                        console.log(chalk.gray(` MAC: ${iface.mac}`));
                        if (iface.ip6) console.log(chalk.gray(` IPv6: ${iface.ip6}`));
                    }
                });
                console.log();
            } catch (err) {
                spinner.fail('Failed to fetch IP information');
                console.error(chalk.red(err.message));
            }
        });


    net
        .command('speed')
        .description('Run internet speed test')
        .action(async () => {
            console.log(chalk.bold.cyan('\n Internet Speed Test\n'));
            const spinner = ora('Testing download speed...').start();

            try {
                const speedtest = new FastSpeedtest({
                    token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
                    verbose: false,
                    timeout: 10000,
                    https: true,
                    urlCount: 5,
                    bufferSize: 8,
                    unit: FastSpeedtest.UNITS.Mbps
                });

                const speed = await speedtest.getSpeed();
                spinner.succeed(`Download Speed: ${chalk.green(speed.toFixed(2) + ' Mbps')}\n`);

                console.log(chalk.dim('Note: Upload speed test requires additional configuration.\n'));
            } catch (err) {
                spinner.fail('Speed test failed');
                console.error(chalk.red(err.message));
            }
        });

    net
        .command('info')
        .description('Show detailed network statistics')
        .action(async () => {
            const spinner = ora('Gathering network statistics...').start();

            try {
                const stats = await si.networkStats();
                const connections = await si.networkConnections();

                spinner.succeed('Network Statistics\n');

                console.log(chalk.bold.cyan(' Network Statistics\n'));

                stats.forEach(iface => {
                    console.log(chalk.bold(iface.iface));
                    console.log(chalk.gray(` RX: ${(iface.rx_bytes / 1024 / 1024).toFixed(2)} MB`));
                    console.log(chalk.gray(` TX: ${(iface.tx_bytes / 1024 / 1024).toFixed(2)} MB`));
                    console.log(chalk.gray(` Speed: ${iface.rx_sec ? (iface.rx_sec / 1024).toFixed(2) : 0} KB/s\n`));
                });

                console.log(chalk.bold(`Active Connections: ${chalk.yellow(connections.length)}\n`));
            } catch (err) {
                spinner.fail('Failed to gather statistics');
                console.error(chalk.red(err.message));
            }
        });
}

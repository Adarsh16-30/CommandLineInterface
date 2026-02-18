import chalk from 'chalk';
import axios from 'axios';
import ora from 'ora';

export default function (program) {
 const ticker = program.command('ticker').description('Cryptocurrency and stock price tracker');

 ticker
 .command('crypto <symbol>')
 .description('Get cryptocurrency price (e.g., BTC, ETH)')
 .action(async (symbol) => {
 const spinner = ora(`Fetching ${symbol.toUpperCase()} price...`).start();

 try {
 const response = await axios.get(
 `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd&include_24hr_change=true`
 );

 const coinId = symbol.toLowerCase();
 const data = response.data[coinId];

 if (!data) {
 spinner.fail(`Cryptocurrency not found: ${symbol}`);
 console.log(chalk.yellow('\nTry: BTC, ETH, SOL, ADA, DOT, etc.\n'));
 return;
 }

 spinner.succeed(`${symbol.toUpperCase()} Price`);

 const price = data.usd;
 const change = data.usd_24h_change || 0;
 const changeColor = change >= 0 ? chalk.green : chalk.red;
 const arrow = change >= 0 ? '↑' : '↓';

 console.log(chalk.bold.cyan('\n Cryptocurrency Price\n'));
 console.log(chalk.bold('Symbol:'), chalk.white(symbol.toUpperCase()));
 console.log(chalk.bold('Price:'), chalk.green(`$${price.toLocaleString()}`));
 console.log(chalk.bold('24h Change:'), changeColor(`${arrow} ${Math.abs(change).toFixed(2)}%`));
 console.log();
 } catch (err) {
 spinner.fail('Failed to fetch price');
 console.error(chalk.red(err.message));
 }
 });

 ticker
 .command('watch <symbols...>')
 .description('Watch multiple cryptocurrencies')
 .action(async (symbols) => {
 console.log(chalk.bold.cyan('\n Cryptocurrency Tracker\n'));

 const ids = symbols.join(',');

 try {
 const response = await axios.get(
 `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
 );

 console.log(chalk.gray('─'.repeat(70)));
 console.log(
 chalk.bold('Symbol'.padEnd(15)) +
 chalk.bold('Price'.padEnd(20)) +
 chalk.bold('24h Change')
 );
 console.log(chalk.gray('─'.repeat(70)));

 for (const symbol of symbols) {
 const data = response.data[symbol.toLowerCase()];

 if (!data) {
 console.log(chalk.yellow(`${symbol.toUpperCase().padEnd(15)} Not found`));
 continue;
 }

 const price = data.usd;
 const change = data.usd_24h_change || 0;
 const changeColor = change >= 0 ? chalk.green : chalk.red;
 const arrow = change >= 0 ? '↑' : '↓';

 console.log(
 chalk.cyan(symbol.toUpperCase().padEnd(15)) +
 chalk.white(`$${price.toLocaleString()}`.padEnd(20)) +
 changeColor(`${arrow} ${Math.abs(change).toFixed(2)}%`)
 );
 }

 console.log(chalk.gray('─'.repeat(70)));
 console.log();
 } catch (err) {
 console.error(chalk.red('Failed to fetch prices:'), err.message);
 }
 });

 ticker
 .command('top [limit]')
 .description('Show top cryptocurrencies by market cap')
 .action(async (limit = 10) => {
 const spinner = ora('Fetching top cryptocurrencies...').start();

 try {
 const response = await axios.get(
 `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1`
 );

 spinner.succeed('Top Cryptocurrencies');

 console.log(chalk.bold.cyan('\n Top Cryptocurrencies by Market Cap\n'));
 console.log(chalk.gray('─'.repeat(80)));
 console.log(
 chalk.bold('#'.padEnd(5)) +
 chalk.bold('Symbol'.padEnd(10)) +
 chalk.bold('Price'.padEnd(20)) +
 chalk.bold('24h Change'.padEnd(15)) +
 chalk.bold('Market Cap')
 );
 console.log(chalk.gray('─'.repeat(80)));

 response.data.forEach((coin, i) => {
 const change = coin.price_change_percentage_24h || 0;
 const changeColor = change >= 0 ? chalk.green : chalk.red;
 const arrow = change >= 0 ? '↑' : '↓';

 console.log(
 chalk.gray(`${(i + 1).toString().padEnd(5)}`) +
 chalk.cyan(coin.symbol.toUpperCase().padEnd(10)) +
 chalk.white(`$${coin.current_price.toLocaleString()}`.padEnd(20)) +
 changeColor(`${arrow} ${Math.abs(change).toFixed(2)}%`.padEnd(15)) +
 chalk.gray(`$${(coin.market_cap / 1e9).toFixed(2)}B`)
 );
 });

 console.log(chalk.gray('─'.repeat(80)));
 console.log();
 } catch (err) {
 spinner.fail('Failed to fetch data');
 console.error(chalk.red(err.message));
 }
 });
}

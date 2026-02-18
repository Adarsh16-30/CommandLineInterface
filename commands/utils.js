import chalk from 'chalk';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import qrcode from 'qrcode-terminal';
import { jwtDecode } from 'jwt-decode';


export default function (program) {
 const utils = program.command('utils').description('Developer utilities and generators');

 utils
 .command('encode <type> <text>')
 .description('Encode text (base64, url, hex)')
 .action((type, text) => {
 let result;
 switch (type.toLowerCase()) {
 case 'base64':
 result = Buffer.from(text).toString('base64');
 break;
 case 'url':
 result = encodeURIComponent(text);
 break;
 case 'hex':
 result = Buffer.from(text).toString('hex');
 break;
 default:
 console.log(chalk.red('Unknown encoding type. Use: base64, url, hex'));
 return;
 }
 console.log(chalk.green('\n Encoded:\n'));
 console.log(chalk.white(result));
 console.log();
 });

 utils
 .command('decode <type> <text>')
 .description('Decode text (base64, url, hex)')
 .action((type, text) => {
 try {
 let result;
 switch (type.toLowerCase()) {
 case 'base64':
 result = Buffer.from(text, 'base64').toString('utf-8');
 break;
 case 'url':
 result = decodeURIComponent(text);
 break;
 case 'hex':
 result = Buffer.from(text, 'hex').toString('utf-8');
 break;
 default:
 console.log(chalk.red('Unknown encoding type. Use: base64, url, hex'));
 return;
 }
 console.log(chalk.green('\n Decoded:\n'));
 console.log(chalk.white(result));
 console.log();
 } catch (err) {
 console.error(chalk.red('Decode error:'), err.message);
 }
 });

 utils
 .command('hash <algorithm> <text>')
 .description('Generate hash (md5, sha1, sha256, sha512)')
 .action((algorithm, text) => {
 try {
 const hash = crypto.createHash(algorithm).update(text).digest('hex');
 console.log(chalk.green(`\n ${algorithm.toUpperCase()} Hash:\n`));
 console.log(chalk.white(hash));
 console.log();
 } catch (err) {
 console.error(chalk.red('Hash error:'), err.message);
 }
 });

 utils
 .command('uuid')
 .description('Generate UUID v4')
 .option('-n, --number <count>', 'Number of UUIDs to generate', '1')
 .action((options) => {
 const count = parseInt(options.number);
 console.log(chalk.green('\n Generated UUID(s):\n'));
 for (let i = 0; i < count; i++) {
 console.log(chalk.white(uuidv4()));
 }
 console.log();
 });

 utils
 .command('qr <text>')
 .description('Generate QR code in terminal')
 .action((text) => {
 console.log(chalk.cyan('\n QR Code:\n'));
 qrcode.generate(text, { small: true });
 console.log();
 });

 utils
 .command('jwt <token>')
 .description('Decode JWT token')
 .action((token) => {
 try {
 const decoded = jwtDecode(token);
 console.log(chalk.green('\n Decoded JWT:\n'));
 console.log(JSON.stringify(decoded, null, 2));
 console.log();
 } catch (err) {
 console.error(chalk.red('Invalid JWT:'), err.message);
 }
 });

 utils
 .command('case <type> <text>')
 .description('Convert case (camel, snake, kebab, pascal)')
 .action((type, text) => {
 let result;
 switch (type.toLowerCase()) {
 case 'camel':
 result = text.replace(/[-_\s](.)/g, (_, c) => c.toUpperCase());
 result = result.charAt(0).toLowerCase() + result.slice(1);
 break;
 case 'snake':
 result = text.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
 result = result.replace(/[-\s]/g, '_');
 break;
 case 'kebab':
 result = text.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
 result = result.replace(/[_\s]/g, '-');
 break;
 case 'pascal':
 result = text.replace(/[-_\s](.)/g, (_, c) => c.toUpperCase());
 result = result.charAt(0).toUpperCase() + result.slice(1);
 break;
 default:
 console.log(chalk.red('Unknown case type. Use: camel, snake, kebab, pascal'));
 return;
 }
 console.log(chalk.green('\n Converted:\n'));
 console.log(chalk.white(result));
 console.log();
 });

 utils
 .command('lorem [words]')
 .description('Generate Lorem Ipsum text')
 .action((words = 50) => {
 const loremWords = [
 'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat'
 ];

 const count = parseInt(words);
 const result = [];
 for (let i = 0; i < count; i++) {
 result.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
 }

 console.log(chalk.white('\n' + result.join(' ') + '\n'));
 });
}

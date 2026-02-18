// info.js
// Displays a quick snapshot of the machine's CPU, RAM, OS, and Node.js version.
// All three system calls run in parallel so the output appears quickly.

import si from "systeminformation";
import chalk from "chalk";

export default (program) => {
  program
    .command("info")
    .description("Show system and Node.js environment details")
    .action(async () => {
      console.log(chalk.blueBright("Gathering system info..."));

      // Fire all three requests at once instead of waiting for each one sequentially.
      const [cpu, mem, osInfo] = await Promise.all([
        si.cpu(),
        si.mem(),
        si.osInfo()
      ]);

      console.log(chalk.cyanBright(`CPU: ${cpu.manufacturer} ${cpu.brand}`));
      console.log(chalk.cyanBright(`RAM: ${(mem.total / 1e9).toFixed(2)} GB`));
      console.log(chalk.cyanBright(`OS: ${osInfo.distro} ${osInfo.release}`));
      console.log(chalk.yellowBright(`Node.js: ${process.version}`));
    });
};

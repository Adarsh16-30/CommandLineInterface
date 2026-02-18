import chalk from 'chalk';

export default function (program) {
    program
        .command('help-all')
        .description('Display all available commands organized by category')
        .action(() => {
            console.log(chalk.bold.cyan('\n MyCLI - Complete Command Reference\n'));

            console.log(chalk.bold.yellow(' SYSTEM & MONITORING '));
            console.log(chalk.white(' monitor ') + chalk.gray('Real-time system monitor dashboard'));
            console.log(chalk.white(' process [-s search] ') + chalk.gray('Interactive process manager'));
            console.log(chalk.white(' net <cmd> ') + chalk.gray('Network utilities (ip|speed|info)'));
            console.log(chalk.white(' disk <cmd> ') + chalk.gray('Disk analyzer (analyze|clean)'));
            console.log(chalk.white(' info ') + chalk.gray('Show system and Node.js environment details'));

            console.log(chalk.bold.yellow('\n DEVELOPMENT TOOLS '));
            console.log(chalk.white(' http <method> <url> ') + chalk.gray('HTTP client (get|post|interactive)'));
            console.log(chalk.white(' json <cmd> <file> ') + chalk.gray('JSON tools (validate|format|view|query)'));
            console.log(chalk.white(' utils <cmd> ') + chalk.gray('Dev utilities (encode|decode|hash|uuid|qr|jwt|case|lorem)'));
            console.log(chalk.white(' regex ') + chalk.gray('Interactive regex tester'));
            console.log(chalk.white(' run <script> ') + chalk.gray('Run a custom npm/yarn/pnpm script'));
            console.log(chalk.white(' serve [port] ') + chalk.gray('Run a simple local dev server'));

            console.log(chalk.bold.yellow('\n DEVOPS & DEPLOYMENT '));
            console.log(chalk.white(' docker <cmd> ') + chalk.gray('Docker manager (ps|images|logs|start|stop|exec|stats|clean)'));
            console.log(chalk.white(' ssh <cmd> ') + chalk.gray('SSH manager (add|list|connect|edit|remove)'));
            console.log(chalk.white(' deploy <cmd> ') + chalk.gray('Deploy tools (static|netlify|vercel|info)'));
            console.log(chalk.white(' build [-t platform] ') + chalk.gray('Build standalone executable'));

            console.log(chalk.bold.yellow('\n=== PROJECT MANAGEMENT ==='));
            console.log(chalk.white('  scaffold <cmd>            ') + chalk.gray('Project scaffolder (list|create|interactive)'));
            console.log(chalk.white('  git <action>              ') + chalk.gray('Perform Git operations'));
            console.log(chalk.white('  gh <action> [name]        ') + chalk.gray('GitHub helpers'));

            console.log(chalk.bold.yellow('\n CODE QUALITY '));
            console.log(chalk.white(' lint [folder] ') + chalk.gray('Run eslint/prettier across project'));
            console.log(chalk.white(' audit [folder] ') + chalk.gray('Run npm audit and display summary'));

            console.log(chalk.bold.yellow('\n AI & CHAT '));
            console.log(chalk.white(' ai <action> ') + chalk.gray('Explain code using Hugging Face AI'));
            console.log(chalk.white(' chat ') + chalk.gray('Start an interactive AI chat session'));
            console.log(chalk.white(' ask <question> ') + chalk.gray('Ask AI any question'));

            console.log(chalk.bold.yellow('\n PRODUCTIVITY '));
            console.log(chalk.white(' focus [-w 25] [-b 5] ') + chalk.gray('Pomodoro timer'));
            console.log(chalk.white(' notes <cmd> ') + chalk.gray('Notes manager (new|list|view|edit|delete|search)'));
            console.log(chalk.white(' todo <action> ') + chalk.gray('Todo list manager'));
            console.log(chalk.white(' password <cmd> ') + chalk.gray('Password tools (gen|analyze|interactive)'));
            console.log(chalk.white(' ticker <cmd> ') + chalk.gray('Crypto/Stock ticker (crypto|watch|top)'));

            console.log(chalk.bold.yellow('\n FILE & CLIPBOARD '));
            console.log(chalk.white(' file <action> [filename] ') + chalk.gray('Perform file operations'));
            console.log(chalk.white(' clip <cmd> ') + chalk.gray('Clipboard utilities (copy|paste|file|clear)'));

            console.log(chalk.bold.yellow('\n SECURITY '));
            console.log(chalk.white(' secret ') + chalk.gray('Encrypt/Decrypt secrets'));

            console.log(chalk.bold.yellow('\n CUSTOMIZATION '));
            console.log(chalk.white(' demo [-t theme] ') + chalk.gray('Interactive TUI showcase'));
            console.log(chalk.white(' theme [mode] ') + chalk.gray('Set or view terminal color preferences'));
            console.log(chalk.white(' config ') + chalk.gray('Manage your mycli configuration'));

            console.log(chalk.bold.yellow('\n UTILITIES '));
            console.log(chalk.white(' greet <name> ') + chalk.gray('Greet a user by name'));
            console.log(chalk.white(' time ') + chalk.gray('Show current system time'));
            console.log(chalk.white(' quote ') + chalk.gray('Show a motivational quote'));
            console.log(chalk.white(' joke ') + chalk.gray('Get a random programming joke'));
            console.log(chalk.white(' open <url> ') + chalk.gray('Open a website from CLI'));

            console.log(chalk.bold.yellow('\n=== CLI MANAGEMENT ==='));
            console.log(chalk.white('  selfupdate [--check]      ') + chalk.gray('Self-update mechanism'));

            console.log(chalk.bold.cyan('\n Tips:'));
            console.log(chalk.gray(' Use --help with any command for details'));
            console.log(chalk.gray(' Run "mycli help-all" to see this menu'));
            console.log(chalk.gray('  Total: 38 commands across 12 categories\n'));
        });
}

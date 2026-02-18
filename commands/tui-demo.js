import { TUIEngine } from '../utils/tui-engine.js';


export default function (program) {
 program
 .command('demo')
 .description('Interactive TUI demo with split panes and themes')
 .option('-t, --theme <theme>', 'Theme to use (default, dracula, monokai)', 'default')
 .action((options) => {
 const tui = new TUIEngine(options.theme);
 const screen = tui.getScreen();

 // Create header
 const header = tui.createBox({
 top: 0,
 left: 0,
 width: '100%',
 height: 3,
 content: '{center}{bold}MyCLI v3.0 - TUI Demo{/bold}{/center}\nPress q or Ctrl+C to exit',
 tags: true
 });

 // Create left panel (command list)
 const leftPanel = tui.createList({
 top: 3,
 left: 0,
 width: '50%',
 height: '70%',
 label: ' Available Commands ',
 items: [
 'System Monitor',
 'Network Tools',
 'HTTP Client',
 'JSON Viewer',
 'Process Manager',
 'Disk Analyzer',
 'Docker Manager',
 'Focus Timer',
 'Notes Manager',
 'Password Generator',
 'WiFi Scanner',
 'Regex Tester',
 'Crypto Ticker',
 'Image to ASCII'
 ]
 });

 // Create right panel (details)
 const rightPanel = tui.createBox({
 top: 3,
 left: '50%',
 width: '50%',
 height: '70%',
 label: ' Command Details ',
 content: 'Select a command from the left panel to see details.\n\n' +
 '{bold}Navigation:{/bold}\n' +
 ' ↑/↓ or j/k - Move selection\n' +
 ' Enter - Select item\n' +
 ' q - Quit\n\n' +
 '{bold}Themes:{/bold}\n' +
 ' Try: mycli demo -t dracula\n' +
 ' Try: mycli demo -t monokai',
 tags: true,
 scrollable: true,
 alwaysScroll: true,
 mouse: true
 });

 // Create footer
 const footer = tui.createBox({
 bottom: 0,
 left: 0,
 width: '100%',
 height: 3,
 content: `{center}Theme: {bold}${options.theme}{/bold} | Mouse: {green-fg}Enabled{/green-fg} | Version: 3.0.0{/center}`,
 tags: true
 });

 // Command descriptions
 const descriptions = {
 'System Monitor': '{bold}Real-time System Dashboard{/bold}\n\n' +
 'Monitor your system resources with live graphs:\n' +
 ' CPU usage per core\n' +
 ' Memory utilization\n' +
 ' Network I/O\n' +
 ' Process list with sorting\n\n' +
 '{yellow-fg}Coming in Phase 2{/yellow-fg}',

 'Network Tools': '{bold}Comprehensive Network Utilities{/bold}\n\n' +
 'All your network tools in one place:\n' +
 ' Speed test (upload/download)\n' +
 ' Port scanner\n' +
 ' IP lookup (public/private)\n' +
 ' DNS resolver\n\n' +
 '{yellow-fg}Coming in Phase 2{/yellow-fg}',

 'HTTP Client': '{bold}Interactive API Testing Tool{/bold}\n\n' +
 'Test APIs right from your terminal:\n' +
 ' GET/POST/PUT/DELETE requests\n' +
 ' JSON syntax highlighting\n' +
 ' Headers management\n' +
 ' Response viewer\n\n' +
 '{yellow-fg}Coming in Phase 3{/yellow-fg}',

 'JSON Viewer': '{bold}Interactive JSON Explorer{/bold}\n\n' +
 'Work with JSON data easily:\n' +
 ' Expand/collapse nodes\n' +
 ' Syntax highlighting\n' +
 ' Validation\n' +
 ' Pretty print/minify\n\n' +
 '{yellow-fg}Coming in Phase 3{/yellow-fg}',

 'Process Manager': '{bold}Advanced Process Management{/bold}\n\n' +
 'Manage system processes:\n' +
 ' Search processes\n' +
 ' Kill/restart\n' +
 ' Resource monitoring\n' +
 ' Auto-complete\n\n' +
 '{yellow-fg}Coming in Phase 2{/yellow-fg}',

 'Disk Analyzer': '{bold}Interactive Disk Usage Analyzer{/bold}\n\n' +
 'Visualize disk usage:\n' +
 ' Directory tree view\n' +
 ' Size visualization\n' +
 ' node_modules cleaner\n' +
 ' Export reports\n\n' +
 '{yellow-fg}Coming in Phase 2{/yellow-fg}',

 'Docker Manager': '{bold}Docker Container Management TUI{/bold}\n\n' +
 'Manage Docker with ease:\n' +
 ' Container dashboard\n' +
 ' Logs viewer\n' +
 ' Image management\n' +
 ' One-key actions\n\n' +
 '{yellow-fg}Coming in Phase 4{/yellow-fg}',

 'Focus Timer': '{bold}Pomodoro Timer with Notifications{/bold}\n\n' +
 'Stay productive:\n' +
 ' Customizable intervals\n' +
 ' System notifications\n' +
 ' Statistics tracking\n' +
 ' Website blocker (optional)\n\n' +
 '{yellow-fg}Coming in Phase 5{/yellow-fg}',

 'Notes Manager': '{bold}Quick Markdown Notes{/bold}\n\n' +
 'Manage notes from CLI:\n' +
 ' Create/edit notes\n' +
 ' Fuzzy search\n' +
 ' Tags support\n' +
 ' Export to files\n\n' +
 '{yellow-fg}Coming in Phase 5{/yellow-fg}',

 'Password Generator': '{bold}Secure Password Generation{/bold}\n\n' +
 'Generate strong passwords:\n' +
 ' Custom length\n' +
 ' Character sets\n' +
 ' Strength analyzer\n' +
 ' Passphrase mode\n\n' +
 '{yellow-fg}Coming in Phase 5{/yellow-fg}',

 'WiFi Scanner': '{bold}WiFi Network Scanner{/bold}\n\n' +
 'Scan and analyze WiFi:\n' +
 ' List available networks\n' +
 ' Signal strength\n' +
 ' Channel information\n' +
 ' Connection details\n\n' +
 '{yellow-fg}Coming in Phase 2{/yellow-fg}',

 'Regex Tester': '{bold}Interactive Regex Tester{/bold}\n\n' +
 'Test regex patterns:\n' +
 ' Live pattern matching\n' +
 ' Syntax highlighting\n' +
 ' Match groups display\n' +
 ' Common patterns library\n\n' +
 '{yellow-fg}Coming in Phase 3{/yellow-fg}',

 'Crypto Ticker': '{bold}Real-time Crypto/Stock Prices{/bold}\n\n' +
 'Track market prices:\n' +
 ' Live price updates\n' +
 ' Multiple currencies\n' +
 ' Price alerts\n' +
 ' Historical charts\n\n' +
 '{yellow-fg}Coming in Phase 5{/yellow-fg}',

 'Image to ASCII': '{bold}Image to ASCII Art Converter{/bold}\n\n' +
 'Convert images to ASCII:\n' +
 ' High-resolution output\n' +
 ' Color support\n' +
 ' Adjustable size\n' +
 ' Export to file\n\n' +
 '{yellow-fg}Coming in Phase 10{/yellow-fg}'
 };

 // Handle list selection
 leftPanel.on('select', (item) => {
 const content = item.getText();
 rightPanel.setContent(descriptions[content] || 'No description available.');
 screen.render();
 });

 // Append all widgets
 screen.append(header);
 screen.append(leftPanel);
 screen.append(rightPanel);
 screen.append(footer);

 // Focus on the list
 leftPanel.focus();

 // Initial render
 tui.render();
 });
}

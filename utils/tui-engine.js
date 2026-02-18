import blessed from 'blessed';


export const themes = {
 default: {
 primary: '#61afef',
 secondary: '#c678dd',
 accent: '#98c379',
 background: '#282c34',
 foreground: '#abb2bf',
 border: '#4b5263',
 success: '#98c379',
 warning: '#e5c07b',
 error: '#e06c75'
 },
 dracula: {
 primary: '#bd93f9',
 secondary: '#ff79c6',
 accent: '#50fa7b',
 background: '#282a36',
 foreground: '#f8f8f2',
 border: '#6272a4',
 success: '#50fa7b',
 warning: '#f1fa8c',
 error: '#ff5555'
 },
 monokai: {
 primary: '#66d9ef',
 secondary: '#ae81ff',
 accent: '#a6e22e',
 background: '#272822',
 foreground: '#f8f8f2',
 border: '#75715e',
 success: '#a6e22e',
 warning: '#e6db74',
 error: '#f92672'
 }
};

export class TUIEngine {
 constructor(themeName = 'default') {
 this.currentTheme = themes[themeName] || themes.default;
 this.screen = blessed.screen({
 smartCSR: true,
 title: 'MyCLI',
 fullUnicode: true,
 dockBorders: true
 });

 // Enable mouse support
 this.screen.enableMouse();

 // Handle Ctrl+C and q for exit
 this.screen.key(['C-c', 'q'], () => {
 this.destroy();
 });
 }

 createBox(options = {}) {
 return blessed.box({
 border: 'line',
 style: {
 fg: this.currentTheme.foreground,
 bg: this.currentTheme.background,
 border: {
 fg: this.currentTheme.border
 }
 },
 ...options
 });
 }

 createList(options = {}) {
 return blessed.list({
 border: 'line',
 style: {
 fg: this.currentTheme.foreground,
 bg: this.currentTheme.background,
 selected: {
 bg: this.currentTheme.primary,
 fg: this.currentTheme.background
 },
 border: {
 fg: this.currentTheme.border
 }
 },
 keys: true,
 vi: true,
 mouse: true,
 ...options
 });
 }

 createTable(options = {}) {
 return blessed.table({
 border: 'line',
 style: {
 fg: this.currentTheme.foreground,
 bg: this.currentTheme.background,
 border: {
 fg: this.currentTheme.border
 },
 header: {
 fg: this.currentTheme.accent,
 bold: true
 },
 cell: {
 fg: this.currentTheme.foreground
 }
 },
 ...options
 });
 }

 createProgressBar(options = {}) {
 return blessed.progressbar({
 border: 'line',
 style: {
 fg: this.currentTheme.foreground,
 bg: this.currentTheme.background,
 bar: {
 bg: this.currentTheme.accent,
 fg: this.currentTheme.background
 },
 border: {
 fg: this.currentTheme.border
 }
 },
 ...options
 });
 }

 render() {
 this.screen.render();
 }

 destroy() {
 this.screen.destroy();
 process.exit(0);
 }

 getScreen() {
 return this.screen;
 }

 setTheme(themeName) {
 this.currentTheme = themes[themeName] || themes.default;
 }

 getTheme() {
 return this.currentTheme;
 }
}

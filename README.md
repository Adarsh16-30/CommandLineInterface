<h1 align="center">🤖 My CLI (CommandLineInterface)</h1>
<p align="center">
<b>A fully featured Node.js CLI toolkit for modern automation and developer workflows.</b>

<i>Uses Commander, Chalk, Inquirer, Axios, OpenAI, simple-git, and more.</i>
# MyCLI 🚀

**MyCLI** is a powerful Node.js toolkit designed to supercharge your terminal. It bundles 40+ essential developer tools into a single, cohesive interface — from system monitoring and DevOps utilities to productivity timers and AI-powered coding assistants.

> **Status:** Active Development  
> **Version:** 3.0.0

## ✨ Key Features

- **System Monitoring:** Real-time CPU, RAM, Network, and Disk usage dashboards (TUI).
- **Pro Developer Tools:** HTTP client, JSON viewer, Regex tester, Base64 encoder, and more.
- **Productivity:** Pomodoro timer, Notes manager, Todo list, and Clipboard manager.
- **DevOps:** SSH manager, Docker controller (TUI), and Deployment helpers (GitHub/Vercel/Netlify).
- **AI Integration:** Chat with AI, explain code, and generate comprehensive answers (via Hugging Face).
- **Customization:** Multiple themes (Dracula, Monokai) and configurable settings.

## 📦 Installation

```bash
npm install -g mycli
```

Or run it directly without installing:

```bash
npx mycli --help
```

## 🚀 Getting Started

Once installed, simply run `mycli` to see the available commands, or use `mycli help-all` for the complete reference.

```bash
mycli help-all
```

## 🛠️ Example Commands

### 🖥️ System & Monitoring
- **`mycli monitor`** — Launch the full-screen system dashboard.
- **`mycli process -s node`** — Find and manage running processes.
- **`mycli net speed`** — Run a quick internet speed test.
- **`mycli disk analyze`** — Visualize what's taking up space on your drive.

### 🛠️ Developer Utilities
- **`mycli http get https://api.github.com/users/google`** — Test APIs instantly.
- **`mycli json view data.json`** — View JSON files with syntax highlighting.
- **`mycli regex`** — Test regular expressions interactively.
- **`mycli utils uuid -n 5`** — Generate 5 random UUIDs.

### 🚀 DevOps & Deployment
- **`mycli ssh connect myserver`** — Connect to your saved SSH servers.
- **`mycli deploy static ./dist`** — Deploy a static site to GitHub Pages in one command.
- **`mycli docker ps`** — View active Docker containers.

### 🧠 AI & Productivity
- **`mycli ai ask "How do I reverse a string in Rust?"`** — Get coding answers instantly.
- **`mycli focus -w 25`** — Start a 25-minute focus timer.
- **`mycli notes new ideas`** — Jot down quick notes in markdown.
- **`mycli ticker crypto BTC`** — Check the price of Bitcoin.

## 📂 Project Structure

```
.
├── commands/       # 40+ command modules (one file per command)
├── utils/          # Shared helpers (TUI engine, config, colors)
├── tests/          # Integration tests
├── index.js        # Main CLI entry point
└── package.json    # Dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
CLI interfaces.
<p><b>If You Installed via npm (Globally):</b></p>
<ul>
<li><b>Recommended:</b> Create a <code>.env</code> file in your home directory.
<ul>
<li><b>Windows:</b> <code>C:\Users\your-username.env</code></li>
<li><b>Linux/Mac:</b> <code>/home/your-username/.env</code> or <code>~/.env</code></li>
</ul>
</li>
<li>This is picked up automatically by the CLI if you use <code>dotenv</code>.</li>
</ul>
<p><b>If You Cloned the Repository (Locally):</b></p>
<ul>
<li>Create a <code>.env</code> file in the root folder of the project.</li>
</ul>
<p><b>Example .env contents:</b></p>
<pre>
GITHUB_TOKEN=your_github_personal_token_here
HF_TOKEN=your_huggingface_token_here
ENCRYPTION_KEY=some-very-strong-random-string
</pre>
<ul>
<li><b>GITHUB_TOKEN:</b> Needed for GitHub integrations (repo, issues, etc.).</li>
<li><b>HF_TOKEN:</b> Required for Hugging Face AI integrations (text/code, etc.).</li>
<li><b>ENCRYPTION_KEY:</b> Used to securely encrypt/decrypt secrets via the CLI.</li>
</ul>
<p>Alternatively, you can set these variables directly in your terminal:</p>
<p><b>Linux/Mac:</b></p>
<pre>
export GITHUB_TOKEN=your_github_personal_token_here
export HF_TOKEN=your_huggingface_token_here
export ENCRYPTION_KEY=some-very-strong-random-string
</pre>
<p><b>Windows (CMD):</b></p>
<pre>
set GITHUB_TOKEN=your_github_personal_token_here
set HF_TOKEN=your_huggingface_token_here
set ENCRYPTION_KEY=some-very-strong-random-string
</pre>
<p><b>Important:</b> Keep your <code>.env</code> file private—never commit it to a public repository.</p>
<h3>🤖 Example Commands</h3>
<p>Explore <code>mycli --help</code> for all options and details.</p>
<ul>
<li><code>mycli greet</code> – Show a custom banner and welcome</li>
<li><code>mycli time</code> – Display the current time</li>
<li><code>mycli quote</code> – Get motivational quotes</li>
<li><code>mycli init</code> – Initialize new CLI configs/projects</li>
<li><code>mycli config</code> – Edit/view CLI config</li>
<li><code>mycli joke</code> – Print a random joke</li>
<li><code>mycli ai</code> – Ask AI for code help</li>
<li><code>mycli github</code> – Interact with GitHub</li>
<li><code>mycli todo</code> – Manage TODOs</li>
<li><code>mycli secret</code> – Encrypt/decrypt secrets</li>
<li><code>mycli lint</code> – JavaScript linting</li>
<li><code>mycli audit</code> – Security checks</li>
</ul>
<h3>📁 Project Folder Structure</h3>
<pre>
CommandLineInterface/
├── commands/            # Modular CLI command implementations
│   ├── greet.js
│   ├── time.js
│   └── ...other commands...
├── utils/               # Utilities (helpers, colors, etc.)
│   ├── colors.js
│   └── helpers.js
├── index.js             # Main entry point (registers CLI and commands)
├── package.json         # Project metadata & dependencies
├── .env                 # Required environment variables (not committed)
└── README.md            # This documentation
</pre>
<h3>🤝 Contributing</h3>
<p>Feel free to fork, submit PRs, or open issues for bugs/feature requests!</p>
<h3>📝 License</h3>
<p>This project is intended for educational purposes and personal learning only. Please use, modify, and share it to enhance your understanding of CLI tools and Node.js development.</p>
<p align="center"><b>Made by Adarsh</b></p>

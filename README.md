<h1 align="center">🤖 My CLI (CommandLineInterface)</h1>
<p align="center">
<b>A fully featured Node.js CLI toolkit for modern automation and developer workflows.</b>

<i>Uses Commander, Chalk, Inquirer, Axios, OpenAI, simple-git, and more.</i>
</p>
<hr>
<h3>🚀 Features</h3>
<ul>
<li><b>Extensible Commands:</b> Includes utilities for greet, time, quote, init, config, joke, file manipulation, git operations, server tools, updates, info, script runner, AI code explanations (Hugging Face/OpenAI), Docker management, GitHub integration, todo lists, secret management, linting, audits, theming, and more.</li>
<li><b>Modular Structure:</b> All commands are organized in the <code>commands/</code> folder.</li>
<li><b>Beautiful Output:</b> Uses <code>chalk</code> and <code>figlet</code> for colorful banners and stylish CLI interfaces.</li>
<li><b>Configurable & Secure:</b> Supports <code>.env</code> and custom config file management for tokens and secrets.</li>
<li><b>Modern Toolkit:</b> Built with Commander, Chalk, Inquirer, Axios, HuggingFace API, OpenAI, simple-git, express, and ora spinners.</li>
</ul>
<h3>🛠️ Getting Started</h3>
<h4>Option 1: Install from npm (Recommended)</h4>
<p>This makes <code>mycli</code> available globally:</p>
<pre>
npm install -g @adarsht0912/mycli
</pre>
<h4>Option 2: Clone This Repository</h4>
<pre>
git clone https://github.com/Adarsh16-30/CommandLineInterface.git
cd CommandLineInterface
npm install
</pre>
<p>(Optional) To make the command available globally from the cloned folder:</p>
<pre>
npm link
</pre>
<h4>Environment Setup (.env)</h4>
<p>Before using advanced features (like AI or GitHub integration), create a <code>.env</code> file in your project root:</p>
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

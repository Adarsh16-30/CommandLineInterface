import { test } from 'node:test';
import assert from 'node:assert';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// ===== Core CLI Tests =====
test('CLI should display version', async () => {
    const { stdout } = await execAsync('node index.js --version');
    assert.match(stdout, /\d+\.\d+\.\d+/);
});

test('CLI should display help', async () => {
    const { stdout } = await execAsync('node index.js --help');
    assert.match(stdout, /Usage:/);
});

// ===== Legacy/Original Commands (13 tests) =====
test('Greet command should work', async () => {
    const { stdout } = await execAsync('node index.js greet --help');
    assert.ok(stdout.includes('greet') || stdout.includes('name'));
});

test('Time command should exist', async () => {
    const { stdout } = await execAsync('node index.js time --help');
    assert.ok(stdout.includes('time') || stdout.includes('Show'));
});

test('Quote command should exist', async () => {
    const { stdout } = await execAsync('node index.js quote --help');
    assert.ok(stdout.includes('quote') || stdout.includes('motivational'));
});


test('Config command should exist', async () => {
    const { stdout } = await execAsync('node index.js config --help');
    assert.ok(stdout.includes('config') || stdout.includes('Manage'));
});

test('Joke command should exist', async () => {
    const { stdout } = await execAsync('node index.js joke --help');
    assert.ok(stdout.includes('joke') || stdout.includes('random'));
});

test('File command should exist', async () => {
    const { stdout } = await execAsync('node index.js file --help');
    assert.ok(stdout.includes('file') || stdout.includes('operations'));
});

test('Git command should exist', async () => {
    const { stdout } = await execAsync('node index.js git --help');
    assert.ok(stdout.includes('git') || stdout.includes('status'));
});

test('Serve command should exist', async () => {
    const { stdout } = await execAsync('node index.js serve --help');
    assert.ok(stdout.includes('serve') || stdout.includes('server'));
});


test('Info command should exist', async () => {
    const { stdout } = await execAsync('node index.js info --help');
    assert.ok(stdout.includes('info') || stdout.includes('system'));
});

test('Run command should exist', async () => {
    const { stdout } = await execAsync('node index.js run --help');
    assert.ok(stdout.includes('run') || stdout.includes('script'));
});

test('AI command should exist', async () => {
    const { stdout } = await execAsync('node index.js ai --help');
    assert.ok(stdout.includes('ai') || stdout.includes('Explain'));
});


test('GitHub command should exist', async () => {
    const { stdout } = await execAsync('node index.js gh --help');
    assert.ok(stdout.includes('GitHub') || stdout.includes('create-repo'));
});

test('Todo command should exist', async () => {
    const { stdout } = await execAsync('node index.js todo --help');
    assert.ok(stdout.includes('todo') || stdout.includes('add'));
});

test('Secret command should exist', async () => {
    const { stdout } = await execAsync('node index.js secret --help');
    assert.ok(stdout.includes('secret') || stdout.includes('Encrypt'));
});

test('Lint command should exist', async () => {
    const { stdout } = await execAsync('node index.js lint --help');
    assert.ok(stdout.includes('lint') || stdout.includes('eslint'));
});

test('Audit command should exist', async () => {
    const { stdout } = await execAsync('node index.js audit --help');
    assert.ok(stdout.includes('audit') || stdout.includes('npm'));
});

test('Open command should exist', async () => {
    const { stdout } = await execAsync('node index.js open --help');
    assert.ok(stdout.includes('open') || stdout.includes('website'));
});

test('Theme command should exist', async () => {
    const { stdout } = await execAsync('node index.js theme --help');
    assert.ok(stdout.includes('theme') || stdout.includes('terminal'));
});

// ===== Phase 1: TUI (1 test) =====
test('TUI demo should show available themes', async () => {
    const { stdout } = await execAsync('node index.js demo --help');
    assert.ok(stdout.includes('theme'));
});

// ===== Phase 2: System Tools (4 tests) =====
test('Monitor command should exist', async () => {
    const { stdout } = await execAsync('node index.js monitor --help');
    assert.ok(stdout.includes('monitor') || stdout.includes('System'));
});

test('Process command should exist', async () => {
    const { stdout } = await execAsync('node index.js process --help');
    assert.ok(stdout.includes('process') || stdout.includes('Interactive'));
});

test('Network info command should exist', async () => {
    const { stdout } = await execAsync('node index.js net --help');
    assert.ok(stdout.includes('ip') || stdout.includes('Network'));
});

test('Disk command should have analyze option', async () => {
    const { stdout } = await execAsync('node index.js disk --help');
    assert.ok(stdout.includes('analyze'));
});

// ===== Phase 3: Developer Utilities (4 tests) =====
test('HTTP command should support GET method', async () => {
    const { stdout } = await execAsync('node index.js http --help');
    assert.ok(stdout.includes('get'));
});

test('JSON tools should have validate command', async () => {
    const { stdout } = await execAsync('node index.js json --help');
    assert.ok(stdout.includes('validate'));
});

test('Utils hash should generate SHA256', async () => {
    const { stdout } = await execAsync('node index.js utils hash sha256 "test"');
    assert.ok(stdout.includes('SHA256 Hash'));
});

test('Utils should support encoding', async () => {
    const { stdout } = await execAsync('node index.js utils encode base64 "hello"');
    assert.ok(stdout.includes('aGVsbG8='));
});

test('Utils UUID should generate valid UUIDs', async () => {
    const { stdout } = await execAsync('node index.js utils uuid -n 1');
    assert.match(stdout, /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
});

test('Regex command should exist', async () => {
    const { stdout } = await execAsync('node index.js regex --help');
    assert.ok(stdout.includes('regex') || stdout.includes('pattern'));
});

// ===== Phase 4: DevOps (3 tests) =====
test('Docker command should have ps subcommand', async () => {
    const { stdout } = await execAsync('node index.js docker --help');
    assert.ok(stdout.includes('ps'));
});

test('SSH command should support add operation', async () => {
    const { stdout } = await execAsync('node index.js ssh --help');
    assert.ok(stdout.includes('add'));
});

test('Deploy command should show info', async () => {
    const { stdout } = await execAsync('node index.js deploy info');
    assert.ok(stdout.includes('Git') || stdout.includes('Deployment'));
});

// ===== Phase 5: Productivity (4 tests) =====
test('Focus timer should have configurable options', async () => {
    const { stdout } = await execAsync('node index.js focus --help');
    assert.ok(stdout.includes('work') || stdout.includes('break'));
});

test('Notes command should support list operation', async () => {
    const { stdout } = await execAsync('node index.js notes --help');
    assert.ok(stdout.includes('list'));
});

test('Password generator should create passwords', async () => {
    const { stdout } = await execAsync('node index.js password gen -l 12 -n 1');
    assert.ok(stdout.includes('Generated Passwords'));
});

test('Password analyzer should check strength', async () => {
    const { stdout } = await execAsync('node index.js password analyze "Test123!"');
    assert.ok(stdout.includes('Strength') || stdout.includes('Score'));
});

test('Ticker command should support crypto lookup', async () => {
    const { stdout } = await execAsync('node index.js ticker --help');
    assert.ok(stdout.includes('crypto'));
});

// ===== Phase 6: Core Features (3 tests) =====
test('Clipboard should support copy operation', async () => {
    const { stdout } = await execAsync('node index.js clip copy "test"');
    assert.ok(stdout.includes('Copied') || stdout.includes('clipboard'));
});

test('Scaffold should list templates', async () => {
    const { stdout } = await execAsync('node index.js scaffold list');
    assert.ok(stdout.includes('node-express'));
    assert.ok(stdout.includes('react-vite'));
});

test('Self-update should check for updates', async () => {
    const { stdout } = await execAsync('node index.js selfupdate --check');
    assert.ok(stdout.includes('version') || stdout.includes('Update'));
});

// ===== Phase 7: Distribution (1 test) =====
test('Build command should exist', async () => {
    const { stdout } = await execAsync('node index.js build --help');
    assert.ok(stdout.includes('target') || stdout.includes('Build'));
});

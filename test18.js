import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function test() {
    const dir = path.join(__dirname, 'commands');
    const files = fs.readdirSync(dir);
    for (const f of files) {
        if (!f.endsWith('.js')) continue;
        try {
            const fileUrl = pathToFileURL(path.join(dir, f)).href;
            await import(fileUrl);
            console.log('OK:', f);
        } catch (e) {
            console.error('FAIL:', f, e.message);
        }
    }
}
test();

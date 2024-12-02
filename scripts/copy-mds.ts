import fs from 'fs-extra';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { consola } from 'consola';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

fs.copyFileSync(path.resolve(__dirname, '../README.md'), path.resolve(__dirname, '../packages/core/README.md'));
consola.success('📄 README.md copied to packages/core');

fs.copyFileSync(path.resolve(__dirname, '../LICENSE'), path.resolve(__dirname, '../packages/core/LICENSE'));
consola.success('📄 LICENSE copied to packages/core');

fs.copyFileSync(path.resolve(__dirname, '../packages/core/CHANGELOG.md'), path.resolve(__dirname, '../CHANGELOG.md'));
consola.success('📄 CHANGELOG.md copied to root');

import { version } from '../packages/core/package.json';
import fs from 'fs';

fs.writeFileSync('version.output.txt', `v${version}`);

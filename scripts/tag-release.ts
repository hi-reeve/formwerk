import { version } from '../packages/core/package.json';
import { execSync } from 'node:child_process';
import { consola } from 'consola';

try {
  consola.info(`🔖 Tagging release v${version}`);
  execSync(`git tag v${version}`);
  consola.success(`✅ Tagged release v${version}`);
} catch (error) {
  consola.error(`❌ Failed to tag release v${version}`);
  consola.error(error);
  process.exit(1);
}

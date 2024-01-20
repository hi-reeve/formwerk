import fs from 'fs-extra';
import { filesize } from 'filesize';
import { gzipSizeSync } from 'gzip-size';

function reportSize({ path, code }) {
  const { size } = fs.statSync(path);
  const gzipped = gzipSizeSync(code);

  return `size: ${filesize(size)} | gzipped: ${filesize(gzipped)}`;
}

export { reportSize };

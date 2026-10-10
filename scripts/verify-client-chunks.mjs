import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const chunkDirectory = path.resolve('dist/client/_astro');
const maximumChunkBytes = 500 * 1024;

let entries;
try {
  entries = await readdir(chunkDirectory, { withFileTypes: true });
} catch (error) {
  if (error?.code === 'ENOENT') {
    console.error('Client chunk verification requires a completed production build. Run npm run build first.');
    process.exit(1);
  }
  throw error;
}

const chunks = await Promise.all(
  entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
    .map(async (entry) => {
      const filePath = path.join(chunkDirectory, entry.name);
      const fileStat = await stat(filePath);
      return { name: entry.name, bytes: fileStat.size };
    }),
);

chunks.sort((left, right) => right.bytes - left.bytes);
const oversizedChunks = chunks.filter((chunk) => chunk.bytes > maximumChunkBytes);
const legacyHtml2pdfChunks = chunks.filter((chunk) => chunk.name.startsWith('html2pdf.'));

for (const chunk of chunks.slice(0, 5)) {
  console.log(`${chunk.name}: ${(chunk.bytes / 1024).toFixed(1)} KiB`);
}

if (legacyHtml2pdfChunks.length > 0) {
  console.error('Legacy html2pdf.js output remains in the client build.');
  process.exitCode = 1;
}

if (oversizedChunks.length > 0) {
  console.error(`Client JavaScript chunks must not exceed ${maximumChunkBytes / 1024} KiB:`);
  for (const chunk of oversizedChunks) {
    console.error(`- ${chunk.name}: ${(chunk.bytes / 1024).toFixed(1)} KiB`);
  }
  process.exitCode = 1;
}

if (!process.exitCode) {
  console.log(`Client chunk budget passed: ${chunks.length} JavaScript chunks are at or below 500 KiB.`);
}

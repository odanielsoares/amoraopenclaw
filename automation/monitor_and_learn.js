const fs = require('fs');
const path = require('path');

const watchedPath = process.cwd();

async function scanDirRecursively(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      console.log(`Scanning dir: ${fullPath}`);
      await scanDirRecursively(fullPath);
    } else {
      // Only consider certain file types
      if (['.md', '.txt', '.json', '.js', '.ts', '.excalidraw', '.pdf'].includes(path.extname(fullPath))) {
        console.log(`Found file: ${fullPath}`);
        // TODO: process file (learn, parse, summarize...)
      }
    }
  }
}

async function monitorLoop() {
  while (true) {
    await scanDirRecursively(watchedPath);
    console.log('Scan complete; sleeping for 5 min');
    await new Promise(r => setTimeout(r, 5 * 60 * 1000));
  }
}

monitorLoop();

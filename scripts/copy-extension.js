#!/usr/bin/env node

/**
 * Cross-platform script to copy built files to extension directory
 * Replaces platform-specific shell commands like cp
 */

import { copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const distDir = join(projectRoot, 'dist');
const extensionDir = join(projectRoot, 'extension');

// Files to copy
const filesToCopy = [
  'fbacc-plugin.min.js',
  'fbacc-plugin.min.js.map'
];

console.log('Copying built files to extension directory...');

let copiedCount = 0;
let errorCount = 0;

filesToCopy.forEach(file => {
  const sourcePath = join(distDir, file);
  const destPath = join(extensionDir, file);

  try {
    if (existsSync(sourcePath)) {
      copyFileSync(sourcePath, destPath);
      console.log(`✓ Copied ${file}`);
      copiedCount++;
    } else {
      console.warn(`⚠ Warning: ${file} not found in dist directory`);
    }
  } catch (error) {
    console.error(`✗ Error copying ${file}: ${error.message}`);
    errorCount++;
  }
});

console.log(`\nCopy complete: ${copiedCount} files copied, ${errorCount} errors`);

if (errorCount > 0) {
  process.exit(1);
}

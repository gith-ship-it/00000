#!/usr/bin/env node

/**
 * Simple icon generator for the Facebook Ads Manager Plugin
 * Creates basic placeholder icons using data URIs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const extensionDir = join(__dirname, '..', 'extension', 'icons');

// Ensure icons directory exists
try {
  mkdirSync(extensionDir, { recursive: true });
} catch (err) {
  // Directory already exists
}

// Function to create a simple SVG icon
function createSVGIcon(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.45}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">FB</text>
</svg>`;
}

// Sizes to generate
const sizes = [16, 32, 48, 128];

console.log('Generating placeholder icons...');

sizes.forEach(size => {
  const svg = createSVGIcon(size);
  const filename = `icon${size}.svg`;
  const filepath = join(extensionDir, filename);

  writeFileSync(filepath, svg);
  console.log(`✓ Created ${filename}`);
});

console.log('\nPlaceholder SVG icons created successfully!');
console.log('Note: Modern browsers support SVG icons in extensions.');
console.log('If you need PNG icons, you can convert these SVGs using online tools like:');
console.log('- https://cloudconvert.com/svg-to-png');
console.log('- https://convertio.co/svg-png/');
console.log('\nOr update manifest.json to use .svg extensions instead of .png');

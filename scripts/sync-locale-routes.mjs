import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

// Remove any URL-encoded duplicate directory created by file tools
const encodedDir = path.join(root, 'app', '%5Blocale%5D');
if (fs.existsSync(encodedDir)) {
  fs.rmSync(encodedDir, { recursive: true, force: true });
}

const localeDir = path.join(root, 'app', '[locale]');
const copies = [
  ['src/routes/layout.tsx', path.join(localeDir, 'layout.tsx')],
  ['src/routes/page.tsx', path.join(localeDir, 'page.tsx')],
  ['src/routes/opengraph-image.tsx', path.join(localeDir, 'opengraph-image.tsx')],
  ['src/routes/research-page.tsx', path.join(localeDir, 'research', 'page.tsx')],
  ['src/routes/projects-page.tsx', path.join(localeDir, 'projects', 'page.tsx')],
  ['src/routes/cv-page.tsx', path.join(localeDir, 'cv', 'page.tsx')],
];

for (const [srcRel, destAbs] of copies) {
  const srcAbs = path.join(root, srcRel);
  if (fs.existsSync(srcAbs)) {
    fs.mkdirSync(path.dirname(destAbs), { recursive: true });
    fs.copyFileSync(srcAbs, destAbs);
  }
}

console.log('Synced src/routes/* -> app/[locale]/* and cleaned any %5Blocale%5D folder.');

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET_DIRS = ['src', 'app', '.next/static/css'];
const FORBIDDEN_WORD = 'gradient';

function walkDir(dirPath, results = []) {
  if (!fs.existsSync(dirPath)) return results;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, results);
    } else if (
      entry.isFile() &&
      /\.(ts|tsx|js|jsx|mjs|css|svg)$/i.test(entry.name)
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

let violations = [];

for (const relDir of TARGET_DIRS) {
  const absDir = path.join(ROOT, relDir);
  const files = walkDir(absDir);
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.toLowerCase().includes(FORBIDDEN_WORD)) {
        violations.push({
          file: path.relative(ROOT, file),
          line: idx + 1,
          snippet: line.trim().slice(0, 120),
        });
      }
    });
  }
}

if (violations.length > 0) {
  console.error('ERROR: Hard ban violated — found forbidden word in source or CSS output:');
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line} -> ${v.snippet}`);
  }
  process.exit(1);
} else {
  console.log('✓ No-gradient check passed across src/, app/, and CSS output.');
}

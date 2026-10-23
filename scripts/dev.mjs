import { spawn } from 'node:child_process';
import path from 'node:path';
import './sync-locale-routes.mjs';

// Parse --port / -p and --host / --hostname / -H passed by the host environment or CLI
const args = process.argv.slice(2);
let port = process.env.PORT || '3000';
let host = '0.0.0.0';

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if ((arg === '--port' || arg === '-p') && args[i + 1]) {
    port = args[i + 1];
    i++;
  } else if (
    (arg === '--host' || arg === '--hostname' || arg === '-H') &&
    args[i + 1]
  ) {
    host = args[i + 1];
    i++;
  }
}

const nextBin = path.join(process.cwd(), 'node_modules', '.bin', 'next');
const child = spawn(nextBin, ['dev', '-p', String(port), '-H', String(host)], {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    child.kill(sig);
  });
}

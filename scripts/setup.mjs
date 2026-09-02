#!/usr/bin/env node
/**
 * One-command project setup:
 *   1. create .env from .env.example (if missing)
 *   2. install dependencies
 *   3. start the PostgreSQL container (when Docker is available)
 *   4. create the database schema and seed the demo account
 *
 * Database steps are best effort: if no database is reachable the script
 * prints a hint and finishes successfully, so `npm run dev` still serves the
 * frontend pages.
 */
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function run(command, args, { optional = false } = {}) {
  console.log(`\n> ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', shell: false });
  const ok = result.status === 0;
  if (!ok && !optional) {
    process.exit(result.status ?? 1);
  }
  return ok;
}

function hasDocker() {
  const result = spawnSync('docker', ['compose', 'version'], { cwd: root, stdio: 'ignore' });
  return result.status === 0;
}

// 1. Environment file
const envFile = join(root, '.env');
if (existsSync(envFile)) {
  console.log('.env already exists, keeping it as is.');
} else {
  copyFileSync(join(root, '.env.example'), envFile);
  console.log('Created .env from .env.example.');
}

// 2. Dependencies
run('npm', ['install']);

// 3. Database container (optional)
if (hasDocker()) {
  run('docker', ['compose', 'up', '-d'], { optional: true });
} else {
  console.log('\nDocker not found, skipping the PostgreSQL container.');
}

// 4. Schema + demo data (retried a few times while the database boots)
let pushed = false;
for (let attempt = 1; attempt <= 5 && !pushed; attempt += 1) {
  pushed = run('npx', ['prisma', 'db', 'push'], { optional: true });
  if (!pushed && attempt < 5) {
    console.log(`Database not ready yet, retrying (${attempt}/5)...`);
    spawnSync(process.execPath, ['-e', 'setTimeout(() => {}, 3000)']);
  }
}
const seeded = pushed && run('npx', ['prisma', 'db', 'seed'], { optional: true });

if (seeded) {
  console.log('\nSetup complete. Start the app with: npm run dev');
} else {
  console.log(
    '\nSetup finished without a database. The frontend pages still work with `npm run dev`.\n' +
      'Start PostgreSQL (e.g. `docker compose up -d`) or set DATABASE_URL in .env, then run `npm run setup` again.'
  );
}

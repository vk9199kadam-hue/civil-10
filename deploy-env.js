import fs from 'fs';
import { spawnSync } from 'child_process';

// 1. Read .env.local
if (!fs.existsSync('.env.local')) {
  console.error('Error: .env.local file not found.');
  process.exit(1);
}

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};

for (const line of envFile.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const index = trimmed.indexOf('=');
  if (index === -1) continue;
  const key = trimmed.slice(0, index).trim();
  const val = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, '');
  env[key] = val;
}

console.log('Found environment variables:', Object.keys(env));

// 2. Deploy each VITE_ variable to Vercel
for (const [key, val] of Object.entries(env)) {
  if (!key.startsWith('VITE_')) continue;
  
  console.log(`\n--------------------------------------------`);
  console.log(`Processing: ${key}`);
  console.log(`--------------------------------------------`);

  // Remove existing variable (if any) to prevent duplication/conflict
  console.log(`Removing existing ${key} on Vercel production...`);
  spawnSync('npx', ['vercel', 'env', 'rm', key, 'production', '-y'], { stdio: 'ignore', shell: true });

  // Add the variable
  console.log(`Adding ${key} to Vercel production...`);
  const child = spawnSync('npx', ['vercel', 'env', 'add', key, 'production'], {
    input: val,
    encoding: 'utf8',
    shell: true
  });
  
  console.log(child.stdout || 'Done.');
  if (child.status !== 0) {
    console.error(`Failed to add ${key}:`, child.stderr);
  }
}

console.log('\n============================================');
console.log('All environment variables uploaded to Vercel!');
console.log('============================================\n');

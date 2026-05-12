#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const REQUIRED_KEYS = [
  'ADMIN_APP_URL',
  'ADMIN_LOGIN_URL',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'RESEND_FROM_NAME',
];

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  const contents = readFileSync(filePath, 'utf8');
  const env = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const equalsIndex = line.indexOf('=');
    if (equalsIndex === -1) continue;

    const key = line.slice(0, equalsIndex).trim();
    let value = line.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function firstNonEmpty(...values) {
  return values.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim() ?? '';
}

function loadSecrets() {
  const localEnvPath = resolve(process.cwd(), '.env.local');
  const exampleEnvPath = resolve(process.cwd(), '.env.example');
  const localEnv = parseEnvFile(localEnvPath);
  const exampleEnv = parseEnvFile(exampleEnvPath);

  const combined = {};
  for (const key of REQUIRED_KEYS) {
    combined[key] = firstNonEmpty(process.env[key], localEnv[key], exampleEnv[key]);
  }

  const missing = REQUIRED_KEYS.filter((key) => !combined[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required values: ${missing.join(', ')}. Set them in .env.local or export them before running.`);
  }

  return combined;
}

function main() {
  const projectRef = process.env.SUPABASE_PROJECT_REF || process.env.SUPABASE_REF;
  if (!projectRef) {
    throw new Error('Missing SUPABASE_PROJECT_REF. Export it before running the script.');
  }

  const secrets = loadSecrets();
  const args = ['secrets', 'set'];

  for (const key of REQUIRED_KEYS) {
    args.push(`${key}=${secrets[key]}`);
  }

  args.push('--project-ref', projectRef);

  const result = spawnSync('supabase', args, {
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(message);
  process.exit(1);
}

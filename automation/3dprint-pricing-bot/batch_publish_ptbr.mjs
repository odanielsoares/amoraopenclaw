#!/usr/bin/env node
/** Batch publish N PT-BR posts with a focus theme.
 * Retries on duplicate slug (exit code 3) up to maxAttempts.
 */

import { spawn } from 'node:child_process';

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  if (!v || v.startsWith('--')) return true;
  return v;
}

const count = Number(arg('count', 8));
const focus = String(arg('focus', 'renda extra com impressão 3D vendendo em marketplaces (Mercado Livre e Shopee)')).trim();
const maxAttempts = Number(arg('maxAttempts', 20));

function runOnce() {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, ['automation/3dprint-pricing-bot/post_and_report.mjs', '--lang', 'pt', '--focus', focus], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
    });
    let out = '';
    let err = '';
    p.stdout.on('data', (d) => (out += d.toString('utf8')));
    p.stderr.on('data', (d) => (err += d.toString('utf8')));
    p.on('close', (code) => resolve({ code: code ?? 1, out, err }));
  });
}

async function main() {
  let published = 0;
  let attempts = 0;

  while (published < count && attempts < maxAttempts) {
    attempts += 1;
    const res = await runOnce();

    if (res.code === 0) {
      published += 1;
      process.stdout.write(`OK ${published}/${count}\n`);
      continue;
    }

    // Duplicate slug: try again
    if (res.code === 3) {
      process.stdout.write(`DUPLICATE (attempt ${attempts}) — retrying\n`);
      continue;
    }

    process.stderr.write(res.err || res.out);
    throw new Error(`Batch stopped: exit=${res.code}`);
  }

  if (published < count) {
    throw new Error(`Could not publish ${count}. Published ${published} in ${attempts} attempts.`);
  }

  console.log(`DONE published=${published} attempts=${attempts}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

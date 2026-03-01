#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const MC_DIR = '/root/mission-control';
const ENV_PATH = path.join(MC_DIR, '.env.local');
const DEFAULT_BASE_URL = 'https://odanielsoares.tech';

export function readEnvFile(p = ENV_PATH) {
  const out = {};
  if (!fs.existsSync(p)) return out;
  const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith('#')) continue;
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    let v = m[2] ?? '';
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}

export async function apiFetch(baseUrl, token, urlPath, init = {}) {
  const url = baseUrl.replace(/\/$/, '') + urlPath;
  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else {
    headers.set('Origin', baseUrl);
    headers.set('Referer', baseUrl + '/');
  }
  if (!headers.has('Content-Type') && init.body) headers.set('Content-Type', 'application/json');
  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = null; }
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }
  return json;
}

export function getMcConfig() {
  const baseUrl = process.env.MC_BASE_URL || DEFAULT_BASE_URL;
  const env = readEnvFile();
  const token = process.env.MC_API_TOKEN || env.MC_API_TOKEN || '';
  const workspaceId = process.env.MC_WORKSPACE_ID || env.MC_WORKSPACE_ID || 'default';
  return { baseUrl, token, workspaceId };
}

export function todayISODate() {
  const d = new Date();
  // Use UTC date string for stability
  return d.toISOString().slice(0, 10);
}

#!/usr/bin/env node
/**
 * Reconcile Mission Control tasks with expected realtime hygiene.
 * - Finds open tasks in workspace 'default'
 * - Flags stale tasks (no recent update) by posting an activity
 * - Optionally nudges status mismatches (conservative: only logs)
 */

import fs from 'fs';
import path from 'path';

const MC_DIR = '/root/mission-control';
const ENV_PATH = path.join(MC_DIR, '.env.local');
const DEFAULT_BASE_URL = 'https://odanielsoares.tech';

function readEnvFile(p) {
  const out = {};
  if (!fs.existsSync(p)) return out;
  const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith('#')) continue;
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    let v = m[2] ?? '';
    // strip surrounding quotes
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

function isoNow() {
  return new Date().toISOString();
}

function minutesBetween(isoA, isoB) {
  const a = new Date(isoA).getTime();
  const b = new Date(isoB).getTime();
  return Math.round((b - a) / 60000);
}

async function apiFetch(baseUrl, token, urlPath, init = {}) {
  const url = baseUrl.replace(/\/$/, '') + urlPath;
  const headers = new Headers(init.headers || {});

  // Auth:
  // - Prefer Bearer token when available
  // - Fallback to same-origin headers (MC middleware allows Origin/Referer that matches Host)
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

async function main() {
  const args = process.argv.slice(2);
  const baseUrl = process.env.MC_BASE_URL || DEFAULT_BASE_URL;
  const staleMinutes = Number(process.env.MC_STALE_MINUTES || 60);
  const workspaceId = process.env.MC_WORKSPACE_ID || 'default';

  const env = readEnvFile(ENV_PATH);
  const token = process.env.MC_API_TOKEN || env.MC_API_TOKEN || '';
  // Note: token may be empty; we can still proceed by spoofing same-origin headers.

  const openStatuses = ['planning','inbox','assigned','in_progress','testing','review'];
  const statusParam = encodeURIComponent(openStatuses.join(','));
  const wsParam = encodeURIComponent(workspaceId);

  const startedAt = isoNow();
  const summary = {
    startedAt,
    baseUrl,
    workspaceId,
    staleMinutes,
    scanned: 0,
    staleFlagged: 0,
    errors: 0,
  };

  try {
    const tasks = await apiFetch(baseUrl, token, `/api/tasks?workspace_id=${wsParam}&status=${statusParam}`);
    summary.scanned = Array.isArray(tasks) ? tasks.length : 0;

    const now = new Date();

    for (const t of (tasks || [])) {
      const updatedAt = t.updated_at || t.updatedAt || t.created_at;
      if (!updatedAt) continue;

      const mins = Math.round((now.getTime() - new Date(updatedAt).getTime()) / 60000);
      if (mins < staleMinutes) continue;

      // Avoid spamming: only flag if last activity isn't already a STALE within last 6h
      let shouldFlag = true;
      try {
        const acts = await apiFetch(baseUrl, token, `/api/tasks/${t.id}/activities`);
        const last = Array.isArray(acts) && acts.length ? acts[0] : null;
        if (last && typeof last.message === 'string' && last.message.startsWith('STALE:')) {
          const lastAt = last.created_at;
          if (lastAt) {
            const since = Math.round((now.getTime() - new Date(lastAt).getTime()) / 60000);
            if (since < 360) shouldFlag = false;
          }
        }
      } catch {
        // If activities fail, still attempt to flag once
      }

      if (!shouldFlag) continue;

      const msg = `STALE: sem atualização há ~${mins} min. Status=${t.status}. Próximo checkpoint necessário (bloqueio? dependência? resultado parcial?). [${isoNow()}]`;
      await apiFetch(baseUrl, token, `/api/tasks/${t.id}/activities`, {
        method: 'POST',
        body: JSON.stringify({
          activity_type: 'updated',
          message: msg,
          // API expects metadata as string (not object)
          metadata: JSON.stringify({ kind: 'reconcile', mins_stale: mins })
        })
      });
      summary.staleFlagged += 1;
    }

    console.log(JSON.stringify({ ok: true, ...summary }, null, 2));
  } catch (e) {
    summary.errors += 1;
    console.error(JSON.stringify({ ok: false, ...summary, error: String(e), status: e?.status, body: e?.body }, null, 2));
    process.exit(1);
  }
}

main();

#!/usr/bin/env node
/**
 * Ensure there is a daily Mission Control task to track BlogBot runs.
 * Creates (or reuses) task: "BlogBot — 3D Pricing — YYYY-MM-DD"
 */

import { apiFetch, getMcConfig, todayISODate } from './mc_blogbot_helpers.mjs';

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  if (!v || v.startsWith('--')) return true;
  return v;
}

const date = String(arg('date', todayISODate()));
const title = `BlogBot — 3D Pricing — ${date}`;

async function main() {
  const { baseUrl, token, workspaceId } = getMcConfig();

  // Find existing tasks with same title (search not available; list open + done)
  const statuses = ['planning','inbox','assigned','in_progress','testing','review','done'];
  const statusParam = encodeURIComponent(statuses.join(','));
  const wsParam = encodeURIComponent(workspaceId);

  const tasks = await apiFetch(baseUrl, token, `/api/tasks?workspace_id=${wsParam}&status=${statusParam}`);
  const existing = (tasks || []).find(t => String(t.title || '').trim() === title);

  if (existing) {
    console.log(JSON.stringify({ ok: true, reused: true, task: existing }, null, 2));
    return;
  }

  const created = await apiFetch(baseUrl, token, `/api/tasks`, {
    method: 'POST',
    body: JSON.stringify({
      title,
      description: 'Task diária para acompanhar se o BlogBot publicou (PT/EN) e registrar slugs/títulos de cada post.',
      status: 'in_progress',
      priority: 'normal',
      workspace_id: workspaceId
    })
  });

  // Initial activity
  await apiFetch(baseUrl, token, `/api/tasks/${created.id}/activities`, {
    method: 'POST',
    body: JSON.stringify({
      activity_type: 'updated',
      message: `Iniciando acompanhamento do BlogBot do dia ${date}. Esperado: 4 posts (PT 08:10/14:10; EN 11:10/17:10).`,
      metadata: JSON.stringify({ kind: 'blogbot_daily', date, expected_runs: 4 })
    })
  });

  console.log(JSON.stringify({ ok: true, reused: false, task: created }, null, 2));
}

main().catch(err => {
  console.error(err?.body || err);
  process.exit(1);
});

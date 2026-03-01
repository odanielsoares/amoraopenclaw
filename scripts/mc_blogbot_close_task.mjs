#!/usr/bin/env node
/** Close today's BlogBot daily task in Mission Control (set status=done).
 * Adds a final activity with quick summary.
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

async function main() {
  const { baseUrl, token, workspaceId } = getMcConfig();
  const title = `BlogBot — 3D Pricing — ${date}`;

  const statuses = ['planning','inbox','assigned','in_progress','testing','review','done'];
  const statusParam = encodeURIComponent(statuses.join(','));
  const wsParam = encodeURIComponent(workspaceId);
  const tasks = await apiFetch(baseUrl, token, `/api/tasks?workspace_id=${wsParam}&status=${statusParam}`);
  const task = (tasks || []).find(t => String(t.title || '').trim() === title);

  if (!task) {
    console.log(JSON.stringify({ ok: true, skipped: true, reason: 'task_not_found', title }, null, 2));
    return;
  }

  const acts = await apiFetch(baseUrl, token, `/api/tasks/${task.id}/activities`).catch(() => []);
  const publishedCount = Array.isArray(acts)
    ? acts.filter(a => a.activity_type === 'completed' && typeof a.message === 'string' && a.message.startsWith('Publicado')).length
    : 0;
  const failures = Array.isArray(acts)
    ? acts.filter(a => a.activity_type === 'updated' && typeof a.message === 'string' && a.message.startsWith('FALHA')).length
    : 0;

  await apiFetch(baseUrl, token, `/api/tasks/${task.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'done' })
  });

  await apiFetch(baseUrl, token, `/api/tasks/${task.id}/activities`, {
    method: 'POST',
    body: JSON.stringify({
      activity_type: 'completed',
      message: `Fechamento do dia ${date}: ${publishedCount} publicados, ${failures} falhas (ver activities).`,
    })
  });

  console.log(JSON.stringify({ ok: true, closed: true, taskId: task.id, publishedCount, failures }, null, 2));
}

main().catch(err => {
  console.error(err?.body || err);
  process.exit(1);
});

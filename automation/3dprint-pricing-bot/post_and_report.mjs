#!/usr/bin/env node
/**
 * Wrapper: publish a blog post (run.mjs) then report result into Mission Control.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { apiFetch, getMcConfig, todayISODate } from '../../scripts/mc_blogbot_helpers.mjs';

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  if (!v || v.startsWith('--')) return true;
  return v;
}

const lang = String(arg('lang', 'pt')).toLowerCase();
const focus = String(arg('focus', '')).trim();
const date = todayISODate();

function runNodeScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [scriptPath, ...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
    });
    let out = '';
    let err = '';
    p.stdout.on('data', (d) => (out += d.toString('utf8')));
    p.stderr.on('data', (d) => (err += d.toString('utf8')));
    p.on('error', reject);
    p.on('close', (code) => {
      resolve({ code, out, err });
    });
  });
}

async function ensureDailyTask() {
  const { baseUrl, token, workspaceId } = getMcConfig();
  const title = `BlogBot — 3D Pricing — ${date}`;

  const statuses = ['planning','inbox','assigned','in_progress','testing','review','done'];
  const statusParam = encodeURIComponent(statuses.join(','));
  const wsParam = encodeURIComponent(workspaceId);
  const tasks = await apiFetch(baseUrl, token, `/api/tasks?workspace_id=${wsParam}&status=${statusParam}`);
  const existing = (tasks || []).find(t => String(t.title || '').trim() === title);
  if (existing) return existing;

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
  return created;
}

async function logActivity(taskId, { activity_type = 'updated', message, metadata }) {
  const { baseUrl, token } = getMcConfig();
  await apiFetch(baseUrl, token, `/api/tasks/${taskId}/activities`, {
    method: 'POST',
    body: JSON.stringify({
      activity_type,
      message,
      metadata: JSON.stringify(metadata || {})
    })
  });
}

async function addDeliverable(taskId, { title, url }) {
  const { baseUrl, token } = getMcConfig();
  if (!url) return;
  await apiFetch(baseUrl, token, `/api/tasks/${taskId}/deliverables`, {
    method: 'POST',
    body: JSON.stringify({
      deliverable_type: 'url',
      title,
      description: 'Blog post (slug)',
      path: url
    })
  });
}

async function setClaudioStatus(status) {
  const { baseUrl, token, workspaceId } = getMcConfig();
  // This is the Claudio (BlogBot) agent imported from Gateway in Mission Control
  const CLAUDIO_AGENT_ID = process.env.MC_CLAUDIO_AGENT_ID || '164a6c3c-c81a-40c5-963a-4a03dc95c828';
  try {
    await apiFetch(baseUrl, token, `/api/agents/${CLAUDIO_AGENT_ID}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, workspace_id: workspaceId })
    });
  } catch {
    // don't fail publishing if MC status update fails
  }
}

async function main() {
  const task = await ensureDailyTask();

  const runnerPath = path.resolve(process.cwd(), 'automation/3dprint-pricing-bot/run.mjs');

  await setClaudioStatus('working');

  await logActivity(task.id, {
    activity_type: 'spawned',
    message: `Iniciando publicação automática (${lang.toUpperCase()})…`,
    metadata: { kind: 'blogbot_run_start', lang, date }
  });

  const args = ['--lang', lang];
  if (focus) args.push('--focus', focus);
  const res = await runNodeScript(runnerPath, args);

  if (res.code !== 0) {
    await logActivity(task.id, {
      activity_type: 'updated',
      message: `FALHA (${lang.toUpperCase()}): exit=${res.code}. stderr: ${res.err.slice(0, 600)}`,
      metadata: { kind: 'blogbot_run_failed', lang, date, exitCode: res.code }
    });
    await setClaudioStatus('standby');
    console.error(res.err || res.out);
    process.exit(res.code || 1);
  }

  // run.mjs prints JSON
  let parsed;
  try {
    parsed = JSON.parse(res.out.trim());
  } catch {
    parsed = null;
  }

  const slug = parsed?.slug;
  const postTitle = parsed?.published?.post?.title || parsed?.published?.title || '(sem título)';

  await logActivity(task.id, {
    activity_type: 'completed',
    message: `Publicado (${lang.toUpperCase()}): ${postTitle}${slug ? ` — slug: ${slug}` : ''}`,
    metadata: { kind: 'blogbot_run_ok', lang, date, slug, postId: parsed?.published?.post?.id }
  });

  await setClaudioStatus('standby');

  // If you have a public blog base URL, set BLOG_PUBLIC_BASE_URL to create clickable links.
  const publicBase = process.env.BLOG_PUBLIC_BASE_URL;
  if (publicBase && slug) {
    const url = publicBase.replace(/\/$/, '') + '/blog/' + slug;
    await addDeliverable(task.id, { title: `Post ${lang.toUpperCase()}: ${slug}`, url });
  }

  console.log(res.out);
}

main().catch(async (err) => {
  try {
    const task = await ensureDailyTask();
    await logActivity(task.id, {
      activity_type: 'updated',
      message: `ERRO wrapper (${lang.toUpperCase()}): ${String(err).slice(0, 600)}`,
      metadata: { kind: 'blogbot_wrapper_error', lang, date }
    });
  } catch {}
  console.error(err);
  process.exit(1);
});

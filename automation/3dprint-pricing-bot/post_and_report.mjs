#!/usr/bin/env node
/**
 * Wrapper: publish a blog post (run.mjs) then report result into Mission Control.
 * Extended: weekly rotation by cluster + published_history to avoid repeats.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { apiFetch, getMcConfig, todayISODate } from '../../scripts/mc_blogbot_helpers.mjs';

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  if (!v || v.startsWith('--')) return true;
  return v;
}

const lang = String(arg('lang', 'pt')).toLowerCase();
let focus = String(arg('focus', '')).trim();
const rotateWeekly = Boolean(arg('rotate-weekly', false));
const noRepeatWeeks = Number(arg('no-repeat-weeks', 8)) || 8;
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

function pickClusterForToday(history, clusters) {
  // clusters: array in order Monday..Sunday
  const today = new Date();
  // Use local timezone of server; fallback to UTC day if needed
  const dayIndex = today.getDay(); // 0=Sunday
  // mapping: Monday(1) -> index 0
  const mappingIndex = (dayIndex + 6) % 7; // 0->6,1->0,...
  // initial preferred cluster
  let pref = clusters[mappingIndex];
  // build recent set to avoid repeats
  const recentCount = noRepeatWeeks * clusters.length;
  const recent = (history || []).slice(-recentCount).map(r => r.cluster).filter(Boolean);
  if (!recent.includes(pref)) return pref;
  // otherwise pick next cluster not in recent, cycling forward
  for (let i = 1; i < clusters.length; i++) {
    const c = clusters[(mappingIndex + i) % clusters.length];
    if (!recent.includes(c)) return c;
  }
  // if all appear in recent, just return preference
  return pref;
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

  // Rotation config
  const clusters = [
    'impressoras', // Monday
    'filamentos',  // Tuesday
    'projetos',    // Wednesday
    'marketplaces',// Thursday
    'monetizacao', // Friday
    'manutencao',  // Saturday
    'mix'          // Sunday
  ];

  // Try load history
  let history = [];
  const historyPath = path.resolve(process.cwd(), 'automation/3dprint-pricing-bot/published_history.json');
  try {
    if (fs.existsSync(historyPath)) {
      const raw = fs.readFileSync(historyPath, 'utf8');
      history = JSON.parse(raw || '[]');
    }
  } catch (e) {
    // continue with empty history
    history = [];
  }

  if (rotateWeekly && !focus) {
    const chosen = pickClusterForToday(history, clusters);
    focus = chosen; // pass cluster name as focus to runner
    await logActivity(task.id, {
      activity_type: 'updated',
      message: `Rodada diária: cluster selecionado = ${chosen}`,
      metadata: { kind: 'blogbot_rotation', cluster: chosen }
    });
  }

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
  const clusterRecorded = focus || parsed?.meta?.cluster || null;

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

  // Append to history
  try {
    const entry = { date: date, slug: slug || null, title: postTitle, cluster: clusterRecorded };
    history.push(entry);
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf8');
  } catch (e) {
    // ignore history write failures
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

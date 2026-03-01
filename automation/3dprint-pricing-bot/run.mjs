#!/usr/bin/env node
/* BlogBot - Precificação Impressão 3D
 * - Coleta itens recentes via RSS (fontes fixas)
 * - Usa OpenAI Responses API para gerar JSON do post (HTML + SEO)
 * - Publica via Supabase Edge Function create-blog-post
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import axios from "axios";
import Parser from "rss-parser";

const ROOT = path.resolve(process.cwd());
const BOT_DIR = path.join(ROOT, "automation/3dprint-pricing-bot");
const SOURCES_PATH = path.join(BOT_DIR, "sources.ptbr.json");
const PROMPT_PATH = path.join(BOT_DIR, "PROMPT_ARTICLE.md");
const STATE_PATH = path.join(BOT_DIR, "state.json");

function arg(name, def = undefined) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return def;
  const v = process.argv[idx + 1];
  if (!v || v.startsWith("--")) return true;
  return v;
}

const lang = String(arg("lang", "pt")).toLowerCase(); // pt | en
const dryRun = Boolean(arg("dry", false));
const endpoint = process.env.BLOG_ENDPOINT || "https://zfwwaeualfmsjobflnpj.supabase.co/functions/v1/create-blog-post";
const blogApiKey = process.env.BLOG_API_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!blogApiKey) {
  console.error("Missing BLOG_API_KEY env var");
  process.exit(2);
}
if (!openaiKey) {
  console.error("Missing OPENAI_API_KEY env var");
  process.exit(2);
}
if (!fs.existsSync(SOURCES_PATH)) {
  console.error("Missing sources file:", SOURCES_PATH);
  process.exit(2);
}
if (!fs.existsSync(PROMPT_PATH)) {
  console.error("Missing prompt file:", PROMPT_PATH);
  process.exit(2);
}

const sourcesCfg = JSON.parse(fs.readFileSync(SOURCES_PATH, "utf8"));
const promptBase = fs.readFileSync(PROMPT_PATH, "utf8");

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  } catch {
    return { published: [] };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

function nowISO() {
  return new Date().toISOString();
}

function simpleSlug(s) {
  return String(s)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

async function getExistingBySlug(slug) {
  try {
    const r = await axios.get(endpoint, {
      params: { slug },
      headers: { "x-api-key": blogApiKey },
      timeout: 20000,
    });
    // Edge function: GET may return {posts:[...]} or array; be defensive
    const data = r.data;
    const posts = Array.isArray(data) ? data : (data?.posts || data?.data || []);
    return posts?.length ? posts : [];
  } catch (e) {
    // If API doesn't support slug query properly, don't hard-fail.
    return [];
  }
}

async function fetchRssItems() {
  const parser = new Parser({ timeout: 20000 });
  const rssList = sourcesCfg.rss || [];
  const allItems = [];

  for (const src of rssList) {
    try {
      const feed = await parser.parseURL(src.url);
      for (const item of feed.items || []) {
        allItems.push({
          source: src.name,
          feedUrl: src.url,
          title: item.title,
          link: item.link,
          pubDate: item.isoDate || item.pubDate || null,
          contentSnippet: item.contentSnippet || item.summary || "",
        });
      }
    } catch (e) {
      // ignore single source failure
    }
  }

  // sort by pubDate desc (fallback stable)
  allItems.sort((a, b) => {
    const da = a.pubDate ? Date.parse(a.pubDate) : 0;
    const db = b.pubDate ? Date.parse(b.pubDate) : 0;
    return db - da;
  });

  // unique by link
  const seen = new Set();
  const uniq = [];
  for (const it of allItems) {
    if (!it.link) continue;
    if (seen.has(it.link)) continue;
    seen.add(it.link);
    uniq.push(it);
  }
  return uniq;
}

function pickTheme(items, state) {
  const recentTitles = new Set(
    (state.published || [])
      .filter((x) => Date.now() - Date.parse(x.at) < 7 * 24 * 3600 * 1000)
      .map((x) => x.topicHash)
  );

  for (const it of items.slice(0, 30)) {
    const key = crypto.createHash("sha1").update(String(it.title || "") + "|" + String(it.link || "")).digest("hex");
    if (!recentTitles.has(key)) {
      return { item: it, topicHash: key };
    }
  }
  // fallback: first item
  const it = items[0];
  const key = crypto.createHash("sha1").update(String(it?.title || "") + "|" + String(it?.link || "")).digest("hex");
  return { item: it, topicHash: key };
}

async function openaiGeneratePost({ lang, seedItem, supportLinks }) {
  const languageInstruction =
    lang === "en"
      ? "Write the post in ENGLISH (US)."
      : "Escreva o post em PORTUGUÊS BRASILEIRO (PT-BR).";

  const seedBlock = seedItem
    ? `Seed (fresh signal):\n- title: ${seedItem.title}\n- url: ${seedItem.link}\n- source: ${seedItem.source}\n- snippet: ${seedItem.contentSnippet || ""}`
    : "";

  const linksBlock = (supportLinks || [])
    .filter(Boolean)
    .slice(0, 12)
    .map((u) => `- ${u}`)
    .join("\n");

  const system =
    "You are an expert content writer for a SaaS that helps price 3D printing jobs. " +
    "You must write ORIGINAL content (no copying). Always include sources as links.";

  const user = `
${languageInstruction}

Context:
- Audience: makers, small sellers, 3D printing service providers
- Goal: practical, actionable pricing/cost/margin guidance + subtle CTA for the SaaS calculator

${promptBase}

Sources you may cite (choose the best ones and always link them):
${linksBlock || "- (none)"}

${seedBlock}

Return STRICT JSON only, with keys:
title, excerpt, content, meta_title, meta_description, tags, sources

Where:
- content must be HTML string
- tags is an array of short tags
- sources is an array of URLs actually cited in the article
`;

  const resp = await axios.post(
    "https://api.openai.com/v1/responses",
    {
      model: "gpt-5.2",
      input: [
        { role: "system", content: [{ type: "input_text", text: system }] },
        { role: "user", content: [{ type: "input_text", text: user }] },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "blog_post",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              excerpt: { type: "string" },
              content: { type: "string" },
              meta_title: { type: "string" },
              meta_description: { type: "string" },
              tags: { type: "array", items: { type: "string" } },
              sources: { type: "array", items: { type: "string" } }
            },
            required: ["title", "excerpt", "content", "meta_title", "meta_description", "tags", "sources"],
          },
          strict: true,
        },
      },
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 120000,
    }
  );

  // Responses API: prefer output_text
  const outText = resp.data?.output_text;
  if (outText) {
    return JSON.parse(outText);
  }

  // fallback: attempt to locate JSON in output
  const o = resp.data?.output || [];
  const textChunks = [];
  for (const item of o) {
    for (const c of item?.content || []) {
      if (c.type === "output_text") textChunks.push(c.text);
    }
  }
  const joined = textChunks.join("\n").trim();
  return JSON.parse(joined);
}

async function publishPost(post) {
  // Omit cover_image_url if absent
  const payload = {
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    meta_title: post.meta_title,
    meta_description: post.meta_description,
    published: true,
  };

  const r = await axios.post(endpoint, payload, {
    headers: {
      "x-api-key": blogApiKey,
      "Content-Type": "application/json",
    },
    timeout: 30000,
  });
  return r.data;
}

async function main() {
  const state = loadState();

  const items = await fetchRssItems();
  if (!items.length) {
    console.error("No RSS items found; aborting");
    process.exit(1);
  }

  const picked = pickTheme(items, state);
  const supportLinks = [
    picked.item?.link,
    ...items.slice(0, 9).map((x) => x.link),
    ...(sourcesCfg.manual_sources || []).slice(0, 6).map((x) => x.url),
  ].filter(Boolean);

  const post = await openaiGeneratePost({ lang, seedItem: picked.item, supportLinks });

  // de-dupe by slug
  const slug = simpleSlug(post.title);
  const existing = await getExistingBySlug(slug);
  if (existing.length) {
    console.error("Slug already exists; aborting:", slug);
    process.exit(3);
  }

  if (dryRun) {
    console.log(JSON.stringify({ dryRun: true, slug, post }, null, 2));
    process.exit(0);
  }

  const pub = await publishPost(post);

  state.published = state.published || [];
  state.published.push({ at: nowISO(), lang, slug, topicHash: picked.topicHash, seedUrl: picked.item?.link || null });
  // keep last 200
  state.published = state.published.slice(-200);
  saveState(state);

  console.log(JSON.stringify({ ok: true, slug, published: pub }, null, 2));
}

main().catch((err) => {
  console.error(err?.response?.data || err);
  process.exit(1);
});

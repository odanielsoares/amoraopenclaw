import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

async function renderStatusPdf() {
  const mdPath = path.resolve(process.cwd(), 'reports', 'status-openclaw-installation.md');
  const mdContent = fs.readFileSync(mdPath, 'utf-8');
  const htmlContent = marked(mdContent);

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  let html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Status OpenClaw</title>
  <style>@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&display=swap');
  body { font-family: 'Space Grotesk', sans-serif; background: #0a0a0f; color: #f1f1f6; margin: 20px; line-height: 1.6; }
  h1,h2,h3 { color:#8b5cf6; } p { max-width: 700px; font-size: 12pt; } ul { max-width: 700px; margin-left: 1rem; } li { margin-bottom: 0.5rem; }
  </style></head><body>` + htmlContent + '</body></html>';

  await page.setContent(html);
  await page.pdf({ path: path.resolve(process.cwd(), 'reports', 'status-openclaw-installation.pdf'), format: 'A4', printBackground: true });

  await browser.close();
  console.log('PDF de status gerado com sucesso.');
}

renderStatusPdf();

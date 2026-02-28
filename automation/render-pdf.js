import puppeteer from 'puppeteer';
import path from 'path';

async function renderPdf() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  const filePath = path.resolve(process.cwd(), 'index.html');
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });

  await page.pdf({ path: 'projeto-openclaw-esquema-fidelidade.pdf', format: 'A4', printBackground: true });

  await browser.close();
  console.log('PDF gerado com alta fidelidade de layout.');
}

renderPdf();

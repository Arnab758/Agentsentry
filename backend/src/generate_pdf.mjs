import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

async function generateDeckPdf() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

  console.log('Using browser executable:', executablePath);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const url = 'http://localhost:3000/presentation_deck.html';
  console.log('Navigating to:', url);
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Wait a moment for webfonts to render crisply
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const rootPdfPath = path.resolve('..', 'AgentSentry_Presentation_Deck.pdf');
  const docsPdfPath = path.resolve('..', 'docs', 'AgentSentry_Presentation_Deck.pdf');

  console.log('Rendering PDF to:', rootPdfPath);
  await page.pdf({
    path: rootPdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  // Also copy to docs directory
  fs.copyFileSync(rootPdfPath, docsPdfPath);
  console.log('Copied PDF to:', docsPdfPath);

  await browser.close();

  const stats = fs.statSync(rootPdfPath);
  console.log(`SUCCESS! Generated AgentSentry_Presentation_Deck.pdf (${stats.size} bytes)`);
}

generateDeckPdf().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});

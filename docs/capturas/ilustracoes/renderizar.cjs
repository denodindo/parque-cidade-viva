// Converte svg/*.svg em png/*.png (1600×900, escala 2) com o Chromium do Playwright.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const dir = path.join(__dirname, 'svg');
  const out = path.join(__dirname, 'png');
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.svg')).sort()) {
    await p.setContent(`<html><body style="margin:0">${fs.readFileSync(path.join(dir, f), 'utf8')}</body></html>`);
    await p.locator('svg').screenshot({ path: path.join(out, f.replace('.svg', '.png')) });
    console.log('ok', f);
  }
  await b.close();
})();

// Gera vistas conceituais a partir da maquete 3D (rodar com `npx vite --port 5180` ativo).
const { chromium } = require('playwright');
const path = require('path');
const OUT = path.join(__dirname, 'maquete-bruto');
const VISTAS = [
  { id: '01-visao-geral', pos: [190, 210, 300], alvo: [-5, 0, 25] },
  { id: '02-noite', pos: [150, 120, 260], alvo: [10, 0, 60], noite: true },
  { id: '03-ginasio', pos: [150, 55, 235], alvo: [40, 15, 125] },
  { id: '04-ginasio-pavimentos', pos: [170, 150, 270], alvo: [40, 25, 125], sel: { tipo: 'edificio', id: 'ginasio' }, modo: 'explodido' },
  { id: '05-centro-cultural', pos: [175, 50, 70], alvo: [75, 12, 0] },
  { id: '06-centro-cultural-pavimentos', pos: [200, 120, 130], alvo: [75, 18, 0], sel: { tipo: 'edificio', id: 'centro-cultural' }, modo: 'explodido' },
  { id: '07-praca-anfiteatro', pos: [55, 45, 70], alvo: [5, 0, -10] },
  { id: '08-playgrounds', pos: [-10, 40, 20], alvo: [-68, 0, -25] },
  { id: '09-campo-quadras', pos: [70, 50, 270], alvo: [20, 0, 180] },
  { id: '10-horta-inclusao', pos: [-55, 50, 45], alvo: [-115, 0, -20] },
  { id: '11-bosque', pos: [10, 45, -60], alvo: [-40, 0, -150] },
  { id: '12-restaurante-quiosques', pos: [65, 35, -25], alvo: [20, 0, -65] },
];
(async () => {
  const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto('http://localhost:5180/');
  await p.waitForSelector('canvas', { timeout: 30000 });
  await p.addStyleTag({ content: '.topo,.lateral,.sobreposicao,.controles-cena,.legenda,[class*="controles"],[class*="selo"]{display:none!important} .layout{grid-template-columns:1fr!important;grid-template-rows:1fr!important} .cena{height:100vh}' });
  await p.evaluate(() => { const s = window.__parque.getState(); s.setQualidade('alta'); s.setRotulos(false); });
  await p.waitForTimeout(4000);
  for (const v of VISTAS) {
    await p.evaluate((v) => {
      const s = window.__parque.getState();
      s.setNoite(!!v.noite);
      s.selecionar(v.sel ?? null);
      s.setModoEdificio(v.modo ?? 'fechado');
      s.moverCamera(v.pos, v.alvo);
    }, v);
    await p.waitForTimeout(3500);
    await p.locator('canvas').first().screenshot({ path: path.join(OUT, v.id + '.png') });
    console.log('ok', v.id);
  }
  console.log('erros', erros);
  await b.close();
})();

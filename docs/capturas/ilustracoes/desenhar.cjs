// Ilustrações conceituais em vetor (SVG 1600×900) dos espaços do Parque Cidade Viva.
// Uso: node desenhar.cjs  → gera svg/*.svg; depois renderizar.cjs gera os PNG.
const fs = require('fs');
const path = require('path');

const W = 1600, H = 900;
const C = {
  escuro: '#12291F', verde: '#4F8F5F', verde2: '#3E7A4E', verde3: '#2F6440', verdeClaro: '#8DC58F', menta: '#6FAE9C',
  ambar: '#E9A23B', terracota: '#C9785A', azul: '#7B93C9', azulAgua: '#4FA3D1', ceu: '#DCEBF2', ceu2: '#F6F1E3',
  creme: '#F3EBDD', concreto: '#D9D6CF', cinza: '#9AA3A0', madeira: '#B07A4F', branco: '#FFFFFF', lilas: '#A58FC4', grama: '#9CCB7A',
};

// PRNG determinístico
let semente = 7;
const rnd = () => ((semente = (semente * 16807) % 2147483647) / 2147483647);
const escolha = (a) => a[Math.floor(rnd() * a.length)];

const PELES = ['#8D5524', '#C68642', '#E0AC69', '#F1C27D', '#5C3A21', '#A0522D'];
const ROUPAS = [C.ambar, C.terracota, C.azul, C.menta, '#E36B5D', '#5B6FB5', '#F2C14E', '#7D5BA6', '#2E8B8B', '#D35D8B'];

const svg = (titulo, corpo, legenda) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="'Public Sans', Arial, sans-serif">
<defs>
  <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE0EE"/><stop offset="1" stop-color="${C.ceu2}"/></linearGradient>
  <linearGradient id="tarde" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6B26B"/><stop offset="0.6" stop-color="#F9D9A6"/><stop offset="1" stop-color="#FBEBD0"/></linearGradient>
  <linearGradient id="agua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6EC1E4"/><stop offset="1" stop-color="#3F8FC4"/></linearGradient>
  <linearGradient id="interior" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8EC"/><stop offset="1" stop-color="#F1E6D2"/></linearGradient>
</defs>
${corpo}
<rect x="0" y="${H - 56}" width="${W}" height="56" fill="${C.escuro}" opacity="0.92"/>
<text x="40" y="${H - 20}" font-size="26" font-weight="700" fill="${C.ambar}">${titulo}</text>
<text x="${W - 40}" y="${H - 20}" font-size="18" fill="#BFD4C6" text-anchor="end">${legenda ?? 'Ilustração conceitual · Parque Cidade Viva · projeto acadêmico SENAC'}</text>
</svg>`;

// ---------- peças ----------
function arvore(x, y, s = 1, cor = escolha([C.verde, C.verde2, C.verde3, C.menta])) {
  const r = 34 * s;
  return `<g><rect x="${x - 4 * s}" y="${y - 40 * s}" width="${8 * s}" height="${40 * s}" fill="#6B4A2E"/>
<circle cx="${x}" cy="${y - 48 * s - r * 0.4}" r="${r}" fill="${cor}"/>
<circle cx="${x - r * 0.55}" cy="${y - 40 * s - r * 0.2}" r="${r * 0.7}" fill="${cor}"/>
<circle cx="${x + r * 0.55}" cy="${y - 42 * s - r * 0.25}" r="${r * 0.72}" fill="${cor}"/>
<circle cx="${x - r * 0.25}" cy="${y - 55 * s - r * 0.6}" r="${r * 0.35}" fill="#ffffff" opacity="0.12"/></g>`;
}
function ipe(x, y, s = 1) { return arvore(x, y, s, '#E8B4D0') ; }
function arbusto(x, y, s = 1, cor = C.verde2) {
  return `<ellipse cx="${x}" cy="${y - 10 * s}" rx="${26 * s}" ry="${16 * s}" fill="${cor}"/><ellipse cx="${x + 16 * s}" cy="${y - 14 * s}" rx="${16 * s}" ry="${12 * s}" fill="${cor}" opacity="0.9"/>`;
}
function flores(x, y, n = 6, cores = ['#F2C14E', '#E36B5D', '#D35D8B', '#ffffff']) {
  let o = '';
  for (let i = 0; i < n; i++) o += `<circle cx="${x + i * 9 + rnd() * 4}" cy="${y - rnd() * 8}" r="3.5" fill="${escolha(cores)}"/>`;
  return o;
}
function pessoa(x, y, s = 1, o = {}) {
  const pele = o.pele ?? escolha(PELES), roupa = o.roupa ?? escolha(ROUPAS), calca = o.calca ?? escolha(['#2E3A4A', '#5A4632', '#3B4F7A', '#6B6B6B']);
  const h = 74 * s;
  const braco = o.bracoAcima
    ? `<line x1="${x + 7 * s}" y1="${y - h * 0.72}" x2="${x + 18 * s}" y2="${y - h * 1.02}" stroke="${roupa}" stroke-width="${6 * s}" stroke-linecap="round"/>`
    : `<line x1="${x + 8 * s}" y1="${y - h * 0.72}" x2="${x + 12 * s}" y2="${y - h * 0.45}" stroke="${roupa}" stroke-width="${6 * s}" stroke-linecap="round"/>`;
  const pernas = o.correndo
    ? `<line x1="${x - 2 * s}" y1="${y - h * 0.42}" x2="${x - 14 * s}" y2="${y}" stroke="${calca}" stroke-width="${7 * s}" stroke-linecap="round"/><line x1="${x + 2 * s}" y1="${y - h * 0.42}" x2="${x + 14 * s}" y2="${y - 6 * s}" stroke="${calca}" stroke-width="${7 * s}" stroke-linecap="round"/>`
    : `<line x1="${x - 4 * s}" y1="${y - h * 0.42}" x2="${x - 5 * s}" y2="${y}" stroke="${calca}" stroke-width="${7 * s}" stroke-linecap="round"/><line x1="${x + 4 * s}" y1="${y - h * 0.42}" x2="${x + 5 * s}" y2="${y}" stroke="${calca}" stroke-width="${7 * s}" stroke-linecap="round"/>`;
  return `<g>${pernas}<rect x="${x - 9 * s}" y="${y - h * 0.8}" width="${18 * s}" height="${h * 0.42}" rx="${8 * s}" fill="${roupa}"/>
<line x1="${x - 8 * s}" y1="${y - h * 0.72}" x2="${x - 12 * s}" y2="${y - h * 0.45}" stroke="${roupa}" stroke-width="${6 * s}" stroke-linecap="round"/>${braco}
<circle cx="${x}" cy="${y - h * 0.9}" r="${9 * s}" fill="${pele}"/>${o.cabelo !== false ? `<path d="M${x - 9 * s} ${y - h * 0.9} a${9 * s} ${9 * s} 0 0 1 ${18 * s} 0 z" fill="${escolha(['#2B1B12', '#4A3426', '#1B1B1B', '#7A5230', '#C9C9C9'])}"/>` : ''}</g>`;
}
function sentada(x, y, s = 1) {
  const pele = escolha(PELES), roupa = escolha(ROUPAS);
  return `<g><line x1="${x}" y1="${y - 26 * s}" x2="${x + 16 * s}" y2="${y - 26 * s}" stroke="#2E3A4A" stroke-width="${7 * s}" stroke-linecap="round"/><line x1="${x + 16 * s}" y1="${y - 26 * s}" x2="${x + 16 * s}" y2="${y}" stroke="#2E3A4A" stroke-width="${7 * s}" stroke-linecap="round"/>
<rect x="${x - 9 * s}" y="${y - 58 * s}" width="${18 * s}" height="${32 * s}" rx="${8 * s}" fill="${roupa}"/><circle cx="${x}" cy="${y - 67 * s}" r="${9 * s}" fill="${pele}"/></g>`;
}
function cadeirante(x, y, s = 1) {
  const pele = escolha(PELES), roupa = escolha(ROUPAS);
  return `<g><circle cx="${x}" cy="${y - 18 * s}" r="${18 * s}" fill="none" stroke="#333" stroke-width="${4 * s}"/><circle cx="${x + 26 * s}" cy="${y - 6 * s}" r="${6 * s}" fill="#333"/>
<line x1="${x}" y1="${y - 30 * s}" x2="${x + 24 * s}" y2="${y - 30 * s}" stroke="#333" stroke-width="${4 * s}"/><line x1="${x - 4 * s}" y1="${y - 30 * s}" x2="${x - 8 * s}" y2="${y - 62 * s}" stroke="#333" stroke-width="${4 * s}"/>
<line x1="${x + 6 * s}" y1="${y - 34 * s}" x2="${x + 22 * s}" y2="${y - 34 * s}" stroke="#2E3A4A" stroke-width="${7 * s}" stroke-linecap="round"/><line x1="${x + 22 * s}" y1="${y - 34 * s}" x2="${x + 24 * s}" y2="${y - 12 * s}" stroke="#2E3A4A" stroke-width="${7 * s}" stroke-linecap="round"/>
<rect x="${x - 6 * s}" y="${y - 66 * s}" width="${18 * s}" height="${32 * s}" rx="${8 * s}" fill="${roupa}"/><circle cx="${x + 3 * s}" cy="${y - 75 * s}" r="${9 * s}" fill="${pele}"/></g>`;
}
function bicicleta(x, y, s = 1) {
  return `<g stroke="#333" stroke-width="${3 * s}" fill="none"><circle cx="${x}" cy="${y - 14 * s}" r="${14 * s}"/><circle cx="${x + 46 * s}" cy="${y - 14 * s}" r="${14 * s}"/>
<path d="M${x} ${y - 14 * s} L${x + 18 * s} ${y - 40 * s} L${x + 40 * s} ${y - 40 * s} L${x + 46 * s} ${y - 14 * s} M${x + 18 * s} ${y - 40 * s} L${x + 24 * s} ${y - 14 * s} L${x + 46 * s} ${y - 14 * s}"/></g>${pessoa(x + 22 * s, y - 22 * s, 0.75 * s, { correndo: false })}`;
}
function banco(x, y, s = 1) {
  return `<rect x="${x}" y="${y - 22 * s}" width="${70 * s}" height="${7 * s}" rx="2" fill="${C.madeira}"/><rect x="${x}" y="${y - 36 * s}" width="${70 * s}" height="${6 * s}" rx="2" fill="${C.madeira}"/><rect x="${x + 6 * s}" y="${y - 22 * s}" width="${5 * s}" height="${22 * s}" fill="#555"/><rect x="${x + 59 * s}" y="${y - 22 * s}" width="${5 * s}" height="${22 * s}" fill="#555"/>`;
}
function poste(x, y, s = 1, aceso = false) {
  return `<rect x="${x - 2.5 * s}" y="${y - 120 * s}" width="${5 * s}" height="${120 * s}" fill="#3B4A44"/><rect x="${x - 12 * s}" y="${y - 126 * s}" width="${24 * s}" height="${8 * s}" rx="3" fill="#3B4A44"/>${aceso ? `<ellipse cx="${x}" cy="${y - 112 * s}" rx="${30 * s}" ry="${14 * s}" fill="#FFE9A8" opacity="0.5"/>` : ''}`;
}
function coletor(x, y) {
  const cores = ['#3C78D8', '#E06666', '#F1C232', '#6AA84F'];
  return cores.map((c, i) => `<rect x="${x + i * 16}" y="${y - 34}" width="14" height="34" rx="3" fill="${c}"/>`).join('');
}
function nuvem(x, y, s = 1) {
  return `<g fill="#ffffff" opacity="0.85"><ellipse cx="${x}" cy="${y}" rx="${60 * s}" ry="${20 * s}"/><ellipse cx="${x + 30 * s}" cy="${y - 12 * s}" rx="${36 * s}" ry="${22 * s}"/><ellipse cx="${x - 26 * s}" cy="${y - 8 * s}" rx="${28 * s}" ry="${16 * s}"/></g>`;
}
function mata(yBase, cores = [C.verde3, C.verde2, C.verde], n = 40, alt = 1) {
  let o = '';
  for (let i = 0; i < n; i++) o += arvore((i / n) * (W + 120) - 40 + rnd() * 20, yBase + rnd() * 18, (0.9 + rnd() * 0.7) * alt, escolha(cores));
  return o;
}
const rotulo = (x, y, texto, cor = C.escuro, tam = 22, ancora = 'start') => `<text x="${x}" y="${y}" font-size="${tam}" font-weight="700" fill="${cor}" text-anchor="${ancora}">${texto}</text>`;
const etiqueta = (x, y, texto) => `<g><rect x="${x}" y="${y - 24}" width="${texto.length * 10.5 + 24}" height="34" rx="17" fill="${C.escuro}" opacity="0.88"/><text x="${x + 12}" y="${y - 1}" font-size="18" font-weight="600" fill="#ffffff">${texto}</text></g>`;

function janelas(x, y, w, h, colunas, linhas, cor = '#CFE6EE') {
  let o = '';
  const gw = w / colunas, gh = h / linhas;
  for (let i = 0; i < colunas; i++) for (let j = 0; j < linhas; j++) o += `<rect x="${x + i * gw + 4}" y="${y + j * gh + 4}" width="${gw - 8}" height="${gh - 8}" rx="2" fill="${cor}"/>`;
  return o;
}

// ---------- cenas ----------
const cenas = {};

cenas['01-visao-geral'] = () => {
  semente = 11;
  let o = `<rect width="${W}" height="${H}" fill="url(#ceu)"/>${nuvem(260, 120)}${nuvem(1250, 90, 1.3)}${nuvem(820, 160, 0.8)}`;
  o += `<path d="M0 380 Q 400 300 800 350 T 1600 330 L1600 900 L0 900Z" fill="${C.verde3}"/>`;
  o += mata(400, [C.verde3, C.verde2], 46, 1.3);
  o += `<path d="M0 470 Q 600 430 1600 460 L1600 900 L0 900Z" fill="${C.grama}"/>`;
  // centro cultural (esq.)
  o += `<rect x="230" y="330" width="330" height="170" fill="${C.creme}"/><rect x="220" y="320" width="350" height="16" fill="${C.verde}"/>${janelas(240, 345, 310, 140, 7, 3)}<rect x="360" y="440" width="70" height="60" fill="${C.azul}"/>`;
  o += etiqueta(250, 305, 'Centro cultural e educacional');
  // ginásio (dir.)
  o += `<rect x="1020" y="290" width="440" height="215" fill="${C.concreto}"/><rect x="1010" y="280" width="460" height="16" fill="${C.verde}"/>${janelas(1030, 300, 420, 190, 9, 4, '#BFD9E6')}<rect x="1200" y="445" width="80" height="60" fill="${C.ambar}"/>`;
  o += etiqueta(1120, 265, 'Ginásio multifuncional');
  // praça e anfiteatro
  o += `<ellipse cx="800" cy="560" rx="260" ry="60" fill="${C.concreto}"/><path d="M690 560 a110 50 0 0 1 220 0" fill="none" stroke="${C.terracota}" stroke-width="14"/><path d="M710 560 a90 38 0 0 1 180 0" fill="none" stroke="${C.terracota}" stroke-width="10" opacity="0.8"/>`;
  for (let i = 0; i < 4; i++) o += `<path d="M${600 + i * 120} 520 l40 -36 l40 36z" fill="${escolha([C.ambar, C.terracota, C.azul, C.menta])}"/><rect x="${605 + i * 120}" y="520" width="70" height="26" fill="#ffffff" opacity="0.7"/>`;
  // caminho
  o += `<path d="M0 760 Q 500 640 800 610 T 1600 700" fill="none" stroke="${C.creme}" stroke-width="46" stroke-linecap="round"/><path d="M0 760 Q 500 640 800 610 T 1600 700" fill="none" stroke="#E3D9C5" stroke-width="6" stroke-dasharray="18 14"/>`;
  // campo (dir. frente)
  o += `<path d="M1060 620 L1560 600 L1600 780 L1020 800Z" fill="#3E9B57"/><path d="M1060 620 L1560 600 L1600 780 L1020 800Z" fill="none" stroke="#ffffff" stroke-width="4"/><line x1="1310" y1="610" x2="1310" y2="790" stroke="#ffffff" stroke-width="3"/>`;
  // playground (esq. frente)
  o += `<rect x="90" y="640" width="330" height="140" rx="20" fill="${C.lilas}" opacity="0.6"/><path d="M150 760 L150 680 L200 680 L260 760" fill="none" stroke="${C.terracota}" stroke-width="10"/><rect x="290" y="680" width="80" height="8" fill="${C.ambar}"/><line x1="300" y1="688" x2="300" y2="760" stroke="${C.ambar}" stroke-width="6"/><line x1="360" y1="688" x2="360" y2="760" stroke="${C.ambar}" stroke-width="6"/>`;
  for (const [x, y, s] of [[520, 700, 1], [470, 590, 0.9], [960, 650, 0.9], [130, 590, 1], [1500, 560, 1], [900, 760, 1.2], [60, 860, 1.4], [1560, 880, 1.4]]) o += arvore(x, y, s);
  o += ipe(620, 690, 1.1) + ipe(1000, 560, 0.9);
  for (let i = 0; i < 16; i++) o += pessoa(480 + i * 52 + rnd() * 20, 660 + rnd() * 50, 0.6 + rnd() * 0.2);
  o += bicicleta(330, 830, 0.9) + cadeirante(760, 700, 0.75) + pessoa(1180, 720, 0.6, { correndo: true }) + pessoa(1400, 690, 0.6, { correndo: true });
  o += etiqueta(1180, 590, 'Campo e quadras') + etiqueta(110, 630, 'Playgrounds') + etiqueta(700, 520, 'Praça e anfiteatro');
  return svg('Visão geral do parque', o);
};

cenas['02-ginasio-corte'] = () => {
  semente = 21;
  let o = `<rect width="${W}" height="${H}" fill="url(#ceu)"/>${nuvem(1350, 110)}${mata(250, [C.verde3, C.verde2], 30, 0.9)}<rect y="770" width="${W}" height="130" fill="${C.grama}"/>`;
  const x0 = 200, w = 1200, hN = 150, base = 770;
  // estrutura
  o += `<rect x="${x0 - 14}" y="${base - 4 * hN - 30}" width="${w + 28}" height="${4 * hN + 30}" fill="${C.concreto}"/>`;
  const niveis = ['Térreo · piscinas, vestiários e recepção', '1º pavimento · quadras de basquete, vôlei e futsal', '2º pavimento · musculação, funcional e avaliação física', '3º pavimento · jogos, tênis de mesa e salas multiuso'];
  for (let n = 0; n < 4; n++) {
    const y = base - (n + 1) * hN;
    o += `<rect x="${x0}" y="${y}" width="${w}" height="${hN - 12}" fill="url(#interior)"/><rect x="${x0 - 14}" y="${y + hN - 12}" width="${w + 28}" height="12" fill="#A9A49A"/>`;
    o += `<rect x="${x0 + 12}" y="${y + 8}" width="${niveis[n].length * 10.3 + 20}" height="30" rx="15" fill="${C.escuro}" opacity="0.85"/><text x="${x0 + 22}" y="${y + 29}" font-size="17" font-weight="600" fill="#fff">${niveis[n]}</text>`;
  }
  // térreo: piscina
  let y = base - hN;
  o += `<rect x="${x0 + 120}" y="${y + 70}" width="760" height="56" fill="url(#agua)"/>`;
  for (let i = 1; i < 6; i++) o += `<line x1="${x0 + 120}" y1="${y + 70 + i * 9.3}" x2="${x0 + 880}" y2="${y + 70 + i * 9.3}" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.8"/>`;
  for (let i = 0; i < 5; i++) o += `<ellipse cx="${x0 + 200 + i * 140}" cy="${y + 80 + i * 8}" rx="22" ry="6" fill="${escolha(PELES)}"/><circle cx="${x0 + 222 + i * 140}" cy="${y + 78 + i * 8}" r="6" fill="${escolha(['#E36B5D', '#F2C14E', '#3C78D8'])}"/>`;
  o += `<rect x="${x0 + 920}" y="${y + 90}" width="200" height="36" fill="url(#agua)"/>` + pessoa(x0 + 1000, y + 136, 0.55) + pessoa(x0 + 1060, y + 136, 0.45);
  // 1º: quadras
  y = base - 2 * hN;
  o += `<rect x="${x0 + 40}" y="${y + 116}" width="1120" height="16" fill="#D99A5B"/><line x1="${x0 + 600}" y1="${y + 116}" x2="${x0 + 600}" y2="${y + 132}" stroke="#fff" stroke-width="3"/>`;
  o += `<rect x="${x0 + 60}" y="${y + 50}" width="6" height="66" fill="#555"/><rect x="${x0 + 66}" y="${y + 50}" width="26" height="18" fill="#fff" stroke="#555"/><circle cx="${x0 + 100}" cy="${y + 70}" r="9" fill="none" stroke="#E36B5D" stroke-width="3"/>`;
  o += `<rect x="${x0 + 1134}" y="${y + 50}" width="6" height="66" fill="#555"/><rect x="${x0 + 1108}" y="${y + 50}" width="26" height="18" fill="#fff" stroke="#555"/><circle cx="${x0 + 1100}" cy="${y + 70}" r="9" fill="none" stroke="#E36B5D" stroke-width="3"/>`;
  for (let i = 0; i < 8; i++) o += pessoa(x0 + 180 + i * 120 + rnd() * 30, y + 118, 0.75, { bracoAcima: i % 3 === 0, correndo: i % 2 === 0 });
  o += `<circle cx="${x0 + 470}" cy="${y + 52}" r="9" fill="#E07B39"/>`;
  // 2º: academia
  y = base - 3 * hN;
  for (let i = 0; i < 6; i++) {
    const xx = x0 + 120 + i * 175;
    o += `<rect x="${xx}" y="${y + 96}" width="70" height="30" rx="4" fill="#4A4F55"/><rect x="${xx + 50}" y="${y + 66}" width="8" height="30" fill="#4A4F55"/>` + pessoa(xx + 30, y + 126, 0.7, { correndo: i % 2 === 0 });
  }
  // 3º: convivência
  y = base - 4 * hN;
  for (let i = 0; i < 4; i++) {
    const xx = x0 + 160 + i * 260;
    o += `<rect x="${xx}" y="${y + 92}" width="110" height="10" fill="#2E7D5B"/><line x1="${xx + 55}" y1="${y + 82}" x2="${xx + 55}" y2="${y + 92}" stroke="#fff" stroke-width="2"/><rect x="${xx + 10}" y="${y + 102}" width="6" height="24" fill="#555"/><rect x="${xx + 94}" y="${y + 102}" width="6" height="24" fill="#555"/>`;
    o += pessoa(xx - 14, y + 126, 0.65, { bracoAcima: true }) + pessoa(xx + 124, y + 126, 0.65);
  }
  // terraço
  y = base - 4 * hN - 30;
  for (let i = 0; i < 9; i++) o += arbusto(x0 + 60 + i * 135, y, 1, escolha([C.verde, C.menta, C.verde2]));
  o += rotulo(x0 + w / 2, y - 40, 'Terraço verde (possibilidade condicionada)', C.escuro, 20, 'middle');
  o += arvore(110, 780, 1.6) + arvore(1500, 790, 1.5) + pessoa(1450, 830, 0.8) + cadeirante(1530, 850, 0.8);
  return svg('Ginásio multifuncional · corte em quatro níveis', o, 'Corte esquemático, sem escala · quadras elevadas dependem de estudo estrutural');
};

cenas['03-centro-cultural-corte'] = () => {
  semente = 31;
  let o = `<rect width="${W}" height="${H}" fill="url(#ceu)"/>${nuvem(300, 100)}${mata(260, [C.verde3, C.verde2], 30, 0.9)}<rect y="770" width="${W}" height="130" fill="${C.grama}"/>`;
  const x0 = 220, w = 1160, base = 770;
  const hs = [220, 160, 160];
  const tops = [base - hs[0], base - hs[0] - hs[1], base - hs[0] - hs[1] - hs[2]];
  o += `<rect x="${x0 - 14}" y="${tops[2] - 20}" width="${w + 28}" height="${base - tops[2] + 20}" fill="${C.creme}"/><rect x="${x0 - 24}" y="${tops[2] - 34}" width="${w + 48}" height="18" fill="${C.verde}"/>`;
  const nomes = ['Térreo · auditório (meta de até 300 lugares), palco e camarins', '1º pavimento · biblioteca, leitura e espaço infantil', '2º pavimento · laboratório de TI, salas de aula e cursos'];
  for (let n = 0; n < 3; n++) {
    o += `<rect x="${x0}" y="${tops[n]}" width="${w}" height="${hs[n] - 12}" fill="url(#interior)"/><rect x="${x0 - 14}" y="${tops[n] + hs[n] - 12}" width="${w + 28}" height="12" fill="#C9BFA9"/>`;
    o += `<rect x="${x0 + 12}" y="${tops[n] + 8}" width="${nomes[n].length * 10.1 + 20}" height="30" rx="15" fill="${C.escuro}" opacity="0.85"/><text x="${x0 + 22}" y="${tops[n] + 29}" font-size="17" font-weight="600" fill="#fff">${nomes[n]}</text>`;
  }
  // auditório
  let y = tops[0];
  o += `<rect x="${x0 + 40}" y="${y + 130}" width="280" height="66" fill="#6B3E2E"/><rect x="${x0 + 40}" y="${y + 50}" width="20" height="80" fill="#8B1E2D"/><rect x="${x0 + 300}" y="${y + 50}" width="20" height="80" fill="#8B1E2D"/>`;
  o += pessoa(x0 + 150, y + 130, 0.8, { bracoAcima: true }) + pessoa(x0 + 220, y + 130, 0.8) + `<ellipse cx="${x0 + 180}" cy="${y + 60}" rx="90" ry="14" fill="#FFE9A8" opacity="0.6"/>`;
  for (let r = 0; r < 4; r++) for (let i = 0; i < 12; i++) {
    const xx = x0 + 400 + i * 62 + r * 10, yy = y + 120 + r * 22;
    o += `<rect x="${xx - 14}" y="${yy}" width="30" height="14" rx="3" fill="#8B1E2D"/><circle cx="${xx}" cy="${yy - 8}" r="9" fill="${escolha(PELES)}"/>`;
  }
  // biblioteca
  y = tops[1];
  for (let i = 0; i < 6; i++) {
    const xx = x0 + 60 + i * 110;
    o += `<rect x="${xx}" y="${y + 50}" width="80" height="96" fill="${C.madeira}"/>`;
    for (let p = 0; p < 4; p++) for (let l = 0; l < 7; l++) o += `<rect x="${xx + 6 + l * 10}" y="${y + 56 + p * 23}" width="8" height="18" fill="${escolha(['#E36B5D', '#3C78D8', '#F2C14E', '#6AA84F', '#7D5BA6', '#F5F0E6'])}"/>`;
  }
  for (let i = 0; i < 3; i++) o += `<rect x="${x0 + 760 + i * 130}" y="${y + 104}" width="100" height="8" fill="${C.madeira}"/>` + sentada(x0 + 770 + i * 130, y + 148, 0.7) + sentada(x0 + 840 + i * 130, y + 148, 0.7);
  o += `<rect x="${x0 + 1050}" y="${y + 120}" width="90" height="28" rx="14" fill="${C.ambar}"/>` + pessoa(x0 + 1080, y + 146, 0.5) + pessoa(x0 + 1110, y + 146, 0.45);
  // TI
  y = tops[2];
  for (let i = 0; i < 8; i++) {
    const xx = x0 + 70 + i * 130;
    o += `<rect x="${xx}" y="${y + 100}" width="100" height="8" fill="#9AA3A0"/><rect x="${xx + 30}" y="${y + 70}" width="40" height="28" rx="2" fill="#2E3A4A"/><rect x="${xx + 33}" y="${y + 73}" width="34" height="22" fill="#6EC1E4"/>` + sentada(xx + 20, y + 146, 0.65);
  }
  o += arvore(110, 780, 1.6) + ipe(1490, 790, 1.4) + pessoa(1420, 840, 0.8) + pessoa(1460, 846, 0.6);
  return svg('Centro cultural e educacional · corte em três níveis', o, 'Corte esquemático, sem escala · lotação do auditório é meta, não capacidade licenciada');
};

cenas['04-praca-anfiteatro'] = () => {
  semente = 41;
  let o = `<rect width="${W}" height="${H}" fill="url(#tarde)"/><circle cx="1300" cy="210" r="70" fill="#FCE3A6"/>${mata(330, [C.verde3, C.verde2, C.verde], 38, 1.1)}<rect y="420" width="${W}" height="480" fill="${C.concreto}"/>`;
  // anfiteatro
  for (let i = 0; i < 6; i++) o += `<path d="M${300 - i * 40} ${720 - i * 4} A ${500 + i * 40} ${180 + i * 22} 0 0 1 ${1300 + i * 40} ${720 - i * 4}" fill="none" stroke="${i % 2 ? '#C6BBA8' : '#D6CCB9'}" stroke-width="30"/>`;
  o += `<ellipse cx="800" cy="610" rx="230" ry="60" fill="${C.terracota}"/>`;
  o += pessoa(730, 600, 0.95, { bracoAcima: true }) + pessoa(800, 596, 0.95) + pessoa(870, 600, 0.95, { bracoAcima: true }) + `<rect x="790" y="530" width="4" height="66" fill="#333"/>`;
  // varal de luzes
  o += `<path d="M120 300 Q 800 420 1480 300" fill="none" stroke="#333" stroke-width="2"/>`;
  for (let i = 0; i <= 30; i++) { const t = i / 30; const x = 120 + t * 1360; const y = 300 + 4 * 120 * t * (1 - t); o += `<circle cx="${x}" cy="${y + 6}" r="6" fill="#FFE08A"/>`; }
  // plateia nas arquibancadas
  for (let r = 0; r < 4; r++) for (let i = 0; i < 18; i++) {
    const a = Math.PI * (0.08 + 0.84 * (i / 17)); const rx = 560 + r * 60, ry = 210 + r * 30;
    const x = 800 - Math.cos(a) * rx, y = 720 - r * 4 - Math.sin(a) * ry * 0.35 + 70;
    if (rnd() < 0.7) o += sentada(x, y, 0.62);
  }
  // feira
  for (let i = 0; i < 3; i++) o += `<path d="M${60 + i * 120} 640 l50 -46 l50 46z" fill="${escolha([C.ambar, C.terracota, C.azul])}"/><rect x="${66 + i * 120}" y="640" width="88" height="50" fill="#fff" opacity="0.85"/>` + pessoa(110 + i * 120, 740, 0.8);
  o += `<rect x="1380" y="600" width="150" height="100" fill="${C.creme}"/><path d="M1370 600 l85 -40 l85 40z" fill="${C.verde}"/>` + rotulo(1455, 660, 'Quiosque', C.escuro, 18, 'middle') + pessoa(1420, 760, 0.8) + pessoa(1490, 770, 0.8);
  o += cadeirante(1150, 820, 0.85) + pessoa(260, 860, 0.9) + bicicleta(500, 870, 0.9);
  o += coletor(1250, 840) + banco(980, 850) + poste(200, 780, 1, true) + poste(1350, 790, 1, true);
  return svg('Praça central e anfiteatro aberto', o, 'Ilustração conceitual · lotação, acústica e rotas de fuga a estudar');
};

cenas['05-playgrounds'] = () => {
  semente = 51;
  let o = `<rect width="${W}" height="${H}" fill="url(#ceu)"/>${nuvem(400, 110)}${nuvem(1200, 140, 0.9)}${mata(330, [C.verde3, C.verde2, C.verde], 36, 1)}<rect y="420" width="${W}" height="480" fill="${C.grama}"/>`;
  o += `<rect x="120" y="520" width="620" height="300" rx="40" fill="#E9A57A"/><rect x="820" y="500" width="680" height="320" rx="40" fill="#A7C7E7"/>`;
  // 0-5: casinha, escorregador baixo, areia
  o += `<rect x="220" y="640" width="120" height="100" fill="${C.ambar}"/><path d="M200 640 l80 -60 l80 60z" fill="${C.terracota}"/><rect x="265" y="690" width="30" height="50" fill="#6B4A2E"/>`;
  o += `<path d="M380 740 L380 680 L420 680 L500 740" fill="none" stroke="${C.menta}" stroke-width="12"/><ellipse cx="610" cy="760" rx="100" ry="30" fill="#F1D9A6"/>`;
  o += pessoa(600, 760, 0.45) + pessoa(640, 770, 0.4) + pessoa(450, 740, 0.45) + sentada(560, 830, 0.8) + pessoa(700, 840, 0.85);
  // 6-12: torre, escorregador, balanço, escalada
  o += `<rect x="900" y="560" width="140" height="20" fill="${C.ambar}"/><rect x="905" y="580" width="10" height="200" fill="${C.azul}"/><rect x="1025" y="580" width="10" height="200" fill="${C.azul}"/><path d="M1040 580 Q 1120 640 1150 780" fill="none" stroke="#E36B5D" stroke-width="16" stroke-linecap="round"/>`;
  o += `<line x1="1220" y1="560" x2="1440" y2="560" stroke="#5B6FB5" stroke-width="10"/><line x1="1230" y1="560" x2="1210" y2="790" stroke="#5B6FB5" stroke-width="8"/><line x1="1430" y1="560" x2="1450" y2="790" stroke="#5B6FB5" stroke-width="8"/>`;
  o += `<line x1="1290" y1="560" x2="1300" y2="700" stroke="#333" stroke-width="2"/><line x1="1340" y1="560" x2="1330" y2="700" stroke="#333" stroke-width="2"/><rect x="1288" y="700" width="50" height="8" fill="#333"/>` + sentada(1305, 710, 0.5);
  o += `<line x1="1380" y1="560" x2="1390" y2="700" stroke="#333" stroke-width="2"/><line x1="1420" y1="560" x2="1410" y2="700" stroke="#333" stroke-width="2"/><rect x="1380" y="700" width="40" height="8" fill="#333"/>`;
  o += pessoa(960, 556, 0.5, { bracoAcima: true }) + pessoa(1150, 780, 0.5, { correndo: true }) + pessoa(1080, 790, 0.55, { correndo: true }) + pessoa(1250, 800, 0.85);
  o += arvore(780, 560, 1.4) + arvore(80, 520, 1.2) + ipe(1530, 520, 1.2);
  o += banco(150, 830) + sentada(170, 820, 0.8) + sentada(220, 820, 0.8) + cadeirante(860, 835, 0.85) + coletor(760, 830);
  o += etiqueta(140, 560, 'Playground 0 a 5 anos') + etiqueta(1160, 540, 'Playground 6 a 12 anos');
  return svg('Playgrounds e lazer familiar', o, 'Ilustração conceitual · piso amortecedor, sombra e áreas por faixa etária');
};

cenas['06-campo-quadras'] = () => {
  semente = 61;
  let o = `<rect width="${W}" height="${H}" fill="url(#tarde)"/><circle cx="380" cy="260" r="80" fill="#FCD38A"/>${mata(360, [C.verde3, C.verde2], 34, 1)}<rect y="440" width="${W}" height="460" fill="${C.grama}"/>`;
  // campo em perspectiva
  o += `<path d="M180 500 L1420 500 L1560 860 L40 860Z" fill="#3E9B57"/><path d="M180 500 L1420 500 L1560 860 L40 860Z" fill="none" stroke="#fff" stroke-width="5"/><line x1="800" y1="500" x2="800" y2="860" stroke="#fff" stroke-width="4"/><ellipse cx="800" cy="670" rx="120" ry="44" fill="none" stroke="#fff" stroke-width="4"/>`;
  for (let i = 0; i < 6; i++) o += `<path d="M${180 + i * 0} ${500} " />`;
  o += `<rect x="96" y="610" width="10" height="110" fill="#fff"/><rect x="96" y="610" width="70" height="10" fill="#fff"/>` + `<rect x="1494" y="610" width="10" height="110" fill="#fff"/><rect x="1434" y="610" width="70" height="10" fill="#fff"/>`;
  for (let i = 0; i < 12; i++) o += pessoa(260 + i * 100 + rnd() * 40, 620 + rnd() * 200, 0.75, { correndo: rnd() > 0.4, roupa: i % 2 ? C.ambar : C.azul });
  o += `<circle cx="760" cy="760" r="10" fill="#fff" stroke="#333"/>`;
  // refletores
  for (const x of [140, 1460]) o += `<rect x="${x - 4}" y="300" width="8" height="200" fill="#4A4F55"/><rect x="${x - 30}" y="290" width="60" height="22" fill="#4A4F55"/><rect x="${x - 26}" y="294" width="52" height="14" fill="#FFF2B8"/>`;
  o += etiqueta(200, 470, 'Campo society com refletores');
  o += sentada(80, 835, 0.8) + pessoa(140, 835, 0.8) + cadeirante(1500, 838, 0.8) + coletor(300, 838);
  return svg('Campo society', o, 'Ilustração conceitual · dimensões e iluminação a definir em projeto');
};

cenas['07-horta-inclusao'] = () => {
  semente = 71;
  let o = `<rect width="${W}" height="${H}" fill="url(#ceu)"/>${nuvem(1100, 120)}${mata(340, [C.verde3, C.verde2, C.verde], 36, 1)}<rect y="430" width="${W}" height="470" fill="#B9D48C"/>`;
  // galpão do viveiro e compostagem
  o += `<rect x="1120" y="440" width="360" height="190" fill="${C.creme}"/><path d="M1100 440 l200 -70 l200 70z" fill="${C.verde}"/><rect x="1150" y="480" width="120" height="80" fill="#CFE6EE"/><rect x="1300" y="520" width="80" height="110" fill="#6B4A2E"/>` + etiqueta(1190, 420, 'Viveiro e compostagem');
  for (let i = 0; i < 3; i++) o += `<rect x="${1130 + i * 90}" y="660" width="70" height="60" fill="#6B4A2E"/><rect x="${1130 + i * 90}" y="650" width="70" height="12" fill="#8B5E3C"/>`;
  o += coletor(1420, 720);
  // canteiros elevados
  for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++) {
    const x = 120 + i * 240 + r * 60, y = 560 + r * 160;
    o += `<rect x="${x}" y="${y}" width="200" height="56" fill="${C.madeira}"/><rect x="${x}" y="${y - 6}" width="200" height="12" fill="#6B4A2E"/>`;
    for (let k = 0; k < 9; k++) o += `<ellipse cx="${x + 14 + k * 21}" cy="${y - 12}" rx="10" ry="14" fill="${escolha([C.verde, '#6AA84F', C.menta])}"/>`;
    o += flores(x + 20, y - 26, 4, ['#E36B5D', '#F2C14E']);
  }
  o += cadeirante(330, 700, 0.85) + pessoa(560, 690, 0.85, { bracoAcima: true }) + pessoa(800, 700, 0.85) + pessoa(260, 820, 0.85) + pessoa(620, 825, 0.5) + pessoa(950, 820, 0.85);
  // ponto de orientação
  o += `<rect x="40" y="440" width="200" height="110" fill="${C.menta}"/><rect x="60" y="470" width="70" height="80" fill="#CFE6EE"/>` + rotulo(140, 430, 'Ponto de Orientação Cidadã', C.escuro, 16, 'middle');
  o += arvore(1000, 560, 1.3) + arvore(1560, 600, 1.3);
  return svg('Horta comunitária, viveiro e inclusão', o, 'Ilustração conceitual · canteiros elevados e acessíveis; uso a definir com a comunidade');
};

cenas['08-bosque-caminhos'] = () => {
  semente = 81;
  let o = `<rect width="${W}" height="${H}" fill="url(#ceu)"/>${mata(260, [C.verde3], 30, 1.4)}${mata(380, [C.verde2, C.verde3], 34, 1.3)}<rect y="450" width="${W}" height="450" fill="#7FB36A"/>`;
  o += `<path d="M700 460 Q 820 600 600 900 L1100 900 Q 960 620 760 460Z" fill="${C.creme}"/><path d="M1600 560 Q 1200 620 1040 700" fill="none" stroke="#C9A97A" stroke-width="40"/>`;
  for (const [x, y, s] of [[120, 640, 1.8], [330, 560, 1.4], [480, 700, 1.7], [1180, 560, 1.4], [1350, 680, 1.8], [1520, 600, 1.5], [60, 860, 2], [1560, 880, 2]]) o += arvore(x, y, s);
  o += ipe(250, 760, 1.5) + ipe(1450, 780, 1.4);
  // jardim sensorial
  o += `<ellipse cx="300" cy="820" rx="200" ry="50" fill="#9CCB7A"/>` + flores(150, 815, 30) + etiqueta(170, 760, 'Jardim sensorial');
  o += bicicleta(720, 640, 0.8) + pessoa(870, 760, 0.95, { correndo: true }) + cadeirante(760, 860, 1) + pessoa(830, 870, 1) + pessoa(940, 580, 0.6) + pessoa(980, 590, 0.6);
  o += banco(1060, 800) + sentada(1080, 790, 0.9) + `<rect x="1230" y="760" width="8" height="70" fill="#4A4F55"/><rect x="1200" y="720" width="80" height="50" rx="4" fill="${C.escuro}"/><text x="1240" y="752" font-size="14" fill="#fff" text-anchor="middle">Trilha</text>`;
  o += poste(600, 760) + poste(1120, 700);
  return svg('Bosque, caminhos acessíveis e jardim sensorial', o, 'Ilustração conceitual · espécies conforme inventário arbóreo; trilha condicionada a licença');
};

cenas['09-restaurante-quiosques'] = () => {
  semente = 91;
  let o = `<rect width="${W}" height="${H}" fill="url(#tarde)"/>${mata(330, [C.verde3, C.verde2], 34, 1)}<rect y="430" width="${W}" height="470" fill="${C.concreto}"/>`;
  o += `<rect x="260" y="360" width="760" height="260" fill="${C.creme}"/><rect x="240" y="344" width="800" height="22" fill="${C.verde}"/>${janelas(290, 390, 700, 150, 7, 1, '#FFE6B0')}<rect x="590" y="540" width="100" height="80" fill="#6B4A2E"/>`;
  o += etiqueta(580, 330, 'Restaurante');
  for (let i = 0; i < 5; i++) {
    const x = 220 + i * 190;
    o += `<rect x="${x}" y="${700}" width="90" height="10" fill="${C.madeira}"/><rect x="${x + 42}" y="710" width="6" height="40" fill="#555"/><path d="M${x + 45} 600 l-70 30 l140 0z" fill="${escolha([C.ambar, C.terracota, C.menta])}"/><rect x="${x + 43}" y="630" width="4" height="70" fill="#555"/>`;
    o += sentada(x - 10, 760, 0.75) + sentada(x + 100, 760, 0.75);
  }
  o += `<rect x="1180" y="520" width="200" height="140" fill="${C.creme}"/><path d="M1160 520 l120 -60 l120 60z" fill="${C.terracota}"/><rect x="1200" y="560" width="160" height="50" fill="#FFE6B0"/>` + rotulo(1280, 450, 'Quiosque', C.escuro, 18, 'middle');
  o += pessoa(1240, 740, 0.85) + pessoa(1310, 745, 0.85) + pessoa(1380, 750, 0.6) + cadeirante(1100, 820, 0.85) + coletor(1450, 820);
  o += poste(150, 800, 1, true) + poste(1520, 800, 1, true) + arvore(80, 560, 1.4) + ipe(1550, 580, 1.2);
  return svg('Restaurante e quiosques', o, 'Ilustração conceitual · operação por concessão; horários conforme a demanda');
};

cenas['10-noite'] = () => {
  semente = 101;
  let o = `<rect width="${W}" height="${H}" fill="#14243A"/>`;
  for (let i = 0; i < 80; i++) o += `<circle cx="${rnd() * W}" cy="${rnd() * 300}" r="${rnd() * 1.8 + 0.5}" fill="#fff" opacity="${0.4 + rnd() * 0.6}"/>`;
  o += `<circle cx="1320" cy="140" r="46" fill="#F5F0D6"/>${mata(380, ['#183B2A', '#1F4A34'], 36, 1.2)}<rect y="460" width="${W}" height="440" fill="#2A3F33"/>`;
  o += `<rect x="1000" y="290" width="460" height="210" fill="#55606A"/>${janelas(1020, 310, 420, 170, 9, 4, '#FFD27A')}` + `<rect x="200" y="340" width="360" height="160" fill="#6B655A"/>${janelas(220, 360, 320, 120, 7, 3, '#FFE6A8')}`;
  o += `<path d="M0 780 Q 500 640 800 610 T 1600 700" fill="none" stroke="#7A7366" stroke-width="46" stroke-linecap="round"/>`;
  for (let i = 0; i < 9; i++) { const x = 80 + i * 185; const y = 760 - Math.sin((i / 8) * Math.PI) * 120; o += poste(x, y, 1, true); }
  for (let i = 0; i < 10; i++) o += pessoa(300 + i * 110 + rnd() * 30, 700 + rnd() * 60, 0.7, { correndo: i % 3 === 0 });
  o += cadeirante(860, 760, 0.8) + bicicleta(1200, 760, 0.8);
  return svg('O parque à noite', o, 'Ilustração conceitual · iluminação, segurança e horários a definir no plano de operação');
};

const OUT = path.join(__dirname, 'svg');
fs.mkdirSync(OUT, { recursive: true });
for (const [nome, f] of Object.entries(cenas)) fs.writeFileSync(path.join(OUT, `${nome}.svg`), f());
console.log(Object.keys(cenas).length, 'ilustrações em', OUT);

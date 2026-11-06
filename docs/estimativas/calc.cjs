const D = require('./dados.cjs');
function calcular() {
  const linhas = D.capex.map(([grupo, cod, item, fase, qmin, qmax, un, umin, umax, base, nota]) => ({ grupo, cod, item, fase, qmin, qmax, un, umin, umax, base, nota, min: qmin * umin, max: qmax * umax }));
  const grupos = {};
  for (const l of linhas) { const g = (grupos[l.grupo] ??= { min: 0, max: 0 }); g.min += l.min; g.max += l.max; }
  const obra = linhas.filter((l) => l.cod !== 'PRE-001');
  const obraMin = obra.reduce((a, l) => a + l.min, 0), obraMax = obra.reduce((a, l) => a + l.max, 0);
  const ind = D.indiretos.map(([cod, item, pmin, pmax, base, nota]) => ({ cod, item, pmin, pmax, base, nota, min: obraMin * pmin, max: obraMax * pmax }));
  const diretoMin = linhas.reduce((a, l) => a + l.min, 0), diretoMax = linhas.reduce((a, l) => a + l.max, 0);
  const capexMin = diretoMin + ind.reduce((a, l) => a + l.min, 0), capexMax = diretoMax + ind.reduce((a, l) => a + l.max, 0);
  const porFase = {};
  for (const l of linhas) { const f = l.fase; const k = (porFase[f] ??= { min: 0, max: 0 }); k.min += l.min; k.max += l.max; }
  const eq = D.equipe.map(([area, funcao, qmin, qmax, smin, smax, base, nota]) => ({ area, funcao, qmin, qmax, smin, smax, base, nota,
    min: qmin * (smin * 12 * (1 + D.ENC[0]) + D.BEN[0] * 12), max: qmax * (smax * 12 * (1 + D.ENC[1]) + D.BEN[1] * 12) }));
  const pessoas = [eq.reduce((a, e) => a + e.qmin, 0), eq.reduce((a, e) => a + e.qmax, 0)];
  const folhaMensal = [eq.reduce((a, e) => a + e.qmin * e.smin, 0), eq.reduce((a, e) => a + e.qmax * e.smax, 0)];
  const pessoalAno = [eq.reduce((a, e) => a + e.min, 0), eq.reduce((a, e) => a + e.max, 0)];
  const outros = D.opexOutros.map(([cod, item, a, b, base, nota]) => a === 'pct'
    ? { cod, item, base, nota: nota, min: obraMin * b[0], max: obraMax * b[1] }
    : { cod, item, base, nota, min: a, max: b });
  const opexAno = [pessoalAno[0] + outros.reduce((s, o) => s + o.min, 0), pessoalAno[1] + outros.reduce((s, o) => s + o.max, 0)];
  return { linhas, grupos, obraMin, obraMax, ind, diretoMin, diretoMax, capexMin, capexMax, porFase, eq, pessoas, folhaMensal, pessoalAno, outros, opexAno, imp: D.implantacaoProgramas };
}
const brl = (v) => {
  if (v >= 1e6) return 'R$ ' + (v / 1e6).toLocaleString('pt-BR', v >= 1e7 ? { maximumFractionDigits: 0 } : { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' mi';
  if (v >= 1e3) return 'R$ ' + Math.round(v / 1e3).toLocaleString('pt-BR') + ' mil';
  return 'R$ ' + v.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
};
const faixa = (a, b) => (a === b ? brl(a) : `${brl(a)} a ${brl(b)}`);
module.exports = { calcular, brl, faixa };
if (require.main === module) {
  const r = calcular();
  for (const l of r.linhas) console.log(l.cod.padEnd(9), faixa(l.min, l.max).padEnd(26), l.item);
  console.log('grupos', Object.fromEntries(Object.entries(r.grupos).map(([k, v]) => [k, faixa(v.min, v.max)])));
  for (const l of r.ind) console.log(l.cod, faixa(l.min, l.max));
  console.log('direto', faixa(r.diretoMin, r.diretoMax), 'CAPEX', faixa(r.capexMin, r.capexMax));
  console.log('fases', Object.fromEntries(Object.entries(r.porFase).map(([k, v]) => [k, faixa(v.min, v.max)])));
  console.log('pessoas', r.pessoas, 'folha mensal', faixa(...r.folhaMensal), 'pessoal/ano', faixa(...r.pessoalAno));
  for (const o of r.outros) console.log(o.cod, faixa(o.min, o.max));
  console.log('OPEX/ano', faixa(...r.opexAno));
}

import { EDIFICIOS } from '../data/buildings';
import { ORCAMENTO } from '../data/budget';
import { INSTALACOES, pegadas } from '../data/facilities';
import { CAMINHOS, GEOMETRIA_SETORES } from '../data/layout';
import { NUCLEOS } from '../data/nucleos';
import { AREA_ESTUDO_M2, SETORES } from '../data/sectors';
import { TERRENO } from '../data/terrain';
import { validarLancamento } from './budget-calculator';
import { bbox, distancia, isSimplePolygon, polygonArea, pontoNoConvexo, retangulo, type Point } from './geometry';

/** Espaçamento mínimo ILUSTRATIVO entre pontos de coleta: impede "lixeira a cada 2 m". */
export const ESPACAMENTO_MINIMO_COLETORES_M = 15;

/** Objetos 3D com ficha orçamentária própria. */
export function objetos3dConhecidos(): Set<string> {
  return new Set(EDIFICIOS.map((e) => e.objeto_3d_id));
}

/** Validação cruzada dos dados-semente. Retorna lista de erros (vazia = ok). */
export function validarDados(): string[] {
  const erros: string[] = [];
  const setores = new Set(SETORES.map((s) => s.id));
  const nucleos = new Set(NUCLEOS.map((n) => n.id));
  const objetos = objetos3dConhecidos();
  const orcamentoIds = new Set(ORCAMENTO.map((o) => o.id));

  const todosIds = [
    ...SETORES.map((s) => s.id),
    ...NUCLEOS.map((n) => n.id),
    ...EDIFICIOS.map((e) => e.id),
    ...INSTALACOES.map((i) => i.id),
    ...ORCAMENTO.map((o) => o.id),
  ];
  const repetidos = todosIds.filter((id, i) => todosIds.indexOf(id) !== i);
  if (repetidos.length) erros.push(`IDs repetidos: ${repetidos.join(', ')}`);

  const soma = SETORES.reduce((acc, s) => acc + s.area_territorial_m2, 0);
  if (soma !== AREA_ESTUDO_M2) erros.push(`Soma das áreas = ${soma}, esperado ${AREA_ESTUDO_M2}`);
  const somaPct = SETORES.reduce((acc, s) => acc + s.percentual, 0);
  if (somaPct !== 100) erros.push(`Soma dos percentuais = ${somaPct}`);
  for (const s of SETORES) {
    if (s.percentual * AREA_ESTUDO_M2 !== s.area_territorial_m2 * 100) erros.push(`${s.id}: percentual incoerente com a área`);
  }

  for (const n of NUCLEOS) {
    if (n.setores_ids.length === 0) erros.push(`${n.id}: núcleo sem setor`);
    for (const s of n.setores_ids) if (!setores.has(s)) erros.push(`${n.id}: setor inexistente ${s}`);
  }

  for (const e of EDIFICIOS) {
    if (!setores.has(e.setor_id)) erros.push(`${e.id}: setor inexistente ${e.setor_id}`);
    for (const n of e.nucleos_ids) if (!nucleos.has(n)) erros.push(`${e.id}: núcleo inexistente ${n}`);
    if (!orcamentoIds.has(e.orcamento_id)) erros.push(`${e.id}: lançamento inexistente ${e.orcamento_id}`);
    const ordens = e.niveis.map((n) => n.ordem).sort((a, b) => a - b);
    if (ordens.some((o, i) => o !== i)) erros.push(`${e.id}: níveis fora de sequência`);
  }

  for (const i of INSTALACOES) {
    if (i.setor_id !== null && !setores.has(i.setor_id)) erros.push(`${i.id}: setor inexistente ${i.setor_id}`);
    if (i.nucleos_ids.length === 0) erros.push(`${i.id}: sem núcleo`);
    for (const n of i.nucleos_ids) if (!nucleos.has(n)) erros.push(`${i.id}: núcleo inexistente ${n}`);
    if (!orcamentoIds.has(i.orcamento_id)) erros.push(`${i.id}: lançamento inexistente ${i.orcamento_id}`);
    if (i.posicoes.length === 0) erros.push(`${i.id}: sem posição`);
  }

  for (const o of ORCAMENTO) {
    if (!setores.has(o.setor_id)) erros.push(`${o.id}: setor inexistente ${o.setor_id}`);
    if (o.objeto_3d_id !== null && !objetos.has(o.objeto_3d_id)) erros.push(`${o.id}: objeto 3D inexistente ${o.objeto_3d_id}`);
    if (o.parent_id !== null && !orcamentoIds.has(o.parent_id)) erros.push(`${o.id}: pai inexistente ${o.parent_id}`);
    erros.push(...validarLancamento(o));
  }
  return erros;
}

function sobrepoe(a: Point[], b: Point[]): boolean {
  const A = bbox(a);
  const B = bbox(b);
  return A.minX < B.maxX && B.minX < A.maxX && A.minZ < B.maxZ && B.minZ < A.maxZ;
}

const dentroDe = (poly: readonly Point[], pegada: Point[]) => pegada.every((p) => pontoNoConvexo(poly, p));

/** Validação geométrica da implantação ilustrativa (D2). */
export function validarImplantacao(): string[] {
  const erros: string[] = [];
  const terreno = TERRENO.poligono;

  let somaDesenhada = 0;
  for (const s of SETORES) {
    const poly = GEOMETRIA_SETORES[s.id];
    if (!poly) {
      erros.push(`${s.id}: setor sem geometria`);
      continue;
    }
    const a = polygonArea(poly);
    somaDesenhada += a;
    if (Math.abs(a - s.area_territorial_m2) > 1) erros.push(`${s.id}: área desenhada ${a.toFixed(1)} ≠ ${s.area_territorial_m2}`);
    if (!isSimplePolygon(poly)) erros.push(`${s.id}: polígono não simples`);
    if (!dentroDe(terreno, [...poly])) erros.push(`${s.id}: setor fora do terreno`);
  }
  if (Math.abs(somaDesenhada - AREA_ESTUDO_M2) > 1) erros.push(`Soma desenhada ${somaDesenhada.toFixed(1)} ≠ ${AREA_ESTUDO_M2}`);

  const ocupacoes: { id: string; pegada: Point[] }[] = [];
  for (const e of EDIFICIOS) {
    const pegada = retangulo(e.posicao[0], e.posicao[1], e.planta_ilustrativa.largura, e.planta_ilustrativa.profundidade);
    if (!dentroDe(GEOMETRIA_SETORES[e.setor_id] ?? [], pegada)) erros.push(`${e.id}: fora do setor ${e.setor_id}`);
    ocupacoes.push({ id: e.id, pegada });
  }
  for (const i of INSTALACOES) {
    const alvo = i.setor_id === null ? terreno : GEOMETRIA_SETORES[i.setor_id] ?? [];
    pegadas(i).forEach((pegada, k) => {
      if (!dentroDe(alvo, pegada)) erros.push(`${i.id}#${k}: fora de ${i.setor_id ?? 'terreno'}`);
      ocupacoes.push({ id: `${i.id}#${k}`, pegada });
    });
  }
  for (let a = 0; a < ocupacoes.length; a++) {
    for (let b = a + 1; b < ocupacoes.length; b++) {
      if (sobrepoe(ocupacoes[a]!.pegada, ocupacoes[b]!.pegada)) erros.push(`Sobreposição: ${ocupacoes[a]!.id} × ${ocupacoes[b]!.id}`);
    }
  }

  for (const i of INSTALACOES.filter((x) => x.tipo === 'coleta_seletiva')) {
    for (let a = 0; a < i.posicoes.length; a++) {
      for (let b = a + 1; b < i.posicoes.length; b++) {
        const d = distancia(i.posicoes[a]!, i.posicoes[b]!);
        if (d < ESPACAMENTO_MINIMO_COLETORES_M) erros.push(`${i.id}: coletores a ${d.toFixed(1)} m`);
      }
    }
  }

  for (const c of CAMINHOS) {
    for (const p of c.pontos) if (!pontoNoConvexo(terreno, p)) erros.push(`${c.id}: ponto fora do terreno (${p.join(', ')})`);
  }
  return erros;
}

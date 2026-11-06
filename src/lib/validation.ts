import { EDIFICIOS } from '../data/buildings';
import { ORCAMENTO } from '../data/budget';
import { AREA_ESTUDO_M2, SETORES } from '../data/sectors';
import { validarLancamento } from './budget-calculator';

/** Objetos 3D existentes na cena (D1). */
export function objetos3dConhecidos(): Set<string> {
  return new Set(EDIFICIOS.map((e) => e.objeto_3d_id));
}

/** Validação cruzada dos dados-semente. Retorna lista de erros (vazia = ok). */
export function validarDados(): string[] {
  const erros: string[] = [];
  const setores = new Set(SETORES.map((s) => s.id));
  const objetos = objetos3dConhecidos();
  const orcamentoIds = new Set(ORCAMENTO.map((o) => o.id));

  const todosIds = [...SETORES.map((s) => s.id), ...EDIFICIOS.map((e) => e.id), ...ORCAMENTO.map((o) => o.id)];
  const repetidos = todosIds.filter((id, i) => todosIds.indexOf(id) !== i);
  if (repetidos.length) erros.push(`IDs repetidos: ${repetidos.join(', ')}`);

  const soma = SETORES.reduce((acc, s) => acc + s.area_territorial_m2, 0);
  if (soma !== AREA_ESTUDO_M2) erros.push(`Soma das áreas = ${soma}, esperado ${AREA_ESTUDO_M2}`);
  const somaPct = SETORES.reduce((acc, s) => acc + s.percentual, 0);
  if (somaPct !== 100) erros.push(`Soma dos percentuais = ${somaPct}`);
  for (const s of SETORES) {
    if (s.percentual * AREA_ESTUDO_M2 !== s.area_territorial_m2 * 100) erros.push(`${s.id}: percentual incoerente com a área`);
  }

  for (const e of EDIFICIOS) {
    if (!setores.has(e.setor_id)) erros.push(`${e.id}: setor inexistente ${e.setor_id}`);
    if (!orcamentoIds.has(e.orcamento_id)) erros.push(`${e.id}: lançamento inexistente ${e.orcamento_id}`);
    const ordens = e.niveis.map((n) => n.ordem).sort((a, b) => a - b);
    if (ordens.some((o, i) => o !== i)) erros.push(`${e.id}: níveis fora de sequência`);
  }

  for (const o of ORCAMENTO) {
    if (!setores.has(o.setor_id)) erros.push(`${o.id}: setor inexistente ${o.setor_id}`);
    if (o.objeto_3d_id !== null && !objetos.has(o.objeto_3d_id)) erros.push(`${o.id}: objeto 3D inexistente ${o.objeto_3d_id}`);
    if (o.parent_id !== null && !orcamentoIds.has(o.parent_id)) erros.push(`${o.id}: pai inexistente ${o.parent_id}`);
    erros.push(...validarLancamento(o));
  }
  return erros;
}

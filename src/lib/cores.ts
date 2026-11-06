import type { Camada, ModoCor } from '../app/store';
import { EDIFICIOS, edificioPorId } from '../data/buildings';
import { ORCAMENTO } from '../data/budget';
import { instalacaoPorId } from '../data/facilities';
import { FASE_POR_OBJETO, fasePorId } from '../data/phases';
import { setorPorId } from '../data/sectors';
import type { Selecao } from '../features/selection/selection';
import { lancamentosDoObjeto, subtotal } from './budget-calculator';

const CAMADA_DO_SETOR: Record<string, Camada> = {
  verde: 'verde', esporte: 'esporte', pracas: 'cultura', cultura: 'cultura', infancia: 'infancia', circulacao: 'circulacao', servicos: 'servicos', inclusao: 'inclusao',
};

/** Camadas temáticas de um objeto (derivadas do setor e dos núcleos). */
export function camadasDe(s: Selecao): Camada[] {
  if (s.tipo === 'terreno') return [];
  if (s.tipo === 'setor') return [CAMADA_DO_SETOR[s.id]!].filter(Boolean);
  if (s.tipo === 'edificio') {
    const e = edificioPorId(s.id);
    return e ? [CAMADA_DO_SETOR[e.setor_id]!] : [];
  }
  const i = instalacaoPorId(s.id);
  if (!i) return [];
  const out = new Set<Camada>();
  if (i.setor_id) out.add(CAMADA_DO_SETOR[i.setor_id]!);
  if (i.nucleos_ids.includes('sustentabilidade')) out.add('sustentabilidade');
  if (i.setor_id === null) out.add('circulacao');
  return [...out];
}

export function visivelNasCamadas(s: Selecao, camadas: Record<Camada, boolean>): boolean {
  const cs = camadasDe(s);
  return cs.length === 0 || cs.some((c) => camadas[c]);
}

export const COR_CUSTO = { com_valor: '#3f8f4f', pendente: '#c25b4a', sem_lancamento: '#9e9e9e' };

/** Situação de custo para o modo de cor "custos". */
export function situacaoCusto(s: Selecao): keyof typeof COR_CUSTO {
  let itens = [] as typeof ORCAMENTO[number][];
  if (s.tipo === 'edificio') {
    const e = EDIFICIOS.find((x) => x.id === s.id);
    if (e) itens = lancamentosDoObjeto(ORCAMENTO, e.objeto_3d_id);
  } else if (s.tipo === 'instalacao') {
    const i = instalacaoPorId(s.id);
    if (i) itens = ORCAMENTO.filter((l) => l.id === i.orcamento_id);
  } else if (s.tipo === 'setor') {
    itens = ORCAMENTO.filter((l) => l.setor_id === s.id);
  }
  if (itens.length === 0) return 'sem_lancamento';
  return itens.every((l) => subtotal(l).valor !== null) ? 'com_valor' : 'pendente';
}

/** Cor do objeto conforme o modo de cor; `base` é a cor normal (setores). */
export function corPorModo(s: Selecao, modo: ModoCor, base: string): string {
  if (modo === 'setores') return base;
  if (modo === 'custos') return COR_CUSTO[situacaoCusto(s)];
  const fase = FASE_POR_OBJETO[s.id];
  return fase ? fasePorId(fase).cor : '#bdbdbd';
}

export function corBaseSetor(id: string): string {
  return setorPorId(id)?.cor ?? '#cccccc';
}

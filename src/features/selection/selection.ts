import { EDIFICIOS, edificioPorId } from '../../data/buildings';
import { ORCAMENTO } from '../../data/budget';
import { INSTALACOES, instalacaoPorId } from '../../data/facilities';
import { SETORES, setorPorId } from '../../data/sectors';
import { TERRENO } from '../../data/terrain';
import { formatarCusto, idsComFilhos, lancamentosDoObjeto, subtotal } from '../../lib/budget-calculator';

export type Selecao =
  | { tipo: 'terreno'; id: 'terreno' }
  | { tipo: 'setor'; id: string }
  | { tipo: 'edificio'; id: string }
  | { tipo: 'instalacao'; id: string };

export interface ItemSelecionavel {
  selecao: Selecao;
  rotulo: string;
}

export interface GrupoSelecionavel {
  titulo: string;
  itens: ItemSelecionavel[];
}

/** Lista acessível de objetos da cena: permite selecionar tudo sem WebGL. */
export const GRUPOS_SELECIONAVEIS: readonly GrupoSelecionavel[] = [
  { titulo: 'Edifícios', itens: EDIFICIOS.map((e) => ({ selecao: { tipo: 'edificio', id: e.id }, rotulo: e.nome })) },
  { titulo: 'Setores', itens: SETORES.map((s) => ({ selecao: { tipo: 'setor', id: s.id }, rotulo: s.nome })) },
  { titulo: 'Instalações', itens: INSTALACOES.map((i) => ({ selecao: { tipo: 'instalacao', id: i.id }, rotulo: i.nome })) },
  { titulo: 'Terreno', itens: [{ selecao: { tipo: 'terreno', id: 'terreno' }, rotulo: TERRENO.nome }] },
];

export function mesmaSelecao(a: Selecao | null, b: Selecao | null): boolean {
  return a !== null && b !== null && a.tipo === b.tipo && a.id === b.id;
}

export function nomeDaSelecao(s: Selecao): string {
  switch (s.tipo) {
    case 'edificio':
      return edificioPorId(s.id)?.nome ?? s.id;
    case 'setor':
      return setorPorId(s.id)?.nome ?? s.id;
    case 'instalacao':
      return instalacaoPorId(s.id)?.nome ?? s.id;
    case 'terreno':
      return TERRENO.nome;
  }
}

/**
 * Texto de custo para tooltip. Só mostra valor se TODAS as folhas do objeto
 * tiverem subtotal calculável; caso contrário, "A calcular".
 */
export function textoCustoDaSelecao(s: Selecao): string {
  const pais = idsComFilhos(ORCAMENTO);
  let itens: typeof ORCAMENTO[number][] = [];
  if (s.tipo === 'edificio') {
    const e = edificioPorId(s.id);
    if (e) itens = lancamentosDoObjeto(ORCAMENTO, e.objeto_3d_id).filter((l) => !pais.has(l.id));
  } else if (s.tipo === 'instalacao') {
    const i = instalacaoPorId(s.id);
    // lançamento agrupado: cobre várias instalações, não há custo individual
    if (i) return 'A calcular (lançamento agrupado ' + i.orcamento_id + ')';
  }
  if (itens.length === 0) return formatarCusto(null);
  const valores = itens.map((l) => subtotal(l).valor);
  if (valores.some((v) => v === null)) return formatarCusto(null);
  return formatarCusto(valores.reduce<number>((a, v) => a + (v ?? 0), 0));
}

import { edificioPorId } from '../../data/buildings';
import { setorPorId } from '../../data/sectors';
import { TERRENO } from '../../data/terrain';

export type Selecao =
  | { tipo: 'terreno'; id: 'terreno' }
  | { tipo: 'setor'; id: string }
  | { tipo: 'edificio'; id: string };

export interface ItemSelecionavel {
  selecao: Selecao;
  rotulo: string;
}

/** Lista acessível de objetos da cena (D1): permite seleção sem WebGL. */
export const ITENS_SELECIONAVEIS: readonly ItemSelecionavel[] = [
  { selecao: { tipo: 'edificio', id: 'ginasio' }, rotulo: edificioPorId('ginasio')!.nome },
  { selecao: { tipo: 'setor', id: 'esporte' }, rotulo: `Setor: ${setorPorId('esporte')!.nome}` },
  { selecao: { tipo: 'terreno', id: 'terreno' }, rotulo: TERRENO.nome },
];

export function mesmaSelecao(a: Selecao | null, b: Selecao | null): boolean {
  return a !== null && b !== null && a.tipo === b.tipo && a.id === b.id;
}

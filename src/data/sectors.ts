import type { Fonte, StatusEvidencia } from './types';

export interface Setor {
  id: string;
  nome: string;
  /** Área territorial do cenário de estudo. Hipotética: não é levantamento. */
  area_territorial_m2: number;
  percentual: number;
  status: StatusEvidencia;
  cor: string;
  fontes: Fonte[];
  observacao?: string;
}

/** Área total do cenário de estudo (hipótese, não certificada). */
export const AREA_ESTUDO_M2 = 100_000;

/**
 * Setores territoriais mutuamente exclusivos, contabilizados uma única vez.
 * A imagem original soma 95.000 m²; a reserva de inclusão/horta (5.000 m²)
 * é PROPOSTA dos estudos v1/v2, não medição.
 */
export const SETORES: readonly Setor[] = [
  { id: 'verde', nome: 'Parque verde, bosque e jardins', area_territorial_m2: 30_000, percentual: 30, status: 'hipotetico', cor: '#4f8f5f', fontes: [{ documento: 'imagem_referencia', secao: 'distribuicao_original.jpeg' }, { documento: 'estudo_v1', secao: '3' }] },
  { id: 'esporte', nome: 'Esporte e atividades físicas', area_territorial_m2: 20_000, percentual: 20, status: 'hipotetico', cor: '#d9a441', fontes: [{ documento: 'imagem_referencia', secao: 'distribuicao_original.jpeg' }, { documento: 'estudo_v1', secao: '3' }], observacao: 'Área territorial do setor, não área construída do ginásio.' },
  { id: 'pracas', nome: 'Praças, eventos e anfiteatro', area_territorial_m2: 10_000, percentual: 10, status: 'hipotetico', cor: '#c9785a', fontes: [{ documento: 'imagem_referencia', secao: 'distribuicao_original.jpeg' }, { documento: 'estudo_v1', secao: '3' }] },
  { id: 'cultura', nome: 'Centro cultural e educacional', area_territorial_m2: 8_000, percentual: 8, status: 'hipotetico', cor: '#7b93c9', fontes: [{ documento: 'imagem_referencia', secao: 'distribuicao_original.jpeg' }, { documento: 'estudo_v1', secao: '3' }] },
  { id: 'infancia', nome: 'Playgrounds e lazer familiar', area_territorial_m2: 7_000, percentual: 7, status: 'hipotetico', cor: '#a58fc4', fontes: [{ documento: 'imagem_referencia', secao: 'distribuicao_original.jpeg' }, { documento: 'estudo_v1', secao: '3' }] },
  { id: 'circulacao', nome: 'Circulação, acessibilidade e ciclovias', area_territorial_m2: 12_000, percentual: 12, status: 'hipotetico', cor: '#93a1a6', fontes: [{ documento: 'imagem_referencia', secao: 'distribuicao_original.jpeg' }, { documento: 'estudo_v1', secao: '3' }] },
  { id: 'servicos', nome: 'Estacionamento e serviços', area_territorial_m2: 8_000, percentual: 8, status: 'hipotetico', cor: '#b8b8b8', fontes: [{ documento: 'imagem_referencia', secao: 'distribuicao_original.jpeg' }, { documento: 'estudo_v1', secao: '3' }] },
  { id: 'inclusao', nome: 'Inclusão social e horta comunitária', area_territorial_m2: 5_000, percentual: 5, status: 'proposto', cor: '#6fae9c', fontes: [{ documento: 'estudo_v1', secao: '3' }, { documento: 'estudo_v2', secao: '3' }], observacao: 'Reserva proposta para fechar 100.000 m²; não consta na imagem original e não é medida.' },
];

export function setorPorId(id: string): Setor | undefined {
  return SETORES.find((s) => s.id === id);
}

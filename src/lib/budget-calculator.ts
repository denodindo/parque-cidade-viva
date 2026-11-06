/**
 * Cálculo orçamentário conservador (Prompt Mestre §8).
 *
 * - Ausência de dado é `null`, nunca zero.
 * - Somam-se apenas lançamentos FOLHA (sem filhos), evitando contar pai e filho duas vezes.
 * - CAPEX e OPEX são totalizados separadamente.
 */

export type TipoCusto = 'CAPEX' | 'OPEX_mensal' | 'OPEX_anual' | 'implantacao_programas';
export type StatusCusto = 'a_cotar' | 'a_calcular' | 'sem_referencia' | 'estimado' | 'cotado' | 'verificado';

export const UNIDADES_VALIDAS = ['m2', 'm3', 'm', 'un', 'vb', 'mes', 'ano', 'a_definir'] as const;
export type Unidade = (typeof UNIDADES_VALIDAS)[number];

export interface LancamentoOrcamento {
  id: string;
  objeto_3d_id: string | null;
  nome: string;
  setor_id: string;
  categoria: string;
  tipo: TipoCusto;
  quantidade: number | null;
  unidade: Unidade;
  custo_unitario_brl: number | null;
  fonte: string | null;
  data_base: string | null;
  status: StatusCusto;
  parent_id: string | null;
  incluido_no_total: boolean;
  observacoes?: string;
}

export interface ResultadoSubtotal {
  valor: number | null;
  erros: string[];
}

export function validarLancamento(l: LancamentoOrcamento): string[] {
  const erros: string[] = [];
  if (l.quantidade !== null && (!Number.isFinite(l.quantidade) || l.quantidade < 0)) erros.push(`${l.id}: quantidade inválida`);
  if (l.custo_unitario_brl !== null && (!Number.isFinite(l.custo_unitario_brl) || l.custo_unitario_brl < 0)) erros.push(`${l.id}: custo unitário inválido`);
  if (!(UNIDADES_VALIDAS as readonly string[]).includes(l.unidade)) erros.push(`${l.id}: unidade desconhecida`);
  if (l.custo_unitario_brl !== null && l.fonte === null) erros.push(`${l.id}: valor sem fonte`);
  return erros;
}

/** Subtotal só existe com quantidade, unitário, unidade definida e fonte válidos. */
export function subtotal(l: LancamentoOrcamento): ResultadoSubtotal {
  const erros = validarLancamento(l);
  if (erros.length > 0) return { valor: null, erros };
  if (l.quantidade === null || l.custo_unitario_brl === null || l.unidade === 'a_definir') return { valor: null, erros };
  return { valor: l.quantidade * l.custo_unitario_brl, erros };
}

export function idsComFilhos(itens: readonly LancamentoOrcamento[]): Set<string> {
  return new Set(itens.map((i) => i.parent_id).filter((p): p is string => p !== null));
}

export interface ResumoTipo {
  tipo: TipoCusto;
  /** Soma das folhas que têm valor calculável. Nunca é chamada de "total". */
  total_parcial_brl: number;
  folhas_com_valor: number;
  folhas_pendentes: number;
  /** Fração 0–1 de folhas com valor; `null` se não há folhas. */
  cobertura: number | null;
  completo: boolean;
}

export function resumoPorTipo(itens: readonly LancamentoOrcamento[], tipo: TipoCusto): ResumoTipo {
  const pais = idsComFilhos(itens);
  const folhas = itens.filter((i) => i.tipo === tipo && i.incluido_no_total && !pais.has(i.id));
  let total = 0;
  let comValor = 0;
  for (const f of folhas) {
    const { valor } = subtotal(f);
    if (valor !== null) {
      total += valor;
      comValor++;
    }
  }
  const pendentes = folhas.length - comValor;
  return {
    tipo,
    total_parcial_brl: total,
    folhas_com_valor: comValor,
    folhas_pendentes: pendentes,
    cobertura: folhas.length === 0 ? null : comValor / folhas.length,
    completo: folhas.length > 0 && pendentes === 0,
  };
}

export function lancamentosDoObjeto(itens: readonly LancamentoOrcamento[], objeto3dId: string): LancamentoOrcamento[] {
  return itens.filter((i) => i.objeto_3d_id === objeto3dId);
}

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const TEXTO_STATUS: Record<StatusCusto, string> = {
  a_cotar: 'A cotar',
  a_calcular: 'A calcular',
  sem_referencia: 'Sem referência',
  estimado: 'Estimado',
  cotado: 'Cotado',
  verificado: 'Verificado',
};

/** Texto de interface: valor ausente NUNCA vira "R$ 0,00". */
export function formatarCusto(valor: number | null): string {
  return valor === null ? 'A calcular' : BRL.format(valor);
}

export function textoStatusCusto(s: StatusCusto): string {
  return TEXTO_STATUS[s];
}

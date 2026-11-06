import type { LancamentoOrcamento } from '../lib/budget-calculator';

/**
 * Lançamentos orçamentários. NENHUM preço foi inventado: sem fonte, o valor é `null`.
 * Códigos alinhados ao estudo v1, seção 10.2.
 */
export const ORCAMENTO: readonly LancamentoOrcamento[] = [
  {
    id: 'GIN-001',
    objeto_3d_id: 'ginasio-multifuncional',
    nome: 'Ginásio — construção civil',
    setor_id: 'esporte',
    categoria: 'obra',
    tipo: 'CAPEX',
    quantidade: null,
    unidade: 'm2',
    custo_unitario_brl: null,
    fonte: null,
    data_base: null,
    status: 'a_cotar',
    parent_id: null,
    incluido_no_total: true,
    observacoes: 'm² a definir; fonte prevista SINAPI-SP ou composição documentada.',
  },
  {
    id: 'AQU-001',
    objeto_3d_id: 'ginasio-multifuncional',
    nome: 'Piscinas e tratamento de água',
    setor_id: 'esporte',
    categoria: 'equipamento_ou_obra_a_classificar',
    tipo: 'CAPEX',
    quantidade: null,
    unidade: 'a_definir',
    custo_unitario_brl: null,
    fonte: null,
    data_base: null,
    status: 'a_cotar',
    parent_id: 'GIN-001',
    incluido_no_total: true,
    observacoes: 'Sem quantitativo e composição validados.',
  },
  {
    id: 'CUL-001',
    objeto_3d_id: 'centro-cultural-educacional',
    nome: 'Centro cultural e educacional',
    setor_id: 'cultura',
    categoria: 'obra',
    tipo: 'CAPEX',
    quantidade: null,
    unidade: 'm2',
    custo_unitario_brl: null,
    fonte: null,
    data_base: null,
    status: 'a_cotar',
    parent_id: null,
    incluido_no_total: true,
    observacoes: 'm² a definir.',
  },
];

import { describe, expect, it } from 'vitest';
import { ORCAMENTO } from '../src/data/budget';
import { formatarCusto, resumoPorTipo, subtotal, type LancamentoOrcamento } from '../src/lib/budget-calculator';

const base: LancamentoOrcamento = {
  id: 'X-001', objeto_3d_id: null, nome: 'Teste', setor_id: 'esporte', categoria: 'obra', tipo: 'CAPEX',
  quantidade: null, unidade: 'm2', custo_unitario_brl: null, fonte: null, data_base: null,
  status: 'a_cotar', parent_id: null, incluido_no_total: true,
};

describe('orçamento', () => {
  it('valor ausente (null) não vira R$ 0', () => {
    expect(subtotal(base).valor).toBeNull();
    expect(formatarCusto(null)).toBe('A calcular');
    expect(formatarCusto(subtotal(base).valor)).not.toMatch(/R\$/);
  });

  it('todos os lançamentos-semente estão sem preço (nenhum valor inventado)', () => {
    for (const l of ORCAMENTO) {
      expect(l.custo_unitario_brl).toBeNull();
      expect(l.fonte).toBeNull();
      expect(subtotal(l).valor).toBeNull();
    }
    const r = resumoPorTipo(ORCAMENTO, 'CAPEX');
    expect(r.completo).toBe(false);
    expect(r.folhas_com_valor).toBe(0);
  });

  it('subtotal exige quantidade, unitário, unidade definida e fonte', () => {
    const ok = { ...base, quantidade: 2, custo_unitario_brl: 10, fonte: 'cotação documentada (teste)' };
    expect(subtotal(ok).valor).toBe(20);
    expect(subtotal({ ...ok, unidade: 'a_definir' }).valor).toBeNull();
    expect(subtotal({ ...ok, fonte: null }).erros).toContain('X-001: valor sem fonte');
    expect(subtotal({ ...ok, quantidade: -1 }).valor).toBeNull();
    expect(subtotal({ ...ok, custo_unitario_brl: -5 }).erros.length).toBeGreaterThan(0);
  });

  it('não conta pai e filho duas vezes', () => {
    const pai = { ...base, id: 'P', quantidade: 1, custo_unitario_brl: 1000, fonte: 'teste' };
    const filho = { ...base, id: 'F', parent_id: 'P', quantidade: 1, custo_unitario_brl: 300, fonte: 'teste' };
    const r = resumoPorTipo([pai, filho], 'CAPEX');
    expect(r.total_parcial_brl).toBe(300);
    expect(r.folhas_com_valor).toBe(1);
  });

  it('OPEX não entra no CAPEX e cobertura parcial é reportada', () => {
    const capex = { ...base, id: 'C', quantidade: 1, custo_unitario_brl: 100, fonte: 'teste' };
    const opex = { ...base, id: 'O', tipo: 'OPEX_anual' as const, unidade: 'ano' as const, quantidade: 1, custo_unitario_brl: 50, fonte: 'teste' };
    const pendente = { ...base, id: 'Pd' };
    const r = resumoPorTipo([capex, opex, pendente], 'CAPEX');
    expect(r.total_parcial_brl).toBe(100);
    expect(r.cobertura).toBe(0.5);
    expect(r.completo).toBe(false);
    expect(resumoPorTipo([capex, opex, pendente], 'OPEX_anual').total_parcial_brl).toBe(50);
  });
});

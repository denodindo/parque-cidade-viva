import { describe, expect, it } from 'vitest';
import { EDIFICIOS, edificioPorId } from '../src/data/buildings';
import { AREA_ESTUDO_M2, SETORES, setorPorId } from '../src/data/sectors';
import { validarDados } from '../src/lib/validation';

describe('dados-semente', () => {
  it('passa na validação cruzada (IDs únicos, referências existentes)', () => {
    expect(validarDados()).toEqual([]);
  });

  it('setores somam 100.000 m² e 100% no cenário de estudo', () => {
    expect(SETORES.reduce((a, s) => a + s.area_territorial_m2, 0)).toBe(AREA_ESTUDO_M2);
    expect(SETORES.reduce((a, s) => a + s.percentual, 0)).toBe(100);
    expect(SETORES).toHaveLength(8);
  });

  it('a imagem original soma 95.000 m² e a reserva de 5.000 m² é proposta', () => {
    const inclusao = setorPorId('inclusao')!;
    expect(inclusao.area_territorial_m2).toBe(5_000);
    expect(inclusao.status).toBe('proposto');
    const original = SETORES.filter((s) => s.id !== 'inclusao').reduce((a, s) => a + s.area_territorial_m2, 0);
    expect(original).toBe(95_000);
  });

  it('nenhum setor é marcado como verificado sem evidência', () => {
    expect(SETORES.every((s) => s.status !== 'verificado')).toBe(true);
    expect(EDIFICIOS.every((e) => e.status !== 'verificado')).toBe(true);
  });

  it('ginásio tem exatamente 4 níveis e centro cultural exatamente 3', () => {
    expect(edificioPorId('ginasio')!.niveis.map((n) => n.nome)).toEqual(['Térreo', '1º pavimento', '2º pavimento', '3º pavimento']);
    expect(edificioPorId('centro-cultural')!.niveis.map((n) => n.nome)).toEqual(['Térreo', '1º pavimento', '2º pavimento']);
  });

  it('ginásio exibe aviso de viabilidade pendente e não tem áreas inventadas', () => {
    const g = edificioPorId('ginasio')!;
    expect(g.avisos.join(' ')).toMatch(/sujeito a estudo estrutural/);
    expect(g.projecao_no_solo_m2).toBeNull();
    expect(g.area_construida_total_m2).toBeNull();
  });
});

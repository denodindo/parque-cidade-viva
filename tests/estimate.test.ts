import { describe, expect, it } from 'vitest';
import { ORCAMENTO } from '../src/data/budget';
import { ESTIMATIVA_CAPEX } from '../src/data/estimates';
import {
  capexTotal,
  contasEssenciais,
  linhasOpex,
  materiaisObra,
  equipeResumo,
  faixaDe,
  formatarFaixa,
  linhasDoObjeto,
  opexAnual,
  porGrupo,
} from '../src/lib/estimativa';
import { auditarTextos, validarDados } from '../src/lib/validation';

describe('estimativa de ordem de grandeza (DT-35)', () => {
  it('bate com o anexo em Word: CAPEX, OPEX e equipe', () => {
    expect(formatarFaixa(capexTotal())).toBe('R$ 79 mi a R$ 184 mi');
    expect(formatarFaixa(opexAnual())).toBe('R$ 7,9 mi a R$ 23 mi');
    expect(equipeResumo().pessoas).toEqual([79, 127]);
  });

  it('não altera o orçamento rastreável: preços continuam nulos', () => {
    expect(ORCAMENTO.every((l) => l.custo_unitario_brl === null && l.quantidade === null && l.fonte === null)).toBe(true);
  });

  it('cada linha entra uma vez: soma dos grupos = soma das linhas', () => {
    const grupos = porGrupo().reduce<[number, number]>((a, g) => [a[0] + g.faixa[0], a[1] + g.faixa[1]], [0, 0]);
    expect(grupos).toEqual([...faixaDe(ESTIMATIVA_CAPEX)]);
    expect(new Set(ESTIMATIVA_CAPEX.map((l) => l.id)).size).toBe(ESTIMATIVA_CAPEX.length);
  });

  it('ginásio soma obra civil, piscinas e equipamentos (filhos fora da obra civil)', () => {
    expect(linhasDoObjeto('ginasio-multifuncional').map((l) => l.id)).toEqual(['GIN-001', 'AQU-001', 'ACA-001']);
    expect(formatarFaixa(faixaDe(linhasDoObjeto('ginasio-multifuncional')))).toBe('R$ 33 mi a R$ 70 mi');
  });

  it('dados válidos e sem frases proibidas', () => {
    expect(validarDados()).toEqual([]);
    expect(auditarTextos()).toEqual([]);
  });

  it('formatação nunca produz R$ 0', () => {
    for (const l of ESTIMATIVA_CAPEX) expect(formatarFaixa(faixaDe([l]))).not.toMatch(/R\$\s*0/);
  });

  it('contas essenciais: consumo × tarifa, mensal e anual coerentes', () => {
    const c = contasEssenciais();
    expect(c.kwh).toEqual([71740, 183000]);
    expect(c.m3).toEqual([625, 2450]);
    expect(formatarFaixa(c.mensal)).toBe('R$ 76 mil a R$ 336 mil');
    expect(c.anual).toEqual([c.mensal[0] * 12, c.mensal[1] * 12]);
  });

  it('OPEX soma cada linha uma vez e inclui contas e materiais de consumo', () => {
    const ids = linhasOpex().map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(expect.arrayContaining(['OPX-PES-001', 'OPX-UTL-001', 'OPX-CON-001', 'OPX-PIS-001', 'OPX-MAN-001']));
  });

  it('materiais da obra ficam dentro do CAPEX (parte, não soma)', () => {
    const m = materiaisObra();
    const total = [m.reduce((a, x) => a + x.faixa[0], 0), m.reduce((a, x) => a + x.faixa[1], 0)];
    expect(formatarFaixa(total as [number, number])).toBe('R$ 6,1 mi a R$ 15 mi');
    expect(total[1]).toBeLessThan(capexTotal()[0]);
  });
});

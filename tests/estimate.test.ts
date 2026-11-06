import { describe, expect, it } from 'vitest';
import { ORCAMENTO } from '../src/data/budget';
import { ESTIMATIVA_CAPEX } from '../src/data/estimates';
import {
  capexTotal,
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
    expect(formatarFaixa(opexAnual())).toBe('R$ 7,9 mi a R$ 21 mi');
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
});

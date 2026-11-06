import { describe, expect, it } from 'vitest';
import { EDIFICIOS } from '../src/data/buildings';
import { INSTALACOES } from '../src/data/facilities';
import { FAIXAS_IMPLANTACAO, GEOMETRIA_SETORES, TRILHA_HIPOTETICA } from '../src/data/layout';
import { NUCLEOS } from '../src/data/nucleos';
import { SETORES } from '../src/data/sectors';
import { TERRENO } from '../src/data/terrain';
import { bbox, polygonArea, pontoNoConvexo } from '../src/lib/geometry';
import { validarImplantacao } from '../src/lib/validation';

describe('implantação ilustrativa (D2)', () => {
  it('passa na validação geométrica (áreas, encaixe, sobreposições, coletores, caminhos)', () => {
    expect(validarImplantacao()).toEqual([]);
  });

  it('cada setor aparece uma vez no layout e tem a área do quadro', () => {
    expect(FAIXAS_IMPLANTACAO.flat().sort()).toEqual(SETORES.map((s) => s.id).sort());
    for (const s of SETORES) expect(polygonArea(GEOMETRIA_SETORES[s.id]!)).toBeCloseTo(s.area_territorial_m2, 0);
  });

  it('setores não se sobrepõem: cada ponto amostrado do terreno pertence a exatamente um setor', () => {
    const { minX, maxX, minZ, maxZ } = bbox(TERRENO.poligono);
    let amostras = 0;
    // passo irracional evita cair exatamente sobre bordas compartilhadas
    for (let x = minX + 0.37; x < maxX; x += 3.1416) {
      for (let z = minZ + 0.71; z < maxZ; z += 2.7183) {
        if (!pontoNoConvexo(TERRENO.poligono, [x, z])) continue;
        amostras++;
        const donos = SETORES.filter((s) => pontoNoConvexo(GEOMETRIA_SETORES[s.id]!, [x, z]));
        expect(donos.length, `ponto (${x.toFixed(2)}, ${z.toFixed(2)})`).toBe(1);
      }
    }
    expect(amostras).toBeGreaterThan(5000);
  });

  it('dez núcleos, cada um ligado a ao menos uma instalação ou edifício, sem área própria', () => {
    expect(NUCLEOS).toHaveLength(10);
    const usados = new Set([...INSTALACOES.flatMap((i) => i.nucleos_ids), ...EDIFICIOS.flatMap((e) => e.nucleos_ids)]);
    for (const n of NUCLEOS) {
      expect(usados.has(n.id), n.id).toBe(true);
      expect(n).not.toHaveProperty('area_territorial_m2');
    }
  });

  it('catálogo: 1 campo, 2 quadras externas, 1 restaurante, 3 quiosques', () => {
    const conta = (t: string) => INSTALACOES.filter((i) => i.tipo === t).reduce((a, i) => a + i.posicoes.length, 0);
    expect(conta('campo')).toBe(1);
    expect(conta('quadra')).toBe(2);
    expect(conta('restaurante')).toBe(1);
    expect(conta('quiosque')).toBe(3);
    expect(conta('sanitario')).toBeGreaterThanOrEqual(3);
  });

  it('coleta seletiva em pontos estratégicos, não a cada 2 m', () => {
    const coleta = INSTALACOES.find((i) => i.tipo === 'coleta_seletiva')!;
    expect(coleta.posicoes.length).toBeLessThan(20);
  });

  it('trilha é hipotética, sai do terreno e tem aviso', () => {
    expect(TRILHA_HIPOTETICA.aviso).toMatch(/hipotética/);
    expect(TRILHA_HIPOTETICA.pontos.some((p) => !pontoNoConvexo(TERRENO.poligono, p))).toBe(true);
  });

  it('nenhuma instalação é marcada como verificada', () => {
    expect(INSTALACOES.every((i) => i.status !== 'verificado')).toBe(true);
  });
});

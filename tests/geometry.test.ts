import { describe, expect, it } from 'vitest';
import { centroid, clipBelowZ, isConvex, isSimplePolygon, normalizeToArea, polygonArea, stripWithArea } from '../src/lib/geometry';
import { CONTORNO_REFERENCIA_PX, SETOR_ESPORTE_GEOMETRIA, TERRENO } from '../src/data/terrain';

describe('geometria básica', () => {
  const quadrado = [[0, 0], [10, 0], [10, 10], [0, 10]] as const;

  it('calcula área e centroide pelo método do laço', () => {
    expect(polygonArea(quadrado)).toBe(100);
    expect(centroid(quadrado)).toEqual([5, 5]);
  });

  it('detecta auto-interseção (gravata-borboleta)', () => {
    expect(isSimplePolygon(quadrado)).toBe(true);
    expect(isSimplePolygon([[0, 0], [10, 10], [10, 0], [0, 10]])).toBe(false);
  });

  it('rejeita polígonos degenerados', () => {
    expect(isSimplePolygon([[0, 0], [1, 1]])).toBe(false);
    expect(isSimplePolygon([[0, 0], [1, 1], [2, 2]])).toBe(false);
  });

  it('normaliza para a área-alvo, centralizado na origem', () => {
    const { polygon } = normalizeToArea(quadrado, 400);
    expect(polygonArea(polygon)).toBeCloseTo(400, 6);
    const [cx, cz] = centroid(polygon);
    expect(cx).toBeCloseTo(0, 9);
    expect(cz).toBeCloseTo(0, 9);
  });

  it('recorta faixa com área-alvo por bisseção', () => {
    expect(polygonArea(clipBelowZ(quadrado, 5))).toBeCloseTo(50, 9);
    const { polygon } = stripWithArea(quadrado, 30);
    expect(polygonArea(polygon)).toBeCloseTo(30, 1);
  });
});

describe('terreno ilustrativo', () => {
  it('contorno de referência é simples e convexo', () => {
    expect(isSimplePolygon(CONTORNO_REFERENCIA_PX)).toBe(true);
    expect(isConvex(CONTORNO_REFERENCIA_PX)).toBe(true);
  });

  it('terreno normalizado fecha 100.000 m² e não se auto-intersecta', () => {
    expect(isSimplePolygon(TERRENO.poligono)).toBe(true);
    expect(polygonArea(TERRENO.poligono)).toBeCloseTo(100_000, 3);
  });

  it('rotula a escala como normalizada e não certificada', () => {
    expect(TERRENO.natureza_escala).toBe('escala visual normalizada');
    expect(TERRENO.aviso).toMatch(/escala não certificada/);
  });

  it('setor de esporte desenhado tem a área hipotética do setor (20.000 m²) e cabe no terreno', () => {
    expect(isSimplePolygon(SETOR_ESPORTE_GEOMETRIA.polygon)).toBe(true);
    expect(polygonArea(SETOR_ESPORTE_GEOMETRIA.polygon)).toBeCloseTo(20_000, 1);
    expect(polygonArea(clipBelowZ(TERRENO.poligono, SETOR_ESPORTE_GEOMETRIA.zCut))).toBeCloseTo(20_000, 1);
  });
});

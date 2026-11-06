import { bbox, distanciaPontoSegmento, pontoNoConvexo, type Point } from './geometry';

/** PRNG determinístico (mulberry32): a maquete fica igual a cada carregamento. */
export function prng(semente: number): () => number {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface OpcoesArvores {
  quantidade: number;
  semente: number;
  /** Retângulos/polígonos convexos a evitar (edifícios, quadras etc.). */
  evitar: readonly (readonly Point[])[];
  /** Polilinhas de caminhos a evitar. */
  caminhos: readonly (readonly Point[])[];
  /** Distância mínima a caminhos, áreas evitadas e bordas do polígono (m). */
  folga: number;
  /** Distância mínima entre árvores (m). */
  espacamento: number;
}

/**
 * Distribui árvores ILUSTRATIVAS dentro de um polígono convexo, por rejeição.
 * Não representa inventário arbóreo nem projeto paisagístico.
 */
export function gerarArvores(poligono: readonly Point[], o: OpcoesArvores): Point[] {
  const rand = prng(o.semente);
  const { minX, maxX, minZ, maxZ } = bbox(poligono);
  const out: Point[] = [];
  const bordas = poligono.map((p, i) => [p, poligono[(i + 1) % poligono.length]!] as const);
  const longeDe = (p: Point) =>
    bordas.every(([a, b]) => distanciaPontoSegmento(p, a, b) >= o.folga) &&
    o.caminhos.every((c) => c.every((a, i) => i === 0 || distanciaPontoSegmento(p, c[i - 1]!, a) >= o.folga)) &&
    o.evitar.every((r) => {
      const { minX: x0, maxX: x1, minZ: z0, maxZ: z1 } = bbox(r);
      return p[0] < x0 - o.folga || p[0] > x1 + o.folga || p[1] < z0 - o.folga || p[1] > z1 + o.folga;
    }) &&
    out.every((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) >= o.espacamento);
  for (let tentativa = 0; tentativa < o.quantidade * 60 && out.length < o.quantidade; tentativa++) {
    const p: Point = [minX + rand() * (maxX - minX), minZ + rand() * (maxZ - minZ)];
    if (pontoNoConvexo(poligono, p) && longeDe(p)) out.push(p);
  }
  return out;
}

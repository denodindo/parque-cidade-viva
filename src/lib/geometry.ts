/**
 * Geometria 2D do terreno ilustrativo.
 *
 * Coordenadas no plano (x, z), em metros de uma escala visual NORMALIZADA.
 * Nada aqui representa medição topográfica, cadastral ou georreferenciada.
 */

export type Point = readonly [x: number, z: number];
export type Polygon = readonly Point[];

/** Área com sinal pela fórmula do laço (shoelace). */
export function signedArea(poly: Polygon): number {
  let sum = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, z1] = poly[i]!;
    const [x2, z2] = poly[(i + 1) % poly.length]!;
    sum += x1 * z2 - x2 * z1;
  }
  return sum / 2;
}

export function polygonArea(poly: Polygon): number {
  return Math.abs(signedArea(poly));
}

export function centroid(poly: Polygon): Point {
  const a = signedArea(poly);
  if (a === 0) throw new Error('Polígono degenerado (área zero).');
  let cx = 0;
  let cz = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, z1] = poly[i]!;
    const [x2, z2] = poly[(i + 1) % poly.length]!;
    const cross = x1 * z2 - x2 * z1;
    cx += (x1 + x2) * cross;
    cz += (z1 + z2) * cross;
  }
  return [cx / (6 * a), cz / (6 * a)];
}

function orientation(p: Point, q: Point, r: Point): number {
  const v = (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  return Math.abs(v) < 1e-12 ? 0 : Math.sign(v);
}

function onSegment(p: Point, q: Point, r: Point): boolean {
  return (
    Math.min(p[0], r[0]) <= q[0] && q[0] <= Math.max(p[0], r[0]) &&
    Math.min(p[1], r[1]) <= q[1] && q[1] <= Math.max(p[1], r[1])
  );
}

export function segmentsIntersect(a1: Point, a2: Point, b1: Point, b2: Point): boolean {
  const o1 = orientation(a1, a2, b1);
  const o2 = orientation(a1, a2, b2);
  const o3 = orientation(b1, b2, a1);
  const o4 = orientation(b1, b2, a2);
  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && onSegment(a1, b1, a2)) return true;
  if (o2 === 0 && onSegment(a1, b2, a2)) return true;
  if (o3 === 0 && onSegment(b1, a1, b2)) return true;
  if (o4 === 0 && onSegment(b1, a2, b2)) return true;
  return false;
}

/**
 * Polígono simples: ao menos 3 vértices, área não nula, sem vértices repetidos
 * e sem auto-interseção entre arestas não adjacentes.
 */
export function isSimplePolygon(poly: Polygon): boolean {
  const n = poly.length;
  if (n < 3 || polygonArea(poly) === 0) return false;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (poly[i]![0] === poly[j]![0] && poly[i]![1] === poly[j]![1]) return false;
    }
  }
  for (let i = 0; i < n; i++) {
    const a1 = poly[i]!;
    const a2 = poly[(i + 1) % n]!;
    for (let j = i + 1; j < n; j++) {
      const adjacent = j === i + 1 || (i === 0 && j === n - 1);
      if (adjacent) continue;
      if (segmentsIntersect(a1, a2, poly[j]!, poly[(j + 1) % n]!)) return false;
    }
  }
  return true;
}

/** Escala uniforme em torno da origem. */
export function scalePolygon(poly: Polygon, factor: number): Point[] {
  return poly.map(([x, z]) => [x * factor, z * factor] as const);
}

export function translatePolygon(poly: Polygon, dx: number, dz: number): Point[] {
  return poly.map(([x, z]) => [x + dx, z + dz] as const);
}

/**
 * Normaliza o polígono para uma área-alvo: centraliza no centroide e
 * aplica escala uniforme. Retorna o fator usado para registro/transparência.
 */
export function normalizeToArea(poly: Polygon, targetArea: number): { polygon: Point[]; scale: number } {
  if (!(targetArea > 0)) throw new Error('Área-alvo deve ser positiva.');
  const [cx, cz] = centroid(poly);
  const centered = translatePolygon(poly, -cx, -cz);
  const scale = Math.sqrt(targetArea / polygonArea(centered));
  return { polygon: scalePolygon(centered, scale), scale };
}

export function isConvex(poly: Polygon): boolean {
  let sign = 0;
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const o = orientation(poly[i]!, poly[(i + 1) % n]!, poly[(i + 2) % n]!);
    if (o === 0) continue;
    if (sign === 0) sign = o;
    else if (o !== sign) return false;
  }
  return true;
}

export type Eixo = 'x' | 'z';

const coord = (p: Point, eixo: Eixo) => (eixo === 'x' ? p[0] : p[1]);

/**
 * Recorta pelo semiplano em que a coordenada do eixo é <= corte (lado 'menor')
 * ou >= corte (lado 'maior'). Sutherland–Hodgman: exato para polígonos convexos.
 */
export function clipEixo(poly: Polygon, eixo: Eixo, corte: number, lado: 'menor' | 'maior'): Point[] {
  const out: Point[] = [];
  const dentro = (p: Point) => (lado === 'menor' ? coord(p, eixo) <= corte : coord(p, eixo) >= corte);
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i]!;
    const next = poly[(i + 1) % poly.length]!;
    if (dentro(cur)) out.push(cur);
    if (dentro(cur) !== dentro(next)) {
      const t = (corte - coord(cur, eixo)) / (coord(next, eixo) - coord(cur, eixo));
      out.push([cur[0] + t * (next[0] - cur[0]), cur[1] + t * (next[1] - cur[1])]);
    }
  }
  return out;
}

/**
 * Divide um polígono convexo por uma reta perpendicular ao eixo, de modo que o
 * lado de coordenada menor tenha `areaPrimeiro`. Retorna [primeiro, resto].
 */
export function dividirPorArea(poly: Polygon, eixo: Eixo, areaPrimeiro: number, tolerancia = 0.001): [Point[], Point[]] {
  if (!isConvex(poly)) throw new Error('dividirPorArea exige polígono convexo.');
  const total = polygonArea(poly);
  if (!(areaPrimeiro > 0 && areaPrimeiro < total)) throw new Error('Área fora do intervalo (0, área total).');
  const cs = poly.map((p) => coord(p, eixo));
  let lo = Math.min(...cs);
  let hi = Math.max(...cs);
  let corte = (lo + hi) / 2;
  for (let i = 0; i < 200; i++) {
    corte = (lo + hi) / 2;
    const a = polygonArea(clipEixo(poly, eixo, corte, 'menor'));
    if (Math.abs(a - areaPrimeiro) <= tolerancia) break;
    if (a < areaPrimeiro) lo = corte;
    else hi = corte;
  }
  return [clipEixo(poly, eixo, corte, 'menor'), clipEixo(poly, eixo, corte, 'maior')];
}

/** Divide sucessivamente ao longo do eixo; a soma de `areas` deve ser a área do polígono. */
export function particionarSequencial(poly: Polygon, eixo: Eixo, areas: readonly number[]): Point[][] {
  const pecas: Point[][] = [];
  let resto: Point[] = [...poly];
  areas.forEach((a, i) => {
    if (i === areas.length - 1) {
      pecas.push(resto);
      return;
    }
    const [primeiro, r] = dividirPorArea(resto, eixo, a);
    pecas.push(primeiro);
    resto = r;
  });
  return pecas;
}

/**
 * Ponto dentro (ou na borda) de polígono convexo. Pontos a menos de `tolerancia`
 * metros de uma aresta contam como na borda (absorve arredondamento das interpolações).
 */
export function pontoNoConvexo(poly: Polygon, p: Point, tolerancia = 1e-6): boolean {
  let sinal = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i]!;
    const b = poly[(i + 1) % poly.length]!;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len === 0) continue;
    const dist = ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) / len;
    if (Math.abs(dist) <= tolerancia) continue;
    const o = Math.sign(dist);
    if (sinal === 0) sinal = o;
    else if (o !== sinal) return false;
  }
  return true;
}

export function bbox(poly: Polygon): { minX: number; maxX: number; minZ: number; maxZ: number } {
  const xs = poly.map((p) => p[0]);
  const zs = poly.map((p) => p[1]);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minZ: Math.min(...zs), maxZ: Math.max(...zs) };
}

/** Retângulo alinhado aos eixos, centrado em (cx, cz). */
export function retangulo(cx: number, cz: number, largura: number, profundidade: number): Point[] {
  const w = largura / 2;
  const d = profundidade / 2;
  return [[cx - w, cz - d], [cx + w, cz - d], [cx + w, cz + d], [cx - w, cz + d]];
}

export function distancia(a: Point, b: Point): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

export function distanciaPontoSegmento(p: Point, a: Point, b: Point): number {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const len2 = dx * dx + dz * dz;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / len2));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dz));
}

import { normalizeToArea, polygonArea, type Point } from '../lib/geometry';
import { AREA_ESTUDO_M2 } from './sectors';

/**
 * Vértices do contorno desenhado sobre `referencias/terreno_poligono.jpeg`,
 * em PIXELS da captura (x para a direita, y para baixo → eixo z da cena).
 * Leitura visual aproximada; não é levantamento topográfico nem cadastral.
 * A orientação do norte e a escala real NÃO estão comprovadas.
 */
export const CONTORNO_REFERENCIA_PX: readonly Point[] = [
  [310, 252], // vértice superior (borda com a área verde)
  [513, 722], // vértice inferior direito (junto à avenida)
  [313, 800], // vértice inferior esquerdo
  [158, 460], // vértice esquerdo
];

/**
 * Escala visual normalizada: o contorno é reescalado para que sua área seja a
 * área HIPOTÉTICA do estudo (100.000 m²). Isso não prova a área do terreno.
 */
const normalizado = normalizeToArea(CONTORNO_REFERENCIA_PX, AREA_ESTUDO_M2);

export const TERRENO = {
  id: 'terreno',
  nome: 'Terreno de estudo (contorno ilustrativo)',
  poligono: normalizado.polygon as readonly Point[],
  /** metros "normalizados" por pixel da captura — transformação registrada, não medida. */
  fator_escala_m_por_px: normalizado.scale,
  area_poligono_px2: polygonArea(CONTORNO_REFERENCIA_PX),
  natureza_escala: 'escala visual normalizada' as const,
  aviso: 'Geometria conceitual — escala não certificada',
};

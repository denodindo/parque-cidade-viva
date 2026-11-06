import { particionarSequencial, type Point } from '../lib/geometry';
import { SETORES, setorPorId } from './sectors';
import { TERRENO } from './terrain';

/**
 * Implantação ILUSTRATIVA dos 8 setores (D2).
 *
 * O terreno é fatiado em faixas ao longo de z (de cima para baixo na imagem de
 * referência) e cada faixa é fatiada ao longo de x. Cada fatia recebe exatamente
 * a área hipotética do setor no quadro de áreas. A disposição é uma proposta de
 * estudo, não um projeto de implantação.
 *
 * Racional da ordem (proposta):
 * - verde no topo, junto à área vegetada vizinha (borda ecológica);
 * - inclusão/horta e infância perto do verde; praças e cultura no centro;
 * - eixo de circulação separando as áreas de convivência do esporte;
 * - esporte e serviços junto à avenida visível na imagem (acesso e carga).
 */
export const FAIXAS_IMPLANTACAO: readonly (readonly string[])[] = [
  ['verde'],
  ['inclusao', 'infancia', 'pracas', 'cultura'],
  ['circulacao'],
  ['esporte', 'servicos'],
];

function area(id: string): number {
  const s = setorPorId(id);
  if (!s) throw new Error(`Setor inexistente no layout: ${id}`);
  return s.area_territorial_m2;
}

function calcular(): Record<string, Point[]> {
  const ids = FAIXAS_IMPLANTACAO.flat();
  if (new Set(ids).size !== ids.length || ids.length !== SETORES.length || !SETORES.every((s) => ids.includes(s.id))) {
    throw new Error('O layout deve conter cada setor exatamente uma vez.');
  }
  const faixas = particionarSequencial(TERRENO.poligono, 'z', FAIXAS_IMPLANTACAO.map((f) => f.reduce((a, id) => a + area(id), 0)));
  const out: Record<string, Point[]> = {};
  FAIXAS_IMPLANTACAO.forEach((faixa, i) => {
    const pecas = faixa.length === 1 ? [faixas[i]!] : particionarSequencial(faixas[i]!, 'x', faixa.map(area));
    faixa.forEach((id, j) => (out[id] = pecas[j]!));
  });
  return out;
}

/** Polígono ilustrativo de cada setor, na escala visual normalizada. */
export const GEOMETRIA_SETORES: Readonly<Record<string, readonly Point[]>> = calcular();

/**
 * Regra de atribuição (sem dupla contagem): o setor "circulação" é a faixa do
 * eixo principal e representa a área agregada da rede. Caminhos desenhados
 * dentro de outros setores são linhas de referência e contam na área do setor
 * em que estão; não somam área própria.
 */
export const CAMINHOS: readonly { id: string; nome: string; pontos: Point[] }[] = [
  { id: 'eixo-norte-sul', nome: 'Eixo principal (avenida → praça → bosque)', pontos: [[30, 226], [30, 155], [-5, 152], [-5, 94], [-4, 44], [0, -8], [0, -79], [-20, -140], [-30, -230]] },
  { id: 'alameda-leste-oeste', nome: 'Alameda transversal / ciclovia', pontos: [[-95, 69], [142, 69]] },
  { id: 'acesso-servicos', nome: 'Acesso de serviços e emergência', pontos: [[155, 180], [158, 120], [150, 94]] },
  { id: 'passeio-bosque', nome: 'Passeio do bosque', pontos: [[-150, -90], [-110, -130], [-60, -150], [-20, -140], [30, -100], [60, -85]] },
];

/**
 * Trilha / conexão com a área vegetada vizinha: HIPÓTESE condicionada a
 * titularidade, licenciamento ambiental e autorização (PM §5). Desenhada fora
 * do terreno, tracejada.
 */
export const TRILHA_HIPOTETICA = {
  id: 'trilha-conexao-ecologica',
  nome: 'Trilha / conexão ecológica (hipotética)',
  pontos: [[-30, -230], [-18, -306], [-40, -360], [-85, -400]] as Point[],
  aviso: 'Conexão hipotética: depende de titularidade, gestão da área vizinha, licenciamento ambiental, segurança e autorização.',
};

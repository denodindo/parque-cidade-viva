import type { Fonte, StatusEvidencia } from './types';

export interface Nivel {
  id: string;
  /** 0 = térreo. */
  ordem: number;
  nome: string;
  funcoes: string[];
}

export interface Edificio {
  id: string;
  /** ID do objeto na cena 3D (estável). */
  objeto_3d_id: string;
  nome: string;
  funcao: string;
  setor_id: string;
  nucleo: string;
  status: StatusEvidencia;
  niveis: Nivel[];
  /** Área de projeção no solo e áreas por pavimento: sem dado, logo `null`. */
  projecao_no_solo_m2: number | null;
  area_construida_total_m2: number | null;
  orcamento_id: string;
  pendencias: string[];
  avisos: string[];
  fontes: Fonte[];
}

const AVISO_VIABILIDADE = 'Arranjo sujeito a estudo estrutural, acústico, de segurança e de operação.';

export const EDIFICIOS: readonly Edificio[] = [
  {
    id: 'ginasio',
    objeto_3d_id: 'ginasio-multifuncional',
    nome: 'Ginásio multifuncional',
    funcao: 'Centro aquático, quadras cobertas, academia e convivência em quatro níveis conceituais.',
    setor_id: 'esporte',
    nucleo: 'Esporte e movimento',
    status: 'proposto',
    niveis: [
      { id: 'ginasio-terreo', ordem: 0, nome: 'Térreo', funcoes: ['Piscina de referência 25 m (demais dimensões, raias e profundidade a definir)', 'Piscina menor de iniciação', 'Recepção', 'Duchas e vestiários', 'Sanitários acessíveis', 'Primeiros socorros', 'Depósitos', 'Casa de máquinas e tratamento de água'] },
      { id: 'ginasio-1', ordem: 1, nome: '1º pavimento', funcoes: ['Duas quadras de basquete adaptáveis a voleibol', 'Quadra indoor de futsal (sem dimensões homologadas presumidas)', 'Proteção, apoio e depósitos'] },
      { id: 'ginasio-2', ordem: 2, nome: '2º pavimento', funcoes: ['Musculação e cardio', 'Treinamento funcional', 'Avaliação física e alongamento', 'Atividades coletivas', 'Vestiários e apoio'] },
      { id: 'ginasio-3', ordem: 3, nome: '3º pavimento', funcoes: ['Jogos e convivência', 'Descanso', 'Tênis de mesa', 'Salas multiuso', 'Terraço apenas como possibilidade condicionada'] },
    ],
    projecao_no_solo_m2: null,
    area_construida_total_m2: null,
    orcamento_id: 'GIN-001',
    pendencias: [
      'Quadras elevadas: viabilidade estrutural, vãos, vibração e acústica pendentes.',
      'Circulação vertical, elevadores, escadas e saídas de emergência são necessidades de projeto, não conformidade comprovada.',
      'Polo aquático e fisioterapia aquática dependem de parâmetros de piscina, profissionais habilitados e pactuação.',
      'Projeção no solo e áreas por pavimento não definidas.',
    ],
    avisos: [AVISO_VIABILIDADE],
    fontes: [{ documento: 'estudo_v1', secao: '5.1' }, { documento: 'estudo_v2', secao: '5.1' }, { documento: 'prompt_mestre_v2_1', secao: '4.1' }],
  },
  {
    id: 'centro-cultural',
    objeto_3d_id: 'centro-cultural-educacional',
    nome: 'Centro cultural e educacional',
    funcao: 'Auditório, biblioteca e formação em três níveis conceituais.',
    setor_id: 'cultura',
    nucleo: 'Cultura e criação',
    status: 'proposto',
    niveis: [
      { id: 'cultural-terreo', ordem: 0, nome: 'Térreo', funcoes: ['Auditório com meta de até 300 lugares (objetivo, não capacidade licenciada)', 'Palco, bastidores e camarins', 'Controle audiovisual e apoio', 'Sanitários e acessibilidade', 'Saídas de emergência a validar'] },
      { id: 'cultural-1', ordem: 1, nome: '1º pavimento', funcoes: ['Biblioteca e acervo', 'Atendimento', 'Leitura e espaço infantil', 'Estudo individual e coletivo'] },
      { id: 'cultural-2', ordem: 2, nome: '2º pavimento', funcoes: ['Laboratório de TI', 'Salas de aula', 'Formação digital e cursos profissionalizantes', 'Orientação acadêmica e empreendedorismo', 'Salas de reunião'] },
    ],
    projecao_no_solo_m2: null,
    area_construida_total_m2: null,
    orcamento_id: 'CUL-001',
    pendencias: ['Lotação, áreas por ambiente e saídas dependem de projeto de segurança e licenciamento.'],
    avisos: [],
    fontes: [{ documento: 'estudo_v1', secao: '5.2' }, { documento: 'prompt_mestre_v2_1', secao: '4.2' }],
  },
];

export function edificioPorId(id: string): Edificio | undefined {
  return EDIFICIOS.find((e) => e.id === id);
}

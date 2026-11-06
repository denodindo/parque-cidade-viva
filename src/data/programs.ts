import type { Fonte, StatusEvidencia } from './types';

/**
 * Programas sociais e serviços (PM §6): PROPOSTAS, não convênios existentes.
 * Nenhuma parceria, vaga, resultado ou capacidade está confirmada.
 */
export type Eixo = 'educacao' | 'trabalho_renda' | 'esporte_inclusivo' | 'cidadania_familias' | 'protecao_social' | 'cultura' | 'sustentabilidade_alimentacao';

export const ROTULO_EIXO: Record<Eixo, string> = {
  educacao: 'Educação',
  trabalho_renda: 'Tecnologia, trabalho e renda',
  esporte_inclusivo: 'Esporte inclusivo',
  cidadania_familias: 'Cidadania e famílias',
  protecao_social: 'Proteção social',
  cultura: 'Cultura',
  sustentabilidade_alimentacao: 'Sustentabilidade e alimentação',
};

export interface Programa {
  id: string;
  nome: string;
  eixo: Eixo;
  descricao: string;
  /** IDs de edifícios/instalações/setores onde o programa pode ocorrer. */
  espacos_ids: string[];
  publico_alvo: string;
  equipe_pendente: string[];
  /** Indicadores PROPOSTOS (o que medir), não metas numéricas nem resultados. */
  indicadores_propostos: string[];
  /** Sem estudo de demanda/capacidade: `null` ("a definir"). */
  capacidade_hipotetica: string | null;
  status: StatusEvidencia;
  dependencias: string[];
  /** Limite inegociável exibido na ficha. */
  limite?: string;
  custo_recorrente_id: string | null;
  fontes: Fonte[];
}

const V1 = (s: string): Fonte => ({ documento: 'estudo_v1', secao: s });
const V2 = (s: string): Fonte => ({ documento: 'estudo_v2', secao: s });
const PM6: Fonte = { documento: 'prompt_mestre_v2_1', secao: '6' };

export const PROGRAMAS: readonly Programa[] = [
  {
    id: 'educa-povao', nome: 'Educa Povão', eixo: 'educacao',
    descricao: 'Preparação para ENEM, vestibulares e processos seletivos; redação; orientação sobre SISU, PROUNI e FIES com informações atualizadas a cada ciclo.',
    espacos_ids: ['centro-cultural'], publico_alvo: 'Jovens e adultos que buscam o ensino superior',
    equipe_pendente: ['Educadores por área', 'Orientação acadêmica'], indicadores_propostos: ['Matrículas e frequência', 'Conclusão de ciclos', 'Simulados realizados', 'Encaminhamentos acadêmicos'],
    capacidade_hipotetica: null, status: 'proposto', dependencias: ['Equipe pedagógica', 'Editais e regras vigentes de cada ciclo'],
    limite: 'Não promete aprovação, ingresso universitário nem concessão de bolsa.', custo_recorrente_id: 'OPX-PRG-001', fontes: [V1('7.1'), V2('7'), PM6],
  },
  {
    id: 'eja-retomada', nome: 'EJA e retomada escolar', eixo: 'educacao',
    descricao: 'Apoio pedagógico, alfabetização e reforço em matemática e português, articulados com escolas e órgãos responsáveis.',
    espacos_ids: ['centro-cultural'], publico_alvo: 'Jovens e adultos fora da escola ou com defasagem',
    equipe_pendente: ['Equipe habilitada para alfabetização', 'Articulação com a rede de ensino'], indicadores_propostos: ['Matrículas e frequência', 'Encaminhamentos à rede de ensino'],
    capacidade_hipotetica: null, status: 'proposto', dependencias: ['Parceria com sistema de ensino autorizado para oferta formal'],
    limite: 'O parque não é escola certificadora: matrícula e certificação só via sistema de ensino autorizado.', custo_recorrente_id: 'OPX-PRG-001', fontes: [V1('7.3'), V2('7'), PM6],
  },
  {
    id: 'primeiro-passo-digital', nome: 'Primeiro Passo Digital', eixo: 'trabalho_renda',
    descricao: 'Informática básica, produtividade, segurança e cidadania digital, introdução à programação.',
    espacos_ids: ['centro-cultural'], publico_alvo: 'Pessoas com pouca familiaridade digital, de todas as idades',
    equipe_pendente: ['Instrutores de TI'], indicadores_propostos: ['Inscrições e conclusão de cursos'],
    capacidade_hipotetica: null, status: 'proposto', dependencias: ['Laboratório de TI equipado (TI-001)'], custo_recorrente_id: 'OPX-PRG-001', fontes: [V2('7'), PM6],
  },
  {
    id: 'estacao-oportunidades', nome: 'Estação de Oportunidades', eixo: 'trabalho_renda',
    descricao: 'Currículo, entrevista, direitos trabalhistas, orientação de carreira e encaminhamento a cursos e serviços de emprego.',
    espacos_ids: ['centro-cultural'], publico_alvo: 'Jovens e adultos em busca de trabalho',
    equipe_pendente: ['Orientação profissional'], indicadores_propostos: ['Pessoas orientadas', 'Encaminhamentos', 'Entrevistas e inserções confirmadas'],
    capacidade_hipotetica: null, status: 'proposto', dependencias: ['Articulação com serviços públicos de emprego'],
    limite: 'Não garante emprego; mede encaminhamentos e inserções confirmadas.', custo_recorrente_id: 'OPX-PRG-001', fontes: [V1('7.6'), V2('7'), PM6],
  },
  {
    id: 'laboratorio-criativo', nome: 'Laboratório Criativo', eixo: 'trabalho_renda',
    descricao: 'Maker de baixo custo, robótica introdutória, audiovisual, design e resolução de problemas; impressão 3D só se viável.',
    espacos_ids: ['centro-cultural'], publico_alvo: 'Adolescentes e jovens',
    equipe_pendente: ['Educadores maker e audiovisual'], indicadores_propostos: ['Oficinas realizadas', 'Projetos produzidos'],
    capacidade_hipotetica: null, status: 'proposto', dependencias: ['Segurança, ventilação, equipamentos e insumos', 'Fase física F4'], custo_recorrente_id: 'OPX-PRG-001', fontes: [V2('7'), PM6],
  },
  {
    id: 'empreender-bairro', nome: 'Empreender no Bairro', eixo: 'trabalho_renda',
    descricao: 'Educação financeira, precificação, formalização (MEI), vendas digitais, economia solidária e feiras de pequenos empreendedores.',
    espacos_ids: ['centro-cultural', 'praca-central'], publico_alvo: 'Empreendedores locais e interessados',
    equipe_pendente: ['Educadores de empreendedorismo'], indicadores_propostos: ['Pessoas orientadas', 'Formalizações', 'Feiras realizadas'],
    capacidade_hipotetica: null, status: 'proposto', dependencias: ['Possível interlocução com SEBRAE e economia solidária (não confirmada)'], custo_recorrente_id: 'OPX-PRG-001', fontes: [V2('7'), PM6],
  },
  {
    id: 'esporte-para-todos', nome: 'Esporte para Todos', eixo: 'esporte_inclusivo',
    descricao: 'Iniciação esportiva, atividades regulares, esporte adaptado, grupos para idosos e campeonatos comunitários.',
    espacos_ids: ['ginasio', 'campo-society', 'quadra-externa-1', 'quadra-externa-2'], publico_alvo: 'Crianças, jovens, adultos, idosos e pessoas com deficiência',
    equipe_pendente: ['Coordenação esportiva', 'Professores de Educação Física', 'Salva-vidas (piscinas)'], indicadores_propostos: ['Inscrições, frequência e permanência', 'Participação por faixa etária'],
    capacidade_hipotetica: null, status: 'proposto', dependencias: ['Equipe e horários definidos'], custo_recorrente_id: 'OPX-PRG-001', fontes: [V1('7.4'), PM6],
  },
  {
    id: 'meninas-em-campo', nome: 'Meninas em Campo', eixo: 'esporte_inclusivo',
    descricao: 'Horários protegidos, treinadoras e festivais para ampliar a participação feminina no esporte.',
    espacos_ids: ['campo-society', 'quadra-externa-1', 'quadra-externa-2'], publico_alvo: 'Meninas e mulheres',
    equipe_pendente: ['Treinadoras'], indicadores_propostos: ['Participação de meninas e mulheres', 'Permanência'],
    capacidade_hipotetica: null, status: 'proposto', dependencias: ['Equipe; editais SEME 012/013 são apenas oportunidades (ver relatório)'], custo_recorrente_id: 'OPX-PRG-001', fontes: [V2('5.3'), PM6],
  },
  {
    id: 'ativa-60', nome: 'Ativa 60+', eixo: 'esporte_inclusivo',
    descricao: 'Mobilidade, equilíbrio, dança, jogos e atividade orientada para pessoas idosas.',
    espacos_ids: ['ginasio', 'praca-central'], publico_alvo: 'Pessoas com 60 anos ou mais',
    equipe_pendente: ['Profissionais de Educação Física'], indicadores_propostos: ['Inscrições e frequência', 'Satisfação'],
    capacidade_hipotetica: null, status: 'proposto', dependencias: ['Equipe; edital SEME 014 é apenas oportunidade'], custo_recorrente_id: 'OPX-PRG-001', fontes: [V2('5.3'), PM6],
  },
  {
    id: 'parque-acessivel', nome: 'Parque Acessível', eixo: 'esporte_inclusivo',
    descricao: 'Atividades inclusivas e adaptadas, com desenho universal e participação consultiva de pessoas com deficiência.',
    espacos_ids: ['ginasio', 'quadra-externa-1', 'playground-6-12'], publico_alvo: 'Pessoas com deficiência e famílias',
    equipe_pendente: ['Instrutores capacitados em esporte adaptado'], indicadores_propostos: ['Participação de pessoas com deficiência', 'Barreiras relatadas'],
    capacidade_hipotetica: null, status: 'proposto', dependencias: ['Consultoria com organizações representativas'], custo_recorrente_id: 'OPX-PRG-001', fontes: [V2('5.3'), V2('8'), PM6],
  },
  {
    id: 'cidadao-consciente', nome: 'Cidadão Consciente', eixo: 'cidadania_familias',
    descricao: 'Direitos e cidadania, educação financeira, comunicação, mediação de conflitos, participação social e projeto de vida.',
    espacos_ids: ['centro-cultural', 'praca-central'], publico_alvo: 'Todas as idades, com atividades adequadas',
    equipe_pendente: ['Educadores sociais'], indicadores_propostos: ['Oficinas realizadas', 'Participação comunitária'],
    capacidade_hipotetica: null, status: 'proposto', dependencias: ['Equipe e calendário'], custo_recorrente_id: 'OPX-PRG-001', fontes: [V1('7.2'), V2('7'), PM6],
  },
  {
    id: 'recomecar', nome: 'Recomeçar e Ponto de Orientação Cidadã', eixo: 'protecao_social',
    descricao: 'Escuta inicial, orientação, apoio documental, convivência diurna e encaminhamento à rede pública, com equipe e protocolos quando pactuados.',
    espacos_ids: ['ponto-orientacao'], publico_alvo: 'Pessoas em situação de vulnerabilidade, incluindo em situação de rua',
    equipe_pendente: ['Profissionais de serviço social conforme pactuação'], indicadores_propostos: ['Encaminhamentos consentidos efetivados', 'Acesso a documentação'],
    capacidade_hipotetica: null, status: 'proposto', dependencias: ['Pactuação formal com SUAS e rede de atendimento'],
    limite: 'O parque não é Centro POP, abrigo nem órgão de benefícios; não substitui serviço especializado.', custo_recorrente_id: 'OPX-PRG-001', fontes: [V1('7.5'), V2('8'), PM6],
  },
  {
    id: 'comunidade-ativa', nome: 'Comunidade Ativa (programação cultural)', eixo: 'cultura',
    descricao: 'Música, dança, teatro, artes visuais, audiovisual, leitura, saraus, oficinas e exposições.',
    espacos_ids: ['centro-cultural', 'anfiteatro', 'praca-central'], publico_alvo: 'Todas as idades',
    equipe_pendente: ['Oficineiros', 'Mediadores culturais', 'Técnicos de áudio e vídeo'], indicadores_propostos: ['Oficinas e apresentações', 'Público', 'Empréstimos da biblioteca'],
    capacidade_hipotetica: null, status: 'proposto', dependencias: ['Equipe e orçamento; editais de fomento são apenas oportunidades'], custo_recorrente_id: 'OPX-PRG-001', fontes: [V1('7.7'), V2('6'), PM6],
  },
  {
    id: 'horta-educativa', nome: 'Horta e compostagem educativas', eixo: 'sustentabilidade_alimentacao',
    descricao: 'Oficinas de agricultura urbana, compostagem, separação de resíduos e alimentação saudável.',
    espacos_ids: ['horta-comunitaria', 'viveiro-compostagem'], publico_alvo: 'Escolas, famílias e comunidade',
    equipe_pendente: ['Educador ambiental'], indicadores_propostos: ['Resíduos desviados', 'Composto produzido', 'Oficinas realizadas'],
    capacidade_hipotetica: null, status: 'proposto', dependencias: ['Regras de uso da horta', 'Parceria formal com cooperativa para recicláveis'], custo_recorrente_id: 'OPX-PRG-001', fontes: [V1('8.1'), V1('8.2'), V2('10')],
  },
  {
    id: 'educacao-alimentar', nome: 'Educação alimentar e segurança alimentar', eixo: 'sustentabilidade_alimentacao',
    descricao: 'Cozinha educativa, aproveitamento integral, oficinas e conexão com doadores e entidades, sob regras sanitárias.',
    espacos_ids: ['restaurante', 'horta-comunitaria'], publico_alvo: 'Famílias e comunidade',
    equipe_pendente: ['Nutricionista ou responsável técnico quando aplicável'], indicadores_propostos: ['Oficinas realizadas', 'Alimentos aproveitados'],
    capacidade_hipotetica: null, status: 'proposto', dependencias: ['Acordo formal e controle sanitário para doações'], custo_recorrente_id: 'OPX-PRG-001', fontes: [V2('8'), V2('9')],
  },
];

/**
 * Oportunidades do relatório de 05/11/2026. São REFERÊNCIAS: valores são dos
 * programas inteiros, não repasse ao parque; prazos devem ser reconferidos.
 */
export interface Oportunidade {
  nome: string;
  valor: string;
  prazo: string;
  aderencia: string;
  observacao: string;
}

export const OPORTUNIDADES: readonly Oportunidade[] = [
  { nome: 'SEME 014/2026 — Movimento Longevidade', valor: 'R$ 6.750.000,00 (programa total)', prazo: '7 dez. 2026 (estimado)', aderencia: 'Alta: esporte e convivência 50+', observacao: 'Exige OSC com CNPJ há ≥ 1 ano e experiência.' },
  { nome: 'SEME 013/2026 — Núcleos de Futebol Feminino', valor: 'R$ 4.823.706,81 (programa total)', prazo: '3 dez. 2026 (estimado)', aderencia: 'Alta: meninas e mulheres', observacao: 'Exige experiência com público proporcional (750 pessoas).' },
  { nome: 'SEME 012/2026 — Capacitação Futebol Feminino', valor: 'R$ 1.888.080,00 (programa total)', prazo: '3 dez. 2026 (estimado)', aderencia: 'Média/alta', observacao: 'Exige OSC com CNPJ há ≥ 1 ano.' },
  { nome: 'Fomento Municipal ao Teatro e à Dança', valor: 'R$ 18 milhões (pacote total)', prazo: '23 nov. 2026', aderencia: 'Média: programação cultural', observacao: 'Não financia a construção do parque.' },
  { nome: 'Biblioteca Comunitária é Cultura Viva', valor: 'Sem repasse imediato (certificação)', prazo: 'Fluxo contínuo', aderencia: 'Alta: biblioteca e leitura', observacao: 'Exige ≥ 2 anos de atividades de incentivo à leitura.' },
];

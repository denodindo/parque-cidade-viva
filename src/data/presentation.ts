import type { ModoCor, ModoEdificio } from '../app/store';
import type { Selecao } from '../features/selection/selection';

/** Matriz de riscos (PM §13): classificações qualitativas PROPOSTAS, não laudo. */
export const RISCOS: readonly { risco: string; severidade: 'Crítico' | 'Alto' | 'Moderado'; acao: string }[] = [
  { risco: 'Titularidade, perímetro e 10 ha não certificados', severidade: 'Crítico', acao: 'Matrícula, cadastro, topografia, verificação fundiária.' },
  { risco: 'Borda ecológica e conexão da trilha', severidade: 'Alto', acao: 'Estudo ambiental, gestão da área, autorizações.' },
  { risco: 'Estrutura vertical do ginásio, piscinas e quadras', severidade: 'Alto', acao: 'Estudo arquitetônico e engenharia multidisciplinar.' },
  { risco: 'Acessibilidade, saídas e segurança contra incêndio', severidade: 'Alto', acao: 'Projetos específicos e análise pelos órgãos competentes.' },
  { risco: 'Operação: equipes, água, energia, manutenção', severidade: 'Alto', acao: 'Modelo anual de OPEX e gestão.' },
  { risco: 'Programas sociais com parcerias ainda não formalizadas', severidade: 'Alto', acao: 'Pactuação, equipe, orçamento e proteção dos usuários.' },
  { risco: 'Custos incompletos e editais não garantidos', severidade: 'Alto', acao: 'Quantitativos, fontes, cotações, elegibilidade e financiamento.' },
  { risco: 'Performance e compatibilidade do aplicativo', severidade: 'Moderado', acao: 'MVP leve, testes, fallback e qualidade ajustável.' },
];

export interface Passo {
  id: string;
  titulo: string;
  texto: string[];
  selecao: Selecao | null;
  modoEdificio?: ModoEdificio;
  modoCor: ModoCor;
  camera: { posicao: [number, number, number]; alvo: [number, number, number] } | null;
  extra?: 'riscos' | 'fases' | 'orcamento' | 'beneficios';
}

/** Percurso guiado (PM §7.9, D6). */
export const PASSOS: readonly Passo[] = [
  {
    id: 'abertura', titulo: 'Parque Cidade Viva', modoCor: 'setores', selecao: null, camera: null,
    texto: [
      'Um parque público onde esporte, educação, cultura, sustentabilidade e inclusão se encontram para ampliar oportunidades e fortalecer a comunidade.',
      'Esta é uma maquete digital conceitual de um projeto acadêmico SENAC. Não é projeto executivo, BIM, orçamento oficial nem gêmeo digital.',
    ],
  },
  {
    id: 'terreno', titulo: 'O terreno: uma hipótese de 10 hectares', modoCor: 'setores', selecao: { tipo: 'terreno', id: 'terreno' }, camera: null,
    texto: [
      'O contorno foi lido de uma imagem de referência e ampliado para 100.000 m². É uma escala visual normalizada, não um levantamento.',
      'Antes de qualquer obra: matrícula, perímetro, topografia, zoneamento e restrições ambientais.',
    ],
  },
  {
    id: 'setores', titulo: 'Oito setores, dez núcleos', modoCor: 'setores', selecao: null, camera: null,
    texto: [
      'Os oito setores somam 100.000 m² sem sobreposição. A imagem original somava 95.000 m²; os 5.000 m² de inclusão e horta são uma reserva proposta.',
      'Os dez núcleos funcionais (parque vivo, esporte, cultura, educação, infância, convivência, cidadania, alimentação, sustentabilidade e operação) usam esses setores sem criar área nova.',
    ],
  },
  {
    id: 'verde', titulo: 'Parque vivo e conexão ecológica', modoCor: 'setores', selecao: { tipo: 'setor', id: 'verde' }, camera: { posicao: [-40, 300, 40], alvo: [-40, 0, -190] },
    texto: [
      'O bosque fica junto à área vegetada vizinha, com jardim sensorial e passeios.',
      'A trilha tracejada é hipotética: depende de titularidade, licenciamento ambiental, segurança e autorização.',
    ],
  },
  {
    id: 'esporte', titulo: 'Ginásio multifuncional em quatro níveis', modoCor: 'setores', selecao: { tipo: 'edificio', id: 'ginasio' }, modoEdificio: 'explodido', camera: { posicao: [170, 150, 270], alvo: [40, 25, 125] },
    texto: [
      'Térreo: piscina de referência de 25 m e piscina de iniciação. 1º: duas quadras de basquete/vôlei e futsal. 2º: academia. 3º: convivência e jogos.',
      'Quadras elevadas: arranjo sujeito a estudo estrutural, acústico, de segurança e de operação.',
      'Fora do ginásio: campo society e duas quadras híbridas.',
    ],
  },
  {
    id: 'cultura', titulo: 'Centro cultural e educacional em três níveis', modoCor: 'setores', selecao: { tipo: 'edificio', id: 'centro-cultural' }, modoEdificio: 'explodido', camera: { posicao: [200, 120, 130], alvo: [75, 18, 0] },
    texto: [
      'Térreo: auditório com meta de até 300 lugares (objetivo, não capacidade licenciada). 1º: biblioteca. 2º: laboratório de TI e salas de aula.',
      'Abriga programas como Educa Povão, Primeiro Passo Digital e Estação de Oportunidades.',
    ],
  },
  {
    id: 'convivencia', titulo: 'Convivência, infância e alimentação', modoCor: 'setores', selecao: { tipo: 'instalacao', id: 'praca-central' }, camera: { posicao: [-20, 190, 150], alvo: [-25, 0, -20] },
    texto: [
      'Praça central, anfiteatro, playgrounds por faixa etária, restaurante e três quiosques, com sanitários acessíveis distribuídos.',
      'Coleta seletiva em pontos estratégicos — não uma lixeira a cada 2 metros.',
    ],
  },
  {
    id: 'inclusao', titulo: 'Inclusão e sustentabilidade', modoCor: 'setores', selecao: { tipo: 'setor', id: 'inclusao' }, camera: { posicao: [-260, 170, 90], alvo: [-120, 0, -20] },
    texto: [
      'Horta comunitária, viveiro, compostagem e o Ponto de Orientação Cidadã.',
      'O parque acolhe e orienta, mas não substitui a rede pública: não é Centro POP, abrigo ou serviço clínico.',
    ],
  },
  {
    id: 'beneficios', titulo: 'Benefícios esperados', modoCor: 'setores', selecao: null, camera: null, extra: 'beneficios',
    texto: ['Benefícios são objetivos do projeto, não resultados medidos. Metas numéricas só após estudo de demanda e capacidade.'],
  },
  {
    id: 'orcamento', titulo: 'Orçamento: rastreável e ainda em aberto', modoCor: 'custos', selecao: null, camera: null, extra: 'orcamento',
    texto: [
      'Vermelho = item sem quantitativo, preço, fonte e data-base. Nenhum valor foi inventado; não há “custo total do parque”.',
      'CAPEX (implantação) e OPEX (operação anual) são separados e nunca somados.',
    ],
  },
  {
    id: 'fases', titulo: 'Implantação física por fases (cenário acadêmico)', modoCor: 'fases', selecao: null, camera: null, extra: 'fases',
    texto: ['Cores = fase proposta de cada espaço. Começar pelo parque essencial e só abrir equipamentos complexos com OPEX garantido. Sem meses nem datas.'],
  },
  {
    id: 'riscos', titulo: 'Riscos e incertezas', modoCor: 'setores', selecao: null, camera: null, extra: 'riscos',
    texto: ['Classificações qualitativas propostas, não laudo profissional.'],
  },
  {
    id: 'proximos', titulo: 'Próximos passos', modoCor: 'setores', selecao: null, camera: null,
    texto: [
      'Prioridade imediata: confirmar área e perímetro, levantamento topográfico, consulta urbanística e ambiental e diagnóstico de demanda.',
      'Depois: escolher a implantação, desenvolver projetos e orçamento com fontes, formalizar parcerias e só então construir, operar e medir.',
    ],
  },
];

export const BENEFICIOS: readonly string[] = [
  'Ampliar o acesso a esporte, lazer e promoção da saúde.',
  'Oferecer aprendizagem, inclusão digital e formação para o trabalho.',
  'Promover cultura, leitura, eventos e convivência comunitária.',
  'Integrar horta, compostagem, reciclagem e educação ambiental.',
  'Articular orientação e encaminhamento social com a rede pública.',
  'Preservar e valorizar a vegetação existente, se confirmadas as condições ambientais e fundiárias.',
];

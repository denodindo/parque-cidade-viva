import type { FaseId } from './phases';

/**
 * ESTIMATIVA PARAMÉTRICA DE ORDEM DE GRANDEZA (nov/2026), pedida pelo
 * responsável em 06/11/2026 (DT-35). NÃO é orçamento: não altera os
 * lançamentos de `budget.ts`, que seguem `null` até haver quantidade medida,
 * preço com fonte e data-base. Cada linha diz se vem de referência pública
 * citada ou de hipótese do estudo. Memória de cálculo e fontes:
 * `docs/Parque_Cidade_Viva_Estimativas_e_Financiamento.docx`.
 */

export type BaseEstimativa = 'referencia' | 'hipotese';
export type GrupoEstimativa = 'Edifícios' | 'Esporte externo' | 'Praças, infância e verde' | 'Infraestrutura';

export interface LinhaEstimativa {
  id: string;
  /** Lançamento do orçamento rastreável ao qual a faixa se refere. */
  codigo_orcamento: string;
  grupo: GrupoEstimativa;
  item: string;
  fase: FaseId;
  qmin: number;
  qmax: number;
  unidade: 'm²' | 'conjunto' | 'postes';
  umin: number;
  umax: number;
  base: BaseEstimativa;
  nota?: string;
  /** Ids de edifício (objeto 3D), instalação ou setor cobertos pela faixa. */
  objetos: string[];
}

export const DATA_BASE_ESTIMATIVA = 'nov/2026';
export const CUB_SP_R8N = 2238.58; // SindusCon-SP, set/2026, R$/m²

const L = (
  id: string, codigo_orcamento: string, grupo: GrupoEstimativa, item: string, fase: FaseId,
  q: [number, number], unidade: LinhaEstimativa['unidade'], u: [number, number], base: BaseEstimativa, objetos: string[], nota?: string,
): LinhaEstimativa => ({ id, codigo_orcamento, grupo, item, fase, qmin: q[0], qmax: q[1], unidade, umin: u[0], umax: u[1], base, objetos, nota });

export const ESTIMATIVA_CAPEX: readonly LinhaEstimativa[] = [
  L('GIN-001', 'GIN-001', 'Edifícios', 'Ginásio: obra civil (térreo + 3 pavimentos)', 'F3', [9000, 12600], 'm²', [3400, 5000], 'hipotese', ['ginasio-multifuncional'],
    'Área da planta ilustrativa 70 × 45 m em 4 níveis; 1,5 a 2,2 × CUB-SP R8-N de set/2026 (R$ 2.238,58/m²).'),
  L('AQU-001', 'AQU-001', 'Edifícios', 'Piscinas (25 m + iniciação), aquecimento e tratamento', 'F3', [1, 1], 'conjunto', [2_000_000, 4_500_000], 'hipotese', ['ginasio-multifuncional'],
    'Comparação: piscina aquecida em Manduri-SP estimada em R$ 825 mil (licitação 2026, escopo menor).'),
  L('ACA-001', 'ACA-001', 'Edifícios', 'Equipamentos de academia e das quadras cobertas', 'F3', [1, 1], 'conjunto', [800_000, 2_000_000], 'hipotese', ['ginasio-multifuncional']),
  L('CUL-001', 'CUL-001', 'Edifícios', 'Centro cultural: obra civil (térreo + 2 pavimentos)', 'F3', [4500, 6000], 'm²', [3200, 4800], 'hipotese', ['centro-cultural-educacional'],
    'Planta ilustrativa 50 × 40 m em 3 níveis; 1,4 a 2,1 × CUB-SP. CEU da Cultura (MinC): média de R$ 2 mi por unidade.'),
  L('AUD-001', 'AUD-001', 'Edifícios', 'Auditório (meta de até 300 lugares): poltronas, palco, som e luz', 'F3', [1, 1], 'conjunto', [1_200_000, 3_000_000], 'hipotese', ['centro-cultural-educacional']),
  L('TI-001', 'TI-001', 'Edifícios', 'Laboratórios de TI e mobiliário de salas', 'F3', [1, 1], 'conjunto', [400_000, 1_000_000], 'hipotese', ['centro-cultural-educacional']),
  L('ALI-001', 'ALI-001', 'Edifícios', 'Restaurante (416 m²) e 3 quiosques (108 m²), com cozinha', 'F3', [524, 524], 'm²', [3600, 6300], 'hipotese', ['restaurante', 'quiosque-1', 'quiosque-2', 'quiosque-3'],
    '1,6 a 2,8 × CUB-SP CSL-8 (R$ 2.237,54/m²), incluindo cozinha industrial.'),
  L('SRV-001', 'SRV-001', 'Edifícios', 'Administração, manutenção e Ponto de Orientação Cidadã', 'F1', [732, 732], 'm²', [2800, 4200], 'hipotese', ['apoio-operacional', 'ponto-orientacao']),
  L('MOB-001a', 'MOB-001', 'Edifícios', 'Três blocos de sanitários e vestiários externos', 'F1', [180, 180], 'm²', [4000, 6500], 'hipotese', ['sanitario-praca', 'sanitario-familia', 'sanitario-esporte']),
  L('ESP-001a', 'ESP-001', 'Esporte externo', 'Campo society com drenagem, alambrado e iluminação', 'F2', [2016, 2016], 'm²', [300, 550], 'referencia', ['campo-society'],
    'Grama sintética instalada: R$ 90 a R$ 180/m² (2026). Campo de 648 m² em Alto Paraíso-GO com alambrado e luz: R$ 231/m² (2017).'),
  L('ESP-001b', 'ESP-001', 'Esporte externo', 'Duas quadras poliesportivas descobertas', 'F2', [896, 896], 'm²', [300, 650], 'hipotese', ['quadra-externa-1', 'quadra-externa-2']),
  L('PAI-001a', 'PAI-001', 'Praças, infância e verde', 'Praça central', 'F1', [1520, 1520], 'm²', [350, 700], 'hipotese', ['praca-central']),
  L('PAI-001b', 'PAI-001', 'Praças, infância e verde', 'Anfiteatro aberto', 'F2', [402, 402], 'm²', [1200, 2500], 'hipotese', ['anfiteatro']),
  L('PAI-001c', 'PAI-001', 'Praças, infância e verde', 'Dois playgrounds com piso amortecedor', 'F1', [1604, 1604], 'm²', [350, 750], 'referencia', ['playground-0-5', 'playground-6-12'],
    'Playground completo em licitação municipal de 2026: R$ 51 mil a R$ 61 mil (só equipamentos).'),
  L('PAI-001d', 'PAI-001', 'Praças, infância e verde', 'Jardim sensorial', 'F1', [452, 452], 'm²', [250, 500], 'hipotese', ['jardim-sensorial']),
  L('PAI-001e', 'PAI-001', 'Praças, infância e verde', 'Paisagismo do bosque e jardins (30.000 m²)', 'F1', [30000, 30000], 'm²', [40, 120], 'hipotese', ['verde']),
  L('AMB-001', 'AMB-001', 'Praças, infância e verde', 'Horta, viveiro, compostagem e triagem', 'F2', [1, 1], 'conjunto', [330_000, 610_000], 'hipotese', ['horta-comunitaria', 'viveiro-compostagem']),
  L('MOB-001b', 'MOB-001', 'Praças, infância e verde', 'Mobiliário urbano, sinalização e 9 pontos de coleta seletiva', 'F1', [1, 1], 'conjunto', [600_000, 1_500_000], 'hipotese', ['coleta-seletiva'],
    'Coleta seletiva em pontos estratégicos, não lixeiras a cada 2 m.'),
  L('PRE-001', 'PRE-001', 'Infraestrutura', 'Estudos: topografia, sondagens, ambiental e demanda', 'F0', [1, 1], 'conjunto', [400_000, 1_000_000], 'hipotese', []),
  L('TER-001', 'TER-001', 'Infraestrutura', 'Preparação do terreno e terraplenagem', 'F1', [100000, 100000], 'm²', [8, 35], 'hipotese', ['terreno']),
  L('DRE-001', 'DRE-001', 'Infraestrutura', 'Drenagem e manejo de águas pluviais', 'F1', [100000, 100000], 'm²', [20, 55], 'hipotese', ['terreno']),
  L('CIR-001a', 'CIR-001', 'Infraestrutura', 'Caminhos acessíveis e ciclovia (12.000 m²)', 'F1', [12000, 12000], 'm²', [130, 280], 'hipotese', ['circulacao']),
  L('CIR-001b', 'CIR-001', 'Infraestrutura', 'Estacionamento', 'F1', [2200, 2200], 'm²', [160, 320], 'hipotese', ['estacionamento']),
  L('INS-001a', 'INS-001', 'Infraestrutura', 'Iluminação externa em LED', 'F1', [150, 250], 'postes', [9000, 16000], 'hipotese', []),
  L('INS-001b', 'INS-001', 'Infraestrutura', 'Redes externas de água, esgoto e energia', 'F1', [1, 1], 'conjunto', [1_500_000, 4_000_000], 'hipotese', []),
  L('SEG-001', 'SEG-001', 'Infraestrutura', 'Prevenção de incêndio externa, câmeras e controle de acesso', 'F1', [1, 1], 'conjunto', [800_000, 2_000_000], 'hipotese', []),
];

/** Percentuais sobre a obra direta (sem PRE-001). */
export const ESTIMATIVA_INDIRETOS = [
  { id: 'PRO-001', item: 'Projetos, licenças e consultorias', pmin: 0.04, pmax: 0.07 },
  { id: 'ADM-001', item: 'Gerenciamento e fiscalização da obra', pmin: 0.03, pmax: 0.05 },
  { id: 'RSC-001', item: 'Reserva de contingência (provisória)', pmin: 0.1, pmax: 0.15 },
] as const;

export const ESTIMATIVA_IMPLANTACAO_PROGRAMAS = { id: 'IMP-001', item: 'Implantação de programas (acervo, kits, sistemas)', min: 500_000, max: 1_500_000 } as const;

export interface FuncaoEquipe {
  area: string;
  funcao: string;
  qmin: number;
  qmax: number;
  smin: number;
  smax: number;
  base: BaseEstimativa;
  nota?: string;
}

export const ESTIMATIVA_EQUIPE: readonly FuncaoEquipe[] = [
  { area: 'Gestão', funcao: 'Gestor(a) geral do parque', qmin: 1, qmax: 1, smin: 9000, smax: 14000, base: 'hipotese' },
  { area: 'Gestão', funcao: 'Coordenadores (esporte, cultura e educação, social, operação)', qmin: 4, qmax: 4, smin: 5500, smax: 8500, base: 'hipotese' },
  { area: 'Gestão', funcao: 'Assistentes administrativos e financeiros', qmin: 3, qmax: 5, smin: 2300, smax: 3200, base: 'hipotese' },
  { area: 'Gestão', funcao: 'Recepção e atendimento ao público', qmin: 4, qmax: 8, smin: 1900, smax: 2400, base: 'hipotese', nota: 'Piso paulista 2026: R$ 1.874,36.' },
  { area: 'Esporte', funcao: 'Professores de educação física', qmin: 10, qmax: 18, smin: 3000, smax: 4500, base: 'referencia', nota: 'CAGED: média de R$ 3.338,27 em 2026.' },
  { area: 'Esporte', funcao: 'Guarda-vidas', qmin: 4, qmax: 6, smin: 2100, smax: 2900, base: 'referencia', nota: 'CAGED: R$ 2.055 a R$ 2.482.' },
  { area: 'Esporte', funcao: 'Técnicos de piscina e tratamento de água', qmin: 1, qmax: 2, smin: 2500, smax: 3400, base: 'hipotese' },
  { area: 'Cultura e educação', funcao: 'Bibliotecários(as)', qmin: 1, qmax: 2, smin: 4000, smax: 6000, base: 'hipotese' },
  { area: 'Cultura e educação', funcao: 'Educadores e instrutores de cursos e oficinas', qmin: 8, qmax: 14, smin: 2800, smax: 4500, base: 'hipotese' },
  { area: 'Cultura e educação', funcao: 'Técnicos de som, luz e audiovisual', qmin: 2, qmax: 3, smin: 2800, smax: 4200, base: 'hipotese' },
  { area: 'Cultura e educação', funcao: 'Monitores de laboratório de TI', qmin: 2, qmax: 3, smin: 2400, smax: 3500, base: 'hipotese' },
  { area: 'Social', funcao: 'Assistente social e psicólogo(a)', qmin: 2, qmax: 3, smin: 4200, smax: 6500, base: 'hipotese', nota: 'Atendimento especializado depende de pactuação com o SUAS.' },
  { area: 'Operação', funcao: 'Técnicos de enfermagem (primeiros socorros)', qmin: 2, qmax: 4, smin: 2600, smax: 3500, base: 'hipotese' },
  { area: 'Operação', funcao: 'Vigilantes (3 a 4 postos 24 h)', qmin: 12, qmax: 18, smin: 2100, smax: 2800, base: 'referencia', nota: 'CAGED: média de R$ 2.077,41.' },
  { area: 'Operação', funcao: 'Auxiliares de limpeza', qmin: 12, qmax: 18, smin: 1875, smax: 2200, base: 'referencia', nota: 'CAGED: média de R$ 1.912,78.' },
  { area: 'Operação', funcao: 'Jardineiros', qmin: 6, qmax: 10, smin: 1875, smax: 2400, base: 'referencia', nota: 'CAGED: mediana de R$ 1.800.' },
  { area: 'Operação', funcao: 'Manutenção predial (eletricista, encanador, oficial)', qmin: 4, qmax: 6, smin: 2600, smax: 3800, base: 'hipotese' },
  { area: 'Operação', funcao: 'Horticultor(a) e educador(a) ambiental', qmin: 1, qmax: 2, smin: 2200, smax: 3200, base: 'hipotese' },
];

/** Encargos sobre o salário (SINAPI-SP mensalista jan/2025: 71,46%) e benefícios por pessoa/mês. */
export const ENCARGOS = [0.7, 0.8] as const;
export const BENEFICIOS_MES = [700, 1300] as const;

export interface OutroOpex {
  id: string;
  item: string;
  /** Valor anual fixo ou percentual da obra direta. */
  min: number;
  max: number;
  percentual_da_obra?: boolean;
  nota?: string;
}

export const ESTIMATIVA_OPEX_OUTROS: readonly OutroOpex[] = [
  { id: 'OPX-UTL-001', item: 'Água, energia, gás e internet', min: 1_200_000, max: 3_000_000, nota: 'Piscinas aquecidas são o maior consumo.' },
  { id: 'OPX-PIS-001', item: 'Produtos e insumos das piscinas', min: 150_000, max: 400_000 },
  { id: 'OPX-MAN-001', item: 'Materiais de manutenção, reposição e contratos técnicos', min: 0.01, max: 0.02, percentual_da_obra: true, nota: '1% a 2% ao ano do custo de obra.' },
  { id: 'OPX-PRG-001', item: 'Programação: materiais, eventos, transporte e oficineiros', min: 800_000, max: 2_500_000 },
  { id: 'OPX-GER-001', item: 'Seguros, sistemas, auditoria e comunicação', min: 200_000, max: 600_000 },
];

export interface FonteFinanciamento {
  quem: string;
  como: string;
  valor: string;
}

export interface AreaFinanciamento {
  area: string;
  fontes: FonteFinanciamento[];
}

/** Fontes POSSÍVEIS. Valores são tetos ou médias de programas, não verbas do parque. */
export const FINANCIAMENTO: readonly AreaFinanciamento[] = [
  {
    area: 'Esporte',
    fontes: [
      { quem: 'Ministério do Esporte', como: 'Novo PAC, Espaços Esportivos Comunitários: a prefeitura propõe e a Caixa repassa. Projeto padrão com campo society, quadra, pista e parque infantil.', valor: 'Até R$ 1,5 mi por unidade' },
      { quem: 'Secretaria Estadual de Esportes', como: 'Convênio com o município para obra ou equipamentos, em geral com emendas de deputados estaduais.', valor: 'Caso a caso (ginásio com convênio estadual em Tapurah-MT: R$ 16,7 mi)' },
      { quem: 'Secretaria Municipal de Esportes (SEME)', como: 'Paga professores e guarda-vidas ou contrata organização social por termo de colaboração; lança editais de programas.', valor: 'Editais de 2026: R$ 1,89 mi a R$ 6,75 mi (valor total de cada programa)' },
      { quem: 'Lei de Incentivo ao Esporte', como: 'Entidade esportiva aprova projeto; empresas patrocinam abatendo do Imposto de Renda.', valor: 'Empresas: até 2% do IR devido (4% em inclusão social). Pessoas: até 7%' },
    ],
  },
  {
    area: 'Cultura e educação',
    fontes: [
      { quem: 'Ministério da Cultura', como: 'Novo PAC, CEU da Cultura: edifício modular com cineteatro e salas.', valor: 'Média de R$ 2 mi por unidade' },
      { quem: 'Lei Rouanet', como: 'Projeto cultural aprovado; empresas patrocinam abatendo do Imposto de Renda.', valor: 'Empresas: até 4% do IR devido. Pessoas: até 6%' },
      { quem: 'ProAC (Estado de SP)', como: 'Editais de fomento e patrocínio com crédito de ICMS.', valor: 'R$ 100 mi em 2026' },
      { quem: 'Pro-Mac e fomento municipal (SP)', como: 'Patrocínio com abatimento de ISS ou IPTU; Fomento ao Teatro e à Dança.', valor: 'Até 20% do ISS/IPTU; fomento de R$ 18 mi (programa todo)' },
      { quem: 'SENAC, SENAI, SEBRAE, Sesc, ETECs e FATECs', como: 'Cursos, instrutores e programação por acordo de cooperação.', valor: 'Contrapartida em serviços' },
    ],
  },
  {
    area: 'Social e meio ambiente',
    fontes: [
      { quem: 'FUMCAD (criança e adolescente)', como: 'Doações dedutíveis para projetos aprovados pelo conselho municipal.', valor: 'Empresas: até 1% do IR devido. Pessoas: até 6%' },
      { quem: 'Fundo Municipal do Idoso', como: 'Doações dedutíveis para programas de longevidade.', valor: 'Empresas: até 1% do IR devido' },
      { quem: 'Assistência social (SUAS e CRAS)', como: 'Pactuação para o Ponto de Orientação Cidadã.', valor: 'Profissionais cedidos' },
      { quem: 'FEHIDRO e fundos ambientais', como: 'Drenagem, manejo de águas e educação ambiental; compensação ambiental para plantio.', valor: 'Por edital' },
    ],
  },
  {
    area: 'Obra, crédito e receitas',
    fontes: [
      { quem: 'Caixa (FINISA)', como: 'Empréstimo ao município para obras, com garantia no Fundo de Participação dos Municípios.', valor: 'Ex.: R$ 12 mi contratados por um município em 2026' },
      { quem: 'BNDES', como: 'Financiamento e apoio à estruturação de projetos municipais.', valor: 'Até 100% do projeto' },
      { quem: 'Contrapartidas urbanísticas', como: 'Empreendimentos privados pagam áreas públicas em acordo com a prefeitura.', valor: 'Parque Augusta (SP): cerca de R$ 11 mi' },
      { quem: 'BID, Banco Mundial e CAF', como: 'Empréstimos para programas urbanos maiores, com aval da União.', valor: 'Programa a programa' },
      { quem: 'Concessões e eventos', como: 'Restaurante e quiosques por permissão de uso, eventos, patrocínio de espaços.', valor: 'A estimar no plano de negócios' },
    ],
  },
];

import type { Point } from '../lib/geometry';
import type { Fonte, StatusEvidencia } from './types';

/**
 * Catálogo de instalações externas e de apoio (D2).
 * Posições e dimensões são ILUSTRATIVAS (geometria leve da maquete), não
 * dimensões de projeto, homologação esportiva ou norma.
 */
export type TipoInstalacao =
  | 'campo' | 'quadra' | 'praca' | 'anfiteatro' | 'playground' | 'restaurante' | 'quiosque'
  | 'sanitario' | 'coleta_seletiva' | 'horta' | 'viveiro_compostagem' | 'orientacao_cidada'
  | 'jardim_sensorial' | 'estacionamento' | 'apoio_operacional';

export type Forma =
  | { tipo: 'retangulo'; largura: number; profundidade: number }
  | { tipo: 'circulo'; raio: number }
  | { tipo: 'semicirculo'; raio: number };

export interface Instalacao {
  id: string;
  nome: string;
  tipo: TipoInstalacao;
  descricao: string;
  /** `null` = distribuído pelo parque (ex.: coletores), sem setor único. */
  setor_id: string | null;
  nucleos_ids: string[];
  status: StatusEvidencia;
  /** Uma ou mais posições (x, z) na escala visual normalizada. */
  posicoes: Point[];
  forma: Forma;
  /** Altura visual na cena (m ilustrativos). */
  altura: number;
  orcamento_id: string;
  pendencias: string[];
  fontes: Fonte[];
}

const PM_43: Fonte = { documento: 'prompt_mestre_v2_1', secao: '4.3' };

export const INSTALACOES: readonly Instalacao[] = [
  // Esporte
  { id: 'campo-society', nome: 'Campo society', tipo: 'campo', descricao: 'Campo society de porte médio/grande, com horários comunitários.', setor_id: 'esporte', nucleos_ids: ['esporte-movimento'], status: 'proposto', posicoes: [[-8, 176]], forma: { tipo: 'retangulo', largura: 56, profundidade: 36 }, altura: 0.2, orcamento_id: 'ESP-001', pendencias: ['Modalidade, dimensões, drenagem, iluminação e alambrado a definir por estudo.'], fontes: [{ documento: 'estudo_v1', secao: '6.1' }, PM_43] },
  { id: 'quadra-externa-1', nome: 'Quadra híbrida externa 1', tipo: 'quadra', descricao: 'Quadra para futebol, basquete e voleibol, com configuração por modalidade.', setor_id: 'esporte', nucleos_ids: ['esporte-movimento'], status: 'proposto', posicoes: [[55, 175]], forma: { tipo: 'retangulo', largura: 28, profundidade: 16 }, altura: 0.2, orcamento_id: 'ESP-001', pendencias: ['Dimensões e marcações compatíveis com cada modalidade a definir.'], fontes: [{ documento: 'estudo_v1', secao: '6.1' }, PM_43] },
  { id: 'quadra-externa-2', nome: 'Quadra híbrida externa 2', tipo: 'quadra', descricao: 'Quadra para futebol, basquete e voleibol, com configuração por modalidade.', setor_id: 'esporte', nucleos_ids: ['esporte-movimento'], status: 'proposto', posicoes: [[55, 197]], forma: { tipo: 'retangulo', largura: 28, profundidade: 16 }, altura: 0.2, orcamento_id: 'ESP-001', pendencias: ['Dimensões e marcações compatíveis com cada modalidade a definir.'], fontes: [{ documento: 'estudo_v1', secao: '6.1' }, PM_43] },
  // Convivência e eventos
  { id: 'praca-central', nome: 'Praça central', tipo: 'praca', descricao: 'Praça de encontro, feiras e eventos comunitários.', setor_id: 'pracas', nucleos_ids: ['convivencia-eventos'], status: 'proposto', posicoes: [[-5, -30]], forma: { tipo: 'circulo', raio: 22 }, altura: 0.25, orcamento_id: 'PAI-001', pendencias: ['Controle de ruído, iluminação, lotação e rotas de fuga.'], fontes: [{ documento: 'estudo_v1', secao: '4.3' }] },
  { id: 'anfiteatro', nome: 'Anfiteatro aberto', tipo: 'anfiteatro', descricao: 'Apresentações, cinema ao ar livre e saraus.', setor_id: 'pracas', nucleos_ids: ['convivencia-eventos', 'cultura-criacao'], status: 'proposto', posicoes: [[22, 20]], forma: { tipo: 'semicirculo', raio: 16 }, altura: 1.5, orcamento_id: 'PAI-001', pendencias: ['Lotação não definida; acústica, acessibilidade e rotas de fuga a estudar.'], fontes: [{ documento: 'estudo_v1', secao: '4.3' }, { documento: 'estudo_v2', secao: '6' }] },
  // Alimentação
  { id: 'restaurante', nome: 'Restaurante principal', tipo: 'restaurante', descricao: 'Refeições em horários ajustados à demanda real.', setor_id: 'pracas', nucleos_ids: ['alimentacao-economia'], status: 'proposto', posicoes: [[25, -65]], forma: { tipo: 'retangulo', largura: 26, profundidade: 16 }, altura: 5, orcamento_id: 'ALI-001', pendencias: ['Cozinha, estoque, resíduos e critérios sanitários pendentes.', 'Não presumir café, almoço e jantar desde o primeiro dia.'], fontes: [{ documento: 'estudo_v1', secao: '6.2' }, { documento: 'estudo_v2', secao: '9' }] },
  { id: 'quiosque-1', nome: 'Quiosque 1 (praça)', tipo: 'quiosque', descricao: 'Lanches e bebidas junto à praça.', setor_id: 'pracas', nucleos_ids: ['alimentacao-economia'], status: 'proposto', posicoes: [[-30, -70]], forma: { tipo: 'retangulo', largura: 6, profundidade: 6 }, altura: 3.5, orcamento_id: 'ALI-001', pendencias: ['Seleção de operadores, logística e regras sanitárias.'], fontes: [{ documento: 'estudo_v1', secao: '6.2' }] },
  { id: 'quiosque-2', nome: 'Quiosque 2 (família)', tipo: 'quiosque', descricao: 'Lanches e bebidas junto aos playgrounds.', setor_id: 'infancia', nucleos_ids: ['alimentacao-economia'], status: 'proposto', posicoes: [[-50, 30]], forma: { tipo: 'retangulo', largura: 6, profundidade: 6 }, altura: 3.5, orcamento_id: 'ALI-001', pendencias: ['Seleção de operadores, logística e regras sanitárias.'], fontes: [{ documento: 'estudo_v1', secao: '6.2' }] },
  { id: 'quiosque-3', nome: 'Quiosque 3 (esporte)', tipo: 'quiosque', descricao: 'Lanches e bebidas junto ao campo e às quadras.', setor_id: 'esporte', nucleos_ids: ['alimentacao-economia'], status: 'proposto', posicoes: [[12, 210]], forma: { tipo: 'retangulo', largura: 6, profundidade: 6 }, altura: 3.5, orcamento_id: 'ALI-001', pendencias: ['Seleção de operadores, logística e regras sanitárias.'], fontes: [{ documento: 'estudo_v1', secao: '6.2' }] },
  // Infância
  { id: 'playground-0-5', nome: 'Playground 0–5 anos', tipo: 'playground', descricao: 'Brincar com piso amortecedor e sombra; espaço para responsáveis.', setor_id: 'infancia', nucleos_ids: ['infancia-familia'], status: 'proposto', posicoes: [[-68, -45]], forma: { tipo: 'retangulo', largura: 30, profundidade: 24 }, altura: 0.3, orcamento_id: 'PAI-001', pendencias: ['Equipamentos, piso amortecedor e plano de inspeção/manutenção.'], fontes: [{ documento: 'estudo_v1', secao: '4.5' }] },
  { id: 'playground-6-12', nome: 'Playground 6–12 anos', tipo: 'playground', descricao: 'Brincar ativo por faixa etária.', setor_id: 'infancia', nucleos_ids: ['infancia-familia'], status: 'proposto', posicoes: [[-68, 0]], forma: { tipo: 'retangulo', largura: 34, profundidade: 26 }, altura: 0.3, orcamento_id: 'PAI-001', pendencias: ['Equipamentos, piso amortecedor e plano de inspeção/manutenção.'], fontes: [{ documento: 'estudo_v1', secao: '4.5' }] },
  // Sanitários externos
  { id: 'sanitario-praca', nome: 'Sanitários (praça)', tipo: 'sanitario', descricao: 'Sanitários acessíveis e demais sanitários; fraldário quando necessário.', setor_id: 'pracas', nucleos_ids: ['operacao-seguranca'], status: 'proposto', posicoes: [[-28, 25]], forma: { tipo: 'retangulo', largura: 10, profundidade: 6 }, altura: 3.5, orcamento_id: 'MOB-001', pendencias: ['Quantidade e localização por lotação, percurso e exigências legais.'], fontes: [{ documento: 'estudo_v1', secao: '6.3' }, PM_43] },
  { id: 'sanitario-familia', nome: 'Sanitários e fraldário (família)', tipo: 'sanitario', descricao: 'Sanitários acessíveis e fraldário junto aos playgrounds.', setor_id: 'infancia', nucleos_ids: ['operacao-seguranca', 'infancia-familia'], status: 'proposto', posicoes: [[-60, -70]], forma: { tipo: 'retangulo', largura: 10, profundidade: 6 }, altura: 3.5, orcamento_id: 'MOB-001', pendencias: ['Quantidade e localização por lotação, percurso e exigências legais.'], fontes: [{ documento: 'estudo_v1', secao: '6.3' }] },
  { id: 'sanitario-esporte', nome: 'Sanitários e vestiários (campo)', tipo: 'sanitario', descricao: 'Sanitários, vestiários e duchas de apoio ao esporte externo.', setor_id: 'esporte', nucleos_ids: ['operacao-seguranca', 'esporte-movimento'], status: 'proposto', posicoes: [[-30, 140]], forma: { tipo: 'retangulo', largura: 10, profundidade: 6 }, altura: 3.5, orcamento_id: 'MOB-001', pendencias: ['Quantidade e localização por lotação, percurso e exigências legais.'], fontes: [{ documento: 'estudo_v1', secao: '6.3' }] },
  // Sustentabilidade e inclusão
  { id: 'horta-comunitaria', nome: 'Horta comunitária', tipo: 'horta', descricao: 'Canteiros acessíveis, inclusive elevados, e espaço pedagógico.', setor_id: 'inclusao', nucleos_ids: ['sustentabilidade', 'cidadania-inclusao'], status: 'proposto', posicoes: [[-122, -48]], forma: { tipo: 'retangulo', largura: 36, profundidade: 34 }, altura: 0.4, orcamento_id: 'AMB-001', pendencias: ['Regras de uso, manejo, distribuição da produção e manutenção.'], fontes: [{ documento: 'estudo_v1', secao: '8.1' }] },
  { id: 'viveiro-compostagem', nome: 'Viveiro, compostagem e triagem', tipo: 'viveiro_compostagem', descricao: 'Compostagem educativa e área de triagem de recicláveis.', setor_id: 'inclusao', nucleos_ids: ['sustentabilidade'], status: 'proposto', posicoes: [[-106, 20]], forma: { tipo: 'retangulo', largura: 14, profundidade: 10 }, altura: 3, orcamento_id: 'AMB-001', pendencias: ['Capacidade só após caracterização e pesagem dos resíduos; parceria formal com cooperativa.'], fontes: [{ documento: 'estudo_v1', secao: '8.2' }] },
  { id: 'ponto-orientacao', nome: 'Ponto de Orientação Cidadã', tipo: 'orientacao_cidada', descricao: 'Informação, escuta inicial e encaminhamento à rede pública. Não é Centro POP nem abrigo.', setor_id: 'inclusao', nucleos_ids: ['cidadania-inclusao'], status: 'proposto', posicoes: [[-120, -10]], forma: { tipo: 'retangulo', largura: 16, profundidade: 12 }, altura: 4, orcamento_id: 'SRV-001', pendencias: ['Atendimento especializado só com profissionais e pactuação com SUAS.'], fontes: [{ documento: 'estudo_v2', secao: '8' }, { documento: 'prompt_mestre_v2_1', secao: '6' }] },
  { id: 'jardim-sensorial', nome: 'Jardim sensorial', tipo: 'jardim_sensorial', descricao: 'Contemplação e educação ambiental no bosque.', setor_id: 'verde', nucleos_ids: ['parque-vivo'], status: 'proposto', posicoes: [[-40, -110]], forma: { tipo: 'circulo', raio: 12 }, altura: 0.3, orcamento_id: 'PAI-001', pendencias: ['Espécies e manejo conforme inventário arbóreo.'], fontes: [{ documento: 'estudo_v2', secao: '4' }] },
  // Serviços
  { id: 'estacionamento', nome: 'Estacionamento', tipo: 'estacionamento', descricao: 'Vagas e embarque/desembarque; dimensionar por estudo de demanda.', setor_id: 'servicos', nucleos_ids: ['operacao-seguranca'], status: 'proposto', posicoes: [[118, 135]], forma: { tipo: 'retangulo', largura: 44, profundidade: 50 }, altura: 0.15, orcamento_id: 'CIR-001', pendencias: ['Número de vagas não definido; priorizar mobilidade ativa e transporte coletivo.'], fontes: [{ documento: 'estudo_v1', secao: '4.7' }] },
  { id: 'apoio-operacional', nome: 'Administração, manutenção e depósitos', tipo: 'apoio_operacional', descricao: 'Administração, primeiros socorros, zeladoria, depósitos e carga/descarga.', setor_id: 'servicos', nucleos_ids: ['operacao-seguranca'], status: 'proposto', posicoes: [[115, 180]], forma: { tipo: 'retangulo', largura: 30, profundidade: 18 }, altura: 5, orcamento_id: 'SRV-001', pendencias: ['Programa de necessidades e equipe a dimensionar.'], fontes: [{ documento: 'estudo_v1', secao: '6.3' }, PM_43] },
  // Resíduos: pontos estratégicos, NUNCA a cada 2 m (V1 §6.4, PM §5)
  { id: 'coleta-seletiva', nome: 'Pontos de coleta seletiva', tipo: 'coleta_seletiva', descricao: 'Coletores seletivos em pontos de geração e fluxo (alimentação, eventos, quadras, acessos), fora da faixa livre acessível.', setor_id: null, nucleos_ids: ['sustentabilidade', 'operacao-seguranca'], status: 'proposto', posicoes: [[8, -62], [-20, -5], [-30, -62], [-44, 36], [35, 160], [-28, 152], [148, 165], [45, 25], [-100, 8]], forma: { tipo: 'retangulo', largura: 2, profundidade: 1 }, altura: 1.1, orcamento_id: 'MOB-001', pendencias: ['Número e posição definitivos dependem do plano de operação de resíduos.'], fontes: [{ documento: 'estudo_v1', secao: '6.4' }, { documento: 'prompt_mestre_v2_1', secao: '5' }] },
];

export function instalacaoPorId(id: string): Instalacao | undefined {
  return INSTALACOES.find((i) => i.id === id);
}

/** Retângulos envolventes (conservadores) de cada ocorrência, para testes de encaixe. */
export function pegadas(i: Instalacao): Point[][] {
  return i.posicoes.map(([x, z]) => {
    const f = i.forma;
    const w = f.tipo === 'retangulo' ? f.largura / 2 : f.raio;
    const d = f.tipo === 'retangulo' ? f.profundidade / 2 : f.raio;
    return [[x - w, z - d], [x + w, z - d], [x + w, z + d], [x - w, z + d]];
  });
}

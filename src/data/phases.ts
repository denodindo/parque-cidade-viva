import type { Fonte } from './types';

/**
 * Fases de IMPLANTAÇÃO FÍSICA (cenário acadêmico, PM §11). Não são fases do
 * software, não têm meses, custo nem data de inauguração.
 */
export type FaseId = 'F0' | 'F1' | 'F2' | 'F3' | 'F4';

export interface FaseFisica {
  id: FaseId;
  nome: string;
  conceito: string;
  dependencia: string;
  cor: string;
}

export const FASES_FISICAS: readonly FaseFisica[] = [
  { id: 'F0', nome: 'Validação', conceito: 'Terreno, matrícula, topografia, sondagens, ambiente, demanda, acessos, participação e governança.', dependencia: 'Evidências e estudos profissionais.', cor: '#9e9e9e' },
  { id: 'F1', nome: 'Parque essencial', conceito: 'Caminhos, iluminação, sanitários, sombra, praça, lazer simples, limpeza e segurança.', dependencia: 'Custeio e manutenção viáveis.', cor: '#4f8f5f' },
  { id: 'F2', nome: 'Esporte e educação inicial', conceito: 'Quadras/campo, salas de estudo, biblioteca de partida, cursos e programação.', dependencia: 'Equipe, demanda e parcerias.', cor: '#d9a441' },
  { id: 'F3', nome: 'Centro integrado', conceito: 'Ginásio/piscinas, centro cultural/auditório, restaurante e serviços ampliados.', dependencia: 'Engenharia, projetos, licenças, CAPEX e OPEX assegurados.', cor: '#c9785a' },
  { id: 'F4', nome: 'Excelência e inovação', conceito: 'Laboratório criativo, estúdio, programas avançados, melhorias de impacto.', dependencia: 'Evidência de resultado e financiamento sustentável.', cor: '#7b6bb0' },
];

export const FONTE_FASES: Fonte[] = [{ documento: 'prompt_mestre_v2_1', secao: '11' }, { documento: 'estudo_v2', secao: '15' }];

/**
 * Atribuição PROPOSTA de cada objeto a uma fase física (decisão do D3/D7 com base
 * no PM §11). F0 não tem objeto construído: é validação.
 */
export const FASE_POR_OBJETO: Readonly<Record<string, FaseId>> = {
  // setores
  verde: 'F1', circulacao: 'F1', servicos: 'F1', pracas: 'F1', infancia: 'F1', esporte: 'F2', inclusao: 'F2', cultura: 'F3',
  // edifícios
  ginasio: 'F3', 'centro-cultural': 'F3',
  // instalações
  'campo-society': 'F2', 'quadra-externa-1': 'F2', 'quadra-externa-2': 'F2',
  'praca-central': 'F1', anfiteatro: 'F2', restaurante: 'F3',
  'quiosque-1': 'F2', 'quiosque-2': 'F2', 'quiosque-3': 'F2',
  'playground-0-5': 'F1', 'playground-6-12': 'F1',
  'sanitario-praca': 'F1', 'sanitario-familia': 'F1', 'sanitario-esporte': 'F2',
  'horta-comunitaria': 'F2', 'viveiro-compostagem': 'F2', 'ponto-orientacao': 'F2', 'jardim-sensorial': 'F1',
  estacionamento: 'F1', 'apoio-operacional': 'F1', 'coleta-seletiva': 'F1',
};

export function fasePorId(id: FaseId): FaseFisica {
  return FASES_FISICAS.find((f) => f.id === id)!;
}

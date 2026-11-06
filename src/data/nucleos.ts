import type { Fonte } from './types';

/**
 * Dez núcleos FUNCIONAIS (PM §3, V2 §4). Núcleo ≠ setor: um núcleo referencia
 * setores territoriais, mas não tem área própria e não altera a soma territorial.
 */
export interface Nucleo {
  id: string;
  numero: number;
  nome: string;
  descricao: string;
  setores_ids: string[];
  fontes: Fonte[];
}

const F: Fonte[] = [{ documento: 'estudo_v2', secao: '4' }, { documento: 'prompt_mestre_v2_1', secao: '3' }];

export const NUCLEOS: readonly Nucleo[] = [
  { id: 'parque-vivo', numero: 1, nome: 'Parque vivo e biodiversidade', descricao: 'Bosques, jardins, sombra, viveiro, jardim sensorial, contemplação e educação ambiental.', setores_ids: ['verde'], fontes: F },
  { id: 'esporte-movimento', numero: 2, nome: 'Esporte e movimento', descricao: 'Ginásio, piscinas, academia, quadras, campo, caminhada, corrida, esporte adaptado e festivais.', setores_ids: ['esporte'], fontes: F },
  { id: 'cultura-criacao', numero: 3, nome: 'Cultura e criação', descricao: 'Auditório, biblioteca, oficinas, exposição e pequeno estúdio comunitário.', setores_ids: ['cultura', 'pracas'], fontes: F },
  { id: 'educacao-futuro', numero: 4, nome: 'Educação e futuro', descricao: 'Educa Povão, EJA articulada à rede, inclusão digital, preparação acadêmica e orientação de carreira.', setores_ids: ['cultura'], fontes: F },
  { id: 'infancia-familia', numero: 5, nome: 'Infância e família', descricao: 'Playgrounds por idade, leitura infantil, convivência e espaços para responsáveis.', setores_ids: ['infancia'], fontes: F },
  { id: 'convivencia-eventos', numero: 6, nome: 'Convivência e eventos', descricao: 'Praça, anfiteatro, feiras, cinema e encontros comunitários.', setores_ids: ['pracas'], fontes: F },
  { id: 'cidadania-inclusao', numero: 7, nome: 'Cidadania e inclusão', descricao: 'Orientação, encaminhamento social, acolhimento diurno condicionado e acessibilidade.', setores_ids: ['inclusao'], fontes: F },
  { id: 'alimentacao-economia', numero: 8, nome: 'Alimentação e economia local', descricao: 'Restaurante, três quiosques, educação alimentar e economia comunitária.', setores_ids: ['pracas', 'infancia', 'esporte'], fontes: F },
  { id: 'sustentabilidade', numero: 9, nome: 'Sustentabilidade', descricao: 'Horta, compostagem, triagem, educação ambiental e eficiência de recursos.', setores_ids: ['inclusao', 'verde'], fontes: F },
  { id: 'operacao-seguranca', numero: 10, nome: 'Operação e segurança', descricao: 'Administração, primeiros socorros, limpeza, manutenção, depósitos, sanitários, equipe e circulação técnica.', setores_ids: ['servicos', 'circulacao'], fontes: F },
];

export function nucleoPorId(id: string): Nucleo | undefined {
  return NUCLEOS.find((n) => n.id === id);
}

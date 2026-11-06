import type { LancamentoOrcamento, StatusCusto, TipoCusto, Unidade } from '../lib/budget-calculator';

/**
 * Estrutura orçamentária rastreável. NENHUM preço foi inventado: sem fonte, o
 * valor é `null`. Códigos CAPEX seguem o estudo v1 §10.2; blocos OPEX seguem
 * o estudo v1 §11 e v2 §14. `setor_id: null` = parque todo.
 */
interface Semente {
  id: string;
  nome: string;
  tipo?: TipoCusto;
  setor_id?: string | null;
  objeto_3d_id?: string | null;
  parent_id?: string | null;
  unidade?: Unidade;
  categoria?: string;
  status?: StatusCusto;
  observacoes: string;
}

function l(s: Semente): LancamentoOrcamento {
  return {
    id: s.id,
    objeto_3d_id: s.objeto_3d_id ?? null,
    nome: s.nome,
    setor_id: s.setor_id ?? null,
    categoria: s.categoria ?? 'obra',
    tipo: s.tipo ?? 'CAPEX',
    quantidade: null,
    unidade: s.unidade ?? 'a_definir',
    custo_unitario_brl: null,
    fonte: null,
    data_base: null,
    status: s.status ?? 'a_cotar',
    parent_id: s.parent_id ?? null,
    incluido_no_total: true,
    observacoes: s.observacoes,
  };
}

const AGRUPADO = 'Lançamento agrupado: cobre várias instalações.';

export const ORCAMENTO: readonly LancamentoOrcamento[] = [
  // CAPEX — estudo v1 §10.2
  l({ id: 'PRE-001', nome: 'Estudos, levantamentos e sondagens', categoria: 'estudos', observacoes: 'A levantar; inclui topografia, sondagens, ambiental e demanda (fase F0).' }),
  l({ id: 'PRO-001', nome: 'Projetos, licenças e consultorias', categoria: 'projetos', observacoes: 'A levantar.' }),
  l({ id: 'TER-001', nome: 'Preparação do terreno e terraplenagem', unidade: 'm3', observacoes: 'A medir; SINAPI/composição.' }),
  l({ id: 'DRE-001', nome: 'Drenagem e manejo pluvial', observacoes: 'A medir; SINAPI/composição.' }),
  l({ id: 'FUN-001', nome: 'Fundações e contenções', observacoes: 'A projetar; depende de sondagens.' }),
  l({ id: 'EST-001', nome: 'Estruturas e coberturas', observacoes: 'A projetar; inclui avaliação das quadras elevadas do ginásio.' }),
  l({ id: 'INS-001', nome: 'Instalações elétricas, hidráulicas e especiais', observacoes: 'A projetar.' }),
  l({ id: 'GIN-001', nome: 'Ginásio — construção civil', setor_id: 'esporte', objeto_3d_id: 'ginasio-multifuncional', unidade: 'm2', observacoes: 'm² a definir; fonte prevista SINAPI-SP ou composição documentada.' }),
  l({ id: 'AQU-001', nome: 'Piscinas e tratamento de água', setor_id: 'esporte', objeto_3d_id: 'ginasio-multifuncional', parent_id: 'GIN-001', categoria: 'equipamento_ou_obra_a_classificar', observacoes: 'Projeto a definir; cotações/composição.' }),
  l({ id: 'ACA-001', nome: 'Equipamentos de academia e quadras cobertas', setor_id: 'esporte', objeto_3d_id: 'ginasio-multifuncional', parent_id: 'GIN-001', categoria: 'equipamento', observacoes: 'A especificar; cotações. Código criado no D4 para separar equipamento de obra.' }),
  l({ id: 'ESP-001', nome: 'Quadras, campo e equipamentos esportivos externos', setor_id: 'esporte', observacoes: `A medir; cotações/composições. ${AGRUPADO}` }),
  l({ id: 'CUL-001', nome: 'Centro cultural e educacional — construção civil', setor_id: 'cultura', objeto_3d_id: 'centro-cultural-educacional', unidade: 'm2', observacoes: 'm² a definir.' }),
  l({ id: 'AUD-001', nome: 'Auditório e equipamentos cênicos', setor_id: 'cultura', objeto_3d_id: 'centro-cultural-educacional', parent_id: 'CUL-001', categoria: 'equipamento', observacoes: 'A especificar; cotações. Meta de até 300 lugares não é capacidade licenciada.' }),
  l({ id: 'TI-001', nome: 'Laboratórios e infraestrutura de TI', setor_id: 'cultura', objeto_3d_id: 'centro-cultural-educacional', parent_id: 'CUL-001', categoria: 'equipamento', observacoes: 'A especificar; cotações.' }),
  l({ id: 'ALI-001', nome: 'Restaurante e três quiosques', setor_id: 'pracas', observacoes: `A projetar; composição/cotação. ${AGRUPADO}` }),
  l({ id: 'AMB-001', nome: 'Horta, viveiro, compostagem e triagem', setor_id: 'inclusao', observacoes: `A dimensionar; composição/cotação. ${AGRUPADO}` }),
  l({ id: 'PAI-001', nome: 'Paisagismo e mobiliário urbano', setor_id: 'verde', observacoes: `A medir; SINAPI/composição. ${AGRUPADO}` }),
  l({ id: 'CIR-001', nome: 'Pavimentação, ciclovias, estacionamento e sinalização', setor_id: 'circulacao', observacoes: `A medir; SINAPI/composição. ${AGRUPADO}` }),
  l({ id: 'SEG-001', nome: 'Segurança, incêndio e controle de acesso', observacoes: 'A projetar; composição/cotação.' }),
  l({ id: 'MOB-001', nome: 'Mobiliário, sanitários e vestiários', setor_id: 'servicos', observacoes: `A especificar; cotações. ${AGRUPADO}` }),
  l({ id: 'SRV-001', nome: 'Edificações de apoio (administração, manutenção, Ponto de Orientação Cidadã)', setor_id: 'servicos', observacoes: `Código criado no D2; não consta no V1 §10.2. ${AGRUPADO}` }),
  l({ id: 'ADM-001', nome: 'Administração local, fiscalização e gerenciamento', categoria: 'indireto', observacoes: 'A definir; composição.' }),
  l({ id: 'RSC-001', nome: 'Reserva de riscos/contingência justificada', categoria: 'contingencia', observacoes: 'A definir após análise de risco; não aplicar percentual genérico.' }),
  // Implantação de programas — estudo v2 §14
  l({ id: 'IMP-001', nome: 'Implantação de programas (materiais, acervo, kits, sistemas)', tipo: 'implantacao_programas', categoria: 'programas', observacoes: 'Por turma, usuário, ciclo e kit; a dimensionar no plano de cada programa.' }),
  // OPEX — estudo v1 §11, v2 §14 (por ano)
  l({ id: 'OPX-PES-001', nome: 'Pessoal, encargos e benefícios', tipo: 'OPEX_anual', unidade: 'ano', categoria: 'pessoal', observacoes: 'Postos, jornadas e turnos ainda não dimensionados.' }),
  l({ id: 'OPX-UTL-001', nome: 'Água, energia, gás e conectividade', tipo: 'OPEX_anual', unidade: 'ano', categoria: 'utilidades', observacoes: 'Consumo a estimar; piscinas elevam água e energia.' }),
  l({ id: 'OPX-PIS-001', nome: 'Tratamento de piscinas e insumos', tipo: 'OPEX_anual', unidade: 'ano', categoria: 'manutencao', setor_id: 'esporte', objeto_3d_id: 'ginasio-multifuncional', observacoes: 'Depende do projeto das piscinas.' }),
  l({ id: 'OPX-LIM-001', nome: 'Limpeza, jardinagem e segurança', tipo: 'OPEX_anual', unidade: 'ano', categoria: 'servicos', observacoes: 'Níveis de serviço a definir.' }),
  l({ id: 'OPX-MAN-001', nome: 'Manutenção predial, equipamentos e reposição', tipo: 'OPEX_anual', unidade: 'ano', categoria: 'manutencao', observacoes: 'Plano de manutenção preventiva a elaborar.' }),
  l({ id: 'OPX-PRG-001', nome: 'Programação: oficinas, educadores, eventos, materiais e transporte', tipo: 'OPEX_anual', unidade: 'ano', categoria: 'programas', observacoes: 'Agenda anual e custo por turma/atividade a definir.' }),
];

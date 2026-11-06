// Estimativa paramétrica (ordem de grandeza) do Parque Cidade Viva — nov/2026.
// base: 'R' = ancorada em referência pública citada; 'H' = hipótese do estudo (exige cotação).
const CUB = 2238.58; // CUB-SP R8-N set/2026 (SindusCon-SP), R$/m²

const capex = [
  // grupo, codigo, item, fase, qmin, qmax, unid, umin, umax, base, nota
  ['Edifícios', 'GIN-001', 'Ginásio multifuncional: obra civil (térreo + 3 pavimentos)', 'F3', 9000, 12600, 'm²', 3400, 5000, 'H', 'Área: planta ilustrativa 70 × 45 m em 4 níveis (máx. 12.600 m²). Custo: 1,5 a 2,2 × CUB-SP R8-N de set/2026 (R$ 2.238,58/m²), por grandes vãos, quadras elevadas e fundações.'],
  ['Edifícios', 'AQU-001', 'Piscinas (25 m + iniciação), aquecimento e tratamento', 'F3', 1, 1, 'conjunto', 2000000, 4500000, 'H', 'Ordem de grandeza: piscina aquecida em Manduri-SP com valor estimado de R$ 825 mil (licitação 2026, escopo menor). Item filho do ginásio, somado só uma vez.'],
  ['Edifícios', 'ACA-001', 'Equipamentos de academia e das quadras cobertas', 'F3', 1, 1, 'conjunto', 800000, 2000000, 'H', 'Item filho do ginásio, somado só uma vez. Exige especificação e três cotações.'],
  ['Edifícios', 'CUL-001', 'Centro cultural e educacional: obra civil (térreo + 2 pavimentos)', 'F3', 4500, 6000, 'm²', 3200, 4800, 'H', 'Área: planta ilustrativa 50 × 40 m em 3 níveis (máx. 6.000 m²). Custo: 1,4 a 2,1 × CUB-SP. Comparação: CEU da Cultura (MinC), média de R$ 2 mi por unidade de no mínimo 350 m².'],
  ['Edifícios', 'AUD-001', 'Auditório (meta de até 300 lugares): poltronas, palco, som e luz', 'F3', 1, 1, 'conjunto', 1200000, 3000000, 'H', 'Item filho do centro cultural. Lotação não é capacidade licenciada.'],
  ['Edifícios', 'TI-001', 'Laboratórios de TI e mobiliário de salas', 'F3', 1, 1, 'conjunto', 400000, 1000000, 'H', 'Item filho do centro cultural.'],
  ['Edifícios', 'ALI-001', 'Restaurante (416 m²) e 3 quiosques (108 m²), com cozinha', 'F3', 524, 524, 'm²', 3600, 6300, 'H', 'Edificação comercial: 1,6 a 2,8 × CUB-SP CSL-8 (R$ 2.237,54/m²), incluindo cozinha industrial.'],
  ['Edifícios', 'SRV-001', 'Administração, manutenção e Ponto de Orientação Cidadã', 'F1', 732, 732, 'm²', 2800, 4200, 'H', '540 m² de apoio + 192 m² de orientação; 1,25 a 1,9 × CUB-SP CSL-8.'],
  ['Edifícios', 'MOB-001a', 'Três blocos de sanitários e vestiários externos', 'F1', 180, 180, 'm²', 4000, 6500, 'H', 'Áreas molhadas e acessíveis custam mais por m².'],
  ['Esporte externo', 'ESP-001a', 'Campo society (56 × 36 m) com drenagem, alambrado e iluminação', 'F2', 2016, 2016, 'm²', 300, 550, 'R', 'Só a grama sintética instalada: R$ 90 a R$ 180/m² (guia de mercado 2026). Campo de 648 m² em Alto Paraíso-GO, com alambrado e luz: R$ 231/m² em 2017.'],
  ['Esporte externo', 'ESP-001b', 'Duas quadras poliesportivas descobertas (28 × 16 m)', 'F2', 896, 896, 'm²', 300, 650, 'H', 'Piso de concreto, pintura, tabelas, traves e alambrado.'],
  ['Praças, infância e verde', 'PAI-001a', 'Praça central (cerca de 1.520 m²)', 'F1', 1520, 1520, 'm²', 350, 700, 'H', 'Piso, sombra, bancos e pontos de energia para eventos.'],
  ['Praças, infância e verde', 'PAI-001b', 'Anfiteatro aberto (cerca de 400 m²)', 'F2', 402, 402, 'm²', 1200, 2500, 'H', 'Arquibancada em concreto e palco simples.'],
  ['Praças, infância e verde', 'PAI-001c', 'Dois playgrounds (0–5 e 6–12 anos), com piso amortecedor', 'F1', 1604, 1604, 'm²', 350, 750, 'R', 'Playground completo em licitação municipal de 2026: R$ 51 mil a R$ 61 mil (só equipamentos).'],
  ['Praças, infância e verde', 'PAI-001d', 'Jardim sensorial (cerca de 450 m²)', 'F1', 452, 452, 'm²', 250, 500, 'H', ''],
  ['Praças, infância e verde', 'PAI-001e', 'Paisagismo do bosque e jardins (30.000 m²)', 'F1', 30000, 30000, 'm²', 40, 120, 'H', 'Grama, mudas, irrigação parcial. Depende do inventário arbóreo.'],
  ['Praças, infância e verde', 'AMB-001', 'Horta comunitária, viveiro, compostagem e triagem', 'F2', 1, 1, 'conjunto', 330000, 610000, 'H', 'Horta de 1.224 m² e galpão de cerca de 140 m².'],
  ['Praças, infância e verde', 'MOB-001b', 'Mobiliário urbano, bebedouros, bicicletários, sinalização e 9 pontos de coleta seletiva', 'F1', 1, 1, 'conjunto', 600000, 1500000, 'H', 'Coleta seletiva em pontos estratégicos, não lixeiras a cada 2 m.'],
  ['Infraestrutura', 'PRE-001', 'Estudos: topografia, sondagens, ambiental e demanda', 'F0', 1, 1, 'conjunto', 400000, 1000000, 'H', 'Primeiro gasto; sem ele os demais valores não se confirmam.'],
  ['Infraestrutura', 'TER-001', 'Preparação do terreno e terraplenagem', 'F1', 100000, 100000, 'm²', 8, 35, 'H', 'Depende da topografia; pode variar mais do que a faixa.'],
  ['Infraestrutura', 'DRE-001', 'Drenagem e manejo de águas pluviais', 'F1', 100000, 100000, 'm²', 20, 55, 'H', ''],
  ['Infraestrutura', 'CIR-001a', 'Caminhos acessíveis e ciclovia (12.000 m²)', 'F1', 12000, 12000, 'm²', 130, 280, 'H', 'Concreto ou piso intertravado, com acessibilidade.'],
  ['Infraestrutura', 'CIR-001b', 'Estacionamento (cerca de 2.200 m²)', 'F1', 2200, 2200, 'm²', 160, 320, 'H', 'Número de vagas a definir por estudo de demanda.'],
  ['Infraestrutura', 'INS-001a', 'Iluminação externa em LED', 'F1', 150, 250, 'postes', 9000, 16000, 'H', 'Poste, luminária, base e rede.'],
  ['Infraestrutura', 'INS-001b', 'Redes externas de água, esgoto e energia', 'F1', 1, 1, 'conjunto', 1500000, 4000000, 'H', 'Inclui ligação às concessionárias.'],
  ['Infraestrutura', 'SEG-001', 'Prevenção de incêndio externa, câmeras e controle de acesso', 'F1', 1, 1, 'conjunto', 800000, 2000000, 'H', ''],
];

// percentuais sobre o subtotal de obra (sem PRE-001)
const indiretos = [
  ['PRO-001', 'Projetos, licenças e consultorias', 0.04, 0.07, 'H', 'Faixa usual de mercado; confirmar com propostas de escritórios.'],
  ['ADM-001', 'Gerenciamento e fiscalização da obra', 0.03, 0.05, 'H', ''],
  ['RSC-001', 'Reserva de contingência', 0.10, 0.15, 'H', 'Provisória: substituir por análise de riscos.'],
];

const implantacaoProgramas = ['IMP-001', 'Implantação de programas (acervo, kits, sistemas, uniformes)', 500000, 1500000, 'H'];

// Equipe própria (CLT). funcao, qmin, qmax, smin, smax, base, nota
const equipe = [
  ['Gestão', 'Gestor(a) geral do parque', 1, 1, 9000, 14000, 'H', ''],
  ['Gestão', 'Coordenadores (esporte, cultura e educação, social, operação)', 4, 4, 5500, 8500, 'H', ''],
  ['Gestão', 'Assistentes administrativos e financeiros', 3, 5, 2300, 3200, 'H', ''],
  ['Gestão', 'Recepção e atendimento ao público', 4, 8, 1900, 2400, 'H', 'Piso paulista 2026: R$ 1.874,36.'],
  ['Esporte', 'Professores de educação física', 10, 18, 3000, 4500, 'R', 'CAGED: média de R$ 3.338,27 em 2026 (ensino fundamental).'],
  ['Esporte', 'Guarda-vidas', 4, 6, 2100, 2900, 'R', 'CAGED: R$ 2.055 a R$ 2.482; editais somam adicionais.'],
  ['Esporte', 'Técnicos de piscina e tratamento de água', 1, 2, 2500, 3400, 'H', ''],
  ['Cultura e educação', 'Bibliotecários(as)', 1, 2, 4000, 6000, 'H', ''],
  ['Cultura e educação', 'Educadores e instrutores de cursos e oficinas', 8, 14, 2800, 4500, 'H', ''],
  ['Cultura e educação', 'Técnicos de som, luz e audiovisual', 2, 3, 2800, 4200, 'H', ''],
  ['Cultura e educação', 'Monitores de laboratório de TI', 2, 3, 2400, 3500, 'H', ''],
  ['Social', 'Assistente social e psicólogo(a)', 2, 3, 4200, 6500, 'H', 'Atendimento especializado depende de pactuação com o SUAS.'],
  ['Operação', 'Técnicos de enfermagem (primeiros socorros)', 2, 4, 2600, 3500, 'H', ''],
  ['Operação', 'Vigilantes (3 a 4 postos 24 h)', 12, 18, 2100, 2800, 'R', 'CAGED: média de R$ 2.077,41; faixa R$ 1.968 a R$ 2.532.'],
  ['Operação', 'Auxiliares de limpeza', 12, 18, 1875, 2200, 'R', 'CAGED: média de R$ 1.912,78; piso paulista R$ 1.874,36.'],
  ['Operação', 'Jardineiros', 6, 10, 1875, 2400, 'R', 'CAGED: mediana de R$ 1.800 (P90 R$ 2.372); média R$ 1.917,23.'],
  ['Operação', 'Manutenção predial (eletricista, encanador, oficial)', 4, 6, 2600, 3800, 'H', ''],
  ['Operação', 'Horticultor(a) e educador(a) ambiental', 1, 2, 2200, 3200, 'H', ''],
];
const ENC = [0.70, 0.80]; // encargos sobre salário (SINAPI-SP mensalista jan/2025: 71,46%)
const BEN = [700, 1300];  // benefícios por pessoa por mês (VT, VR, plano)

// Outros OPEX anuais: codigo, item, min, max, base, nota ('pct' = % do CAPEX de obra)
const opexOutros = [
  ['OPX-UTL-001', 'Água, energia, gás e internet', 1200000, 3000000, 'H', 'Piscinas aquecidas são o maior consumo.'],
  ['OPX-PIS-001', 'Produtos e insumos das piscinas', 150000, 400000, 'H', ''],
  ['OPX-MAN-001', 'Materiais de manutenção, reposição e contratos técnicos', 'pct', [0.01, 0.02], 'H', '1% a 2% ao ano do custo de obra (regra prática de mercado).'],
  ['OPX-PRG-001', 'Programação: materiais, eventos, transporte e oficineiros', 800000, 2500000, 'H', ''],
  ['OPX-GER-001', 'Seguros, sistemas, auditoria e comunicação', 200000, 600000, 'H', ''],
];

module.exports = { CUB, capex, indiretos, implantacaoProgramas, equipe, ENC, BEN, opexOutros };

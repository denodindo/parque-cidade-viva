// Gera o dossiê do Parque Cidade Viva em .docx (A4).
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, ImageRun, LevelFormat, PageBreak, Footer, PageNumber, TableOfContents, ExternalHyperlink,
} = require('docx');

const OUT = process.argv[2];
const IMG = process.env.IMG_DIR || '/home/user/parque-cidade-viva/release/slides-img';
const VERDE = '1F6B44', ESCURO = '12291F', AMBAR = 'A0600E', CINZA = '3D5247';
const FONTE = 'Arial';
const LARG = 9026; // largura útil A4 com margens de 2,5 cm (DXA)

const t = (text, o = {}) => new TextRun({ text, font: FONTE, ...o });
const p = (text, o = {}) => new Paragraph({ spacing: { after: 120, line: 300 }, ...o, children: Array.isArray(text) ? text : [t(text)] });
const h1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [t(text)] });
const h2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [t(text)] });
const bullet = (text) => new Paragraph({ numbering: { reference: 'bolinhas', level: 0 }, spacing: { after: 60, line: 288 }, children: Array.isArray(text) ? text : [t(text)] });
const numero = (text) => new Paragraph({ numbering: { reference: 'numeros', level: 0 }, spacing: { after: 60, line: 288 }, children: Array.isArray(text) ? text : [t(text)] });
const quebra = () => new Paragraph({ children: [new PageBreak()] });

const borda = { style: BorderStyle.SINGLE, size: 4, color: 'C9D4C6' };
const bordas = { top: borda, bottom: borda, left: borda, right: borda };

function tabela(cabecalho, linhas, pesos) {
  const soma = pesos.reduce((a, b) => a + b, 0);
  const larguras = pesos.map((w) => Math.floor((w / soma) * LARG));
  larguras[larguras.length - 1] += LARG - larguras.reduce((a, b) => a + b, 0);
  const celula = (texto, i, cab) =>
    new TableCell({
      width: { size: larguras[i], type: WidthType.DXA },
      borders: bordas,
      shading: cab ? { type: ShadingType.CLEAR, color: 'auto', fill: 'DCE8DA' } : undefined,
      margins: { top: 80, bottom: 80, left: 110, right: 110 },
      children: [new Paragraph({ children: [t(String(texto), { bold: cab, size: 19, color: cab ? ESCURO : undefined })] })],
    });
  return new Table({
    width: { size: LARG, type: WidthType.DXA },
    columnWidths: larguras,
    rows: [
      new TableRow({ tableHeader: true, children: cabecalho.map((c, i) => celula(c, i, true)) }),
      ...linhas.map((l) => new TableRow({ children: l.map((c, i) => celula(c, i, false)) })),
    ],
  });
}

function caixa(titulo, texto, fill = 'FFF4D6', cor = '6A4B00') {
  return new Table({
    width: { size: LARG, type: WidthType.DXA },
    columnWidths: [LARG],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: LARG, type: WidthType.DXA },
      borders: { top: { style: BorderStyle.SINGLE, size: 4, color: 'E6C766' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E6C766' }, left: { style: BorderStyle.SINGLE, size: 24, color: 'E9A23B' }, right: { style: BorderStyle.SINGLE, size: 4, color: 'E6C766' } },
      shading: { type: ShadingType.CLEAR, color: 'auto', fill },
      margins: { top: 140, bottom: 140, left: 200, right: 200 },
      children: [
        new Paragraph({ spacing: { after: 80 }, children: [t(titulo, { bold: true, color: cor })] }),
        ...[].concat(texto).map((x) => new Paragraph({ spacing: { after: 60, line: 288 }, children: [t(x, { color: cor, size: 20 })] })),
      ],
    })] })],
  });
}

const imagem = (arq, w, h) => new ImageRun({ type: 'jpg', data: fs.readFileSync(path.join(IMG, arq)), transformation: { width: w, height: h } });
const legenda = (text) => p([t(text, { italics: true, size: 18, color: CINZA })], { alignment: AlignmentType.CENTER, spacing: { after: 200 } });
const espaco = () => new Paragraph({ spacing: { after: 120 }, children: [] });

const conteudo = [
  // ---------- capa ----------
  new Paragraph({ spacing: { before: 1800, after: 120 }, children: [t('PROJETO ACADÊMICO SENAC · NOVEMBRO DE 2026', { size: 20, bold: true, color: AMBAR, characterSpacing: 40 })] }),
  new Paragraph({ heading: HeadingLevel.TITLE, children: [t('Parque Cidade Viva')] }),
  p([t('Complexo Integrado de Desenvolvimento Humano', { size: 32, color: VERDE })], { spacing: { after: 240 } }),
  p([t('Dossiê do projeto: propostas, valores, mudança na área, comunidade, parcerias e próximos passos', { size: 24, color: CINZA })], { spacing: { after: 480 } }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [imagem('s-maquete.jpg', 360, 409)] }),
  legenda('Maquete digital 3D do parque proposto (geometria conceitual, escala não certificada).'),
  caixa('Natureza deste documento', [
    'Estudo conceitual acadêmico. Não é projeto executivo, levantamento topográfico, orçamento oficial, licenciamento nem garantia de financiamento.',
    'A área de 100.000 m², os custos, as capacidades e as parcerias são hipóteses ou pendências e estão identificados como tal ao longo do texto.',
  ]),
  quebra(),

  // ---------- sumário ----------
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [t('Sumário')] }),
  new TableOfContents('Sumário', { hyperlink: true, headingStyleRange: '1-2' }),
  p([t('Se o sumário aparecer vazio, clique com o botão direito sobre ele no Word e escolha “Atualizar campo”.', { italics: true, size: 18, color: CINZA })]),
  quebra(),

  // ---------- 1 ----------
  h1('1. Resumo executivo'),
  p('O Parque Cidade Viva é a proposta de um parque público de cerca de 10 hectares que reúne esporte, educação, cultura, sustentabilidade e inclusão social em um só lugar. A ideia não é construir apenas um clube com quadras, e sim um equipamento comunitário com programação gratuita ou acessível todos os dias, articulado à rede pública de serviços.'),
  p('A referência de qualidade são os grandes parques e centros de convivência de São Paulo, como o Ibirapuera, o Villa-Lobos, o Sesc, os CEUs e as Fábricas de Cultura, sem copiar sua escala ou seu modelo de financiamento. Com 10 hectares (área ainda não certificada), a meta realista é um polo de excelência de bairro e região.'),
  h2('Números do estudo'),
  tabela(['Item', 'Proposta'], [
    ['Área de estudo', '100.000 m² (10 ha), hipótese a confirmar'],
    ['Setores territoriais', '8, somando 100.000 m² sem sobreposição'],
    ['Núcleos funcionais', '10 (parque vivo, esporte, cultura, educação, infância, convivência, cidadania, alimentação, sustentabilidade, operação)'],
    ['Edifícios', 'Ginásio multifuncional (4 níveis) e centro cultural e educacional (3 níveis)'],
    ['Instalações externas', 'Campo society, 2 quadras, praça, anfiteatro, 2 playgrounds, restaurante, 3 quiosques, horta, viveiro, sanitários e apoio'],
    ['Programas sociais', '15 propostas em 4 eixos'],
    ['Estimativa de custo', 'Implantação de R$ 79 a 184 mi; operação de R$ 7,9 a 23 mi por ano; equipe de 79 a 127 pessoas (ordem de grandeza, nov/2026)'],
    ['Orçamento rastreável', '30 itens estruturados (implantação, programas e operação), a cotar com fonte e data-base'],
  ], [3, 7]),
  espaco(),

  // ---------- 2 ----------
  h1('2. A mudança na área'),
  p('A área de estudo fica entre uma mata, na parte superior, e uma avenida, na parte inferior, conforme as imagens aéreas de referência. Hoje o terreno aparece como uma área vazia, com solo exposto e vegetação rasteira. A proposta transforma esse espaço em um parque público com bosque, quadras, centro cultural, praças e áreas de convivência.'),
  new Table({
    width: { size: LARG, type: WidthType.DXA }, columnWidths: [LARG / 2, LARG / 2],
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: LARG / 2, type: WidthType.DXA }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [imagem('s-terreno-hoje.jpg', 270, 288)] }), legenda('Hoje: imagem aérea de referência.')] }),
      new TableCell({ width: { size: LARG / 2, type: WidthType.DXA }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [imagem('s-maquete.jpg', 254, 288)] }), legenda('Proposta: maquete digital do parque.')] }),
    ] })],
  }),
  h2('O que muda'),
  bullet('Um terreno sem uso público definido passa a ser um parque aberto à população.'),
  bullet('O bosque fica junto à mata vizinha, ampliando sombra, permeabilidade e continuidade ecológica.'),
  bullet('O esporte e os serviços ficam junto à avenida, facilitando acesso, carga e emergência.'),
  bullet('Uma rede de caminhos acessíveis e uma ciclovia ligam todos os setores.'),
  bullet('A trilha para a área vegetada vizinha é uma possibilidade, condicionada a titularidade e licença ambiental.'),
  caixa('Atenção', 'O contorno foi desenhado sobre a imagem de referência e ampliado para 100.000 m² apenas como exercício visual. Área, perímetro, titularidade, zoneamento e restrições ambientais precisam de levantamento e consulta oficial.'),
  espaco(),

  // ---------- 3 ----------
  h1('3. Visão e valores'),
  p([t('Visão: ', { bold: true }), t('“Um parque que funciona como uma cidade de oportunidades.” O valor do parque está na combinação de espaço de qualidade, programação diária, acolhimento, aprendizagem, participação comunitária e gestão profissional.')]),
  h2('Princípios'),
  tabela(['Valor', 'O que significa'], [
    ['Universalidade', 'Acesso gratuito às áreas públicas e às atividades essenciais; critérios transparentes quando houver vagas limitadas.'],
    ['Educação integral', 'Esporte, arte, cultura, tecnologia, cidadania e trabalho como dimensões complementares.'],
    ['Desenho universal', 'Acessibilidade física, comunicacional, sensorial e de programação desde a concepção.'],
    ['Todas as idades', 'Crianças, adolescentes, jovens, adultos, idosos e pessoas com deficiência no mesmo parque.'],
    ['Território e pertencimento', 'Programação construída com escolas, moradores, coletivos culturais e serviços locais.'],
    ['Qualidade operacional', 'Limpeza, segurança cidadã, manutenção, atendimento e informação como parte da experiência.'],
    ['Transparência', 'Metas públicas, orçamento rastreável, indicadores e prestação de contas.'],
  ], [3, 7]),
  p([t('Síntese: ', { bold: true }), t('a excelência virá da integração e da gestão, não da quantidade de edifícios.')], { spacing: { before: 160, after: 120 } }),

  // ---------- 4 ----------
  h1('4. Propostas'),
  h2('4.1 Distribuição da área'),
  tabela(['Setor', 'Área', '%', 'Observação'], [
    ['Parque verde, bosque e jardins', '30.000 m²', '30%', 'Junto à mata vizinha'],
    ['Esporte e atividades físicas', '20.000 m²', '20%', 'Área do setor, não área construída do ginásio'],
    ['Circulação, acessibilidade e ciclovias', '12.000 m²', '12%', 'Eixo principal e rede de caminhos'],
    ['Praças, eventos e anfiteatro', '10.000 m²', '10%', ''],
    ['Centro cultural e educacional', '8.000 m²', '8%', ''],
    ['Estacionamento e serviços', '8.000 m²', '8%', 'Junto à avenida'],
    ['Playgrounds e lazer familiar', '7.000 m²', '7%', ''],
    ['Inclusão social e horta comunitária', '5.000 m²', '5%', 'Reserva proposta: o quadro original somava 95.000 m²'],
    ['Total', '100.000 m²', '100%', 'Área de estudo hipotética'],
  ], [4, 2, 1, 4]),
  h2('4.2 Ginásio multifuncional (4 níveis)'),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [imagem('s-ginasio.jpg', 560, 350)] }),
  legenda('Maquete do ginásio com os níveis afastados (arranjo interno ilustrativo).'),
  tabela(['Nível', 'Funções'], [
    ['Térreo', 'Piscina de referência de 25 m e piscina menor de iniciação, recepção, vestiários, sanitários acessíveis, primeiros socorros, casa de máquinas.'],
    ['1º pavimento', 'Duas quadras de basquete adaptáveis a vôlei e uma quadra de futsal.'],
    ['2º pavimento', 'Musculação, cardio, treino funcional, avaliação física e atividades coletivas.'],
    ['3º pavimento', 'Jogos, convivência, tênis de mesa e salas multiuso.'],
  ], [2, 8]),
  caixa('Pendência', 'Quadras em pavimento elevado dependem de estudo estrutural, acústico, de segurança e de operação.'),
  h2('4.3 Centro cultural e educacional (3 níveis)'),
  tabela(['Nível', 'Funções'], [
    ['Térreo', 'Auditório com meta de até 300 lugares (objetivo, não capacidade licenciada), palco, camarins e apoio.'],
    ['1º pavimento', 'Biblioteca, acervo, leitura, espaço infantil e estudo.'],
    ['2º pavimento', 'Laboratório de TI, salas de aula, cursos, orientação acadêmica e empreendedorismo.'],
  ], [2, 8]),
  h2('4.4 Áreas externas'),
  bullet('Campo society e duas quadras híbridas (futebol, basquete e vôlei).'),
  bullet('Circuito de caminhada e corrida, estações de alongamento e bicicletários.'),
  bullet('Praça central, anfiteatro aberto, cinema ao ar livre e feiras.'),
  bullet('Playgrounds por faixa etária (0 a 5 e 6 a 12 anos) com espaço para responsáveis.'),
  bullet('Restaurante principal e três quiosques.'),
  bullet('Horta comunitária, viveiro, compostagem e triagem de recicláveis.'),
  bullet('Sanitários acessíveis e fraldários distribuídos; coleta seletiva em pontos estratégicos (não uma lixeira a cada 2 metros).'),
  h2('4.5 Programas sociais propostos'),
  tabela(['Programa', 'Eixo', 'Público', 'Limite'], [
    ['Educa Povão', 'Educação', 'Jovens e adultos rumo ao ensino superior', 'Não promete aprovação nem bolsa'],
    ['EJA e retomada escolar', 'Educação', 'Quem está fora da escola', 'Certificação só via rede de ensino'],
    ['Primeiro Passo Digital', 'Trabalho e tecnologia', 'Pessoas com pouca familiaridade digital', ''],
    ['Estação de Oportunidades', 'Trabalho e tecnologia', 'Quem busca trabalho', 'Não garante emprego'],
    ['Laboratório Criativo', 'Trabalho e tecnologia', 'Adolescentes e jovens', 'Fase F4'],
    ['Empreender no Bairro', 'Trabalho e tecnologia', 'Empreendedores locais', ''],
    ['Esporte para Todos', 'Esporte', 'Todas as idades', ''],
    ['Meninas em Campo', 'Esporte', 'Meninas e mulheres', ''],
    ['Ativa 60+', 'Esporte', 'Pessoas com 60 anos ou mais', ''],
    ['Parque Acessível', 'Esporte', 'Pessoas com deficiência', ''],
    ['Cidadão Consciente', 'Cidadania', 'Todas as idades', ''],
    ['Comunidade Ativa', 'Cultura', 'Todas as idades', ''],
    ['Recomeçar e Ponto de Orientação Cidadã', 'Proteção social', 'Pessoas em vulnerabilidade', 'Não é Centro POP nem abrigo'],
    ['Horta e compostagem educativas', 'Sustentabilidade', 'Escolas e famílias', ''],
    ['Educação alimentar', 'Sustentabilidade', 'Famílias', 'Doações só com controle sanitário'],
  ], [4, 3, 4, 3]),
  p([t('Todos os programas são propostas: equipes, capacidade e parcerias ainda precisam ser definidas e formalizadas.', { italics: true, color: CINZA, size: 20 })], { spacing: { before: 120 } }),

  // ---------- 5 ----------
  h1('5. Valores financeiros e investimento'),
  p('Há duas camadas de valores. A primeira é uma estimativa de ordem de grandeza (novembro de 2026), feita com o custo de construção de São Paulo, licitações recentes, tarifas e salários de 2026, para dar a dimensão do investimento. A segunda é o orçamento rastreável, organizado em 30 itens que só recebem preço com fonte, quantidade medida e data-base. O detalhamento item por item está no anexo “Estimativas de custo, equipe e financiamento”.'),
  h2('5.1 Estimativa de ordem de grandeza'),
  tabela(['Indicador', 'Faixa estimada'], [
    ['Implantação completa (obra, projetos, gerenciamento e reserva)', 'R$ 79 mi a R$ 184 mi'],
    ['Parque essencial, quadras, campo e horta (fases F0 a F2)', 'R$ 19 mi a R$ 50 mi'],
    ['Ginásio com piscinas e centro cultural (fase F3)', 'R$ 60 mi a R$ 134 mi'],
    ['Operação por ano', 'R$ 7,9 mi a R$ 23 mi'],
    ['Equipe própria', '79 a 127 pessoas (folha de R$ 208 a 463 mil por mês)'],
    ['Contas essenciais por mês (luz, água, gás, internet, coleta)', 'R$ 76 mil a R$ 336 mil'],
    ['Principais materiais da obra (parte da implantação)', 'R$ 6,1 mi a R$ 15 mi'],
  ], [7, 4]),
  p([t('Não é orçamento oficial, preço SINAPI nem cotação. A faixa é larga porque ainda não há topografia, sondagem nem projeto.', { italics: true, color: CINZA, size: 20 })], { spacing: { before: 120 } }),
  h2('5.2 Estrutura do orçamento rastreável'),
  tabela(['Bloco', 'Itens', 'Base de cálculo'], [
    ['Implantação (CAPEX)', 'Estudos e sondagens; projetos e licenças; terraplenagem; drenagem; fundações; estruturas; instalações; ginásio e piscinas; centro cultural, auditório e TI; quadras e campo; restaurante e quiosques; horta e compostagem; paisagismo; pavimentação e estacionamento; segurança; mobiliário e sanitários; edificações de apoio; gerenciamento; contingência', 'SINAPI-SP (competência mensal), tabelas públicas e cotações documentadas'],
    ['Implantação de programas', 'Materiais, acervo, kits e sistemas', 'Por turma, ciclo e kit'],
    ['Operação anual (OPEX)', 'Pessoal; água, energia e conectividade; tratamento de piscinas; limpeza, jardinagem e segurança; manutenção; programação', 'Postos, consumo estimado e agenda anual'],
  ], [3, 6, 3]),
  bullet('Valor ausente aparece como “a cotar”, nunca como zero.'),
  bullet('Implantação e operação são contas separadas e nunca somadas.'),
  bullet('Itens “pai” não são somados de novo com seus itens “filho”.'),
  bullet('BDI, encargos e contingência dependem do regime de contratação e da memória de cálculo.'),
  h2('5.3 Oportunidades mapeadas em editais'),
  tabela(['Oportunidade', 'Recursos previstos', 'Prazo informado', 'Aderência'], [
    ['Fomento Municipal ao Teatro e à Dança', 'R$ 18 milhões (pacote total)', '23/11/2026', 'Programação cultural'],
    ['SEME 014/2026 · Movimento Longevidade', 'R$ 6.750.000,00 (programa total)', '7/12/2026 (estimado)', 'Esporte e convivência 50+'],
    ['SEME 013/2026 · Futebol Feminino', 'R$ 4.823.706,81 (programa total)', '3/12/2026 (estimado)', 'Meninas e mulheres'],
    ['SEME 012/2026 · Capacitação Futebol Feminino', 'R$ 1.888.080,00 (programa total)', '3/12/2026 (estimado)', 'Formação e prevenção da violência'],
    ['Biblioteca Comunitária é Cultura Viva', 'Sem repasse imediato (certificação)', 'Fluxo contínuo', 'Biblioteca e leitura'],
  ], [4, 3, 2, 3]),
  caixa('Importante', [
    'Valores totais dos programas publicados (relatório de 05/11/2026), não recursos garantidos ao parque.',
    'Os editais exigem uma organização proponente (OSC) com CNPJ, experiência e capacidade comprovadas. Prazos e regras devem ser reconferidos antes de qualquer inscrição.',
    'Não foi identificado edital aberto para financiar a construção integral do parque.',
  ]),
  h2('5.4 Quem pode financiar'),
  p('A prefeitura seria a proponente das obras, combinando: Ministério do Esporte (Novo PAC, até R$ 1,5 mi por espaço esportivo comunitário), Secretaria Estadual de Esportes (convênios com emendas), Secretaria Municipal de Esportes (professores e editais), Ministério da Cultura (CEU da Cultura, cerca de R$ 2 mi), leis de incentivo (Esporte, Rouanet, ProAC, Pro-Mac), fundos da criança e do idoso, crédito da Caixa (FINISA) e do BNDES e contrapartidas urbanísticas. São tetos e médias de programas, não verbas destinadas ao parque; o mapa completo está no anexo.'),
  espaco(),

  // ---------- 6 ----------
  h1('6. A comunidade e o otimismo com o projeto'),
  p('O Parque Cidade Viva leva para o bairro um equipamento com a qualidade dos melhores parques e centros culturais da cidade: um lugar de alto padrão perto de casa, aberto a todas as idades e com programação gratuita. Essa é a principal razão de ser do projeto e o que pode gerar orgulho e pertencimento na comunidade.'),
  h2('Benefícios esperados'),
  bullet('Esporte, lazer e promoção da saúde para crianças, jovens, adultos, idosos e pessoas com deficiência.'),
  bullet('Cursos, leitura, inclusão digital e preparação para estudos e trabalho, gratuitos.'),
  bullet('Cultura, eventos e convivência no próprio bairro.'),
  bullet('Mais verde, sombra, permeabilidade e educação ambiental.'),
  bullet('Orientação e encaminhamento à rede pública de serviços.'),
  bullet('Oportunidades de trabalho e renda local, com feiras e economia solidária.'),
  h2('Como acompanhar os resultados'),
  tabela(['Dimensão', 'Indicadores propostos'], [
    ['Acesso e uso', 'Visitantes por mês, frequência, faixa etária e território'],
    ['Equidade', 'Participação de meninas e mulheres, pessoas com deficiência e idosos'],
    ['Educação e trabalho', 'Matrículas, conclusão de ciclos, encaminhamentos e inserções confirmadas'],
    ['Cultura', 'Oficinas, apresentações, público e empréstimos da biblioteca'],
    ['Ambiente', 'Árvores, resíduos desviados, composto produzido, água e energia'],
    ['Gestão', 'Custo por atividade, manutenção preventiva e satisfação'],
  ], [3, 7]),
  p([t('Os benefícios são objetivos do projeto, não resultados medidos. As metas serão definidas com a comunidade depois de um estudo de demanda e de uma linha de base.', { italics: true, color: CINZA, size: 20 })], { spacing: { before: 120 } }),

  // ---------- 7 ----------
  h1('7. Parcerias nacionais e internacionais'),
  p('A proposta busca uma rede de cooperação técnica, programação compartilhada, formação de equipes e captação de recursos. Nenhuma instituição abaixo está confirmada como parceira: são interlocutores potenciais, sujeitos a interesse, edital e acordo formal.'),
  h2('7.1 No Brasil'),
  tabela(['Instituição ou rede', 'Possível contribuição', 'Situação'], [
    ['Sesc São Paulo', 'Referência de programação integrada; ações pontuais de cultura, esporte e sustentabilidade', 'A contatar'],
    ['SENAC, ETECs, FATECs e universidades', 'Cursos, extensão, estágios, projetos aplicados e avaliação de impacto', 'A contatar'],
    ['SEBRAE e economia solidária', 'Educação empreendedora, formalização e feiras locais', 'A contatar'],
    ['Instituto Esporte e Educação', 'Formação de educadores e metodologia de esporte inclusivo', 'A contatar'],
    ['Fundação Gol de Letra', 'Referência em esporte, arte e empregabilidade juvenil', 'A contatar'],
    ['Secretarias municipais, CEUs e escolas', 'Pactuação de serviços, calendário e encaminhamentos', 'A contatar'],
    ['Fábricas de Cultura', 'Oficinas, formação artística e circulação de produções', 'A contatar'],
    ['Empresas e fundações', 'Apoio a equipamentos, bolsas e manutenção, com metas e transparência', 'A contatar'],
  ], [4, 6, 2]),
  h2('7.2 No exterior'),
  tabela(['Instituição', 'Possível contribuição', 'Situação'], [
    ['ONU-Habitat (Programa Global de Espaço Público)', 'Metodologias de avaliação, participação e desenho de espaços públicos', 'A explorar'],
    ['BID – Banco Interamericano de Desenvolvimento', 'Linhas de financiamento e cooperação técnica para desenvolvimento urbano e social em municípios', 'A explorar'],
    ['Banco Mundial', 'Financiamento e assistência técnica a programas urbanos municipais', 'A explorar'],
    ['Consulados e embaixadas', 'Intercâmbio e editais de cooperação cultural e esportiva', 'A explorar'],
  ], [4, 6, 2]),
  p([t('Financiamentos internacionais costumam exigir um ente público tomador (prefeitura ou estado) e contrapartidas. A rede internacional é uma frente de médio prazo, depois da validação do terreno e da formação da entidade gestora.', { italics: true, color: CINZA, size: 20 })], { spacing: { before: 120 } }),

  // ---------- 8 ----------
  h1('8. Implantação por fases'),
  tabela(['Fase', 'O que inclui', 'Condição para avançar'], [
    ['F0 · Validação', 'Terreno, matrícula, topografia, sondagens, ambiente, demanda e escuta da comunidade', 'Evidências e estudos profissionais'],
    ['F1 · Parque essencial', 'Caminhos, iluminação, sanitários, sombra, praça, playgrounds, limpeza e segurança', 'Custeio e manutenção viáveis'],
    ['F2 · Esporte e educação inicial', 'Quadras, campo, salas de estudo, biblioteca de partida, cursos e programação', 'Equipe, demanda e parcerias'],
    ['F3 · Centro integrado', 'Ginásio, piscinas, centro cultural, auditório e restaurante', 'Engenharia, licenças, investimento e operação assegurados'],
    ['F4 · Excelência e inovação', 'Laboratório criativo, estúdio e programas avançados', 'Resultados avaliados e financiamento sustentável'],
  ], [3, 6, 4]),
  p([t('Não há datas nem custos por fase nesta etapa: eles dependem de recursos ainda não definidos.', { italics: true, color: CINZA, size: 20 })], { spacing: { before: 120 } }),

  // ---------- 9 ----------
  h1('9. Riscos e cuidados'),
  tabela(['Risco ou incerteza', 'Severidade', 'Ação antes de obras'], [
    ['Titularidade, perímetro e 10 ha não certificados', 'Crítico', 'Matrícula, cadastro, topografia e verificação fundiária'],
    ['Borda ecológica e conexão da trilha', 'Alto', 'Estudo ambiental, gestão da área e autorizações'],
    ['Estrutura vertical do ginásio, piscinas e quadras', 'Alto', 'Estudo arquitetônico e engenharia multidisciplinar'],
    ['Acessibilidade, saídas e segurança contra incêndio', 'Alto', 'Projetos específicos e análise pelos órgãos competentes'],
    ['Operação: equipes, água, energia e manutenção', 'Alto', 'Modelo anual de custeio e gestão'],
    ['Programas sociais sem parcerias formalizadas', 'Alto', 'Pactuação, equipe, orçamento e proteção dos usuários'],
    ['Custos incompletos e editais não garantidos', 'Alto', 'Quantitativos, fontes, cotações e elegibilidade'],
    ['Desempenho do aplicativo', 'Moderado', 'Versão leve, testes e qualidade ajustável'],
  ], [5, 2, 5]),
  p([t('Classificação qualitativa proposta, não laudo profissional.', { italics: true, color: CINZA, size: 20 })], { spacing: { before: 120 } }),

  // ---------- 10 ----------
  h1('10. Maquete digital 3D'),
  p('Para comunicar o projeto foi desenvolvida uma maquete digital interativa, que mostra sempre o que é proposta, hipótese ou pendência.'),
  bullet('Navegação 3D por setores, edifícios e instalações, com fichas de cada espaço.'),
  bullet('Edifícios fechados, explodidos por nível ou em corte.'),
  bullet('Orçamento rastreável, com filtros e exportação para Excel (CSV).'),
  bullet('Fichas dos 15 programas sociais e das oportunidades de editais.'),
  bullet('Percurso guiado de apresentação em 13 passos, modo noite e camadas temáticas.'),
  bullet('Funciona no navegador e como aplicativo para Windows (portátil) e Linux, inclusive sem internet.'),
  p([t('Código-fonte: ', { bold: true }), new ExternalHyperlink({ link: 'https://github.com/denodindo/parque-cidade-viva', children: [t('github.com/denodindo/parque-cidade-viva', { color: '1155CC', underline: {} })] })]),

  // ---------- 11 ----------
  h1('11. Próximos passos'),
  numero([t('Validar o terreno: ', { bold: true }), t('área, perímetro, titularidade, topografia, zoneamento e restrições ambientais.')]),
  numero([t('Ouvir a comunidade: ', { bold: true }), t('diagnóstico de demanda com moradores, escolas, usuários e organizações locais.')]),
  numero([t('Projetar e orçar: ', { bold: true }), t('estudo preliminar com profissionais habilitados e orçamento com quantitativos, fontes e data-base.')]),
  numero([t('Formar a rede: ', { bold: true }), t('entidade gestora, parcerias formalizadas e plano de captação de recursos.')]),
  p([t('Prioridade imediata: ', { bold: true }), t('confirmar a área e ouvir quem vai usar o parque.')], { spacing: { before: 160 } }),

  // ---------- complementos ----------
  h1('Complemento A · Roteiro de fala (cerca de 10 minutos)'),
  tabela(['Slide', 'Tempo', 'Mensagem principal'], [
    ['1. Capa', '0:30', 'Apresentar o projeto e deixar claro que é um estudo conceitual.'],
    ['2. A mudança na área', '0:45', 'Do terreno vazio entre a mata e a avenida a um parque de 10 ha.'],
    ['3. A visão', '0:30', 'Um parque que funciona como uma cidade de oportunidades.'],
    ['4. Setores', '0:45', 'Oito setores somando 100.000 m²; o verde é o maior.'],
    ['5. O que o parque oferece', '0:45', 'Seis grupos de equipamentos.'],
    ['6. Edifícios', '1:00', 'Ginásio em 4 níveis e centro cultural em 3; pendência estrutural.'],
    ['7. Programas', '0:45', '15 programas em 4 eixos, com limites claros.'],
    ['8. Valores', '0:40', 'Princípios do projeto; excelência pela gestão.'],
    ['9. Investimento', '1:00', 'R$ 79 a 184 mi para implantar e R$ 7,9 a 23 mi por ano para operar (ordem de grandeza).'],
    ['10. Financiamento', '0:45', 'Quem pode pagar cada parte: esporte, cultura, social e crédito.'],
    ['11. Comunidade', '0:45', 'Alto padrão perto de casa; benefícios esperados e medidos.'],
    ['12. Parcerias', '0:45', 'Rede nacional e internacional a construir.'],
    ['13. Fases', '0:40', 'Começar pelo essencial e crescer com evidência.'],
    ['14. Maquete digital', '0:30', 'Ferramenta interativa; demonstração opcional.'],
    ['15. Próximos passos', '0:30', 'Quatro passos; prioridade: terreno e escuta.'],
    ['16. Encerramento', '0:20', 'Mensagem institucional e agradecimento.'],
  ], [3, 1.4, 7]),
  espaco(),
  h1('Complemento B · Perguntas prováveis e respostas'),
  ...[
    ['Quanto vai custar o parque?', 'Pela estimativa de ordem de grandeza, de R$ 79 a 184 milhões para implantar e de R$ 7,9 a 23 milhões por ano para operar. A faixa é larga porque ainda não há topografia nem projeto; o valor final sai do orçamento com a tabela SINAPI de São Paulo e cotações. O parque essencial pode abrir antes, por R$ 19 a 50 milhões.'],
    ['De onde virá o dinheiro?', 'De uma combinação de fontes: orçamento público (o parque é um equipamento público), editais para os programas, parcerias com empresas e fundações e, no médio prazo, linhas de cooperação nacionais e internacionais. A parte esportiva externa cabe no Novo PAC do Ministério do Esporte (até R$ 1,5 mi); o ginásio exige somar emendas, convênio estadual e crédito.'],
    ['O terreno tem mesmo 10 hectares?', 'É a área de estudo informada. O contorno foi desenhado sobre uma imagem aérea e precisa de levantamento topográfico, matrícula e verificação de titularidade.'],
    ['As parcerias já existem?', 'Não. São instituições com afinidade com o projeto, que serão procuradas depois da validação do terreno e da formação de uma entidade gestora.'],
    ['Quem vai administrar o parque?', 'O modelo será definido pelo poder público: gestão direta ou parceria com uma organização da sociedade civil, com conselho gestor e participação da comunidade.'],
    ['Quadras em andar elevado são viáveis?', 'É um arranjo pedido pelo programa, mas depende de estudo estrutural, acústico e de segurança. Se não for viável, as quadras podem ficar no térreo ou ao ar livre.'],
    ['Por que não começar pelo ginásio?', 'Porque é o equipamento mais caro de construir e de manter. Abrir primeiro o parque essencial gera uso, confiança e evidência para justificar as fases seguintes.'],
  ].flatMap(([q, r]) => [p([t(q, { bold: true, color: VERDE })], { spacing: { before: 160, after: 60 } }), p(r)]),
  espaco(),
  h1('Complemento C · Glossário'),
  tabela(['Termo', 'Significado'], [
    ['CAPEX', 'Investimento de implantação: estudos, projetos, obras e equipamentos.'],
    ['OPEX', 'Custo de operação: pessoal, água, energia, manutenção e programação.'],
    ['SINAPI', 'Sistema Nacional de Pesquisa de Custos e Índices da Construção Civil (Caixa/IBGE), referência de preços de obras.'],
    ['BDI', 'Benefícios e Despesas Indiretas, parcela aplicada sobre o custo direto conforme o regime de contratação.'],
    ['OSC', 'Organização da Sociedade Civil, entidade sem fins lucrativos que pode firmar parcerias com o poder público.'],
    ['MROSC', 'Marco Regulatório das Organizações da Sociedade Civil (Lei 13.019/2014).'],
    ['SUAS', 'Sistema Único de Assistência Social.'],
    ['Centro POP', 'Unidade pública de atendimento especializado à população em situação de rua; o parque não o substitui.'],
    ['Linha de base', 'Medição inicial que permite comparar resultados ao longo do tempo.'],
  ], [2, 8]),
  espaco(),
  h1('Fontes'),
  bullet('Parque Cidade Viva — Estudo conceitual, versão 1.0 (05/11/2026).'),
  bullet('Parque Cidade Viva — Estudo conceitual, versão 2.0: visão ampliada (05/11/2026).'),
  bullet('Parque Cidade Viva — Especificação mestre revisada, versão 2.1 (05/11/2026).'),
  bullet('Relatório mensal de oportunidades de financiamento, editais e parcerias (05/11/2026).'),
  bullet('Imagens aéreas de referência do terreno e quadro de distribuição original.'),
];

const doc = new Document({
  creator: 'Projeto acadêmico SENAC — Parque Cidade Viva',
  title: 'Parque Cidade Viva — Dossiê do projeto',
  description: 'Propostas, valores, mudança na área, comunidade, parcerias e próximos passos',
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: FONTE, size: 22, color: '1D2A22' } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal', run: { font: FONTE, size: 72, bold: true, color: ESCURO }, paragraph: { spacing: { before: 0, after: 120 }, keepNext: true } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONTE, size: 34, bold: true, color: VERDE }, paragraph: { spacing: { before: 360, after: 160 }, keepNext: true, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONTE, size: 26, bold: true, color: ESCURO }, paragraph: { spacing: { before: 240, after: 120 }, keepNext: true, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bolinhas', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
      { reference: 'numeros', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 300 } } } }] },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1418, bottom: 1418, left: 1440, right: 1440 } } },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [t('Parque Cidade Viva · Dossiê do projeto · página ', { size: 16, color: CINZA }), new TextRun({ children: [PageNumber.CURRENT], font: FONTE, size: 16, color: CINZA })] })] }),
    },
    children: conteudo,
  }],
});

Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(OUT, buf); console.log('ok', OUT, buf.length); });

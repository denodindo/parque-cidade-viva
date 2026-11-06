// Gera o anexo "Estimativas de custo, equipe e financiamento" (A4).
const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, LevelFormat, PageBreak, Footer, PageNumber, ExternalHyperlink,
} = require('docx');
const D = require('./dados.cjs');
const { calcular, brl, faixa } = require('./calc.cjs');
const R = calcular();

const OUT = process.argv[2];
const VERDE = '1F6B44', ESCURO = '12291F', AMBAR = 'A0600E', CINZA = '3D5247';
const FONTE = 'Arial';
const LARG = 9026;

const t = (text, o = {}) => new TextRun({ text, font: FONTE, ...o });
const p = (text, o = {}) => new Paragraph({ spacing: { after: 120, line: 300 }, ...o, children: Array.isArray(text) ? text : [t(text)] });
const h1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [t(text)] });
const h2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [t(text)] });
const bullet = (text) => new Paragraph({ numbering: { reference: 'bolinhas', level: 0 }, spacing: { after: 60, line: 288 }, children: Array.isArray(text) ? text : [t(text)] });
const numero = (text, ref = 'numeros') => new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 80, line: 288 }, children: Array.isArray(text) ? text : [t(text)] });
const quebra = () => new Paragraph({ children: [new PageBreak()] });
const espaco = () => new Paragraph({ spacing: { after: 120 }, children: [] });
const nota = (text) => p([t(text, { italics: true, size: 18, color: CINZA })], { spacing: { before: 80, after: 160 } });

const borda = { style: BorderStyle.SINGLE, size: 4, color: 'C9D4C6' };
const bordas = { top: borda, bottom: borda, left: borda, right: borda };

function tabela(cabecalho, linhas, pesos, opts = {}) {
  const soma = pesos.reduce((a, b) => a + b, 0);
  const larguras = pesos.map((w) => Math.floor((w / soma) * LARG));
  larguras[larguras.length - 1] += LARG - larguras.reduce((a, b) => a + b, 0);
  const direita = new Set(opts.direita ?? []);
  const celula = (texto, i, tipo) =>
    new TableCell({
      width: { size: larguras[i], type: WidthType.DXA },
      borders: bordas,
      shading: tipo === 'cab' ? { type: ShadingType.CLEAR, color: 'auto', fill: 'DCE8DA' } : tipo === 'total' ? { type: ShadingType.CLEAR, color: 'auto', fill: 'F3F6EF' } : undefined,
      margins: { top: 70, bottom: 70, left: 100, right: 100 },
      children: [new Paragraph({ alignment: direita.has(i) && tipo !== 'cab' ? AlignmentType.RIGHT : AlignmentType.LEFT, children: [t(String(texto), { bold: tipo !== 'linha', size: 18, color: tipo === 'cab' ? ESCURO : undefined })] })],
    });
  return new Table({
    width: { size: LARG, type: WidthType.DXA },
    columnWidths: larguras,
    rows: [
      new TableRow({ tableHeader: true, children: cabecalho.map((c, i) => celula(c, i, 'cab')) }),
      ...linhas.map((l) => {
        const total = l.total === true;
        const cels = total ? l.c : l;
        return new TableRow({ cantSplit: true, children: cels.map((c, i) => celula(c, i, total ? 'total' : 'linha')) });
      }),
    ],
  });
}

function caixa(titulo, texto, fill = 'FFF4D6', cor = '6A4B00', barra = 'E9A23B') {
  return new Table({
    width: { size: LARG, type: WidthType.DXA },
    columnWidths: [LARG],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: LARG, type: WidthType.DXA },
      borders: { top: { style: BorderStyle.SINGLE, size: 4, color: 'E6C766' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E6C766' }, left: { style: BorderStyle.SINGLE, size: 24, color: barra }, right: { style: BorderStyle.SINGLE, size: 4, color: 'E6C766' } },
      shading: { type: ShadingType.CLEAR, color: 'auto', fill },
      margins: { top: 140, bottom: 140, left: 200, right: 200 },
      children: [
        new Paragraph({ spacing: { after: 80 }, children: [t(titulo, { bold: true, color: cor })] }),
        ...[].concat(texto).map((x) => new Paragraph({ spacing: { after: 60, line: 288 }, children: [t(x, { color: cor, size: 20 })] })),
      ],
    })] })],
  });
}

function destaque(pares) {
  const w = Math.floor(LARG / pares.length);
  const larg = pares.map((_, i) => (i === pares.length - 1 ? LARG - w * (pares.length - 1) : w));
  const sem = { style: BorderStyle.SINGLE, size: 12, color: 'FFFFFF' };
  return new Table({
    width: { size: LARG, type: WidthType.DXA }, columnWidths: larg,
    rows: [new TableRow({ children: pares.map(([rot, val, sub], i) => new TableCell({
      width: { size: larg[i], type: WidthType.DXA },
      borders: { top: sem, bottom: sem, left: sem, right: sem },
      shading: { type: ShadingType.CLEAR, color: 'auto', fill: i % 2 ? '1B3A2D' : ESCURO },
      margins: { top: 180, bottom: 180, left: 160, right: 160 },
      children: [
        new Paragraph({ children: [t(rot, { bold: true, size: 16, color: 'E9A23B', characterSpacing: 20 })] }),
        new Paragraph({ spacing: { before: 60, after: 60 }, children: [t(val, { bold: true, size: 26, color: 'FFFFFF' })] }),
        new Paragraph({ children: [t(sub, { size: 16, color: 'BFD4C6' })] }),
      ],
    })) })],
  });
}

const fmtQ = (a, b) => (a === b ? a.toLocaleString('pt-BR') : `${a.toLocaleString('pt-BR')} a ${b.toLocaleString('pt-BR')}`);
const fmtU = (a, b, un) => (un === 'conjunto' ? '—' : `${faixa(a, b)}/${un === 'postes' ? 'poste' : un}`);
const BASE = { R: 'Referência pública', H: 'Hipótese do estudo' };
const pct = (x) => (x * 100).toLocaleString('pt-BR') + '%';

// ---------- números de síntese ----------
const ind = R.ind.reduce((a, l) => [a[0] + l.pmin, a[1] + l.pmax], [0, 0]);
const comInd = (v, k) => v * (1 + ind[k]);
const F = R.porFase;
const essencial = [comInd(F.F0.min + F.F1.min + F.F2.min, 0), comInd(F.F0.max + F.F1.max + F.F2.max, 1)];
const integrado = [comInd(F.F3.min, 0), comInd(F.F3.max, 1)];
const ginasio = R.linhas.filter((l) => ['GIN-001', 'AQU-001', 'ACA-001'].includes(l.cod)).reduce((a, l) => [a[0] + l.min, a[1] + l.max], [0, 0]);
const cultural = R.linhas.filter((l) => ['CUL-001', 'AUD-001', 'TI-001'].includes(l.cod)).reduce((a, l) => [a[0] + l.min, a[1] + l.max], [0, 0]);
const espExt = R.grupos['Esporte externo'];

fs.writeFileSync(__dirname + '/sintese.json', JSON.stringify({
  capex: [R.capexMin, R.capexMax], essencial, integrado, ginasio, cultural, espExt: [espExt.min, espExt.max],
  opex: R.opexAno, pessoal: R.pessoalAno, pessoas: R.pessoas, folha: R.folhaMensal, imp: [R.imp[2], R.imp[3]],
  texto: { capex: faixa(R.capexMin, R.capexMax), essencial: faixa(...essencial), integrado: faixa(...integrado), ginasio: faixa(...ginasio), cultural: faixa(...cultural), espExt: faixa(espExt.min, espExt.max), opex: faixa(...R.opexAno), pessoal: faixa(...R.pessoalAno), folha: faixa(...R.folhaMensal) },
}, null, 2));

// ---------- tabelas de CAPEX por grupo ----------
const blocosCapex = [];
for (const g of Object.keys(R.grupos)) {
  const ls = R.linhas.filter((l) => l.grupo === g);
  blocosCapex.push(h2(g));
  blocosCapex.push(tabela(['Item', 'Quantidade', 'Custo unitário', 'Faixa total', 'Base'], [
    ...ls.map((l) => [`${l.cod} · ${l.item}`, l.un === 'conjunto' ? '1 conjunto' : `${fmtQ(l.qmin, l.qmax)} ${l.un}`, fmtU(l.umin, l.umax, l.un), faixa(l.min, l.max), BASE[l.base]]),
    { total: true, c: ['Subtotal ' + g.toLowerCase(), '', '', faixa(R.grupos[g].min, R.grupos[g].max), ''] },
  ], [4.6, 1.6, 1.9, 2.0, 1.5], { direita: [3] }));
  const comNota = ls.filter((l) => l.nota);
  if (comNota.length) {
    blocosCapex.push(p([t('Notas', { bold: true, size: 18, color: CINZA })], { spacing: { before: 120, after: 40 } }));
    for (const l of comNota) blocosCapex.push(bullet([t(`${l.cod}: `, { bold: true, size: 18 }), t(l.nota, { size: 18 })]));
  }
  blocosCapex.push(espaco());
}

// ---------- fontes ----------
const FONTES = [
  ['SindusCon-SP: CUB do Estado de São Paulo, setembro de 2026 (via Portal Dori)', 'https://portaldori.com.br/2026/10/05/sinduscon-divulga-tabelas-de-custo-unitario-basico-no-estado-de-sao-paulo-referencia-setembro-de-2026/'],
  ['Agência Gov: seleção de 260 Espaços Esportivos Comunitários, até R$ 1,5 mi cada (2025)', 'https://agenciagov.ebc.com.br/noticias/202502/ministerio-do-esporte-abre-selecao-para-construcao-de-260-centros-esportivos-comunitarios'],
  ['Casa Civil: manual Novo PAC Seleções 2025, Espaços Esportivos Comunitários', 'https://www.gov.br/casacivil/pt-br/novopac/selecoes2025/arquivos/manual-2025-espacos-esportivos-comunitarios.pdf/@@download/file'],
  ['Ministério da Cultura: cartilha CEU da Cultura (valor médio de R$ 2 mi)', 'https://www.gov.br/cultura/pt-br/assuntos/CulturaNovoPAC/CARTILHAsegundachamada.pdf'],
  ['Jornal Opção: CEUs da Cultura em Goiás, R$ 2 mi por município', 'https://www.jornalopcao.com.br/cultura/recursos-do-novo-pac-para-a-cultura-secult-goias-cadastra-13-projetos-551530/'],
  ['Contadores.cnt.br: Receita valida limites de dedução do IRPJ para o esporte (2026)', 'https://contadores.cnt.br/projetos/28/noticias/tecnicas/2026/03/24/receita-federal-valida-novos-limites-de-deducao-do-irpj-para-patrocinio-e-doacao-a-projetos-esportivos.html'],
  ['Tax Group: leis de incentivo fiscal em 2026', 'https://www.taxgroup.com.br/intelligence/leis-incentivo-fiscal-2026/'],
  ['Normas Legais: Solução de Consulta Cosit nº 4/2026 (limites de 2% e 4% não se somam)', 'https://www.normaslegais.com.br/legislacao/solucao-de-consulta-cosit-4-2026.htm'],
  ['Alerta Licitação: piscina aquecida em Manduri-SP, R$ 825.197 (2026)', 'https://alertalicitacao.com.br/!licitacao/MDRI-SP-2-122026'],
  ['Alerta Licitação: ginásio em Tapurah-MT, R$ 16,7 mi, convênio estadual (2026)', 'https://alertalicitacao.com.br/!licitacao/PNCP-24772253000141-1-000122-2026'],
  ['Monitor do Mercado: custo de grama sintética instalada (2026)', 'https://monitordomercado.com.br/economia-2/416310-quanto-custa-colocar-grama-sintetica-no-quintal-e-eliminar-a-manutencao-do-gramado/'],
  ['Prefeitura de Alto Paraíso-GO: campo society de 648 m², R$ 149.812 (2017)', 'https://altoparaiso.go.gov.br/data/PJ/Lici20170418162618.docx'],
  ['Alerta Licitação: playground infantil completo, R$ 61 mil (2026)', 'https://alertalicitacao.com.br/!licitacao/PNCP-01123678000124-1-000038-2026'],
  ['Prefeitura de São Paulo: Parque Augusta, cerca de R$ 11 mi pagos por construtoras', 'https://prefeitura.sp.gov.br/w/noticia/prefeitura-inaugura-o-parque-municipal-augusta-201cprefeito-bruno-covas201dno-centro-da-capital'],
  ['Marra CLT: piso salarial paulista 2026, R$ 1.874,36', 'https://www.marraclt.com.br/salario/piso-salarial-sp-2026-salario-minimo-paulista'],
  ['Portal Salário (CAGED): professor de educação física', 'https://www.salario.com.br/profissao/professor-de-educacao-fisica-do-ensino-fundamental-cbo-231315/'],
  ['Portal Salário (CAGED): vigilante', 'https://salario.com.br/profissao/vigilante-cbo-517330/'],
  ['Portal Salário (CAGED): guarda-vidas', 'https://www.salario.com.br/profissao/guarda-vidas-cbo-517115/'],
  ['Portal Salário (CAGED): jardineiro', 'https://www.salario.com.br/profissao/jardineiro-cbo-622010'],
  ['Portal Salário: tabela salarial (auxiliar de limpeza)', 'https://www.salario.com.br/tabela-salarial/?cargos=U'],
  ['Prefeitura de Mauá: tabela SINAPI-SP de encargos sociais, jan/2025 (71,46% mensalista)', 'https://dom.maua.sp.gov.br/public/docs/e924cb6963c0cd6ce31d06c72bae0134.pdf'],
  ['Caixa: FINISA', 'https://www.caixa.gov.br/poder-publico/modernizacao-gestao/finisa/Paginas/default.aspx'],
  ['Atlas Público: Buenópolis-MG contrata R$ 12 mi via FINISA (2026)', 'https://atlaspublico.com.br/noticias/buenopolis-mg-contrata-rs-12-milhoes-com-a-caixa-via-finisa-1058'],
  ['Secretaria-Geral da Presidência: pacote Meu Município pelos ODS (BNDES até 100%)', 'https://www.gov.br/secretariageral/pt-br/cnods/meu-municipio-pelos-ods/PacotedebenefciosMMPODS.pdf'],
  ['Alesp: decreto de 2023 que autoriza convênios da Secretaria de Esportes com municípios', 'https://www.al.sp.gov.br/repositorio/legislacao/decreto/2023/decreto-68221-15.12.2023.html'],
  ['Agência Brasil: ProAC tem R$ 100 mi para fomentar a cultura (2026)', 'https://agenciabrasil.ebc.com.br/cultura/noticia/2026-05/sp-programa-de-acao-cultural-tem-r-100-milhoes-para-fomentar-setor'],
  ['Mattos Filho: SP retoma incentivos fiscais à cultura e ao esporte', 'https://www.mattosfilho.com.br/unico/incentivos-fiscais-cultura/'],
];

const conteudo = [
  // ---------- capa ----------
  new Paragraph({ spacing: { before: 1600, after: 120 }, children: [t('PROJETO ACADÊMICO SENAC · NOVEMBRO DE 2026', { size: 20, bold: true, color: AMBAR, characterSpacing: 40 })] }),
  new Paragraph({ heading: HeadingLevel.TITLE, children: [t('Parque Cidade Viva')] }),
  p([t('Estimativas de custo, equipe e financiamento', { size: 32, color: VERDE })], { spacing: { after: 240 } }),
  p([t('Faixas de valor para cada item do parque, equipe e salários, custo anual de operação e mapa de quem pode financiar cada área.', { size: 24, color: CINZA })], { spacing: { after: 480 } }),
  destaque([
    ['IMPLANTAÇÃO', faixa(R.capexMin, R.capexMax), 'obra, projetos e reserva'],
    ['OPERAÇÃO POR ANO', faixa(...R.opexAno), 'equipe e custeio'],
    ['EQUIPE PRÓPRIA', `${R.pessoas[0]} a ${R.pessoas[1]} pessoas`, `folha de ${faixa(...R.folhaMensal)}/mês`],
  ]),
  espaco(),
  caixa('Natureza destes números', [
    'São estimativas paramétricas de ordem de grandeza, feitas em novembro de 2026 para apoiar a apresentação acadêmica. Não são orçamento oficial, preço SINAPI, cotação, proposta de empresa nem garantia de recursos.',
    'Cada linha diz se o valor vem de uma referência pública citada ou de uma hipótese deste estudo. Hipóteses precisam ser trocadas por composição de custos ou por três cotações antes de qualquer decisão.',
    'A área de 100.000 m² e as áreas construídas são hipóteses da maquete. O orçamento do aplicativo continua “A calcular” até existirem quantidades medidas e fontes com data.',
  ]),
  quebra(),

  // ---------- 1 ----------
  h1('1. Resumo em números'),
  tabela(['Indicador', 'Faixa estimada', 'Observação'], [
    ['Implantação completa (CAPEX)', faixa(R.capexMin, R.capexMax), 'Inclui projetos, gerenciamento e reserva de contingência'],
    ['Parque essencial, esporte externo e horta (fases F0 a F2)', faixa(...essencial), 'Pode abrir antes dos edifícios'],
    ['Ginásio e centro cultural (fase F3)', faixa(...integrado), 'Maior parte do investimento'],
    ['   Ginásio com piscinas e equipamentos', faixa(...ginasio), 'Sem indiretos'],
    ['   Centro cultural com auditório e TI', faixa(...cultural), 'Sem indiretos'],
    ['Implantação de programas (acervo, kits, sistemas)', faixa(R.imp[2], R.imp[3]), 'Conta separada da obra'],
    ['Operação por ano (OPEX)', faixa(...R.opexAno), 'Equipe, contas, manutenção e programação'],
    ['   Equipe própria por ano, com encargos e benefícios', faixa(...R.pessoalAno), `${R.pessoas[0]} a ${R.pessoas[1]} pessoas`],
  ], [4.5, 2.4, 3.6], { direita: [1] }),
  espaco(),
  p('A faixa é larga de propósito: sem topografia, sondagem e projeto, o custo real pode ficar em qualquer ponto dela. O peso maior está nos dois edifícios, que respondem por cerca de três quartos do total. Por isso a implantação em fases permite abrir o parque essencial com uma fração do investimento e construir o centro integrado quando houver recursos para obra e para operação.'),

  // ---------- 2 ----------
  h1('2. Como os valores foram estimados'),
  numero([t('Quantidades: ', { bold: true }), t('áreas e dimensões da maquete digital (setores, plantas ilustrativas e instalações). São hipóteses de estudo, não medição.')]),
  numero([t('Edifícios: ', { bold: true }), t(`custo por m² a partir do CUB-SP de setembro de 2026 (R8-N: R$ ${D.CUB.toLocaleString('pt-BR')}/m²; CSL-8: R$ 2.237,54/m²), multiplicado por fatores que cobrem o que o CUB não inclui: fundações, elevadores, instalações especiais, grandes vãos e BDI.`)]),
  numero([t('Áreas externas: ', { bold: true }), t('custo por m² ou por unidade, ancorado em licitações e guias de mercado de 2026 quando encontrados.')]),
  numero([t('Indiretos: ', { bold: true }), t(`percentuais sobre a obra: projetos e licenças (${pct(D.indiretos[0][2])} a ${pct(D.indiretos[0][3])}), gerenciamento (${pct(D.indiretos[1][2])} a ${pct(D.indiretos[1][3])}) e contingência (${pct(D.indiretos[2][2])} a ${pct(D.indiretos[2][3])}).`)]),
  numero([t('Equipe: ', { bold: true }), t(`salários do CAGED e do piso paulista de 2026 quando disponíveis. Encargos de ${pct(D.ENC[0])} a ${pct(D.ENC[1])} sobre o salário (a tabela SINAPI-SP de jan/2025 indica 71,46% para mensalistas) e benefícios de ${brl(D.BEN[0])} a ${brl(D.BEN[1])} por pessoa por mês.`)]),
  h2('O que não está incluído'),
  bullet('Compra ou desapropriação do terreno.'),
  bullet('Obras fora do terreno (viário, travessias, redes públicas além da ligação).'),
  bullet('Reajuste após novembro de 2026 e custos financeiros de empréstimos.'),
  bullet('Equipamentos e equipe do restaurante e dos quiosques, que ficam com o concessionário.'),
  h2('Regra para não contar duas vezes'),
  p('Piscinas, academia, auditório e laboratórios aparecem como itens próprios e não estão dentro do valor da obra civil dos edifícios. O total de cada edifício é a soma dessas linhas, contada uma única vez. Implantação (CAPEX), implantação de programas e operação anual (OPEX) ficam sempre em contas separadas.'),
  espaco(),

  // ---------- 3 ----------
  h1('3. Custo de implantação por item'),
  p('Valores em reais de novembro de 2026, já com BDI nos custos unitários. Quantidades de 1 conjunto indicam verba global estimada.'),
  ...blocosCapex,

  h2('Custos indiretos e total'),
  tabela(['Item', 'Percentual sobre a obra', 'Faixa', 'Base'], [
    { total: true, c: ['Obra direta (sem estudos)', '', faixa(R.obraMin, R.obraMax), ''] },
    ...R.ind.map((l) => [`${l.cod} · ${l.item}`, `${pct(l.pmin)} a ${pct(l.pmax)}`, faixa(l.min, l.max), BASE[l.base]]),
    ['PRE-001 · Estudos (já listado em infraestrutura)', '—', faixa(R.linhas.find((l) => l.cod === 'PRE-001').min, R.linhas.find((l) => l.cod === 'PRE-001').max), BASE.H],
    { total: true, c: ['Implantação completa (CAPEX)', '', faixa(R.capexMin, R.capexMax), ''] },
  ], [4.4, 2.2, 2.2, 1.7], { direita: [2] }),
  nota('A reserva de contingência é provisória. Deve ser substituída por uma análise de riscos com probabilidade e impacto por item.'),
  espaco(),

  // ---------- 4 ----------
  h1('4. Investimento por fase'),
  tabela(['Fase', 'O que entra', 'Obra direta', 'Com indiretos'], [
    ['F0 · Validação', 'Estudos de terreno, ambiente e demanda', faixa(F.F0.min, F.F0.max), faixa(comInd(F.F0.min, 0), comInd(F.F0.max, 1))],
    ['F1 · Parque essencial', 'Terraplenagem, drenagem, caminhos, iluminação, redes, praça, playgrounds, paisagismo, sanitários e apoio', faixa(F.F1.min, F.F1.max), faixa(comInd(F.F1.min, 0), comInd(F.F1.max, 1))],
    ['F2 · Esporte e educação inicial', 'Campo, quadras, anfiteatro, horta e viveiro', faixa(F.F2.min, F.F2.max), faixa(comInd(F.F2.min, 0), comInd(F.F2.max, 1))],
    ['F3 · Centro integrado', 'Ginásio com piscinas, centro cultural com auditório, restaurante e quiosques', faixa(F.F3.min, F.F3.max), faixa(comInd(F.F3.min, 0), comInd(F.F3.max, 1))],
    ['F4 · Excelência', 'Laboratório criativo, estúdio e programas avançados', 'A definir', 'A definir'],
  ], [2.6, 4.4, 1.8, 1.8], { direita: [2, 3] }),
  nota('Os indiretos foram aplicados à fase F0 por simplicidade; na prática, os projetos são contratados antes da obra e entram no início de cada fase.'),
  quebra(),

  // ---------- 5 ----------
  h1('5. Equipe e salários'),
  p(`Equipe própria estimada para o parque completo funcionando de manhã à noite, sete dias por semana: de ${R.pessoas[0]} a ${R.pessoas[1]} pessoas. Valores mensais por pessoa, antes de encargos.`),
  tabela(['Área', 'Função', 'Pessoas', 'Salário mensal', 'Custo anual total', 'Base'], [
    ...R.eq.map((e) => [e.area, e.funcao, fmtQ(e.qmin, e.qmax), faixa(e.smin, e.smax), faixa(e.min, e.max), BASE[e.base]]),
    { total: true, c: ['Total', '', `${R.pessoas[0]} a ${R.pessoas[1]}`, `folha de ${faixa(...R.folhaMensal)}/mês`, faixa(...R.pessoalAno), ''] },
  ], [1.5, 3.4, 1.0, 1.8, 1.9, 1.5], { direita: [4] }),
  p([t('Notas', { bold: true, size: 18, color: CINZA })], { spacing: { before: 120, after: 40 } }),
  ...R.eq.filter((e) => e.nota).map((e) => bullet([t(`${e.funcao}: `, { bold: true, size: 18 }), t(e.nota, { size: 18 })])),
  bullet([t('Custo anual total: ', { bold: true, size: 18 }), t(`salário × 12 × (1 + encargos de ${pct(D.ENC[0])} a ${pct(D.ENC[1])}) + benefícios × 12. Os encargos já cobrem 13º, férias, FGTS e INSS.`, { size: 18 })]),
  bullet([t('Terceirização: ', { bold: true, size: 18 }), t('se limpeza, vigilância ou jardinagem forem contratadas de empresas, essas pessoas saem desta tabela e o valor vai para o contrato. Nunca somar as duas formas.', { size: 18 })]),
  bullet([t('Restaurante e quiosques: ', { bold: true, size: 18 }), t('equipe do concessionário, fora do custo do parque.', { size: 18 })]),
  bullet([t('Parceiros: ', { bold: true, size: 18 }), t('instrutores cedidos por SENAC, Sesc, universidades ou organizações sociais podem reduzir a equipe de educadores, sem custo próprio se houver acordo formal.', { size: 18 })]),
  espaco(),

  // ---------- 6 ----------
  h1('6. Operação anual (OPEX)'),
  tabela(['Item', 'Faixa por ano', 'Base', 'Observação'], [
    ['OPX-PES-001 · Equipe própria com encargos e benefícios', faixa(...R.pessoalAno), 'Seção 5', ''],
    ...R.outros.map((o) => [`${o.cod} · ${o.item}`, faixa(o.min, o.max), BASE[o.base], o.nota]),
    { total: true, c: ['Operação por ano', faixa(...R.opexAno), '', ''] },
  ], [4.0, 2.1, 1.7, 3.0], { direita: [1] }),
  espaco(),
  caixa('Por que a operação importa tanto', [
    `Em cerca de 10 anos, o parque gasta em operação algo da mesma ordem do que custou para construir. Por isso nenhum edifício deve ser inaugurado sem o custeio anual garantido em orçamento público, contrato de gestão ou fundo próprio.`,
  ], 'E7F1E8', '1F4D33', '4F8F5F'),
  quebra(),

  // ---------- 7 ----------
  h1('7. Quem pode financiar cada área'),
  p('O parque é um equipamento público. O caminho mais realista é a prefeitura (dona ou responsável pela área) ser a proponente das obras e combinar recursos federais, estaduais, municipais, de empresas por leis de incentivo e de crédito. Abaixo, as fontes possíveis por área, com os valores de referência encontrados. Nenhuma está garantida: todas dependem de edital, aprovação de projeto e formalização.'),

  h2('7.1 Esporte: como a Secretaria do Esporte pode entrar'),
  p([t('O exemplo pedido. São três níveis de secretaria, cada um com um papel diferente:', {})]),
  tabela(['Quem', 'Como entra', 'Valor de referência'], [
    ['Ministério do Esporte (federal)', 'Novo PAC Seleções, Espaços Esportivos Comunitários: a prefeitura cadastra a proposta, o ministério seleciona e a Caixa repassa e fiscaliza. O projeto padrão tem campo society sintético, quadra, pista de caminhada e parque infantil.', 'Até R$ 1,5 mi por unidade (260 unidades na seleção de 2025)'],
    ['Ministério do Esporte (federal)', 'Emendas parlamentares de deputados e senadores destinadas à obra do ginásio, por convênio ou contrato de repasse.', 'Valor definido pela emenda'],
    ['Secretaria Estadual de Esportes (SP)', 'Convênio com o município para obra ou equipamentos, autorizado por decreto estadual, em geral a partir de emendas de deputados estaduais. Já houve programa estadual de equipamentos (Areninha).', 'Caso a caso. Escala de referência: ginásio de R$ 16,7 mi com convênio estadual em Tapurah-MT (2026)'],
    ['Secretaria Municipal de Esportes (SEME)', 'Assume a gestão esportiva: paga professores e guarda-vidas, ou contrata uma organização social por termo de colaboração (Lei 13.019/2014). Também lança editais de programas.', 'Editais SEME de 2026: R$ 1,89 mi (capacitação), R$ 4,82 mi (futebol feminino) e R$ 6,75 mi (longevidade), valores totais dos programas'],
    ['Empresas, pela Lei de Incentivo ao Esporte', 'Uma entidade esportiva sem fins lucrativos aprova um projeto (núcleos, equipamentos, eventos) e empresas patrocinam abatendo do Imposto de Renda.', 'Empresas do Lucro Real: até 2% do IR devido (3% a partir de 2028; 4% em inclusão social, sem somar). Pessoas físicas: até 7%'],
  ], [2.4, 5.0, 3.1]),
  espaco(),
  p([t('Passo a passo sugerido para a área esportiva', { bold: true })]),
  numero('A prefeitura define a SEME como responsável pela área esportiva do parque.', 'passos'),
  numero(`Módulo esportivo externo (campo, quadras, pista, parte do playground), estimado em ${faixa(espExt.min, espExt.max)}: proposta ao Novo PAC Espaços Esportivos Comunitários, cujo teto de R$ 1,5 mi cobre boa parte desse bloco.`, 'passos'),
  numero(`Ginásio com piscinas, estimado em ${faixa(...ginasio)}: grande demais para um único programa. Combina emendas federais e estaduais, convênio com a Secretaria Estadual, crédito (FINISA ou BNDES) e tesouro municipal, possivelmente em duas etapas (quadras primeiro, piscinas depois).`, 'passos'),
  numero('Equipamentos e programas esportivos: projetos na Lei de Incentivo ao Esporte apresentados por uma entidade parceira, e editais da SEME.', 'passos'),
  numero('Operação: professores e guarda-vidas no orçamento anual da SEME, antes da inauguração.', 'passos'),

  h2('7.2 Cultura e educação'),
  tabela(['Quem', 'Como entra', 'Valor de referência'], [
    ['Ministério da Cultura', 'Novo PAC, CEU da Cultura: edifício modular com cineteatro, salas e equipamentos. Pode compor parte do centro cultural.', 'Média de R$ 2 mi por unidade (R$ 2 a R$ 2,5 mi em casos de 2025–2026)'],
    ['Lei Rouanet (federal)', 'Projeto cultural aprovado; empresas patrocinam com abatimento no Imposto de Renda. Serve para auditório, programação e acervo.', 'Empresas do Lucro Real: até 4% do IR devido. Pessoas físicas: até 6%'],
    ['Secretaria Estadual de Cultura (SP)', 'ProAC Editais (fomento direto) e ProAC ICMS (empresa patrocina e abate do ICMS).', 'ProAC com R$ 100 mi em 2026 (Agência Brasil)'],
    ['Prefeitura de São Paulo', 'Pro-Mac: patrocínio com abatimento de ISS ou IPTU. Editais de fomento (Teatro e Dança).', 'Até 20% do ISS ou IPTU devido. Fomento ao Teatro e à Dança: R$ 18 mi (valor total do programa)'],
    ['Sistema S e ensino técnico', 'SENAC, SENAI, SEBRAE, Sesc e Centro Paula Souza (ETECs e FATECs) oferecem cursos, instrutores e programação por acordo de cooperação.', 'Contrapartida em serviços, sem valor estimado'],
  ], [2.4, 5.0, 3.1]),
  espaco(),

  h2('7.3 Inclusão social, infância e meio ambiente'),
  tabela(['Quem', 'Como entra', 'Valor de referência'], [
    ['FUMCAD (Fundo Municipal da Criança e do Adolescente)', 'Doações dedutíveis do Imposto de Renda para projetos aprovados pelo conselho municipal: playgrounds, programas de infância e juventude.', 'Empresas: até 1% do IR devido. Pessoas físicas: até 6%, somado a outros incentivos'],
    ['Fundo Municipal do Idoso', 'Doações dedutíveis para programas de longevidade.', 'Empresas: até 1% do IR devido'],
    ['Assistência social (SUAS)', 'Pactuação com o CRAS e a secretaria de assistência para o Ponto de Orientação Cidadã.', 'Profissionais cedidos, sem valor estimado'],
    ['FEHIDRO e fundos ambientais', 'Drenagem, manejo de águas e educação ambiental. Termos de compensação ambiental podem custear plantio.', 'Por edital'],
  ], [2.4, 5.0, 3.1]),
  espaco(),

  h2('7.4 Infraestrutura, crédito e receitas próprias'),
  tabela(['Quem', 'Como entra', 'Valor de referência'], [
    ['Caixa: FINISA e FINISA Verde', 'Empréstimo ao município para despesas de capital (obra), com garantia no Fundo de Participação dos Municípios.', 'Ex.: R$ 12 mi contratados por Buenópolis-MG em 2026'],
    ['BNDES', 'Financiamento e apoio à estruturação de projetos municipais.', 'Até 100% do projeto, segundo o governo federal'],
    ['Contrapartidas urbanísticas', 'Empreendimentos privados pagam a implantação de áreas públicas em acordo com a prefeitura.', 'Parque Augusta (SP): cerca de R$ 11 mi pagos por construtoras'],
    ['Concessões e eventos', 'Permissão de uso do restaurante e dos quiosques, eventos, patrocínio de espaços (naming rights) e adoção de áreas verdes.', 'Receita a estimar no plano de negócios'],
  ], [2.4, 5.0, 3.1]),
  espaco(),

  h2('7.5 Parceiros internacionais'),
  tabela(['Quem', 'Como entra'], [
    ['BID, Banco Mundial e CAF', 'Empréstimos a municípios para programas urbanos maiores (vários parques ou um programa de bairro), com aval da União e análise federal. Processo longo; faz sentido se o parque fizer parte de um programa maior.'],
    ['ONU-Habitat', 'Cooperação técnica e metodologia de espaços públicos (Programa Global de Espaço Público).'],
    ['UNESCO e UNICEF', 'Metodologias, selos e redes de cidades (educação, cultura, infância).'],
    ['Institutos culturais e consulados', 'Goethe-Institut, Institut Français, British Council, Instituto Cervantes, Fundação Japão e consulados: programação cultural, cursos de idiomas e intercâmbio.'],
  ], [3, 7.5]),
  espaco(),

  h2('7.6 Empresas privadas'),
  p('Empresas entram principalmente pelas leis de incentivo, porque o patrocínio sai do imposto que elas já pagariam. O perfil mais provável é de empresas do Lucro Real com operação na região (bancos, energia, saneamento, telecomunicações, varejo, construção, indústria). Para encontrá-las, as listas públicas de incentivadores da Lei Rouanet e da Lei de Incentivo ao Esporte mostram quem já patrocina projetos parecidos.'),
  caixa('Exemplo de conta (ilustrativo)', [
    'Uma empresa do Lucro Real com R$ 20 mi de Imposto de Renda devido no ano poderia destinar até R$ 400 mil pela Lei de Incentivo ao Esporte (2%), até R$ 800 mil pela Lei Rouanet (4%) e até R$ 200 mil ao FUMCAD (1%).',
    'Os limites de cada lei têm regras próprias e mudam com o tempo; a destinação deve ser conferida com a contabilidade da empresa.',
  ], 'E7F1E8', '1F4D33', '4F8F5F'),
  quebra(),

  // ---------- 8 ----------
  h1('8. Composição possível das fontes'),
  p('Cenário ilustrativo de como cada bloco poderia ser pago. Os valores de referência são tetos ou médias de programas, não recursos aprovados para o parque.'),
  tabela(['Bloco', 'Custo estimado', 'Fontes possíveis', 'Referência'], [
    ['Estudos e projetos', faixa(R.linhas.find((l) => l.cod === 'PRE-001').min + R.ind[0].min, R.linhas.find((l) => l.cod === 'PRE-001').max + R.ind[0].max), 'Tesouro municipal; apoio do BNDES à estruturação', '—'],
    ['Parque essencial (F1)', faixa(F.F1.min, F.F1.max), 'Tesouro municipal, FINISA, emendas, contrapartidas urbanísticas, FEHIDRO (drenagem)', 'Parque Augusta: R$ 11 mi'],
    ['Esporte externo (F2)', faixa(espExt.min, espExt.max), 'Novo PAC Espaços Esportivos Comunitários', 'Até R$ 1,5 mi'],
    ['Ginásio com piscinas (F3)', faixa(...ginasio), 'Emendas federais e estaduais, convênio estadual, FINISA ou BNDES', 'Ginásio com convênio: R$ 16,7 mi'],
    ['Centro cultural (F3)', faixa(...cultural), 'CEU da Cultura (parte), emendas, FINISA; Rouanet e ProAC para auditório e acervo', 'CEU: cerca de R$ 2 mi'],
    ['Programas e operação (por ano)', faixa(...R.opexAno), 'Orçamento das secretarias (esporte, cultura, educação, assistência), termos de colaboração, leis de incentivo, receitas de concessão', 'Editais SEME de R$ 1,9 a R$ 6,8 mi'],
  ], [2.3, 2.0, 4.0, 2.2]),
  espaco(),

  // ---------- 9 ----------
  h1('9. Como transformar em orçamento real'),
  numero('Confirmar a área: matrícula, topografia, sondagens e restrições ambientais.', 'proximos'),
  numero('Fazer o programa de necessidades e medir as áreas reais de cada edifício e instalação.', 'proximos'),
  numero('Orçar com composições SINAPI-SP do mês e cotações documentadas, com data-base e memória de cálculo.', 'proximos'),
  numero('Definir o modelo de gestão (direta, organização social ou concessão) e o quadro de pessoal.', 'proximos'),
  numero('Escolher as fontes e preparar as propostas nos calendários dos editais (Novo PAC, leis de incentivo, emendas).', 'proximos'),
  numero('Atualizar o orçamento da maquete digital com os valores que tiverem fonte, deixando os demais como “A calcular”.', 'proximos'),

  // ---------- fontes ----------
  h1('Fontes consultadas (novembro de 2026)'),
  nota('Valores dos editais da SEME e do Fomento ao Teatro e à Dança vêm do relatório de oportunidades de 05/11/2026 incluído no pacote do projeto. Limites da Lei Rouanet e dos fundos da criança e do idoso seguem a legislação federal vigente; confirmar antes de usar.'),
  ...FONTES.map(([nome, url]) => new Paragraph({ numbering: { reference: 'bolinhas', level: 0 }, spacing: { after: 60, line: 276 }, children: [
    t(nome + ': ', { size: 18 }),
    new ExternalHyperlink({ link: url, children: [t(url, { size: 16, color: '1F5FA8', underline: {} })] }),
  ] })),
];

const doc = new Document({
  creator: 'Parque Cidade Viva — projeto acadêmico SENAC',
  title: 'Parque Cidade Viva — Estimativas de custo, equipe e financiamento',
  styles: {
    default: { document: { run: { font: FONTE, size: 21 } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal', run: { font: FONTE, size: 64, bold: true, color: ESCURO }, paragraph: { spacing: { before: 0, after: 120 } } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONTE, size: 32, bold: true, color: ESCURO }, paragraph: { spacing: { before: 360, after: 160 }, keepNext: true, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONTE, size: 25, bold: true, color: VERDE }, paragraph: { spacing: { before: 240, after: 120 }, keepNext: true, outlineLevel: 1 } },
    ],
  },
  numbering: { config: [
    { reference: 'bolinhas', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
    ...['numeros', 'passos', 'proximos'].map((reference) => ({ reference, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 360 } } } }] })),
  ] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1418, bottom: 1418, left: 1440, right: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
      t('Parque Cidade Viva · Estimativas de ordem de grandeza, não orçamento oficial · ', { size: 16, color: CINZA }),
      new TextRun({ children: [PageNumber.CURRENT], font: FONTE, size: 16, color: CINZA }),
    ] })] }) },
    children: conteudo,
  }],
});

Packer.toBuffer(doc).then((b) => { fs.writeFileSync(OUT, b); console.log('ok', OUT, b.length); });

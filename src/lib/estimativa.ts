import {
  BENEFICIOS_MES,
  CONSUMIVEIS_ANO,
  CONSUMO_AGUA_M3_MES,
  CONSUMO_ENERGIA_KWH_MES,
  CONTAS_FIXAS_MES,
  MATERIAIS_OBRA,
  TARIFA_AGUA_ESGOTO,
  TARIFA_ENERGIA,
  ENCARGOS,
  ESTIMATIVA_CAPEX,
  ESTIMATIVA_EQUIPE,
  ESTIMATIVA_IMPLANTACAO_PROGRAMAS,
  ESTIMATIVA_INDIRETOS,
  ESTIMATIVA_OPEX_OUTROS,
  type FuncaoEquipe,
  type GrupoEstimativa,
  type LinhaEstimativa,
} from '../data/estimates';
import type { FaseId } from '../data/phases';

/**
 * Cálculos da estimativa de ordem de grandeza (DT-35). Tudo em faixas
 * [mínimo, máximo]. CAPEX, implantação de programas e OPEX ficam separados e
 * nunca são somados entre si. Itens filhos (piscinas, auditório…) são linhas
 * próprias, fora da obra civil do edifício: cada valor entra uma única vez.
 */
export type Faixa = readonly [number, number];

const soma = (fs: readonly Faixa[]): Faixa => fs.reduce<Faixa>((a, f) => [a[0] + f[0], a[1] + f[1]], [0, 0]);

export function faixaLinha(l: LinhaEstimativa): Faixa {
  return [l.qmin * l.umin, l.qmax * l.umax];
}

export function faixaDe(linhas: readonly LinhaEstimativa[]): Faixa {
  return soma(linhas.map(faixaLinha));
}

/** Obra direta: todas as linhas menos estudos (PRE-001), base dos percentuais indiretos. */
export function obraDireta(): Faixa {
  return faixaDe(ESTIMATIVA_CAPEX.filter((l) => l.id !== 'PRE-001'));
}

export function indiretos() {
  const [omin, omax] = obraDireta();
  return ESTIMATIVA_INDIRETOS.map((i) => ({ ...i, faixa: [omin * i.pmin, omax * i.pmax] as Faixa }));
}

export const FATOR_INDIRETOS: Faixa = [
  ESTIMATIVA_INDIRETOS.reduce((a, i) => a + i.pmin, 0),
  ESTIMATIVA_INDIRETOS.reduce((a, i) => a + i.pmax, 0),
];

export function comIndiretos(f: Faixa): Faixa {
  return [f[0] * (1 + FATOR_INDIRETOS[0]), f[1] * (1 + FATOR_INDIRETOS[1])];
}

export function capexTotal(): Faixa {
  return soma([faixaDe(ESTIMATIVA_CAPEX), ...indiretos().map((i) => i.faixa)]);
}

export function porGrupo(): { grupo: GrupoEstimativa; faixa: Faixa }[] {
  const grupos = [...new Set(ESTIMATIVA_CAPEX.map((l) => l.grupo))];
  return grupos.map((grupo) => ({ grupo, faixa: faixaDe(ESTIMATIVA_CAPEX.filter((l) => l.grupo === grupo)) }));
}

export function porFase(fase: FaseId): Faixa {
  return faixaDe(ESTIMATIVA_CAPEX.filter((l) => l.fase === fase));
}

export function custoAnualFuncao(f: FuncaoEquipe): Faixa {
  return [
    f.qmin * (f.smin * 12 * (1 + ENCARGOS[0]) + BENEFICIOS_MES[0] * 12),
    f.qmax * (f.smax * 12 * (1 + ENCARGOS[1]) + BENEFICIOS_MES[1] * 12),
  ];
}

export function equipeResumo() {
  return {
    pessoas: soma(ESTIMATIVA_EQUIPE.map((f) => [f.qmin, f.qmax] as Faixa)),
    folhaMensal: soma(ESTIMATIVA_EQUIPE.map((f) => [f.qmin * f.smin, f.qmax * f.smax] as Faixa)),
    custoAnual: soma(ESTIMATIVA_EQUIPE.map(custoAnualFuncao)),
  };
}

export function opexOutros() {
  const obra = obraDireta();
  return ESTIMATIVA_OPEX_OUTROS.map((o) => ({
    ...o,
    faixa: (o.percentual_da_obra ? [obra[0] * o.min, obra[1] * o.max] : [o.min, o.max]) as Faixa,
  }));
}

/** Contas essenciais: consumo mensal × tarifa, e contas fixas. Valores anuais e mensais. */
export function contasEssenciais() {
  const kwh = soma(CONSUMO_ENERGIA_KWH_MES.map((c) => [c.cmin, c.cmax] as Faixa));
  const m3 = soma(CONSUMO_AGUA_M3_MES.map((c) => [c.cmin, c.cmax] as Faixa));
  const energiaMes: Faixa = [kwh[0] * TARIFA_ENERGIA[0], kwh[1] * TARIFA_ENERGIA[1]];
  const aguaMes: Faixa = [m3[0] * TARIFA_AGUA_ESGOTO[0], m3[1] * TARIFA_AGUA_ESGOTO[1]];
  const fixas = CONTAS_FIXAS_MES.map((c) => ({ ...c, mes: [c.mmin, c.mmax] as Faixa }));
  const mensal = soma([energiaMes, aguaMes, ...fixas.map((c) => c.mes)]);
  return { kwh, m3, energiaMes, aguaMes, fixas, mensal, anual: [mensal[0] * 12, mensal[1] * 12] as Faixa };
}

export function consumiveis() {
  const pessoas = equipeResumo().pessoas;
  return CONSUMIVEIS_ANO.map((c) => ({ ...c, faixa: (c.por_pessoa ? [c.min * pessoas[0], c.max * pessoas[1]] : [c.min, c.max]) as Faixa }));
}

export function materiaisObra() {
  return MATERIAIS_OBRA.map((m) => ({ ...m, faixa: [m.qmin * m.pmin, m.qmax * m.pmax] as Faixa }));
}

/** Linhas do OPEX anual, cada uma contada uma vez. */
export function linhasOpex(): { id: string; item: string; faixa: Faixa; nota?: string }[] {
  return [
    { id: 'OPX-PES-001', item: 'Equipe própria com encargos e benefícios', faixa: equipeResumo().custoAnual },
    { id: 'OPX-UTL-001', item: 'Contas essenciais: luz, água e esgoto, gás, internet, telefone e coleta de resíduos', faixa: contasEssenciais().anual },
    { id: 'OPX-CON-001', item: 'Materiais de consumo (limpeza, esporte, jardinagem, uniformes, escritório, segurança)', faixa: soma(consumiveis().map((c) => c.faixa)) },
    ...opexOutros().map((o) => ({ id: o.id, item: o.item, faixa: o.faixa, nota: o.nota })),
  ];
}

export function opexAnual(): Faixa {
  return soma(linhasOpex().map((l) => l.faixa));
}

export function implantacaoProgramas(): Faixa {
  return [ESTIMATIVA_IMPLANTACAO_PROGRAMAS.min, ESTIMATIVA_IMPLANTACAO_PROGRAMAS.max];
}

export function linhasDoObjeto(id: string): LinhaEstimativa[] {
  return ESTIMATIVA_CAPEX.filter((l) => l.objetos.includes(id));
}

const NUM1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const NUM0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

/** "R$ 31 mi", "R$ 2,5 mi", "R$ 480 mil", "R$ 2.100". Nunca recebe ausência: estimativa sempre tem faixa. */
export function brlCurto(v: number): string {
  if (v >= 10_000_000) return `R$ ${NUM0.format(v / 1e6)} mi`;
  if (v >= 1_000_000) return `R$ ${NUM1.format(v / 1e6)} mi`;
  if (v >= 10_000) return `R$ ${NUM0.format(v / 1000)} mil`;
  return `R$ ${NUM0.format(v)}`;
}

export function formatarFaixa([a, b]: Faixa): string {
  return a === b ? brlCurto(a) : `${brlCurto(a)} a ${brlCurto(b)}`;
}

export function formatarQtd([a, b]: Faixa): string {
  return a === b ? NUM0.format(a) : `${NUM0.format(a)} a ${NUM0.format(b)}`;
}

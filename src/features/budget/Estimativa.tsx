import { ESTIMATIVA_CAPEX, ESTIMATIVA_EQUIPE, FINANCIAMENTO, DATA_BASE_ESTIMATIVA, ENCARGOS, type BaseEstimativa } from '../../data/estimates';
import {
  capexTotal,
  comIndiretos,
  custoAnualFuncao,
  equipeResumo,
  faixaDe,
  faixaLinha,
  formatarFaixa,
  formatarQtd,
  implantacaoProgramas,
  indiretos,
  linhasDoObjeto,
  obraDireta,
  opexAnual,
  opexOutros,
  porFase,
  porGrupo,
  type Faixa,
} from '../../lib/estimativa';

const ROTULO_BASE: Record<BaseEstimativa, string> = { referencia: 'Referência pública', hipotese: 'Hipótese do estudo' };
const pct = (x: number) => `${Math.round(x * 100)}%`;

export const AVISO_ESTIMATIVA =
  `Estimativa de ordem de grandeza (${DATA_BASE_ESTIMATIVA}), feita com CUB-SP, licitações e salários do CAGED de 2026. Não é orçamento oficial, preço SINAPI nem cotação; as hipóteses precisam de composição ou três cotações.`;

/** Faixa que só quebra linha no "a": "R$ 79 mi" e "R$ 184 mi" ficam inteiros. */
export function FaixaTexto({ f }: { f: Faixa }) {
  const [a, b] = formatarFaixa(f).split(' a ');
  return b === undefined ? <span className="sem-quebra">{a}</span> : <><span className="sem-quebra">{a}</span> a <span className="sem-quebra">{b}</span></>;
}

/** Três números de síntese. CAPEX e OPEX lado a lado, nunca somados. */
export function ResumoEstimativa() {
  const eq = equipeResumo();
  return (
    <div className="cartoes estimativa" data-testid="resumo-estimativa">
      <div className="cartao">
        <strong>Implantação (CAPEX)</strong>
        <span className="valor-faixa" data-testid="estimativa-capex"><FaixaTexto f={capexTotal()} /></span>
        <span>Obra, projetos, gerenciamento e reserva</span>
      </div>
      <div className="cartao">
        <strong>Operação por ano (OPEX)</strong>
        <span className="valor-faixa" data-testid="estimativa-opex"><FaixaTexto f={opexAnual()} /></span>
        <span>Equipe, contas, manutenção e programação</span>
      </div>
      <div className="cartao">
        <strong>Equipe própria</strong>
        <span className="valor-faixa">{formatarQtd(eq.pessoas)} pessoas</span>
        <span>Folha de {formatarFaixa(eq.folhaMensal)} por mês</span>
      </div>
    </div>
  );
}

function unidadeTexto(u: string, [a, b]: Faixa) {
  return u === 'conjunto' ? 'verba' : `${formatarFaixa([a, b])}/${u === 'postes' ? 'poste' : u}`;
}

export function EstimativaItens() {
  const ind = indiretos();
  const essencial = comIndiretos([porFase('F0')[0] + porFase('F1')[0] + porFase('F2')[0], porFase('F0')[1] + porFase('F1')[1] + porFase('F2')[1]]);
  return (
    <>
      {porGrupo().map(({ grupo, faixa }) => (
        <section key={grupo} aria-label={grupo}>
          <h3>{grupo}</h3>
          <div className="tabela-rolagem" tabIndex={0} role="region" aria-label={`Tabela: ${grupo}`}>
            <table className="tabela-custo">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Faixa</th>
                </tr>
              </thead>
              <tbody>
                {ESTIMATIVA_CAPEX.filter((l) => l.grupo === grupo).map((l) => (
                  <tr key={l.id}>
                    <td>
                      <span className="item-titulo">{l.id} · {l.item}</span>
                      <span className="detalhe">
                        {l.unidade === 'conjunto' ? 'Verba global' : `${formatarQtd([l.qmin, l.qmax])} ${l.unidade} × ${unidadeTexto(l.unidade, [l.umin, l.umax])}`} · {ROTULO_BASE[l.base]}
                      </span>
                      {l.nota ? <span className="detalhe">{l.nota}</span> : null}
                    </td>
                    <td className="col-valor" data-testid={`est-${l.id}`}><FaixaTexto f={faixaLinha(l)} /></td>
                  </tr>
                ))}
                <tr className="linha-total">
                  <td>Subtotal</td>
                  <td className="col-valor"><FaixaTexto f={faixa} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      ))}
      <section aria-label="Indiretos e total">
        <h3>Indiretos e total</h3>
        <table className="tabela-custo">
          <tbody>
            <tr><td>Obra direta (sem estudos)</td><td className="col-valor"><FaixaTexto f={obraDireta()} /></td></tr>
            {ind.map((i) => (
              <tr key={i.id}><td>{i.id} · {i.item} ({pct(i.pmin)} a {pct(i.pmax)})</td><td className="col-valor"><FaixaTexto f={i.faixa} /></td></tr>
            ))}
            <tr className="linha-total"><td>Implantação completa (CAPEX)</td><td className="col-valor"><FaixaTexto f={capexTotal()} /></td></tr>
            <tr><td>Implantação de programas (conta separada)</td><td className="col-valor"><FaixaTexto f={implantacaoProgramas()} /></td></tr>
          </tbody>
        </table>
      </section>
      <section aria-label="Por fase">
        <h3>Por fase de implantação</h3>
        <ul>
          <li>Parque essencial, esporte externo e horta (F0 a F2), com indiretos: <strong>{formatarFaixa(essencial)}</strong></li>
          <li>Ginásio, centro cultural e restaurante (F3), com indiretos: <strong>{formatarFaixa(comIndiretos(porFase('F3')))}</strong></li>
        </ul>
      </section>
    </>
  );
}

export function EquipeOperacao() {
  const eq = equipeResumo();
  return (
    <>
      <section aria-label="Equipe e salários">
        <h3>Equipe e salários</h3>
        <div className="tabela-rolagem" tabIndex={0} role="region" aria-label="Tabela: equipe e salários">
          <table className="tabela-custo">
            <thead>
              <tr>
                <th scope="col">Função</th>
                <th scope="col">Pessoas</th>
                <th scope="col">Custo anual</th>
              </tr>
            </thead>
            <tbody>
              {ESTIMATIVA_EQUIPE.map((f) => (
                <tr key={f.funcao}>
                  <td>
                    <span className="item-titulo">{f.funcao}</span>
                    <span className="detalhe">{f.area} · salário de {formatarFaixa([f.smin, f.smax])} · {ROTULO_BASE[f.base]}</span>
                    {f.nota ? <span className="detalhe">{f.nota}</span> : null}
                  </td>
                  <td>{formatarQtd([f.qmin, f.qmax])}</td>
                  <td className="col-valor"><FaixaTexto f={custoAnualFuncao(f)} /></td>
                </tr>
              ))}
              <tr className="linha-total">
                <td>Total (folha de {formatarFaixa(eq.folhaMensal)} por mês)</td>
                <td>{formatarQtd(eq.pessoas)}</td>
                <td className="col-valor"><FaixaTexto f={eq.custoAnual} /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="nota">
          Custo anual = salário × 12 × (1 + encargos de {pct(ENCARGOS[0])} a {pct(ENCARGOS[1])}) + benefícios. Se limpeza, vigilância ou jardinagem forem
          terceirizadas, essas pessoas saem desta tabela e o valor vai para o contrato, sem contar duas vezes. Restaurante e quiosques: equipe do
          concessionário.
        </p>
      </section>
      <section aria-label="Operação anual">
        <h3>Operação anual (OPEX)</h3>
        <table className="tabela-custo">
          <tbody>
            <tr><td>OPX-PES-001 · Equipe própria com encargos e benefícios</td><td className="col-valor"><FaixaTexto f={eq.custoAnual} /></td></tr>
            {opexOutros().map((o) => (
              <tr key={o.id}><td>{o.id} · {o.item}{o.nota ? <span className="nota"> — {o.nota}</span> : null}</td><td className="col-valor"><FaixaTexto f={o.faixa} /></td></tr>
            ))}
            <tr className="linha-total"><td>Operação por ano</td><td className="col-valor"><FaixaTexto f={opexAnual()} /></td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}

export function Financiamento() {
  return (
    <>
      <p className="nota">
        A prefeitura é a proponente natural das obras e combina fontes federais, estaduais, municipais, leis de incentivo e crédito. Os valores são tetos
        ou médias de programas públicos, não verbas destinadas ao parque; nenhuma parceria está formalizada.
      </p>
      {FINANCIAMENTO.map((a) => (
        <section key={a.area} aria-label={a.area}>
          <h3>{a.area}</h3>
          <div className="tabela-rolagem" tabIndex={0} role="region" aria-label={`Tabela: ${a.area}`}>
            <table className="tabela-custo">
              <thead>
                <tr><th scope="col">Quem</th><th scope="col">Como entra</th><th scope="col">Valor de referência</th></tr>
              </thead>
              <tbody>
                {a.fontes.map((f) => (
                  <tr key={f.quem}><td>{f.quem}</td><td>{f.como}</td><td>{f.valor}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </>
  );
}

/** Faixa estimada nas fichas. Mostra se a faixa cobre outros objetos juntos. */
export function EstimativaObjeto({ id }: { id: string }) {
  const linhas = linhasDoObjeto(id);
  if (linhas.length === 0) return null;
  const compartilhada = linhas.some((l) => l.objetos.length > 1);
  return (
    <section aria-labelledby={`est-titulo-${id}`} className="bloco-estimativa">
      <h3 id={`est-titulo-${id}`}>Estimativa de ordem de grandeza</h3>
      <p className="valor-faixa" data-testid={`estimativa-objeto-${id}`}><FaixaTexto f={faixaDe(linhas)} /></p>
      {linhas.length > 1 ? (
        <ul className="nota">
          {linhas.map((l) => <li key={l.id}>{l.item}: {formatarFaixa(faixaLinha(l))}</li>)}
        </ul>
      ) : null}
      <p className="nota">
        {compartilhada ? 'Faixa do conjunto: cobre também outros espaços iguais ou vizinhos. ' : ''}
        Sem projetos, gerenciamento e reserva. Não é orçamento: o valor rastreável continua “A calcular”.
      </p>
    </section>
  );
}

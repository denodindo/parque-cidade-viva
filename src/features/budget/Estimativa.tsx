import {
  CONSUMO_AGUA_M3_MES,
  CONSUMO_ENERGIA_KWH_MES,
  DATA_BASE_ESTIMATIVA,
  ENCARGOS,
  ESTIMATIVA_CAPEX,
  ESTIMATIVA_EQUIPE,
  FINANCIAMENTO,
  PRECOS_MATERIAIS,
  TARIFA_AGUA_ESGOTO,
  TARIFA_ENERGIA,
  type BaseEstimativa,
} from '../../data/estimates';
import {
  capexTotal,
  comIndiretos,
  consumiveis,
  contasEssenciais,
  linhasOpex,
  materiaisObra,
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
      <div className="cartao">
        <strong>Contas essenciais por mês</strong>
        <span className="valor-faixa" data-testid="estimativa-contas"><FaixaTexto f={contasEssenciais().mensal} /></span>
        <span>Luz, água e esgoto, gás, internet, telefone e coleta</span>
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
      <section aria-label="Contas essenciais">
        <h3>Contas essenciais (luz, água, gás, internet)</h3>
        <ContasEssenciais />
      </section>
      <section aria-label="Materiais de consumo">
        <h3>Materiais de consumo por ano</h3>
        <table className="tabela-custo">
          <tbody>
            {consumiveis().map((c) => (
              <tr key={c.id}>
                <td>
                  <span className="item-titulo">{c.item}</span>
                  {c.nota ? <span className="detalhe">{c.nota}</span> : null}
                </td>
                <td className="col-valor"><FaixaTexto f={c.faixa} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section aria-label="Operação anual">
        <h3>Operação anual (OPEX)</h3>
        <table className="tabela-custo">
          <tbody>
            {linhasOpex().map((o) => (
              <tr key={o.id}>
                <td>
                  <span className="item-titulo">{o.id} · {o.item}</span>
                  {o.nota ? <span className="detalhe">{o.nota}</span> : null}
                </td>
                <td className="col-valor" data-testid={`opex-${o.id}`}><FaixaTexto f={o.faixa} /></td>
              </tr>
            ))}
            <tr className="linha-total"><td>Operação por ano</td><td className="col-valor"><FaixaTexto f={opexAnual()} /></td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}

const NUM = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

/** Consumo × tarifa, por mês e por ano. */
export function ContasEssenciais() {
  const c = contasEssenciais();
  return (
    <>
      <table className="tabela-custo">
        <thead>
          <tr><th scope="col">Conta</th><th scope="col">Por mês</th><th scope="col">Por ano</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span className="item-titulo">Energia elétrica</span>
              <span className="detalhe">{formatarQtd(c.kwh)} kWh por mês × R$ {NUM.format(TARIFA_ENERGIA[0])} a R$ {NUM.format(TARIFA_ENERGIA[1])}/kWh</span>
            </td>
            <td className="col-valor" data-testid="conta-energia"><FaixaTexto f={c.energiaMes} /></td>
            <td className="col-valor"><FaixaTexto f={[c.energiaMes[0] * 12, c.energiaMes[1] * 12]} /></td>
          </tr>
          <tr>
            <td>
              <span className="item-titulo">Água e esgoto</span>
              <span className="detalhe">{formatarQtd(c.m3)} m³ por mês × R$ {NUM.format(TARIFA_AGUA_ESGOTO[0])} a R$ {NUM.format(TARIFA_AGUA_ESGOTO[1])}/m³</span>
            </td>
            <td className="col-valor" data-testid="conta-agua"><FaixaTexto f={c.aguaMes} /></td>
            <td className="col-valor"><FaixaTexto f={[c.aguaMes[0] * 12, c.aguaMes[1] * 12]} /></td>
          </tr>
          {c.fixas.map((f) => (
            <tr key={f.id}>
              <td>
                <span className="item-titulo">{f.item}</span>
                {f.nota ? <span className="detalhe">{f.nota}</span> : null}
              </td>
              <td className="col-valor">{f.mmin === 0 ? <>até <FaixaTexto f={[f.mmax, f.mmax]} /></> : <FaixaTexto f={f.mes} />}</td>
              <td className="col-valor">{f.mmin === 0 ? <>até <FaixaTexto f={[f.mmax * 12, f.mmax * 12]} /></> : <FaixaTexto f={[f.mes[0] * 12, f.mes[1] * 12]} />}</td>
            </tr>
          ))}
          <tr className="linha-total">
            <td>Total</td>
            <td className="col-valor"><FaixaTexto f={c.mensal} /></td>
            <td className="col-valor"><FaixaTexto f={c.anual} /></td>
          </tr>
        </tbody>
      </table>
      <details>
        <summary>De onde vem o consumo</summary>
        <ul className="nota">
          {CONSUMO_ENERGIA_KWH_MES.map((x) => <li key={x.id}>{x.item}: {formatarQtd([x.cmin, x.cmax])} kWh/mês{x.nota ? ` (${x.nota})` : ''}</li>)}
          {CONSUMO_AGUA_M3_MES.map((x) => <li key={x.id}>{x.item}: {formatarQtd([x.cmin, x.cmax])} m³/mês{x.nota ? ` (${x.nota})` : ''}</li>)}
        </ul>
      </details>
      <p className="nota">
        Tarifas: energia a partir de fatura comercial da Enel SP de abr/2026 (≈ R$ 0,93/kWh com tributos, antes do reajuste de 10,18%); água e esgoto pela
        tabela da Sabesp para categoria pública acima de 50 m³ com o reajuste de 2026. Energia solar, água de chuva e reúso podem reduzir essas contas.
      </p>
    </>
  );
}

/** Preços de referência de materiais e a parte de materiais dentro da obra. */
export function Materiais() {
  const ms = materiaisObra();
  const total: Faixa = [ms.reduce((a, m) => a + m.faixa[0], 0), ms.reduce((a, m) => a + m.faixa[1], 0)];
  return (
    <>
      <section aria-label="Preços de materiais">
        <h3>Preços de referência (2026)</h3>
        <div className="tabela-rolagem" tabIndex={0} role="region" aria-label="Tabela: preços de materiais">
          <table className="tabela-custo">
            <thead>
              <tr><th scope="col">Material</th><th scope="col">Preço</th></tr>
            </thead>
            <tbody>
              {PRECOS_MATERIAIS.map((m) => (
                <tr key={m.material}>
                  <td>
                    <span className="item-titulo">{m.material}</span>
                    <span className="detalhe">por {m.unidade} · {m.fonte}</span>
                  </td>
                  <td className="col-valor">{m.preco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section aria-label="Materiais da obra">
        <h3>Principais materiais da obra</h3>
        <div className="tabela-rolagem" tabIndex={0} role="region" aria-label="Tabela: materiais da obra">
          <table className="tabela-custo">
            <thead>
              <tr><th scope="col">Material</th><th scope="col">Custo</th></tr>
            </thead>
            <tbody>
              {ms.map((m) => (
                <tr key={m.id}>
                  <td>
                    <span className="item-titulo">{m.material}</span>
                    <span className="detalhe">{formatarQtd([m.qmin, m.qmax])} {m.unidade} × {m.pmin === m.pmax ? `R$ ${NUM.format(m.pmin)}` : `R$ ${NUM.format(m.pmin)} a R$ ${NUM.format(m.pmax)}`}</span>
                    <span className="detalhe">{m.nota}</span>
                  </td>
                  <td className="col-valor" data-testid={`mat-${m.id}`}><FaixaTexto f={m.faixa} /></td>
                </tr>
              ))}
              <tr className="linha-total">
                <td>Total destes materiais</td>
                <td className="col-valor" data-testid="mat-total"><FaixaTexto f={total} /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="nota">
          Estes materiais já estão dentro do custo de implantação (não se somam a ele). Quantidades por índices típicos de consumo, hipótese do estudo;
          concreto e aço dependem do projeto estrutural. Preços de varejo e de tabelas de referência: obra grande negocia com fornecedor.
        </p>
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

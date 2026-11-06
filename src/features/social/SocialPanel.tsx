import { useParque } from '../../app/store';
import { edificioPorId } from '../../data/buildings';
import { instalacaoPorId } from '../../data/facilities';
import { OPORTUNIDADES, PROGRAMAS, ROTULO_EIXO, type Eixo } from '../../data/programs';
import { setorPorId } from '../../data/sectors';
import type { Selecao } from '../selection/selection';

function espaco(id: string): { nome: string; sel: Selecao } | null {
  const e = edificioPorId(id);
  if (e) return { nome: e.nome, sel: { tipo: 'edificio', id } };
  const i = instalacaoPorId(id);
  if (i) return { nome: i.nome, sel: { tipo: 'instalacao', id } };
  const s = setorPorId(id);
  if (s) return { nome: s.nome, sel: { tipo: 'setor', id } };
  return null;
}

/** Fichas dos programas sociais (D5) e oportunidades de referência. */
export function SocialPanel() {
  const selecionar = useParque((s) => s.selecionar);
  const setAba = useParque((s) => s.setAba);
  const eixos = [...new Set(PROGRAMAS.map((p) => p.eixo))] as Eixo[];
  return (
    <section aria-labelledby="prog-titulo" className="painel-aba">
      <h2 id="prog-titulo">Programas sociais (propostas)</h2>
      <p className="aviso" role="note">
        ⚠ Programas propostos, não convênios existentes. Nenhuma parceria, vaga, capacidade ou resultado está confirmado. Indicadores abaixo são o que
        se propõe medir; metas numéricas só após estudo de demanda.
      </p>
      {eixos.map((eixo) => (
        <div key={eixo}>
          <h3>{ROTULO_EIXO[eixo]}</h3>
          {PROGRAMAS.filter((p) => p.eixo === eixo).map((p) => (
            <details key={p.id} className="programa">
              <summary>
                {p.nome} <span className="nota">— proposto</span>
              </summary>
              <p>{p.descricao}</p>
              <dl className="ficha">
                <dt>Público</dt><dd>{p.publico_alvo}</dd>
                <dt>Capacidade</dt><dd>{p.capacidade_hipotetica ?? 'A definir (sem estudo de demanda)'}</dd>
                <dt>Equipe pendente</dt><dd>{p.equipe_pendente.join('; ')}</dd>
                <dt>Indicadores propostos</dt><dd>{p.indicadores_propostos.join('; ')}</dd>
                <dt>Dependências</dt><dd>{p.dependencias.join('; ')}</dd>
                <dt>Custo recorrente</dt><dd>A calcular ({p.custo_recorrente_id ?? 'sem lançamento'})</dd>
              </dl>
              {p.limite ? <p className="aviso" role="note">⚠ {p.limite}</p> : null}
              <p>
                Espaços:{' '}
                {p.espacos_ids.map((id, k) => {
                  const e = espaco(id);
                  if (!e) return null;
                  return (
                    <span key={id}>
                      {k > 0 ? ', ' : ''}
                      <button type="button" className="link" onClick={() => { selecionar(e.sel); setAba('explorar'); }}>{e.nome}</button>
                    </span>
                  );
                })}
              </p>
            </details>
          ))}
        </div>
      ))}

      <h3>Oportunidades de editais (referência)</h3>
      <p className="nota">
        Relatório de 05/11/2026. Valores são de programas inteiros, não recursos para o parque. Prazos e requisitos devem ser reconferidos antes de
        qualquer uso; nenhuma inscrição foi feita.
      </p>
      <div className="tabela-rolagem">
        <table className="tabela-custo">
          <thead>
            <tr><th scope="col">Oportunidade</th><th scope="col">Recursos previstos</th><th scope="col">Prazo</th><th scope="col">Aderência</th></tr>
          </thead>
          <tbody>
            {OPORTUNIDADES.map((o) => (
              <tr key={o.nome}>
                <td>{o.nome}<br /><span className="nota">{o.observacao}</span></td>
                <td>{o.valor}</td>
                <td>{o.prazo}</td>
                <td>{o.aderencia}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

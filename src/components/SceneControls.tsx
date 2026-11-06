import { CAMADAS, useParque, type ModoCor, type Qualidade } from '../app/store';
import { FASES_FISICAS } from '../data/phases';
import { COR_CUSTO } from '../lib/cores';

/** Controles sobre a cena: visão geral, rótulos, noite, qualidade, camadas e modo de cor. */
export function SceneControls() {
  const st = useParque();
  return (
    <div className="controles-cena">
      <button type="button" onClick={() => st.moverCamera(null, null)}>Visão geral</button>
      <details className="menu-cena">
        <summary>Camadas e exibição</summary>
        <div className="menu-conteudo">
          <fieldset>
            <legend>Camadas</legend>
            {CAMADAS.map((c) => (
              <label key={c.id}>
                <input type="checkbox" checked={st.camadas[c.id]} onChange={() => st.alternarCamada(c.id)} /> {c.nome}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Colorir por</legend>
            {(
              [
                ['setores', 'Setores'],
                ['custos', 'Situação do custo'],
                ['fases', 'Fase física'],
              ] as [ModoCor, string][]
            ).map(([id, nome]) => (
              <label key={id}>
                <input type="radio" name="modo-cor" checked={st.modoCor === id} onChange={() => st.setModoCor(id)} /> {nome}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Exibição</legend>
            <label>
              <input type="checkbox" checked={st.rotulos} onChange={(e) => st.setRotulos(e.target.checked)} /> Rótulos dos setores
            </label>
            <label>
              <input type="checkbox" checked={st.noite} onChange={(e) => st.setNoite(e.target.checked)} /> Modo noite
            </label>
            <label>
              Qualidade{' '}
              <select value={st.qualidade} onChange={(e) => st.setQualidade(e.target.value as Qualidade)}>
                <option value="baixa">Baixa (sem sombras)</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </label>
          </fieldset>
        </div>
      </details>
    </div>
  );
}

/** Legenda do modo de cor (texto + cor, não só cor). */
export function LegendaModo() {
  const modo = useParque((s) => s.modoCor);
  if (modo === 'setores') return null;
  const itens =
    modo === 'custos'
      ? [
          { cor: COR_CUSTO.pendente, nome: 'A cotar / sem dados' },
          { cor: COR_CUSTO.com_valor, nome: 'Com valor e fonte' },
          { cor: COR_CUSTO.sem_lancamento, nome: 'Sem lançamento próprio' },
        ]
      : FASES_FISICAS.filter((f) => f.id !== 'F0').map((f) => ({ cor: f.cor, nome: `${f.id} — ${f.nome}` }));
  return (
    <div className="legenda-modo" role="note" aria-label={modo === 'custos' ? 'Legenda: situação do custo' : 'Legenda: fases físicas'}>
      <strong>{modo === 'custos' ? 'Situação do custo' : 'Fase física (proposta)'}</strong>
      <ul>
        {itens.map((i) => (
          <li key={i.nome}>
            <span className="amostra" style={{ background: i.cor }} aria-hidden="true" /> {i.nome}
          </li>
        ))}
      </ul>
    </div>
  );
}

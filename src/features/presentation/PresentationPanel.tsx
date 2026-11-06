import { useCallback, useEffect } from 'react';
import { useParque } from '../../app/store';
import { ORCAMENTO } from '../../data/budget';
import { FASES_FISICAS } from '../../data/phases';
import { BENEFICIOS, PASSOS, RISCOS } from '../../data/presentation';
import { resumoPorTipo, ROTULO_TIPO } from '../../lib/budget-calculator';

/** Aplica o estado de cena de um passo (seleção, modo de cor, câmera). */
export function aplicarPasso(indice: number) {
  const p = PASSOS[indice];
  if (!p) return;
  const st = useParque.getState();
  st.setPasso(indice);
  st.selecionar(p.selecao);
  st.setModoEdificio(p.modoEdificio ?? 'fechado');
  st.isolarNivel(null);
  st.setModoCor(p.modoCor);
  st.moverCamera(p.camera?.posicao ?? null, p.camera?.alvo ?? null);
}

export function sairApresentacao() {
  const st = useParque.getState();
  st.setPasso(null);
  st.setModoCor('setores');
  st.setModoEdificio('fechado');
  st.moverCamera(null, null);
}

/** Percurso SENAC (D6): navegação por botões e setas, sem menus complexos. */
export function PresentationPanel() {
  const passo = useParque((s) => s.passo);
  const ir = useCallback((i: number) => aplicarPasso(Math.max(0, Math.min(PASSOS.length - 1, i))), []);

  useEffect(() => {
    if (passo === null) return;
    const onKey = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement | null;
      if (alvo && ['INPUT', 'SELECT', 'TEXTAREA'].includes(alvo.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') ir(passo + 1);
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') ir(passo - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [passo, ir]);

  if (passo === null) {
    return (
      <section aria-labelledby="apr-titulo" className="painel-aba">
        <h2 id="apr-titulo">Percurso de apresentação</h2>
        <p>
          {PASSOS.length} passos guiados: terreno, setores, edifícios, programas, orçamento, fases e riscos. Use os botões ou as setas ← → do teclado.
        </p>
        <ol className="nota">
          {PASSOS.map((p) => (
            <li key={p.id}>{p.titulo}</li>
          ))}
        </ol>
        <button type="button" className="botao" onClick={() => ir(0)}>
          Iniciar apresentação
        </button>
      </section>
    );
  }

  const p = PASSOS[passo]!;
  return (
    <section aria-labelledby="apr-titulo" className="painel-aba apresentacao" aria-live="polite">
      <p className="nota">
        Passo {passo + 1} de {PASSOS.length}
      </p>
      <h2 id="apr-titulo">{p.titulo}</h2>
      {p.texto.map((t) => (
        <p key={t}>{t}</p>
      ))}
      {p.extra === 'beneficios' && (
        <ul>
          {BENEFICIOS.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      {p.extra === 'orcamento' && (
        <ul>
          {(['CAPEX', 'implantacao_programas', 'OPEX_anual'] as const).map((t) => {
            const r = resumoPorTipo(ORCAMENTO, t);
            return (
              <li key={t}>
                {ROTULO_TIPO[t]}: {r.folhas_com_valor} de {r.folhas_com_valor + r.folhas_pendentes} itens com valor — total parcial não calculável.
              </li>
            );
          })}
        </ul>
      )}
      {p.extra === 'fases' && (
        <table className="tabela-custo">
          <thead>
            <tr><th scope="col">Fase</th><th scope="col">Conceito</th><th scope="col">Depende de</th></tr>
          </thead>
          <tbody>
            {FASES_FISICAS.map((f) => (
              <tr key={f.id}>
                <td><span className="amostra" style={{ background: f.cor }} aria-hidden="true" /> {f.id} — {f.nome}</td>
                <td>{f.conceito}</td>
                <td>{f.dependencia}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {p.extra === 'riscos' && (
        <table className="tabela-custo">
          <thead>
            <tr><th scope="col">Risco / incerteza</th><th scope="col">Severidade</th><th scope="col">Ação antes de obras</th></tr>
          </thead>
          <tbody>
            {RISCOS.map((r) => (
              <tr key={r.risco}>
                <td>{r.risco}</td>
                <td><strong>{r.severidade}</strong></td>
                <td>{r.acao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="navegacao-passos">
        <button type="button" className="botao" onClick={() => ir(passo - 1)} disabled={passo === 0}>← Anterior</button>
        <button type="button" className="botao" onClick={() => ir(passo + 1)} disabled={passo === PASSOS.length - 1}>Próximo →</button>
        <button type="button" className="botao secundario" onClick={sairApresentacao}>Sair</button>
      </div>
    </section>
  );
}

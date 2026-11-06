import { Component, lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react';
import { InfoPanel } from '../components/InfoPanel';
import { ObjectList } from '../components/ObjectList';
import { INSTALACOES } from '../data/facilities';
import { SETORES } from '../data/sectors';
import { TERRENO } from '../data/terrain';
import type { Selecao } from '../features/selection/selection';
import { prefereMovimentoReduzido, suportaWebGL } from '../lib/webgl';

const ParkScene = lazy(() => import('../scene/ParkScene').then((m) => ({ default: m.ParkScene })));

function AlternativaTextual({ motivo }: { motivo: string }) {
  return (
    <div className="alternativa" role="status">
      <p><strong>Visualização 3D indisponível</strong> ({motivo}).</p>
      <p>
        A maquete mostra o terreno ilustrativo de {TERRENO.poligono.length} vértices com área de estudo hipotética de 100.000 m², dividido em{' '}
        {SETORES.length} setores sem sobreposição, o ginásio multifuncional (quatro níveis), o centro cultural (três níveis) e{' '}
        {INSTALACOES.length} tipos de instalação. Use a lista ao lado para abrir as fichas.
      </p>
    </div>
  );
}

class LimiteErro3D extends Component<{ children: ReactNode }, { erro: boolean }> {
  state = { erro: false };
  static getDerivedStateFromError() {
    return { erro: true };
  }
  render() {
    return this.state.erro ? <AlternativaTextual motivo="falha ao iniciar a cena" /> : this.props.children;
  }
}

export function App({ webgl: webglForcado }: { webgl?: boolean }) {
  const [webgl] = useState(() => webglForcado ?? suportaWebGL());
  const [selecao, setSelecao] = useState<Selecao | null>(null);
  const [resetCamera, setResetCamera] = useState(0);
  const [reducedMotion] = useState(prefereMovimentoReduzido);
  // Em telas estreitas os rótulos se sobrepõem na faixa central; começam desligados (D7 refina).
  const [mostrarRotulos, setMostrarRotulos] = useState(() => typeof window === 'undefined' || window.innerWidth >= 760);

  const limpar = useCallback(() => setSelecao(null), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') limpar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [limpar]);

  return (
    <div className="layout">
      <header className="topo">
        <div>
          <h1>Parque Cidade Viva</h1>
          <p className="subtitulo">Maquete digital conceitual 3D — projeto acadêmico SENAC</p>
        </div>
        <p className="selo" role="note">Geometria conceitual — escala não certificada</p>
      </header>

      <main className="cena" aria-label="Maquete 3D">
        {webgl ? (
          <LimiteErro3D>
            <Suspense fallback={<p className="carregando">Carregando maquete…</p>}>
              <ParkScene selecao={selecao} onSelecionar={setSelecao} resetCamera={resetCamera} reducedMotion={reducedMotion} mostrarRotulos={mostrarRotulos} />
            </Suspense>
          </LimiteErro3D>
        ) : (
          <AlternativaTextual motivo="WebGL não disponível neste navegador" />
        )}
        {webgl && (
          <div className="controles-cena">
            <button type="button" onClick={() => setResetCamera((n) => n + 1)}>
              Visão geral
            </button>
            <label>
              <input type="checkbox" checked={mostrarRotulos} onChange={(e) => setMostrarRotulos(e.target.checked)} /> Rótulos dos setores
            </label>
          </div>
        )}
      </main>

      <aside className="lateral">
        <InfoPanel selecao={selecao} onFechar={limpar} />
        <ObjectList selecao={selecao} onSelecionar={setSelecao} />
        <footer className="rodape nota">
          Estudo acadêmico. Não é BIM, projeto executivo, levantamento georreferenciado, orçamento oficial nem gêmeo digital. Áreas, custos e
          capacidades exibidos são hipóteses ou pendências.
        </footer>
      </aside>
    </div>
  );
}

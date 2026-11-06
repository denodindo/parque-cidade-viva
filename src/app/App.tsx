import { Component, lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react';
import { InfoPanel } from '../components/InfoPanel';
import { ObjectList } from '../components/ObjectList';
import { SETOR_ESPORTE_GEOMETRIA, TERRENO } from '../data/terrain';
import { setorPorId } from '../data/sectors';
import type { Selecao } from '../features/selection/selection';
import { prefereMovimentoReduzido, suportaWebGL } from '../lib/webgl';

const ParkScene = lazy(() => import('../scene/ParkScene').then((m) => ({ default: m.ParkScene })));

function AlternativaTextual({ motivo }: { motivo: string }) {
  return (
    <div className="alternativa" role="status">
      <p><strong>Visualização 3D indisponível</strong> ({motivo}).</p>
      <p>
        A maquete mostra o terreno ilustrativo de {TERRENO.poligono.length} vértices com área de estudo hipotética de 100.000 m², o setor
        “{setorPorId(SETOR_ESPORTE_GEOMETRIA.setor_id)!.nome}” na faixa inferior e o ginásio multifuncional com quatro níveis. Use a lista ao
        lado para abrir as fichas.
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
              <ParkScene selecao={selecao} onSelecionar={setSelecao} resetCamera={resetCamera} reducedMotion={reducedMotion} />
            </Suspense>
          </LimiteErro3D>
        ) : (
          <AlternativaTextual motivo="WebGL não disponível neste navegador" />
        )}
        {webgl && (
          <button type="button" className="visao-geral" onClick={() => setResetCamera((n) => n + 1)}>
            Visão geral
          </button>
        )}
      </main>

      <aside className="lateral">
        <ObjectList selecao={selecao} onSelecionar={setSelecao} />
        <InfoPanel selecao={selecao} onFechar={limpar} />
        <footer className="rodape nota">
          Estudo acadêmico. Não é BIM, projeto executivo, levantamento georreferenciado, orçamento oficial nem gêmeo digital. Áreas, custos e
          capacidades exibidos são hipóteses ou pendências.
        </footer>
      </aside>
    </div>
  );
}

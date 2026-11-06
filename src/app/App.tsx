import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { InfoPanel } from '../components/InfoPanel';
import { ObjectList } from '../components/ObjectList';
import { LegendaModo, SceneControls } from '../components/SceneControls';
import { INSTALACOES } from '../data/facilities';
import { SETORES } from '../data/sectors';
import { TERRENO } from '../data/terrain';
import { BudgetPanel } from '../features/budget/BudgetPanel';
import { PresentationPanel } from '../features/presentation/PresentationPanel';
import { SocialPanel } from '../features/social/SocialPanel';
import { prefereMovimentoReduzido, suportaWebGL } from '../lib/webgl';
import { useParque, type Aba } from './store';

const ParkScene = lazy(() => import('../scene/ParkScene').then((m) => ({ default: m.ParkScene })));

function AlternativaTextual({ motivo }: { motivo: string }) {
  return (
    <div className="alternativa" role="status">
      <p><strong>Visualização 3D indisponível</strong> ({motivo}).</p>
      <p>
        A maquete mostra o terreno ilustrativo de {TERRENO.poligono.length} vértices com área de estudo hipotética de 100.000 m², dividido em{' '}
        {SETORES.length} setores sem sobreposição, o ginásio multifuncional (quatro níveis), o centro cultural (três níveis) e{' '}
        {INSTALACOES.length} tipos de instalação. Use a lista e as abas ao lado: todas as fichas, pavimentos, orçamento, programas e a apresentação
        funcionam sem 3D.
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

const ABAS: { id: Aba; nome: string }[] = [
  { id: 'explorar', nome: 'Explorar' },
  { id: 'orcamento', nome: 'Orçamento' },
  { id: 'programas', nome: 'Programas' },
  { id: 'apresentacao', nome: 'Apresentar' },
];

export function App({ webgl: webglForcado }: { webgl?: boolean }) {
  const [webgl] = useState(() => webglForcado ?? suportaWebGL());
  const [reducedMotion] = useState(prefereMovimentoReduzido);
  const aba = useParque((s) => s.aba);
  const setAba = useParque((s) => s.setAba);
  const noite = useParque((s) => s.noite);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') useParque.getState().selecionar(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const moverAba = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const prox = ABAS[(i + (e.key === 'ArrowRight' ? 1 : ABAS.length - 1)) % ABAS.length]!;
    setAba(prox.id);
    document.getElementById(`aba-${prox.id}`)?.focus();
  };

  return (
    <div className={`layout${noite ? ' noite' : ''}`}>
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
              <ParkScene reducedMotion={reducedMotion} />
            </Suspense>
          </LimiteErro3D>
        ) : (
          <AlternativaTextual motivo="WebGL não disponível neste navegador" />
        )}
        {webgl && <SceneControls />}
        {webgl && <LegendaModo />}
      </main>

      <aside className="lateral">
        <div role="tablist" aria-label="Seções" className="abas">
          {ABAS.map((a, i) => (
            <button
              key={a.id}
              id={`aba-${a.id}`}
              role="tab"
              type="button"
              aria-selected={aba === a.id}
              aria-controls={`painel-${a.id}`}
              tabIndex={aba === a.id ? 0 : -1}
              onClick={() => setAba(a.id)}
              onKeyDown={(e) => moverAba(e, i)}
            >
              {a.nome}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`painel-${aba}`} aria-labelledby={`aba-${aba}`} className="conteudo-aba">
          {aba === 'explorar' && (
            <>
              <InfoPanel />
              <ObjectList />
            </>
          )}
          {aba === 'orcamento' && <BudgetPanel />}
          {aba === 'programas' && <SocialPanel />}
          {aba === 'apresentacao' && <PresentationPanel />}
        </div>
        <footer className="rodape nota">
          Estudo acadêmico. Não é BIM, projeto executivo, levantamento georreferenciado, orçamento oficial nem gêmeo digital. Áreas, custos e
          capacidades exibidos são hipóteses ou pendências.
        </footer>
      </aside>
    </div>
  );
}

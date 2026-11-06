import { useEffect, useRef, useState, type ComponentRef, type RefObject } from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { Html, Line, OrbitControls } from '@react-three/drei';
import { EDIFICIOS } from '../data/buildings';
import { INSTALACOES } from '../data/facilities';
import { CAMINHOS, GEOMETRIA_SETORES, TRILHA_HIPOTETICA } from '../data/layout';
import { SETORES } from '../data/sectors';
import { TERRENO } from '../data/terrain';
import { mesmaSelecao, nomeDaSelecao, textoCustoDaSelecao, type Selecao } from '../features/selection/selection';
import { centroid, type Point } from '../lib/geometry';
import { ALTURA_NIVEL_ILUSTRATIVA, BuildingFloors } from './BuildingFloors';
import { Facility } from './Facilities';
import { FlatPolygon } from './Terrain';
import { Vegetation } from './Vegetation';

interface Props {
  selecao: Selecao | null;
  onSelecionar: (s: Selecao) => void;
  /** Incrementar para voltar à visão geral. */
  resetCamera: number;
  reducedMotion: boolean;
  mostrarRotulos: boolean;
}

/** Câmera alinhada à orientação da imagem de referência (norte real não comprovado). */
const POSICAO_INICIAL: [number, number, number] = [0, 560, 430];

const CORES_EDIFICIO: Record<string, [string, string]> = {
  ginasio: ['#e7e2d6', '#d7cfbd'],
  'centro-cultural': ['#dfe4f2', '#c8d0e8'],
};

const linha3d = (pts: readonly Point[], y: number) => pts.map(([x, z]) => [x, y, z] as [number, number, number]);
const fechada = (pts: readonly Point[]) => [...pts, pts[0]!];

function Tooltip({ selecao, posicao, portal }: { selecao: Selecao; posicao: [number, number, number]; portal: RefObject<HTMLDivElement | null> }) {
  return (
    <Html portal={portal as RefObject<HTMLElement>} position={posicao} center style={{ pointerEvents: 'none' }} zIndexRange={[20, 10]}>
      <div className="tooltip" role="tooltip">
        <strong>{nomeDaSelecao(selecao)}</strong>
        <span>Custo: {textoCustoDaSelecao(selecao)}</span>
      </div>
    </Html>
  );
}

export function ParkScene({ selecao, onSelecionar, resetCamera, reducedMotion, mostrarRotulos }: Props) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  /**
   * Camada fixa para os rótulos HTML. Sem ela, o drei recria o primeiro <Html>
   * quando o alvo muda após conectar os eventos e o conteúdo some (verificado no D2).
   */
  const sobreposicao = useRef<HTMLDivElement>(null);
  const portal = sobreposicao as RefObject<HTMLElement>;
  const [hover, setHover] = useState<{ selecao: Selecao; ponto: [number, number, number] } | null>(null);

  useEffect(() => {
    if (resetCamera > 0) controls.current?.reset();
  }, [resetCamera]);

  const handlers = (s: Selecao) => ({
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelecionar(s);
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHover({ selecao: s, ponto: [e.point.x, e.point.y + 10, e.point.z] });
    },
    onPointerOut: () => setHover((h) => (h && mesmaSelecao(h.selecao, s) ? null : h)),
  });
  const estado = (s: Selecao) => ({ selecionado: mesmaSelecao(selecao, s), destacado: mesmaSelecao(hover?.selecao ?? null, s) });

  return (
    <div className="cena-3d">
    <Canvas shadows camera={{ position: POSICAO_INICIAL, fov: 45, near: 1, far: 5000 }} aria-hidden="true">
      <color attach="background" args={['#dfe9ef']} />
      <hemisphereLight args={['#ffffff', '#6b7f5a', 0.9]} />
      <directionalLight position={[300, 500, 200]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-450} shadow-camera-right={450} shadow-camera-top={450} shadow-camera-bottom={-450} />

      {/* base do terreno (selecionável pela lista) e contorno */}
      <FlatPolygon poligono={TERRENO.poligono} cor="#8aa67a" altura={-0.2} selecionado={false} destacado={false} onClick={() => undefined} />
      <Line points={linha3d(fechada(TERRENO.poligono), 0.6)} color={mesmaSelecao(selecao, { tipo: 'terreno', id: 'terreno' }) ? '#d9a441' : '#2d3b30'} lineWidth={2.5} />

      {SETORES.map((s) => {
        const sel: Selecao = { tipo: 'setor', id: s.id };
        const poly = GEOMETRIA_SETORES[s.id]!;
        return <FlatPolygon key={s.id} poligono={poly} cor={s.cor} altura={0} {...estado(sel)} {...handlers(sel)} />;
      })}
      {SETORES.map((s) => (
        <Line key={`borda-${s.id}`} points={linha3d(fechada(GEOMETRIA_SETORES[s.id]!), 0.4)} color="#ffffff" lineWidth={1} transparent opacity={0.8} />
      ))}

      {CAMINHOS.map((c) => (
        <Line key={c.id} points={linha3d(c.pontos, 0.5)} color="#f3eee3" lineWidth={4} />
      ))}
      <Line points={linha3d(TRILHA_HIPOTETICA.pontos, 0.5)} color="#7a5230" lineWidth={3} dashed dashSize={8} gapSize={6} />

      {EDIFICIOS.map((e) => {
        const sel: Selecao = { tipo: 'edificio', id: e.id };
        const [a, b] = CORES_EDIFICIO[e.id] ?? ['#e0e0e0', '#cccccc'];
        return <BuildingFloors key={e.id} edificio={e} corA={a} corB={b} {...estado(sel)} {...handlers(sel)} />;
      })}

      {INSTALACOES.map((i) => {
        const sel: Selecao = { tipo: 'instalacao', id: i.id };
        return <Facility key={i.id} instalacao={i} {...estado(sel)} {...handlers(sel)} />;
      })}

      <Vegetation />

      {mostrarRotulos &&
        SETORES.map((s) => {
          const [x, z] = centroid(GEOMETRIA_SETORES[s.id]!);
          return (
            <Html key={`rot-${s.id}`} portal={portal} position={[x, 2, z]} center style={{ pointerEvents: 'none' }} zIndexRange={[5, 0]}>
              <div className="rotulo">{s.rotulo}</div>
            </Html>
          );
        })}

      {mostrarRotulos && (
        <Html portal={portal} position={[TRILHA_HIPOTETICA.pontos[2]![0] + 40, 2, TRILHA_HIPOTETICA.pontos[2]![1]]} center style={{ pointerEvents: 'none' }} zIndexRange={[5, 0]}>
          <div className="rotulo rotulo-aviso">Trilha hipotética — pendente</div>
        </Html>
      )}
      {hover && <Tooltip portal={sobreposicao} selecao={hover.selecao} posicao={hover.selecao.tipo === 'edificio' ? [hover.ponto[0], 4 * ALTURA_NIVEL_ILUSTRATIVA + 10, hover.ponto[2]] : hover.ponto} />}

      <OrbitControls ref={controls} makeDefault enableDamping={!reducedMotion} maxPolarAngle={Math.PI / 2.2} minDistance={60} maxDistance={1500} target={[0, 0, 0]} />
    </Canvas>
    <div ref={sobreposicao} className="sobreposicao" />
    </div>
  );
}

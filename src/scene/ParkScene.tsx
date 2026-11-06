import { useCallback, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { Html, Line, OrbitControls } from '@react-three/drei';
import { useParque, type Qualidade } from '../app/store';
import { EDIFICIOS } from '../data/buildings';
import { INSTALACOES } from '../data/facilities';
import { CAMINHOS, GEOMETRIA_SETORES, TRILHA_HIPOTETICA } from '../data/layout';
import { SETORES } from '../data/sectors';
import { TERRENO } from '../data/terrain';
import { mesmaSelecao, nomeDaSelecao, textoCustoDaSelecao, type Selecao } from '../features/selection/selection';
import { corPorModo, visivelNasCamadas } from '../lib/cores';
import { centroid, type Point } from '../lib/geometry';
import { ALTURA_NIVEL_ILUSTRATIVA, BuildingFloors } from './BuildingFloors';
import { CameraRig, POSICAO_INICIAL } from './CameraRig';
import { Facility } from './Facilities';
import { PortalContext, usePortal } from './portal';
import { FlatPolygon } from './Terrain';
import { Vegetation } from './Vegetation';

/** Presets de qualidade (PM §7.12). */
export const PRESETS: Record<Qualidade, { sombras: boolean; mapa: number; dpr: [number, number]; arvores: number; antialias: boolean }> = {
  baixa: { sombras: false, mapa: 512, dpr: [1, 1], arvores: 0.35, antialias: false },
  media: { sombras: true, mapa: 1024, dpr: [1, 1.5], arvores: 0.7, antialias: true },
  alta: { sombras: true, mapa: 2048, dpr: [1, 2], arvores: 1, antialias: true },
};

const CORES_EDIFICIO: Record<string, [string, string]> = {
  ginasio: ['#e7e2d6', '#d7cfbd'],
  'centro-cultural': ['#dfe4f2', '#c8d0e8'],
};

const linha3d = (pts: readonly Point[], y: number) => pts.map(([x, z]) => [x, y, z] as [number, number, number]);
const fechada = (pts: readonly Point[]) => [...pts, pts[0]!];

/** Postes ilustrativos ao longo dos caminhos (acendem no modo noite). */
function postes(): Point[] {
  const out: Point[] = [];
  for (const c of CAMINHOS) {
    for (let i = 1; i < c.pontos.length; i++) {
      const a = c.pontos[i - 1]!;
      const b = c.pontos[i]!;
      const n = Math.max(1, Math.floor(Math.hypot(b[0] - a[0], b[1] - a[1]) / 45));
      for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * (k + 0.5)) / n + 3, a[1] + ((b[1] - a[1]) * (k + 0.5)) / n]);
    }
  }
  return out;
}
const POSTES = postes();

function Tooltip({ selecao, posicao }: { selecao: Selecao; posicao: [number, number, number] }) {
  const portal = usePortal();
  return (
    <Html portal={portal} position={posicao} center style={{ pointerEvents: 'none' }} zIndexRange={[20, 10]}>
      <div className="tooltip" role="tooltip">
        <strong>{nomeDaSelecao(selecao)}</strong>
        <span>Custo: {textoCustoDaSelecao(selecao)}</span>
      </div>
    </Html>
  );
}

export function ParkScene({ reducedMotion }: { reducedMotion: boolean }) {
  const { selecao, selecionar, modoEdificio, nivelIsolado, isolarNivel, camadas, modoCor, qualidade, noite, rotulos, camera } = useParque();
  const preset = PRESETS[qualidade];
  const [hover, setHover] = useState<{ selecao: Selecao; ponto: [number, number, number] } | null>(null);
  const sobreposicao = useRef<HTMLDivElement>(null);

  const handlers = (s: Selecao) => ({
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      selecionar(s);
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHover({ selecao: s, ponto: [e.point.x, e.point.y + 10, e.point.z] });
    },
    onPointerOut: () => setHover((h) => (h && mesmaSelecao(h.selecao, s) ? null : h)),
  });
  const estado = (s: Selecao) => ({
    selecionado: mesmaSelecao(selecao, s),
    destacado: mesmaSelecao(hover?.selecao ?? null, s),
    apagado: !visivelNasCamadas(s, camadas),
  });
  const setorVisivel = useCallback((id: string) => visivelNasCamadas({ tipo: 'setor', id }, camadas), [camadas]);
  const corModo = (s: Selecao) => (modoCor === 'setores' ? null : corPorModo(s, modoCor, ''));

  const fundo = noite ? '#0f1824' : '#dfe9ef';
  const rotulosSetores = useMemo(() => SETORES.map((s) => ({ s, c: centroid(GEOMETRIA_SETORES[s.id]!) })), []);

  return (
    <div className="cena-3d">
      <PortalContext.Provider value={sobreposicao as RefObject<HTMLElement>}>
        <Canvas key={qualidade} shadows={preset.sombras} dpr={preset.dpr} gl={{ antialias: preset.antialias }} camera={{ position: POSICAO_INICIAL, fov: 45, near: 1, far: 5000 }} aria-hidden="true">
          <color attach="background" args={[fundo]} />
          <hemisphereLight args={[noite ? '#8fa3d1' : '#ffffff', noite ? '#2a3526' : '#6b7f5a', noite ? 0.75 : 0.9]} />
          {noite && <ambientLight intensity={0.25} color="#ffe2b0" />}
          <directionalLight
            position={noite ? [-250, 400, -150] : [300, 500, 200]}
            color={noite ? '#9fb4ff' : '#ffffff'}
            intensity={noite ? 0.5 : 1.6}
            castShadow={preset.sombras}
            shadow-mapSize={[preset.mapa, preset.mapa]}
            shadow-camera-left={-450}
            shadow-camera-right={450}
            shadow-camera-top={450}
            shadow-camera-bottom={-450}
          />

          <FlatPolygon poligono={TERRENO.poligono} cor="#8aa67a" altura={-0.2} selecionado={false} destacado={false} />
          <Line points={linha3d(fechada(TERRENO.poligono), 0.6)} color={mesmaSelecao(selecao, { tipo: 'terreno', id: 'terreno' }) ? '#d9a441' : '#2d3b30'} lineWidth={2.5} />

          {SETORES.map((s) => {
            const sel: Selecao = { tipo: 'setor', id: s.id };
            return <FlatPolygon key={s.id} poligono={GEOMETRIA_SETORES[s.id]!} cor={corModo(sel) ?? s.cor} altura={0} {...estado(sel)} {...handlers(sel)} />;
          })}
          {SETORES.map((s) => (
            <Line key={`borda-${s.id}`} points={linha3d(fechada(GEOMETRIA_SETORES[s.id]!), 0.4)} color="#ffffff" lineWidth={1} transparent opacity={0.8} />
          ))}

          {CAMINHOS.map((c) => (
            <Line key={c.id} points={linha3d(c.pontos, 0.5)} color={noite ? '#fff2c2' : '#f3eee3'} lineWidth={4} />
          ))}
          <Line points={linha3d(TRILHA_HIPOTETICA.pontos, 0.5)} color={noite ? '#c9a27a' : '#7a5230'} lineWidth={3} dashed dashSize={8} gapSize={6} />

          {POSTES.map(([x, z]) => (
            <group key={`${x},${z}`} position={[x, 0, z]}>
              <mesh position-y={2.5} raycast={() => null}>
                <cylinderGeometry args={[0.15, 0.15, 5, 5]} />
                <meshStandardMaterial color="#555" />
              </mesh>
              <mesh position-y={5.2} raycast={() => null}>
                <sphereGeometry args={[0.6, 8, 8]} />
                <meshStandardMaterial color="#fff6d5" emissive="#ffd27a" emissiveIntensity={noite ? 2.5 : 0} />
              </mesh>
            </group>
          ))}

          {EDIFICIOS.map((e) => {
            const sel: Selecao = { tipo: 'edificio', id: e.id };
            const [a, b] = CORES_EDIFICIO[e.id] ?? ['#e0e0e0', '#cccccc'];
            const ativo = mesmaSelecao(selecao, sel);
            return (
              <BuildingFloors
                key={e.id}
                edificio={e}
                corA={a}
                corB={b}
                modo={ativo ? modoEdificio : 'fechado'}
                nivelIsolado={ativo && nivelIsolado?.edificioId === e.id ? nivelIsolado.ordem : null}
                noite={noite}
                reducedMotion={reducedMotion}
                corModo={corModo(sel)}
                onClickNivel={(ordem) => isolarNivel({ edificioId: e.id, ordem })}
                {...estado(sel)}
                {...handlers(sel)}
              />
            );
          })}

          {INSTALACOES.map((i) => {
            const sel: Selecao = { tipo: 'instalacao', id: i.id };
            return <Facility key={i.id} instalacao={i} corModo={corModo(sel)} {...estado(sel)} {...handlers(sel)} />;
          })}

          <Vegetation fracao={preset.arvores} setoresVisiveis={setorVisivel} sombras={preset.sombras} noite={noite} />

          {rotulos &&
            rotulosSetores.map(({ s, c: [x, z] }) => (
              <Html key={`rot-${s.id}`} portal={sobreposicao as RefObject<HTMLElement>} position={[x, 2, z]} center style={{ pointerEvents: 'none' }} zIndexRange={[5, 0]}>
                <div className="rotulo">{s.rotulo}</div>
              </Html>
            ))}
          {rotulos && (
            <Html portal={sobreposicao as RefObject<HTMLElement>} position={[TRILHA_HIPOTETICA.pontos[2]![0] + 40, 2, TRILHA_HIPOTETICA.pontos[2]![1]]} center style={{ pointerEvents: 'none' }} zIndexRange={[5, 0]}>
              <div className="rotulo rotulo-aviso">Trilha hipotética — pendente</div>
            </Html>
          )}
          {modoEdificio !== 'fechado' && selecao?.tipo === 'edificio' && selecao.id === 'ginasio' && (
            <Html portal={sobreposicao as RefObject<HTMLElement>} position={[EDIFICIOS[0]!.posicao[0] - 40, 30, EDIFICIOS[0]!.posicao[1]]} center style={{ pointerEvents: 'none' }} zIndexRange={[6, 0]}>
              <div className="rotulo rotulo-aviso">Viabilidade estrutural pendente</div>
            </Html>
          )}

          {hover && (
            <Tooltip
              selecao={hover.selecao}
              posicao={hover.selecao.tipo === 'edificio' ? [hover.ponto[0], 4 * ALTURA_NIVEL_ILUSTRATIVA + 10, hover.ponto[2]] : hover.ponto}
            />
          )}

          <OrbitControls makeDefault enableDamping={!reducedMotion} maxPolarAngle={Math.PI / 2.1} minDistance={30} maxDistance={1500} target={[0, 0, 0]} />
          <CameraRig pedido={camera} reducedMotion={reducedMotion} />
        </Canvas>
        <div ref={sobreposicao} className="sobreposicao" />
      </PortalContext.Provider>
    </div>
  );
}


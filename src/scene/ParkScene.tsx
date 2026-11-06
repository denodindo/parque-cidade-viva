import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { edificioPorId } from '../data/buildings';
import { setorPorId } from '../data/sectors';
import { SETOR_ESPORTE_GEOMETRIA, TERRENO } from '../data/terrain';
import { mesmaSelecao, type Selecao } from '../features/selection/selection';
import { centroid } from '../lib/geometry';
import { ALTURA_TOTAL_ILUSTRATIVA, BuildingFloors } from './BuildingFloors';
import { FlatPolygon } from './Terrain';

interface Props {
  selecao: Selecao | null;
  onSelecionar: (s: Selecao) => void;
  /** Incrementar para voltar à visão geral. */
  resetCamera: number;
  reducedMotion: boolean;
}

/** Câmera alinhada à orientação da imagem de referência (norte real não comprovado). */
const POSICAO_INICIAL: [number, number, number] = [0, 560, 430];

function Tooltip({ titulo, posicao }: { titulo: string; posicao: [number, number, number] }) {
  return (
    <Html position={posicao} center style={{ pointerEvents: 'none' }}>
      <div className="tooltip" role="tooltip">
        <strong>{titulo}</strong>
        <span>Custo: A calcular</span>
      </div>
    </Html>
  );
}

export function ParkScene({ selecao, onSelecionar, resetCamera, reducedMotion }: Props) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const [hover, setHover] = useState<Selecao | null>(null);

  useEffect(() => {
    if (resetCamera > 0) controls.current?.reset();
  }, [resetCamera]);

  const ginasio = edificioPorId('ginasio')!;
  const esporte = setorPorId('esporte')!;
  const posGinasio = centroid(SETOR_ESPORTE_GEOMETRIA.polygon);

  const handlers = (s: Selecao) => ({
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelecionar(s);
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHover(s);
    },
    onPointerOut: () => setHover((h) => (mesmaSelecao(h, s) ? null : h)),
  });

  const selGinasio: Selecao = { tipo: 'edificio', id: 'ginasio' };
  const selEsporte: Selecao = { tipo: 'setor', id: 'esporte' };
  const selTerreno: Selecao = { tipo: 'terreno', id: 'terreno' };

  return (
    <Canvas shadows camera={{ position: POSICAO_INICIAL, fov: 45, near: 1, far: 5000 }} aria-hidden="true">
      <color attach="background" args={['#dfe9ef']} />
      <hemisphereLight args={['#ffffff', '#6b7f5a', 0.9]} />
      <directionalLight position={[300, 500, 200]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-400} shadow-camera-right={400} shadow-camera-top={400} shadow-camera-bottom={-400} />

      <FlatPolygon poligono={TERRENO.poligono} cor="#9dbb84" altura={0} selecionado={mesmaSelecao(selecao, selTerreno)} destacado={mesmaSelecao(hover, selTerreno)} {...handlers(selTerreno)} />
      <FlatPolygon poligono={SETOR_ESPORTE_GEOMETRIA.polygon} cor={esporte.cor} altura={0.3} selecionado={mesmaSelecao(selecao, selEsporte)} destacado={mesmaSelecao(hover, selEsporte)} {...handlers(selEsporte)} />
      <BuildingFloors edificio={ginasio} posicao={posGinasio} selecionado={mesmaSelecao(selecao, selGinasio)} destacado={mesmaSelecao(hover, selGinasio)} {...handlers(selGinasio)} />

      {mesmaSelecao(hover, selGinasio) && <Tooltip titulo={ginasio.nome} posicao={[posGinasio[0], ALTURA_TOTAL_ILUSTRATIVA(ginasio.niveis.length) + 8, posGinasio[1]]} />}
      {mesmaSelecao(hover, selEsporte) && <Tooltip titulo={esporte.nome} posicao={[posGinasio[0] - 60, 6, posGinasio[1] + 10]} />}

      <OrbitControls ref={controls} makeDefault enableDamping={!reducedMotion} maxPolarAngle={Math.PI / 2.2} minDistance={60} maxDistance={1500} target={[0, 0, 0]} />
    </Canvas>
  );
}

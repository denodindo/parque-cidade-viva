import type { ThreeEvent } from '@react-three/fiber';
import type { Edificio } from '../data/buildings';

/** Dimensões PURAMENTE ilustrativas do volume (não são dimensões de projeto). */
const LARGURA_ILUSTRATIVA = 70;
const PROFUNDIDADE_ILUSTRATIVA = 45;
const ALTURA_NIVEL_ILUSTRATIVA = 6;

interface Props {
  edificio: Edificio;
  posicao: readonly [number, number];
  selecionado: boolean;
  destacado: boolean;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut: (e: ThreeEvent<PointerEvent>) => void;
}

const CORES_NIVEL = ['#e7e2d6', '#d7cfbd', '#e7e2d6', '#d7cfbd'];

export function BuildingFloors({ edificio, posicao, selecionado, destacado, onClick, onPointerOver, onPointerOut }: Props) {
  return (
    <group position={[posicao[0], 0, posicao[1]]} name={edificio.objeto_3d_id} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {edificio.niveis.map((n) => (
        <mesh key={n.id} position-y={ALTURA_NIVEL_ILUSTRATIVA * (n.ordem + 0.5)} castShadow receiveShadow>
          <boxGeometry args={[LARGURA_ILUSTRATIVA, ALTURA_NIVEL_ILUSTRATIVA * 0.94, PROFUNDIDADE_ILUSTRATIVA]} />
          <meshStandardMaterial
            color={CORES_NIVEL[n.ordem % CORES_NIVEL.length]}
            emissive={selecionado ? '#d9a441' : '#000000'}
            emissiveIntensity={selecionado ? 0.35 : destacado ? 0.15 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}

export const ALTURA_TOTAL_ILUSTRATIVA = (niveis: number) => niveis * ALTURA_NIVEL_ILUSTRATIVA;

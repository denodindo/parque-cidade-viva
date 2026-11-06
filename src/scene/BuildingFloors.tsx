import type { ThreeEvent } from '@react-three/fiber';
import type { Edificio } from '../data/buildings';

/** Altura por nível PURAMENTE ilustrativa (não é pé-direito de projeto). */
export const ALTURA_NIVEL_ILUSTRATIVA = 6;

interface Props {
  edificio: Edificio;
  corA: string;
  corB: string;
  selecionado: boolean;
  destacado: boolean;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut: (e: ThreeEvent<PointerEvent>) => void;
}

/** Volume empilhado por nível. Pavimentos explodidos/isolados ficam para o D3. */
export function BuildingFloors({ edificio, corA, corB, selecionado, destacado, onClick, onPointerOver, onPointerOut }: Props) {
  const { largura, profundidade } = edificio.planta_ilustrativa;
  return (
    <group position={[edificio.posicao[0], 0, edificio.posicao[1]]} name={edificio.objeto_3d_id} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {edificio.niveis.map((n) => (
        <mesh key={n.id} position-y={ALTURA_NIVEL_ILUSTRATIVA * (n.ordem + 0.5)} castShadow receiveShadow>
          <boxGeometry args={[largura, ALTURA_NIVEL_ILUSTRATIVA * 0.94, profundidade]} />
          <meshStandardMaterial
            color={n.ordem % 2 ? corB : corA}
            emissive={selecionado ? '#d9a441' : '#000000'}
            emissiveIntensity={selecionado ? 0.35 : destacado ? 0.15 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}

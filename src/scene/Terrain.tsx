import { useMemo } from 'react';
import { Shape } from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import type { Point } from '../lib/geometry';

/** Cria um Shape no plano XY a partir de (x, z); a malha é girada -90° em X. */
export function shapeFromPolygon(poly: readonly Point[]): Shape {
  const shape = new Shape();
  poly.forEach(([x, z], i) => (i === 0 ? shape.moveTo(x, -z) : shape.lineTo(x, -z)));
  shape.closePath();
  return shape;
}

interface Props {
  poligono: readonly Point[];
  cor: string;
  altura: number;
  selecionado: boolean;
  destacado: boolean;
  apagado?: boolean;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
}

export function FlatPolygon({ poligono, cor, altura, selecionado, destacado, apagado = false, onClick, onPointerOver, onPointerOut }: Props) {
  const shape = useMemo(() => shapeFromPolygon(poligono), [poligono]);
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={altura} receiveShadow onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial
        color={apagado ? '#c9cec9' : cor}
        emissive={selecionado ? '#ffffff' : '#000000'}
        emissiveIntensity={selecionado ? 0.22 : destacado ? 0.1 : 0}
      />
    </mesh>
  );
}

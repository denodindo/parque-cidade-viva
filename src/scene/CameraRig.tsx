import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { PedidoCamera } from '../app/store';

export const POSICAO_INICIAL: [number, number, number] = [0, 560, 430];
export const ALVO_INICIAL: [number, number, number] = [0, 0, 0];

interface ControlesOrbitais {
  target: Vector3;
  update: () => void;
  addEventListener: (t: string, f: () => void) => void;
  removeEventListener: (t: string, f: () => void) => void;
}

/**
 * Leva a câmera a um ponto pedido (visão geral, percurso de apresentação).
 * Com movimento reduzido, salta direto; se a pessoa arrastar, a transição para.
 */
export function CameraRig({ pedido, reducedMotion }: { pedido: PedidoCamera; reducedMotion: boolean }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as unknown as ControlesOrbitais | null;
  const destino = useRef<{ pos: Vector3; alvo: Vector3 } | null>(null);

  useEffect(() => {
    if (pedido.seq === 0) return;
    destino.current = { pos: new Vector3(...(pedido.posicao ?? POSICAO_INICIAL)), alvo: new Vector3(...(pedido.alvo ?? ALVO_INICIAL)) };
  }, [pedido]);

  useEffect(() => {
    if (!controls) return;
    const parar = () => (destino.current = null);
    controls.addEventListener('start', parar);
    return () => controls.removeEventListener('start', parar);
  }, [controls]);

  useFrame((_, dt) => {
    const d = destino.current;
    if (!d || !controls) return;
    if (reducedMotion) {
      camera.position.copy(d.pos);
      controls.target.copy(d.alvo);
    } else {
      const k = Math.min(1, dt * 3);
      camera.position.lerp(d.pos, k);
      controls.target.lerp(d.alvo, k);
    }
    controls.update();
    if (camera.position.distanceTo(d.pos) < 0.5 && controls.target.distanceTo(d.alvo) < 0.5) destino.current = null;
  });
  return null;
}

import { useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Group } from 'three';
import type { ModoEdificio } from '../app/store';
import type { Edificio } from '../data/buildings';
import { Interior } from './Interior';
import { usePortal } from './portal';

/** Altura por nível PURAMENTE ilustrativa (não é pé-direito de projeto). */
export const ALTURA_NIVEL_ILUSTRATIVA = 6;
/** Afastamento extra entre níveis no modo explodido. */
const AFASTAMENTO_EXPLODIDO = 16;

interface Props {
  edificio: Edificio;
  corA: string;
  corB: string;
  modo: ModoEdificio;
  nivelIsolado: number | null;
  selecionado: boolean;
  destacado: boolean;
  apagado: boolean;
  noite: boolean;
  reducedMotion: boolean;
  corModo: string | null;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
  onClickNivel: (ordem: number) => void;
  onPointerOver: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut: (e: ThreeEvent<PointerEvent>) => void;
}

export function alturaAlvo(ordem: number, modo: ModoEdificio): number {
  return ordem * (ALTURA_NIVEL_ILUSTRATIVA + (modo === 'explodido' ? AFASTAMENTO_EXPLODIDO : 0));
}

function Nivel(props: Props & { ordem: number; nome: string }) {
  const { edificio, ordem, modo, nivelIsolado, selecionado, destacado, apagado, noite, reducedMotion, corModo } = props;
  const ref = useRef<Group>(null);
  const portal = usePortal();
  const { largura, profundidade } = edificio.planta_ilustrativa;
  const H = ALTURA_NIVEL_ILUSTRATIVA;
  const aberto = modo !== 'fechado';
  const fantasma = nivelIsolado !== null && nivelIsolado !== ordem;
  const alvo = alturaAlvo(ordem, modo);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const y = g.position.y;
    if (reducedMotion || Math.abs(alvo - y) < 0.01) g.position.y = alvo;
    else g.position.y = y + (alvo - y) * Math.min(1, dt * 6);
  });

  const cor = apagado ? '#d3d7d3' : corModo ?? (ordem % 2 ? props.corB : props.corA);
  const emissivo = selecionado ? '#d9a441' : noite ? '#ffcc66' : '#000000';
  const intensidade = selecionado ? 0.35 : destacado ? 0.15 : noite ? 0.25 : 0;
  const opacidadeParede = fantasma ? 0.06 : modo === 'corte' ? 0.35 : 0.22;

  return (
    <group
      ref={ref}
      position-y={alvo}
      onClick={(e) => {
        if (selecionado && aberto) {
          e.stopPropagation();
          props.onClickNivel(ordem);
        }
      }}
    >
      {!aberto ? (
        <mesh position-y={H / 2} castShadow receiveShadow>
          <boxGeometry args={[largura, H * 0.94, profundidade]} />
          <meshStandardMaterial color={cor} emissive={emissivo} emissiveIntensity={intensidade} />
        </mesh>
      ) : (
        <>
          {/* laje */}
          <mesh position-y={0.3} receiveShadow castShadow={!fantasma}>
            <boxGeometry args={[largura, 0.6, profundidade]} />
            <meshStandardMaterial color={cor} emissive={emissivo} emissiveIntensity={intensidade} transparent opacity={fantasma ? 0.12 : 1} depthWrite={!fantasma} />
          </mesh>
          {/* paredes: no corte, só fundo e lado esquerdo */}
          {[
            { p: [0, H / 2, -profundidade / 2] as const, s: [largura, H, 0.4] as const, corte: true },
            { p: [-largura / 2, H / 2, 0] as const, s: [0.4, H, profundidade] as const, corte: true },
            { p: [0, H / 2, profundidade / 2] as const, s: [largura, H, 0.4] as const, corte: false },
            { p: [largura / 2, H / 2, 0] as const, s: [0.4, H, profundidade] as const, corte: false },
          ]
            .filter((w) => modo !== 'corte' || w.corte)
            .map((w, k) => (
              <mesh key={k} position={[...w.p]}>
                <boxGeometry args={[...w.s]} />
                <meshStandardMaterial color="#9fb3c8" transparent opacity={opacidadeParede} depthWrite={false} />
              </mesh>
            ))}
          {!fantasma && (
            <group position-y={0.6}>
              <Interior edificioId={edificio.id} ordem={ordem} />
            </group>
          )}
          {!fantasma && selecionado && (
            <Html portal={portal} position={[largura / 2 + 4, H / 2, profundidade / 2]} style={{ pointerEvents: 'none' }} zIndexRange={[6, 0]}>
              <div className="rotulo">{props.nome}</div>
            </Html>
          )}
        </>
      )}
    </group>
  );
}

/** Edifício por níveis: fechado, explodido (níveis afastados) ou corte (paredes frontais removidas). */
export function BuildingFloors(props: Props) {
  const { edificio, onClick, onPointerOver, onPointerOut } = props;
  return (
    <group position={[edificio.posicao[0], 0, edificio.posicao[1]]} name={edificio.objeto_3d_id} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {edificio.niveis.map((n) => (
        <Nivel key={n.id} {...props} ordem={n.ordem} nome={n.nome} />
      ))}
    </group>
  );
}

import type { ThreeEvent } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import type { Instalacao, TipoInstalacao } from '../data/facilities';

const COR: Record<TipoInstalacao, string> = {
  campo: '#3f9a52',
  quadra: '#4c7fb3',
  praca: '#d8cbb3',
  anfiteatro: '#c9b79a',
  playground: '#e48a5a',
  restaurante: '#f0e2c4',
  quiosque: '#f4c95d',
  sanitario: '#cfd8dc',
  coleta_seletiva: '#2f6fb0',
  horta: '#8a6a3f',
  viveiro_compostagem: '#9bb07a',
  orientacao_cidada: '#e9e0f2',
  jardim_sensorial: '#b6d38c',
  estacionamento: '#7d8487',
  apoio_operacional: '#dadada',
};

const LIXEIRAS = ['#2f6fb0', '#c94a3c', '#e2b93b', '#3f8f4f'];

interface Props {
  instalacao: Instalacao;
  selecionado: boolean;
  destacado: boolean;
  apagado: boolean;
  /** Cor imposta pelo modo de cor (custos/fases), ou null. */
  corModo: string | null;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut: (e: ThreeEvent<PointerEvent>) => void;
}

function Material({ cor, selecionado, destacado, apagado = false }: { cor: string; selecionado: boolean; destacado: boolean; apagado?: boolean }) {
  return (
    <meshStandardMaterial
      color={apagado ? '#d3d7d3' : cor}
      emissive={selecionado ? '#d9a441' : '#000000'}
      emissiveIntensity={selecionado ? 0.45 : destacado ? 0.2 : 0}
    />
  );
}

/** Geometria leve e ilustrativa de cada instalação. */
export function Facility({ instalacao: i, selecionado, destacado, apagado, corModo, ...handlers }: Props) {
  const cor = corModo ?? COR[i.tipo];
  const f = i.forma;
  return (
    <group name={i.id} {...handlers}>
      {i.posicoes.map(([x, z], k) => (
        <group key={k} position={[x, 0, z]}>
          {i.tipo === 'coleta_seletiva' ? (
            LIXEIRAS.map((c, n) => (
              <mesh key={c} position={[(n - 1.5) * 0.55, i.altura / 2, 0]} castShadow>
                <cylinderGeometry args={[0.25, 0.22, i.altura, 8]} />
                <Material cor={selecionado ? '#ffd166' : corModo ?? c} selecionado={selecionado} destacado={destacado} apagado={apagado} />
              </mesh>
            ))
          ) : f.tipo === 'retangulo' ? (
            <>
              <mesh position-y={i.altura / 2} castShadow={i.altura > 1} receiveShadow>
                <boxGeometry args={[f.largura, i.altura, f.profundidade]} />
                <Material cor={cor} selecionado={selecionado} destacado={destacado} apagado={apagado} />
              </mesh>
              {(i.tipo === 'campo' || i.tipo === 'quadra') && (
                <Line
                  points={[[-f.largura / 2 + 1, 0, -f.profundidade / 2 + 1], [f.largura / 2 - 1, 0, -f.profundidade / 2 + 1], [f.largura / 2 - 1, 0, f.profundidade / 2 - 1], [-f.largura / 2 + 1, 0, f.profundidade / 2 - 1], [-f.largura / 2 + 1, 0, -f.profundidade / 2 + 1], [0, 0, -f.profundidade / 2 + 1], [0, 0, f.profundidade / 2 - 1]]}
                  position-y={i.altura + 0.05}
                  color="#ffffff"
                  lineWidth={1.5}
                />
              )}
              {i.tipo === 'horta' &&
                [-12, -6, 0, 6, 12].map((dz) => (
                  <mesh key={dz} position={[0, i.altura + 0.3, dz]}>
                    <boxGeometry args={[f.largura - 6, 0.6, 2]} />
                    <meshStandardMaterial color="#5c9b4a" />
                  </mesh>
                ))}
              {i.tipo === 'quiosque' && (
                <mesh position-y={i.altura + 0.6}>
                  <coneGeometry args={[f.largura * 0.8, 1.6, 4]} />
                  <meshStandardMaterial color="#b5523b" />
                </mesh>
              )}
            </>
          ) : f.tipo === 'circulo' ? (
            <mesh position-y={i.altura / 2} receiveShadow>
              <cylinderGeometry args={[f.raio, f.raio, i.altura, 40]} />
              <Material cor={cor} selecionado={selecionado} destacado={destacado} apagado={apagado} />
            </mesh>
          ) : (
            // semicírculo em degraus (anfiteatro): degrau externo mais alto, palco ao centro
            [1, 0.75, 0.5].map((r, n) => (
              <mesh key={r} position-y={(i.altura * (3 - n)) / 6} rotation-y={Math.PI / 2} receiveShadow>
                <cylinderGeometry args={[f.raio * r, f.raio * r, (i.altura * (3 - n)) / 3, 32, 1, false, 0, Math.PI]} />
                <Material cor={n % 2 && !corModo ? '#bfae90' : cor} selecionado={selecionado} destacado={destacado} apagado={apagado} />
              </mesh>
            ))
          )}
        </group>
      ))}
    </group>
  );
}

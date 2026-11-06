import { Line } from '@react-three/drei';

/**
 * Mobiliário/arranjo INTERNO ilustrativo por nível, para leitura dos pavimentos.
 * Só a piscina de 25 m vem dos documentos (PM §4.1, "piscina de referência");
 * todas as demais dimensões são ilustrativas.
 */
type V3 = [number, number, number];

function Caixa({ p, s, cor }: { p: V3; s: V3; cor: string }) {
  return (
    <mesh position={[p[0], p[1] + s[1] / 2, p[2]]} castShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={cor} />
    </mesh>
  );
}

function Quadra({ x, z, w, d, cor }: { x: number; z: number; w: number; d: number; cor: string }) {
  const y = 0.12;
  return (
    <group position={[x, 0, z]}>
      <Caixa p={[0, 0, 0]} s={[w, 0.1, d]} cor={cor} />
      <Line points={[[-w / 2, y, -d / 2], [w / 2, y, -d / 2], [w / 2, y, d / 2], [-w / 2, y, d / 2], [-w / 2, y, -d / 2]]} color="#ffffff" lineWidth={1.2} />
      <Line points={[[0, y, -d / 2], [0, y, d / 2]]} color="#ffffff" lineWidth={1.2} />
    </group>
  );
}

function Grade({ nx, nz, dx, dz, s, cor, y = 0 }: { nx: number; nz: number; dx: number; dz: number; s: V3; cor: string; y?: number }) {
  const itens: V3[] = [];
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) itens.push([(i - (nx - 1) / 2) * dx, y, (j - (nz - 1) / 2) * dz]);
  return (
    <>
      {itens.map((p) => (
        <Caixa key={p.join(',')} p={p} s={s} cor={cor} />
      ))}
    </>
  );
}

export function Interior({ edificioId, ordem }: { edificioId: string; ordem: number }) {
  if (edificioId === 'ginasio') {
    switch (ordem) {
      case 0:
        return (
          <>
            {/* piscina de referência 25 m (comprimento informado; largura ilustrativa) */}
            <Caixa p={[-10, 0, -6]} s={[25, 0.15, 12.5]} cor="#3fa7d6" />
            <Caixa p={[16, 0, -8]} s={[10, 0.15, 6]} cor="#6cc3e6" />
            <Caixa p={[-25, 0, 14]} s={[12, 3, 8]} cor="#cfd8dc" />
            <Caixa p={[-8, 0, 16]} s={[12, 3, 6]} cor="#cfd8dc" />
            <Caixa p={[12, 0, 15]} s={[10, 3, 8]} cor="#b0bec5" />
            <Caixa p={[28, 0, 14]} s={[8, 3, 10]} cor="#90a4ae" />
          </>
        );
      case 1:
        return (
          <>
            <Quadra x={-17} z={-11} w={28} d={15} cor="#c98a4b" />
            <Quadra x={17} z={-11} w={28} d={15} cor="#c98a4b" />
            <Quadra x={0} z={10} w={40} d={20} cor="#4c7fb3" />
          </>
        );
      case 2:
        return (
          <>
            <Grade nx={6} nz={3} dx={6} dz={5} s={[2, 1.2, 1]} cor="#455a64" y={0} />
            <Caixa p={[22, 0, 10]} s={[18, 0.1, 14]} cor="#8d6e63" />
            <Caixa p={[-24, 0, 14]} s={[14, 3, 8]} cor="#cfd8dc" />
          </>
        );
      default:
        return (
          <>
            <Grade nx={3} nz={2} dx={8} dz={8} s={[2.7, 0.8, 1.5]} cor="#2e7d32" />
            <Grade nx={3} nz={1} dx={10} dz={1} s={[3, 0.8, 3]} cor="#a1887f" y={0} />
            <Caixa p={[24, 0, 12]} s={[12, 3, 10]} cor="#cfd8dc" />
          </>
        );
    }
  }
  // centro cultural
  switch (ordem) {
    case 0:
      return (
        <>
          <Caixa p={[0, 0, -15]} s={[16, 1, 6]} cor="#5d4037" />
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <Caixa key={r} p={[0, 0, -8 + r * 3]} s={[26 + r * 1.5, 0.4 + r * 0.35, 1.2]} cor="#b71c1c" />
          ))}
          <Caixa p={[19, 0, 12]} s={[8, 3, 10]} cor="#cfd8dc" />
        </>
      );
    case 1:
      return (
        <>
          <Grade nx={1} nz={5} dx={1} dz={4} s={[14, 2, 0.8]} cor="#795548" />
          <Grade nx={2} nz={2} dx={8} dz={8} s={[4, 0.8, 2]} cor="#d7ccc8" />
        </>
      );
    default:
      return (
        <>
          <Grade nx={5} nz={3} dx={6} dz={6} s={[2.5, 0.8, 1.2]} cor="#607d8b" />
          <Caixa p={[-20, 0, 12]} s={[8, 3, 10]} cor="#cfd8dc" />
        </>
      );
  }
}

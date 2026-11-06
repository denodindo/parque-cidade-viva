import { useLayoutEffect, useMemo, useRef } from 'react';
import { Matrix4, type InstancedMesh } from 'three';
import { EDIFICIOS } from '../data/buildings';
import { INSTALACOES, pegadas } from '../data/facilities';
import { CAMINHOS, GEOMETRIA_SETORES } from '../data/layout';
import { retangulo, type Point } from '../lib/geometry';
import { gerarArvores } from '../lib/vegetation';

/** Quantidades ilustrativas por setor (não é inventário arbóreo). */
export const DENSIDADE: Record<string, number> = { verde: 240, pracas: 14, infancia: 14, cultura: 8, inclusao: 10, esporte: 10, servicos: 6 };

/** Árvores por setor, geradas uma vez (determinísticas). */
export function useArvores(): Record<string, Point[]> {
  return useMemo(() => {
    const evitar = [
      ...INSTALACOES.flatMap(pegadas),
      ...EDIFICIOS.map((e) => retangulo(e.posicao[0], e.posicao[1], e.planta_ilustrativa.largura, e.planta_ilustrativa.profundidade)),
    ];
    const caminhos = CAMINHOS.map((c) => c.pontos);
    return Object.fromEntries(
      Object.entries(DENSIDADE).map(([id, quantidade], k) => [
        id,
        gerarArvores(GEOMETRIA_SETORES[id]!, { quantidade, semente: 1000 + k, evitar, caminhos, folga: 4, espacamento: 7 }),
      ]),
    );
  }, []);
}

interface Props {
  /** Fração das árvores exibidas (qualidade gráfica). */
  fracao: number;
  setoresVisiveis: (setorId: string) => boolean;
  sombras: boolean;
  noite: boolean;
}

/** Árvores instanciadas: 2 draw calls para todas as árvores. */
export function Vegetation({ fracao, setoresVisiveis, sombras, noite }: Props) {
  const porSetor = useArvores();
  const arvores = useMemo(
    () => Object.entries(porSetor).flatMap(([id, pts]) => (setoresVisiveis(id) ? pts.filter((_, i) => i < Math.ceil(pts.length * fracao)) : [])),
    [porSetor, fracao, setoresVisiveis],
  );
  const copas = useRef<InstancedMesh>(null);
  const troncos = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new Matrix4();
    arvores.forEach(([x, z], i) => {
      const s = 0.8 + ((i * 37) % 10) / 20;
      m.makeScale(s, s, s).setPosition(x, 7 * s, z);
      copas.current?.setMatrixAt(i, m);
      m.makeScale(1, 1, 1).setPosition(x, 1.5, z);
      troncos.current?.setMatrixAt(i, m);
    });
    if (copas.current) {
      copas.current.count = arvores.length;
      copas.current.instanceMatrix.needsUpdate = true;
    }
    if (troncos.current) {
      troncos.current.count = arvores.length;
      troncos.current.instanceMatrix.needsUpdate = true;
    }
  }, [arvores]);
  const max = Object.values(DENSIDADE).reduce((a, b) => a + b, 0);
  return (
    <group>
      <instancedMesh ref={copas} args={[undefined, undefined, max]} castShadow={sombras} raycast={() => null}>
        <coneGeometry args={[4, 9, 7]} />
        <meshStandardMaterial color={noite ? '#2c5530' : '#3f7a45'} />
      </instancedMesh>
      <instancedMesh ref={troncos} args={[undefined, undefined, max]} raycast={() => null}>
        <cylinderGeometry args={[0.5, 0.6, 3, 5]} />
        <meshStandardMaterial color="#6b4f35" />
      </instancedMesh>
    </group>
  );
}

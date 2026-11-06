import { useLayoutEffect, useMemo, useRef } from 'react';
import { Matrix4, type InstancedMesh } from 'three';
import { EDIFICIOS } from '../data/buildings';
import { INSTALACOES, pegadas } from '../data/facilities';
import { CAMINHOS, GEOMETRIA_SETORES } from '../data/layout';
import { retangulo, type Point } from '../lib/geometry';
import { gerarArvores } from '../lib/vegetation';

/** Quantidades ilustrativas por setor (não é inventário arbóreo). */
const DENSIDADE: Record<string, number> = { verde: 240, pracas: 14, infancia: 14, cultura: 8, inclusao: 10, esporte: 10, servicos: 6 };

export function useArvores(): Point[] {
  return useMemo(() => {
    const evitar = [
      ...INSTALACOES.flatMap(pegadas),
      ...EDIFICIOS.map((e) => retangulo(e.posicao[0], e.posicao[1], e.planta_ilustrativa.largura, e.planta_ilustrativa.profundidade)),
    ];
    const caminhos = CAMINHOS.map((c) => c.pontos);
    return Object.entries(DENSIDADE).flatMap(([id, quantidade], k) =>
      gerarArvores(GEOMETRIA_SETORES[id]!, { quantidade, semente: 1000 + k, evitar, caminhos, folga: 4, espacamento: 7 }),
    );
  }, []);
}

/** Árvores instanciadas: 2 draw calls para todas as árvores. */
export function Vegetation() {
  const arvores = useArvores();
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
    if (copas.current) copas.current.instanceMatrix.needsUpdate = true;
    if (troncos.current) troncos.current.instanceMatrix.needsUpdate = true;
  }, [arvores]);
  return (
    <group>
      <instancedMesh ref={copas} args={[undefined, undefined, arvores.length]} castShadow raycast={() => null}>
        <coneGeometry args={[4, 9, 7]} />
        <meshStandardMaterial color="#3f7a45" />
      </instancedMesh>
      <instancedMesh ref={troncos} args={[undefined, undefined, arvores.length]} raycast={() => null}>
        <cylinderGeometry args={[0.5, 0.6, 3, 5]} />
        <meshStandardMaterial color="#6b4f35" />
      </instancedMesh>
    </group>
  );
}

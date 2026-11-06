import { create } from 'zustand';
import type { Selecao } from '../features/selection/selection';

export type Aba = 'explorar' | 'orcamento' | 'programas' | 'apresentacao';
export type Qualidade = 'baixa' | 'media' | 'alta';
export type ModoCor = 'setores' | 'custos' | 'fases';
export type ModoEdificio = 'fechado' | 'explodido' | 'corte';

/** Camadas temáticas (PM §7.6). "Custos" e "fases" são modos de cor (ModoCor). */
export type Camada = 'verde' | 'esporte' | 'cultura' | 'infancia' | 'circulacao' | 'servicos' | 'inclusao' | 'sustentabilidade';

export const CAMADAS: readonly { id: Camada; nome: string }[] = [
  { id: 'verde', nome: 'Verde' },
  { id: 'esporte', nome: 'Esporte' },
  { id: 'cultura', nome: 'Cultura, educação e convivência' },
  { id: 'infancia', nome: 'Infância' },
  { id: 'circulacao', nome: 'Circulação' },
  { id: 'servicos', nome: 'Serviços' },
  { id: 'inclusao', nome: 'Inclusão' },
  { id: 'sustentabilidade', nome: 'Sustentabilidade' },
];

export interface PedidoCamera {
  /** Posição da câmera e ponto observado; `null` = visão geral. */
  posicao: [number, number, number] | null;
  alvo: [number, number, number] | null;
  /** Muda a cada pedido para disparar a transição. */
  seq: number;
}

interface Estado {
  selecao: Selecao | null;
  aba: Aba;
  modoEdificio: ModoEdificio;
  /** Nível isolado por edifício (ordem), ou null. */
  nivelIsolado: { edificioId: string; ordem: number } | null;
  camadas: Record<Camada, boolean>;
  modoCor: ModoCor;
  qualidade: Qualidade;
  noite: boolean;
  rotulos: boolean;
  camera: PedidoCamera;
  passo: number | null;
  selecionar: (s: Selecao | null) => void;
  setAba: (a: Aba) => void;
  setModoEdificio: (m: ModoEdificio) => void;
  isolarNivel: (n: { edificioId: string; ordem: number } | null) => void;
  alternarCamada: (c: Camada) => void;
  setModoCor: (m: ModoCor) => void;
  setQualidade: (q: Qualidade) => void;
  setNoite: (n: boolean) => void;
  setRotulos: (r: boolean) => void;
  moverCamera: (posicao: [number, number, number] | null, alvo: [number, number, number] | null) => void;
  setPasso: (p: number | null) => void;
}

const todasCamadas = (v: boolean) => Object.fromEntries(CAMADAS.map((c) => [c.id, v])) as Record<Camada, boolean>;

const larga = () => typeof window === 'undefined' || window.innerWidth >= 760;

export const useParque = create<Estado>((set) => ({
  selecao: null,
  aba: 'explorar',
  modoEdificio: 'fechado',
  nivelIsolado: null,
  camadas: todasCamadas(true),
  modoCor: 'setores',
  qualidade: larga() ? 'media' : 'baixa',
  noite: false,
  rotulos: larga(),
  camera: { posicao: null, alvo: null, seq: 0 },
  passo: null,
  selecionar: (s) =>
    set((e) => ({
      selecao: s,
      // mudar de edifício desfaz o isolamento de nível
      nivelIsolado: s?.tipo === 'edificio' && e.nivelIsolado?.edificioId === s.id ? e.nivelIsolado : null,
    })),
  setAba: (aba) => set({ aba }),
  setModoEdificio: (modoEdificio) => set({ modoEdificio }),
  isolarNivel: (nivelIsolado) => set((e) => ({ nivelIsolado, modoEdificio: nivelIsolado && e.modoEdificio === 'fechado' ? 'explodido' : e.modoEdificio })),
  alternarCamada: (c) => set((e) => ({ camadas: { ...e.camadas, [c]: !e.camadas[c] } })),
  setModoCor: (modoCor) => set({ modoCor }),
  setQualidade: (qualidade) => set({ qualidade }),
  setNoite: (noite) => set({ noite }),
  setRotulos: (rotulos) => set({ rotulos }),
  moverCamera: (posicao, alvo) => set((e) => ({ camera: { posicao, alvo, seq: e.camera.seq + 1 } })),
  setPasso: (passo) => set({ passo }),
}));

/** Estado inicial, para reiniciar entre testes. */
export const ESTADO_INICIAL = useParque.getState();

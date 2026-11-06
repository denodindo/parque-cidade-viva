import { createContext, useContext, type RefObject } from 'react';

/**
 * Camada DOM fixa para os rótulos <Html> do drei. Sem ela, o primeiro <Html>
 * da cena ficava vazio (ver DT-16 em docs/DECISOES_E_PENDENCIAS.md).
 */
export const PortalContext = createContext<RefObject<HTMLElement> | null>(null);

export function usePortal(): RefObject<HTMLElement> | undefined {
  return useContext(PortalContext) ?? undefined;
}

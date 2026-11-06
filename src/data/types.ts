/** Classificações obrigatórias de evidência (Prompt Mestre §1). */
export type StatusEvidencia = 'informado' | 'proposto' | 'hipotetico' | 'verificado' | 'pendente';

export const ROTULO_STATUS: Record<StatusEvidencia, string> = {
  informado: 'Informado nos documentos',
  proposto: 'Proposto (não aprovado)',
  hipotetico: 'Hipotético (não verificado)',
  verificado: 'Verificado',
  pendente: 'Pendente de estudo',
};

/** Referência a um trecho dos documentos-base. */
export interface Fonte {
  documento: 'estudo_v1' | 'estudo_v2' | 'prompt_mestre_v2_1' | 'relatorio_oportunidades' | 'imagem_referencia';
  secao: string;
}

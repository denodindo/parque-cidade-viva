import { edificioPorId } from '../data/buildings';
import { setorPorId } from '../data/sectors';
import { SETOR_ESPORTE_GEOMETRIA, TERRENO } from '../data/terrain';
import { ROTULO_STATUS, type Fonte } from '../data/types';
import type { Selecao } from '../features/selection/selection';
import { polygonArea } from '../lib/geometry';
import { CostSummary } from './CostSummary';

const NOME_DOC: Record<Fonte['documento'], string> = {
  estudo_v1: 'Estudo conceitual v1.0',
  estudo_v2: 'Estudo conceitual v2.0',
  prompt_mestre_v2_1: 'Prompt mestre v2.1',
  relatorio_oportunidades: 'Relatório de oportunidades',
  imagem_referencia: 'Imagem de referência',
};

const m2 = (v: number) => `${Math.round(v).toLocaleString('pt-BR')} m²`;

function Fontes({ fontes }: { fontes: Fonte[] }) {
  return (
    <p className="nota">
      Fonte: {fontes.map((f) => `${NOME_DOC[f.documento]} (${f.documento === 'imagem_referencia' ? f.secao : `§${f.secao}`})`).join('; ')} — 05/11/2026.
    </p>
  );
}

export function InfoPanel({ selecao, onFechar }: { selecao: Selecao | null; onFechar: () => void }) {
  if (!selecao) {
    return (
      <section className="painel" aria-live="polite">
        <p>Selecione um objeto na maquete ou na lista acima.</p>
      </section>
    );
  }

  let conteudo;
  if (selecao.tipo === 'edificio') {
    const e = edificioPorId(selecao.id)!;
    const setor = setorPorId(e.setor_id)!;
    conteudo = (
      <>
        <h2 id="painel-titulo">{e.nome}</h2>
        <dl className="ficha">
          <dt>Função</dt><dd>{e.funcao}</dd>
          <dt>Setor</dt><dd>{setor.nome}</dd>
          <dt>Núcleo</dt><dd>{e.nucleo}</dd>
          <dt>Estado</dt><dd>{ROTULO_STATUS[e.status]}</dd>
          <dt>Níveis</dt><dd>{e.niveis.length} (térreo + {e.niveis.length - 1} pavimentos)</dd>
          <dt>Projeção no solo</dt><dd>{e.projecao_no_solo_m2 === null ? 'A definir' : m2(e.projecao_no_solo_m2)}</dd>
          <dt>Área construída</dt><dd>{e.area_construida_total_m2 === null ? 'A definir' : m2(e.area_construida_total_m2)}</dd>
        </dl>
        {e.avisos.map((a) => <p key={a} className="aviso" role="note">⚠ {a}</p>)}
        <details>
          <summary>Programa por nível</summary>
          <ol className="niveis">
            {e.niveis.map((n) => (
              <li key={n.id}><strong>{n.nome}:</strong> {n.funcoes.join('; ')}.</li>
            ))}
          </ol>
        </details>
        <CostSummary objeto3dId={e.objeto_3d_id} />
        <h3>Pendências</h3>
        <ul>{e.pendencias.map((p) => <li key={p}>{p}</li>)}</ul>
        <p className="nota">Volume 3D ilustrativo: a forma e o tamanho na cena não são dimensões de projeto.</p>
        <Fontes fontes={e.fontes} />
      </>
    );
  } else if (selecao.tipo === 'setor') {
    const s = setorPorId(selecao.id)!;
    conteudo = (
      <>
        <h2 id="painel-titulo">{s.nome}</h2>
        <dl className="ficha">
          <dt>Área do setor</dt><dd>{m2(s.area_territorial_m2)} ({s.percentual}%) — hipotética</dd>
          <dt>Estado</dt><dd>{ROTULO_STATUS[s.status]}</dd>
          <dt>Posição na cena</dt><dd>Ilustrativa (área desenhada ≈ {m2(polygonArea(SETOR_ESPORTE_GEOMETRIA.polygon))} na escala normalizada)</dd>
        </dl>
        {s.observacao ? <p className="nota">{s.observacao}</p> : null}
        <p>Custo: <strong>A calcular</strong></p>
        <Fontes fontes={s.fontes} />
      </>
    );
  } else {
    conteudo = (
      <>
        <h2 id="painel-titulo">{TERRENO.nome}</h2>
        <dl className="ficha">
          <dt>Área de estudo</dt><dd>{m2(polygonArea(TERRENO.poligono))} — hipótese, não certificada</dd>
          <dt>Escala</dt><dd>{TERRENO.natureza_escala} ({TERRENO.fator_escala_m_por_px.toFixed(3)} m/px sobre a captura)</dd>
          <dt>Estado</dt><dd>{ROTULO_STATUS.hipotetico}</dd>
        </dl>
        <p className="aviso" role="note">⚠ Contorno lido visualmente da imagem de referência. Não é levantamento topográfico, cadastral nem georreferenciado; norte e escala reais não comprovados.</p>
      </>
    );
  }

  return (
    <section className="painel" aria-live="polite" aria-labelledby="painel-titulo">
      <button type="button" className="fechar" onClick={onFechar} aria-label="Fechar ficha">×</button>
      {conteudo}
    </section>
  );
}

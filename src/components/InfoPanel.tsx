import { EDIFICIOS, edificioPorId } from '../data/buildings';
import { ORCAMENTO } from '../data/budget';
import { INSTALACOES, instalacaoPorId, type Forma } from '../data/facilities';
import { GEOMETRIA_SETORES, TRILHA_HIPOTETICA } from '../data/layout';
import { NUCLEOS, nucleoPorId } from '../data/nucleos';
import { setorPorId } from '../data/sectors';
import { TERRENO } from '../data/terrain';
import { ROTULO_STATUS, type Fonte } from '../data/types';
import { useParque, type ModoEdificio } from '../app/store';
import { FASE_POR_OBJETO, fasePorId } from '../data/phases';
import { lancamentosDoObjeto } from '../lib/budget-calculator';
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
const nomesNucleos = (ids: string[]) => ids.map((id) => nucleoPorId(id)?.nome ?? id).join('; ');

function Fontes({ fontes }: { fontes: Fonte[] }) {
  return (
    <p className="nota">
      Fonte: {fontes.map((f) => `${NOME_DOC[f.documento]} (${f.documento === 'imagem_referencia' ? f.secao : `§${f.secao}`})`).join('; ')} — 05/11/2026.
    </p>
  );
}

function descreverForma(f: Forma): string {
  if (f.tipo === 'retangulo') return `${f.largura} × ${f.profundidade} m`;
  return `${f.tipo === 'circulo' ? 'círculo' : 'semicírculo'} de raio ${f.raio} m`;
}

function Pendencias({ itens }: { itens: string[] }) {
  return (
    <>
      <h3>Pendências</h3>
      <ul>{itens.map((p) => <li key={p}>{p}</li>)}</ul>
    </>
  );
}

const MODOS: { id: ModoEdificio; nome: string }[] = [
  { id: 'fechado', nome: 'Fechado' },
  { id: 'explodido', nome: 'Explodido' },
  { id: 'corte', nome: 'Corte' },
];

function Fase({ id }: { id: string }) {
  const f = FASE_POR_OBJETO[id];
  if (!f) return null;
  const fase = fasePorId(f);
  return (
    <>
      <dt>Fase física</dt>
      <dd>{fase.id} — {fase.nome} (proposta)</dd>
    </>
  );
}

/** Controles de pavimentos (D3). Funcionam também sem WebGL: a ficha destaca o nível. */
function ControlesPavimentos({ id }: { id: string }) {
  const e = edificioPorId(id)!;
  const modo = useParque((s) => s.modoEdificio);
  const setModo = useParque((s) => s.setModoEdificio);
  const isolado = useParque((s) => (s.nivelIsolado?.edificioId === id ? s.nivelIsolado.ordem : null));
  const isolar = useParque((s) => s.isolarNivel);
  return (
    <section aria-labelledby="pav-titulo" className="pavimentos">
      <h3 id="pav-titulo">Pavimentos</h3>
      <div className="segmentado" role="group" aria-label="Visualização do edifício">
        {MODOS.map((m) => (
          <button key={m.id} type="button" aria-pressed={modo === m.id} onClick={() => setModo(m.id)}>
            {m.nome}
          </button>
        ))}
      </div>
      <div className="segmentado" role="group" aria-label="Isolar nível">
        <button type="button" aria-pressed={isolado === null} onClick={() => isolar(null)}>Todos</button>
        {e.niveis.map((n) => (
          <button key={n.id} type="button" aria-pressed={isolado === n.ordem} onClick={() => isolar({ edificioId: id, ordem: n.ordem })}>
            {n.ordem === 0 ? 'Térreo' : `${n.ordem}º`}
          </button>
        ))}
      </div>
      <ol className="niveis">
        {e.niveis.map((n) => (
          <li key={n.id} className={isolado === n.ordem ? 'nivel-ativo' : isolado !== null ? 'nivel-inativo' : undefined} aria-current={isolado === n.ordem ? 'true' : undefined}>
            <strong>{n.nome}:</strong> {n.funcoes.join('; ')}.
          </li>
        ))}
      </ol>
      <p className="nota">Na maquete: clique em um pavimento do edifício aberto para isolá-lo. Arranjo interno ilustrativo.</p>
    </section>
  );
}

function FichaEdificio({ id }: { id: string }) {
  const e = edificioPorId(id)!;
  return (
    <>
      <h2 id="painel-titulo">{e.nome}</h2>
      <dl className="ficha">
        <dt>Função</dt><dd>{e.funcao}</dd>
        <dt>Setor</dt><dd>{setorPorId(e.setor_id)!.nome}</dd>
        <dt>Núcleos</dt><dd>{nomesNucleos(e.nucleos_ids)}</dd>
        <dt>Estado</dt><dd>{ROTULO_STATUS[e.status]}</dd>
        <dt>Níveis</dt><dd>{e.niveis.length} (térreo + {e.niveis.length - 1} pavimentos)</dd>
        <dt>Projeção no solo</dt><dd>{e.projecao_no_solo_m2 === null ? 'A definir' : m2(e.projecao_no_solo_m2)}</dd>
        <dt>Área construída</dt><dd>{e.area_construida_total_m2 === null ? 'A definir' : m2(e.area_construida_total_m2)}</dd>
        <Fase id={e.id} />
      </dl>
      {e.avisos.map((a) => <p key={a} className="aviso" role="note">⚠ {a}</p>)}
      <ControlesPavimentos id={e.id} />
      <CostSummary itens={lancamentosDoObjeto(ORCAMENTO, e.objeto_3d_id)} />
      <Pendencias itens={e.pendencias} />
      <p className="nota">Volume 3D ilustrativo: a forma e o tamanho na cena não são dimensões de projeto.</p>
      <Fontes fontes={e.fontes} />
    </>
  );
}

function FichaSetor({ id }: { id: string }) {
  const s = setorPorId(id)!;
  const nucleos = NUCLEOS.filter((n) => n.setores_ids.includes(id));
  const objetos = [...EDIFICIOS.filter((e) => e.setor_id === id).map((e) => e.nome), ...INSTALACOES.filter((i) => i.setor_id === id).map((i) => i.nome)];
  return (
    <>
      <h2 id="painel-titulo">{s.nome}</h2>
      <dl className="ficha">
        <dt>Área do setor</dt><dd>{m2(s.area_territorial_m2)} ({s.percentual}%) — {s.status === 'proposto' ? 'reserva proposta' : 'hipotética'}</dd>
        <dt>Estado</dt><dd>{ROTULO_STATUS[s.status]}</dd>
        <dt>Na cena</dt><dd>Posição ilustrativa; área desenhada ≈ {m2(polygonArea(GEOMETRIA_SETORES[id]!))} na escala normalizada</dd>
        <dt>Núcleos</dt><dd>{nucleos.length ? nucleos.map((n) => n.nome).join('; ') : '—'}</dd>
        <dt>Contém</dt><dd>{objetos.length ? objetos.join('; ') : '—'}</dd>
        <Fase id={id} />
      </dl>
      {s.observacao ? <p className="nota">{s.observacao}</p> : null}
      {id === 'circulacao' ? (
        <p className="nota">
          Regra de atribuição: esta faixa representa a área agregada da rede de circulação. Caminhos desenhados dentro de outros setores contam na área
          desses setores; nada é somado duas vezes.
        </p>
      ) : null}
      <p>Custo: <strong>A calcular</strong></p>
      <Fontes fontes={s.fontes} />
    </>
  );
}

function FichaInstalacao({ id }: { id: string }) {
  const i = instalacaoPorId(id)!;
  const lanc = ORCAMENTO.filter((l) => l.id === i.orcamento_id);
  return (
    <>
      <h2 id="painel-titulo">{i.nome}</h2>
      <dl className="ficha">
        <dt>Função</dt><dd>{i.descricao}</dd>
        <dt>Setor</dt><dd>{i.setor_id ? setorPorId(i.setor_id)!.nome : 'Distribuído pelo parque'}</dd>
        <dt>Núcleos</dt><dd>{nomesNucleos(i.nucleos_ids)}</dd>
        <dt>Estado</dt><dd>{ROTULO_STATUS[i.status]}</dd>
        <dt>Quantidade</dt><dd>{i.posicoes.length} {i.posicoes.length === 1 ? 'unidade' : 'pontos'} na maquete</dd>
        <dt>Na cena</dt><dd>{descreverForma(i.forma)} — dimensões ilustrativas, não de projeto</dd>
        <Fase id={i.id} />
      </dl>
      {i.tipo === 'coleta_seletiva' ? (
        <p className="aviso" role="note">⚠ Pontos estratégicos de coleta seletiva. A ideia de uma lixeira a cada 2 m foi descartada (estudo v1 §6.4).</p>
      ) : null}
      <CostSummary itens={lanc} agrupado />
      <Pendencias itens={i.pendencias} />
      <Fontes fontes={i.fontes} />
    </>
  );
}

function FichaTerreno() {
  return (
    <>
      <h2 id="painel-titulo">{TERRENO.nome}</h2>
      <dl className="ficha">
        <dt>Área de estudo</dt><dd>{m2(polygonArea(TERRENO.poligono))} — hipótese, não certificada</dd>
        <dt>Escala</dt><dd>{TERRENO.natureza_escala} ({TERRENO.fator_escala_m_por_px.toFixed(3)} m/px sobre a captura)</dd>
        <dt>Estado</dt><dd>{ROTULO_STATUS.hipotetico}</dd>
      </dl>
      <p className="aviso" role="note">⚠ Contorno lido visualmente da imagem de referência. Não é levantamento topográfico, cadastral nem georreferenciado; norte e escala reais não comprovados.</p>
      <p className="aviso" role="note">⚠ {TRILHA_HIPOTETICA.aviso}</p>
    </>
  );
}

export function InfoPanel() {
  const selecao = useParque((s) => s.selecao);
  const selecionar = useParque((s) => s.selecionar);
  const onFechar = () => selecionar(null);
  if (!selecao) {
    return (
      <section className="painel" aria-live="polite">
        <p>Selecione um objeto na maquete ou na lista abaixo.</p>
      </section>
    );
  }
  return (
    <section className="painel" aria-live="polite" aria-labelledby="painel-titulo">
      <button type="button" className="fechar" onClick={onFechar} aria-label="Fechar ficha">×</button>
      {selecao.tipo === 'edificio' && <FichaEdificio id={selecao.id} />}
      {selecao.tipo === 'setor' && <FichaSetor id={selecao.id} />}
      {selecao.tipo === 'instalacao' && <FichaInstalacao id={selecao.id} />}
      {selecao.tipo === 'terreno' && <FichaTerreno />}
    </section>
  );
}

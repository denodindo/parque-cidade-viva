import { useMemo, useState } from 'react';
import { useParque } from '../../app/store';
import { EDIFICIOS } from '../../data/buildings';
import { ORCAMENTO } from '../../data/budget';
import { SETORES, setorPorId } from '../../data/sectors';
import {
  formatarCusto,
  gerarCsv,
  idsComFilhos,
  resumoPorTipo,
  ROTULO_TIPO,
  subtotal,
  textoStatusCusto,
  type StatusCusto,
  type TipoCusto,
} from '../../lib/budget-calculator';
import { AVISO_ESTIMATIVA, EquipeOperacao, EstimativaItens, Financiamento, ResumoEstimativa } from './Estimativa';

type Vista = 'rastreavel' | 'itens' | 'equipe' | 'financiamento';
const VISTAS: { id: Vista; rotulo: string }[] = [
  { id: 'rastreavel', rotulo: 'Orçamento rastreável' },
  { id: 'itens', rotulo: 'Estimativa por item' },
  { id: 'equipe', rotulo: 'Equipe e operação' },
  { id: 'financiamento', rotulo: 'Financiamento' },
];

const TIPOS: TipoCusto[] = ['CAPEX', 'implantacao_programas', 'OPEX_anual', 'OPEX_mensal'];

function baixar(nome: string, conteudo: string) {
  // BOM para o Excel reconhecer UTF-8
  const blob = new Blob(['﻿' + conteudo], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Painel de orçamento (D4): sem valores inventados, com cobertura e CAPEX/OPEX separados. */
export function BudgetPanel() {
  const selecionar = useParque((s) => s.selecionar);
  const setAba = useParque((s) => s.setAba);
  const [tipo, setTipo] = useState<TipoCusto | 'todos'>('todos');
  const [setor, setSetor] = useState<string>('todos');
  const [status, setStatus] = useState<StatusCusto | 'todos'>('todos');
  const [busca, setBusca] = useState('');
  const [vista, setVista] = useState<Vista>('rastreavel');
  const pais = idsComFilhos(ORCAMENTO);

  const filtrados = useMemo(
    () =>
      ORCAMENTO.filter(
        (l) =>
          (tipo === 'todos' || l.tipo === tipo) &&
          (setor === 'todos' || (setor === 'parque' ? l.setor_id === null : l.setor_id === setor)) &&
          (status === 'todos' || l.status === status) &&
          (busca.trim() === '' || `${l.id} ${l.nome}`.toLowerCase().includes(busca.trim().toLowerCase())),
      ),
    [tipo, setor, status, busca],
  );

  const abrirObjeto = (objeto: string | null) => {
    const e = EDIFICIOS.find((x) => x.objeto_3d_id === objeto);
    if (!e) return;
    selecionar({ tipo: 'edificio', id: e.id });
    setAba('explorar');
  };

  return (
    <section aria-labelledby="orc-titulo" className="painel-aba">
      <h2 id="orc-titulo">Orçamento conceitual</h2>
      <ResumoEstimativa />
      <p className="nota" role="note">{AVISO_ESTIMATIVA}</p>
      <div className="subvistas" role="group" aria-label="Visão do orçamento">
        {VISTAS.map((v) => (
          <button key={v.id} type="button" className="botao" aria-pressed={vista === v.id} onClick={() => setVista(v.id)}>
            {v.rotulo}
          </button>
        ))}
      </div>

      {vista === 'itens' && <EstimativaItens />}
      {vista === 'equipe' && <EquipeOperacao />}
      {vista === 'financiamento' && <Financiamento />}
      {vista === 'rastreavel' && (
      <>
      <p className="aviso" role="note">
        ⚠ Orçamento rastreável sem total: nenhum lançamento tem quantitativo, preço, fonte e data-base. Valores ausentes aparecem como “A cotar/A calcular”,
        nunca como R$ 0. CAPEX e OPEX não se somam.
      </p>

      <div className="cartoes">
        {TIPOS.map((t) => {
          const r = resumoPorTipo(ORCAMENTO, t);
          const n = r.folhas_com_valor + r.folhas_pendentes;
          if (n === 0) return null;
          return (
            <div key={t} className="cartao" data-testid={`resumo-${t}`}>
              <strong>{ROTULO_TIPO[t]}</strong>
              <span>
                Total parcial: {r.folhas_com_valor === 0 ? <em>sem itens com dados</em> : formatarCusto(r.total_parcial_brl)}
              </span>
              <span>
                Cobertura: {r.folhas_com_valor} de {n} itens ({Math.round((r.cobertura ?? 0) * 100)}%)
              </span>
              <span>{r.completo ? 'Completo' : `${r.folhas_pendentes} pendente(s)`}</span>
            </div>
          );
        })}
      </div>

      <fieldset className="filtros">
        <legend>Filtros</legend>
        <label>
          Tipo
          <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoCusto | 'todos')}>
            <option value="todos">Todos</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>{ROTULO_TIPO[t]}</option>
            ))}
          </select>
        </label>
        <label>
          Setor
          <select value={setor} onChange={(e) => setSetor(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="parque">Parque todo</option>
            {SETORES.map((s) => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as StatusCusto | 'todos')}>
            <option value="todos">Todos</option>
            {(['a_cotar', 'a_calcular', 'sem_referencia', 'estimado', 'cotado', 'verificado'] as StatusCusto[]).map((s) => (
              <option key={s} value={s}>{textoStatusCusto(s)}</option>
            ))}
          </select>
        </label>
        <label>
          Buscar
          <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="código ou item" />
        </label>
      </fieldset>

      <p className="nota" aria-live="polite">{filtrados.length} lançamento(s) exibido(s).</p>
      <div className="tabela-rolagem">
        <table className="tabela-custo">
          <thead>
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Item</th>
              <th scope="col">Tipo</th>
              <th scope="col">Setor</th>
              <th scope="col">Valor</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((l) => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>
                  {l.objeto_3d_id ? (
                    <button type="button" className="link" onClick={() => abrirObjeto(l.objeto_3d_id)}>{l.nome}</button>
                  ) : (
                    l.nome
                  )}
                  {l.parent_id ? <span className="nota"> (compõe {l.parent_id})</span> : null}
                  {pais.has(l.id) ? <span className="nota"> (pai: soma dos filhos, não entra de novo)</span> : null}
                </td>
                <td>{l.tipo === 'CAPEX' ? 'CAPEX' : l.tipo === 'implantacao_programas' ? 'Programas' : 'OPEX'}</td>
                <td>{l.setor_id ? setorPorId(l.setor_id)?.rotulo : 'Parque todo'}</td>
                <td data-testid={`orc-${l.id}`}>{formatarCusto(subtotal(l).valor)}</td>
                <td>{textoStatusCusto(l.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button type="button" className="botao" onClick={() => baixar('parque-cidade-viva-orcamento.csv', gerarCsv(filtrados, new Date().toISOString().slice(0, 10)))}>
        Exportar CSV ({filtrados.length})
      </button>
      <p className="nota">
        Fontes previstas: SINAPI-SP (com competência e composição), tabelas públicas aplicáveis ou cotação documentada. BDI, encargos e contingência
        dependem do regime e da memória de cálculo. As faixas da estimativa não entram aqui: só valores com fonte e data-base.
      </p>
      </>
      )}
    </section>
  );
}

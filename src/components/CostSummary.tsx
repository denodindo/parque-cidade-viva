import { ORCAMENTO } from '../data/budget';
import { formatarCusto, idsComFilhos, subtotal, textoStatusCusto, type LancamentoOrcamento } from '../lib/budget-calculator';

interface Props {
  itens: LancamentoOrcamento[];
  /** Lançamento agrupado: cobre outros objetos além do selecionado. */
  agrupado?: boolean;
}

/** Custos rastreados. Sem dado → "A calcular", nunca R$ 0. */
export function CostSummary({ itens, agrupado = false }: Props) {
  const pais = idsComFilhos(ORCAMENTO);
  if (itens.length === 0) return <p>Sem lançamento orçamentário vinculado.</p>;
  const pendentes = itens.filter((i) => !pais.has(i.id) && subtotal(i).valor === null).length;
  return (
    <section aria-labelledby="custo-titulo">
      <h3 id="custo-titulo">Custo (CAPEX)</h3>
      <table className="tabela-custo">
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Item</th>
            <th scope="col">Valor</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((i) => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>
                {i.nome}
                {i.parent_id ? <span className="nota"> (compõe {i.parent_id})</span> : null}
              </td>
              <td data-testid={`custo-${i.id}`}>{formatarCusto(subtotal(i).valor)}</td>
              <td>{textoStatusCusto(i.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="nota">
        {agrupado
          ? 'Lançamento agrupado: cobre também outras instalações; não há custo individual deste objeto.'
          : <>Total do objeto: <strong>A calcular</strong> — {pendentes} lançamento(s) sem quantitativo, preço, fonte e data-base.</>}{' '}
        Fonte prevista: SINAPI-SP ou cotação documentada.
      </p>
    </section>
  );
}

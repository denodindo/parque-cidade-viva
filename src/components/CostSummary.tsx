import { ORCAMENTO } from '../data/budget';
import { formatarCusto, idsComFilhos, lancamentosDoObjeto, subtotal, textoStatusCusto } from '../lib/budget-calculator';

/** Custos rastreados de um objeto 3D. Sem dado → "A calcular", nunca R$ 0. */
export function CostSummary({ objeto3dId }: { objeto3dId: string }) {
  const itens = lancamentosDoObjeto(ORCAMENTO, objeto3dId);
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
        Total do objeto: <strong>A calcular</strong> — {pendentes} lançamento(s) sem quantitativo, preço, fonte e data-base. Fonte prevista:
        SINAPI-SP ou cotação documentada.
      </p>
    </section>
  );
}

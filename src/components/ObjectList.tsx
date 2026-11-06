import { setorPorId } from '../data/sectors';
import { useParque } from '../app/store';
import { GRUPOS_SELECIONAVEIS, mesmaSelecao } from '../features/selection/selection';

/** Lista acessível + legenda: setores mostram cor E nome/área (não depende só de cor). */
export function ObjectList() {
  const selecao = useParque((s) => s.selecao);
  const onSelecionar = useParque((s) => s.selecionar);
  return (
    <nav aria-label="Objetos da maquete">
      <h2 className="secao-titulo">Objetos da maquete</h2>
      {GRUPOS_SELECIONAVEIS.map((g) => (
        <details key={g.titulo} className="grupo" open={g.titulo !== 'Instalações'}>
          <summary>
            {g.titulo} <span className="nota">({g.itens.length})</span>
          </summary>
          <ul className="lista-objetos">
            {g.itens.map((item) => {
              const ativo = mesmaSelecao(selecao, item.selecao);
              const setor = item.selecao.tipo === 'setor' ? setorPorId(item.selecao.id) : undefined;
              return (
                <li key={`${item.selecao.tipo}-${item.selecao.id}`}>
                  <button type="button" aria-pressed={ativo} className={ativo ? 'ativo' : undefined} onClick={() => onSelecionar(item.selecao)}>
                    {setor ? <span className="amostra" style={{ background: setor.cor }} aria-hidden="true" /> : null}
                    <span>{item.rotulo}</span>
                    {setor ? <span className="nota area">{setor.area_territorial_m2.toLocaleString('pt-BR')} m²</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </details>
      ))}
    </nav>
  );
}

import { ITENS_SELECIONAVEIS, mesmaSelecao, type Selecao } from '../features/selection/selection';

interface Props {
  selecao: Selecao | null;
  onSelecionar: (s: Selecao) => void;
}

export function ObjectList({ selecao, onSelecionar }: Props) {
  return (
    <nav aria-label="Objetos da maquete">
      <h2 className="secao-titulo">Objetos da maquete</h2>
      <ul className="lista-objetos">
        {ITENS_SELECIONAVEIS.map((item) => {
          const ativo = mesmaSelecao(selecao, item.selecao);
          return (
            <li key={`${item.selecao.tipo}-${item.selecao.id}`}>
              <button type="button" aria-pressed={ativo} className={ativo ? 'ativo' : undefined} onClick={() => onSelecionar(item.selecao)}>
                {item.rotulo}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

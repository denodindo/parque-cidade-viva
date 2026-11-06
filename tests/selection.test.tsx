import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { App } from '../src/app/App';
import { ESTADO_INICIAL, useParque } from '../src/app/store';

beforeEach(() => useParque.setState(ESTADO_INICIAL, true));
afterEach(cleanup);

describe('seleção sem WebGL (lista acessível)', () => {
  it('mostra alternativa textual e o selo de escala não certificada', () => {
    render(<App webgl={false} />);
    expect(screen.getByText(/Visualização 3D indisponível/)).toBeTruthy();
    expect(screen.getByText('Geometria conceitual — escala não certificada')).toBeTruthy();
  });

  it('selecionar o ginásio abre a ficha com 4 níveis, aviso e custo "A calcular"', () => {
    render(<App webgl={false} />);
    const botao = screen.getByRole('button', { name: 'Ginásio multifuncional' });
    fireEvent.click(botao);
    expect(botao.getAttribute('aria-pressed')).toBe('true');
    const painel = screen.getByRole('heading', { level: 2, name: 'Ginásio multifuncional' }).closest('section')!;
    const p = within(painel);
    expect(p.getByText(/4 \(térreo \+ 3 pavimentos\)/)).toBeTruthy();
    expect(p.getByText(/sujeito a estudo estrutural/)).toBeTruthy();
    expect(p.getByTestId('custo-GIN-001').textContent).toBe('A calcular');
    expect(p.getByTestId('estimativa-objeto-ginasio-multifuncional').textContent).toBe('R$ 33 mi a R$ 70 mi');
    expect(painel.textContent).not.toMatch(/R\$\s*0/);
  });

  it('Escape fecha a ficha', () => {
    render(<App webgl={false} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ginásio multifuncional' }));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.getByText(/Selecione um objeto na maquete ou na lista abaixo/)).toBeTruthy();
  });

  it('setor e terreno também abrem fichas com status hipotético', () => {
    render(<App webgl={false} />);
    fireEvent.click(screen.getByRole('button', { name: /^Esporte e atividades físicas/ }));
    expect(screen.getByText(/20\.000 m² \(20%\) — hipotética/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Terreno de estudo/ }));
    expect(screen.getByText(/hipótese, não certificada/)).toBeTruthy();
  });

  it('lista os 8 setores com área (legenda não depende só de cor) e todos abrem ficha', () => {
    render(<App webgl={false} />);
    const nomes = ['Parque verde', 'Esporte', 'Praças', 'Centro cultural e educacional', 'Playgrounds', 'Circulação', 'Estacionamento', 'Inclusão'];
    for (const n of nomes) {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${n}.* m²$`) }));
      expect(screen.getByRole('heading', { level: 2, name: new RegExp(`^${n}`) })).toBeTruthy();
    }
    expect(screen.getByText(/5\.000 m² \(5%\) — reserva proposta/)).toBeTruthy();
  });

  it('instalações abrem ficha com custo agrupado "A calcular", núcleos e fase', () => {
    render(<App webgl={false} />);
    fireEvent.click(screen.getByRole('button', { name: 'Restaurante principal' }));
    expect(screen.getByTestId('custo-ALI-001').textContent).toBe('A calcular');
    expect(screen.getByText('Alimentação e economia local')).toBeTruthy();
    expect(screen.getByText(/F3 — Centro integrado/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Pontos de coleta seletiva' }));
    expect(screen.getByText(/lixeira a cada 2 m foi descartada/)).toBeTruthy();
    expect(screen.getByText('Distribuído pelo parque')).toBeTruthy();
  });
});

describe('pavimentos (D3)', () => {
  it('centro cultural tem 3 níveis e o seletor isola um nível sem WebGL', () => {
    render(<App webgl={false} />);
    fireEvent.click(screen.getByRole('button', { name: 'Centro cultural e educacional' }));
    expect(screen.getByText(/3 \(térreo \+ 2 pavimentos\)/)).toBeTruthy();
    const isolar = screen.getByRole('group', { name: 'Isolar nível' });
    expect(within(isolar).getAllByRole('button').map((b) => b.textContent)).toEqual(['Todos', 'Térreo', '1º', '2º']);
    fireEvent.click(within(isolar).getByRole('button', { name: '1º' }));
    const ativo = document.querySelector('[aria-current="true"]')!;
    expect(ativo.textContent).toMatch(/Biblioteca/);
    expect(useParque.getState().modoEdificio).toBe('explodido');
  });

  it('ginásio: modos fechado/explodido/corte e 4 níveis no seletor', () => {
    render(<App webgl={false} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ginásio multifuncional' }));
    const modos = screen.getByRole('group', { name: 'Visualização do edifício' });
    fireEvent.click(within(modos).getByRole('button', { name: 'Corte' }));
    expect(within(modos).getByRole('button', { name: 'Corte' }).getAttribute('aria-pressed')).toBe('true');
    expect(within(screen.getByRole('group', { name: 'Isolar nível' })).getAllByRole('button')).toHaveLength(5);
    fireEvent.click(screen.getByRole('button', { name: '2º' }));
    expect(document.querySelector('[aria-current="true"]')!.textContent).toMatch(/Musculação/);
  });
});

describe('abas: orçamento, programas e apresentação', () => {
  it('orçamento mostra cobertura 0%, nunca R$ 0, e filtra OPEX', () => {
    render(<App webgl={false} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Orçamento' }));
    const capex = screen.getByTestId('resumo-CAPEX');
    expect(capex.textContent).toMatch(/sem itens com dados/);
    expect(capex.textContent).toMatch(/\(0%\)/);
    expect(document.body.textContent).not.toMatch(/R\$\s*0,00/);
    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'OPEX_anual' } });
    const linhas = screen.getAllByTestId(/^orc-/).map((e) => e.getAttribute('data-testid'));
    expect(linhas.length).toBeGreaterThan(0);
    expect(linhas.every((id) => id!.startsWith('orc-OPX-'))).toBe(true);
    expect(screen.getByRole('button', { name: /Exportar CSV/ })).toBeTruthy();
  });

  it('orçamento mostra a estimativa em faixas, equipe e financiamento, separados do rastreável', () => {
    render(<App webgl={false} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Orçamento' }));
    expect(screen.getByTestId('estimativa-capex').textContent).toBe('R$ 79 mi a R$ 184 mi');
    expect(screen.getByTestId('estimativa-opex').textContent).toBe('R$ 7,9 mi a R$ 23 mi');
    expect(screen.getByTestId('estimativa-contas').textContent).toBe('R$ 76 mil a R$ 336 mil');
    fireEvent.click(screen.getByRole('button', { name: 'Estimativa por item' }));
    expect(screen.getByTestId('est-GIN-001').textContent).toBe('R$ 31 mi a R$ 63 mi');
    expect(screen.queryByRole('button', { name: /Exportar CSV/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Equipe e operação' }));
    expect(screen.getByText(/Professores de educação física/)).toBeTruthy();
    expect(screen.getByTestId('conta-energia').textContent).toMatch(/^R\$ \d+ mil a R\$ \d+ mil$/);
    expect(screen.getByTestId('conta-agua')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Materiais' }));
    expect(screen.getByText('Cimento CP II')).toBeTruthy();
    expect(screen.getByTestId('mat-total').textContent).toBe('R$ 6,1 mi a R$ 15 mi');
    fireEvent.click(screen.getByRole('button', { name: 'Financiamento' }));
    expect(screen.getByText('Ministério do Esporte')).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/R\$\s*0,00/);
  });

  it('programas: fichas propostas com limites e oportunidades como referência', () => {
    render(<App webgl={false} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Programas' }));
    expect(screen.getByText('Educa Povão')).toBeTruthy();
    expect(screen.getByText(/não é Centro POP/)).toBeTruthy();
    expect(screen.getByText(/não recursos para o parque/)).toBeTruthy();
    fireEvent.click(screen.getAllByRole('button', { name: 'Ponto de Orientação Cidadã' })[0]!);
    expect(useParque.getState().aba).toBe('explorar');
    expect(screen.getByRole('heading', { level: 2, name: 'Ponto de Orientação Cidadã' })).toBeTruthy();
  });

  it('apresentação percorre os passos por botão e teclado, e sai', () => {
    render(<App webgl={false} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Apresentar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar apresentação' }));
    expect(screen.getByText(/Passo 1 de 13/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Próximo →' }));
    expect(screen.getByText(/Passo 2 de 13/)).toBeTruthy();
    expect(useParque.getState().selecao).toEqual({ tipo: 'terreno', id: 'terreno' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText(/Passo 5 de 13/)).toBeTruthy();
    expect(useParque.getState().modoEdificio).toBe('explodido');
    for (let i = 0; i < 6; i++) fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByRole('heading', { name: /Implantação física por fases/ })).toBeTruthy();
    expect(useParque.getState().modoCor).toBe('fases');
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('Crítico')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));
    expect(screen.getByRole('button', { name: 'Iniciar apresentação' })).toBeTruthy();
    expect(useParque.getState().modoCor).toBe('setores');
  });
});

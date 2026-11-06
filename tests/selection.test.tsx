import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { App } from '../src/app/App';

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
    expect(painel.textContent).not.toMatch(/R\$\s*0/);
  });

  it('Escape fecha a ficha', () => {
    render(<App webgl={false} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ginásio multifuncional' }));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.getByText(/Selecione um objeto/)).toBeTruthy();
  });

  it('setor e terreno também abrem fichas com status hipotético', () => {
    render(<App webgl={false} />);
    fireEvent.click(screen.getByRole('button', { name: /Setor: Esporte/ }));
    expect(screen.getByText(/20\.000 m² \(20%\) — hipotética/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Terreno de estudo/ }));
    expect(screen.getByText(/hipótese, não certificada/)).toBeTruthy();
  });
});

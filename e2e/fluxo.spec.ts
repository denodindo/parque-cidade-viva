import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

test.describe('fluxo principal da maquete', () => {
  test('abrir, trocar setor, selecionar edifício, abrir pavimento, ver "A calcular", apresentar e exportar CSV', async ({ page }) => {
    const erros: string[] = [];
    page.on('pageerror', (e) => erros.push(e.message));
    page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Parque Cidade Viva', level: 1 })).toBeVisible();
    await expect(page.getByText('Geometria conceitual — escala não certificada')).toBeVisible();
    await expect(page.locator('canvas')).toBeVisible({ timeout: 20_000 });

    // trocar setor
    await page.getByRole('button', { name: /^Praças, eventos e anfiteatro/ }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Praças, eventos e anfiteatro' })).toBeVisible();

    // selecionar edifício e abrir pavimento
    await page.getByRole('button', { name: 'Ginásio multifuncional', exact: true }).click();
    await page.getByRole('group', { name: 'Isolar nível' }).getByRole('button', { name: '1º' }).click();
    await expect(page.locator('[aria-current="true"]')).toContainText('quadras de basquete');
    await expect(page.getByTestId('custo-GIN-001')).toHaveText('A calcular');
    await expect(page.locator('body')).not.toContainText('R$ 0,00');

    // clique direto na cena (ginásio visto de cima) mantém a seleção sem erro
    await page.getByRole('button', { name: 'Visão geral' }).click();

    // apresentação
    await page.getByRole('tab', { name: 'Apresentar' }).click();
    await page.getByRole('button', { name: 'Iniciar apresentação' }).click();
    await expect(page.getByText('Passo 1 de 13')).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByText('Passo 2 de 13')).toBeVisible();
    await page.getByRole('button', { name: 'Sair' }).click();

    // exportar CSV
    await page.getByRole('tab', { name: 'Orçamento' }).click();
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Exportar CSV/ }).click()]);
    expect(download.suggestedFilename()).toBe('parque-cidade-viva-orcamento.csv');
    const csv = readFileSync((await download.path())!, 'utf8');
    expect(csv).toContain('NÃO significam zero');
    expect(csv).toMatch(/GIN-001;Ginásio — construção civil;CAPEX;esporte/);

    expect(erros).toEqual([]);
  });

  test('clique no canvas seleciona o ginásio', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 820 });
    await page.goto('/');
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 20_000 });
    await page.waitForTimeout(2000);
    const box = (await canvas.boundingBox())!;
    await page.mouse.click(box.x + box.width * 0.56, box.y + box.height * 0.68);
    await expect(page.locator('#painel-titulo')).toHaveText('Ginásio multifuncional');
  });

  test('celular: sem rolagem horizontal e fichas acessíveis', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('canvas')).toBeVisible({ timeout: 20_000 });
    const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    expect(sw).toBeLessThanOrEqual(iw);
    await page.getByRole('button', { name: 'Centro cultural e educacional', exact: true }).click();
    await expect(page.getByText(/3 \(térreo \+ 2 pavimentos\)/)).toBeVisible();
  });
});

import AxeBuilder from '@axe-core/playwright';

test.describe('acessibilidade automática (axe)', () => {
  for (const [aba, vista] of [['Explorar'], ['Orçamento'], ['Orçamento', 'Estimativa por item'], ['Orçamento', 'Equipe e operação'], ['Orçamento', 'Financiamento'], ['Programas'], ['Apresentar']] as [string, string?][]) {
    test(`sem violações sérias na aba ${aba}${vista ? ` (${vista})` : ''}`, async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('canvas')).toBeVisible({ timeout: 20_000 });
      await page.getByRole('tab', { name: aba }).click();
      if (aba === 'Explorar') await page.getByRole('button', { name: 'Ginásio multifuncional', exact: true }).click();
      if (vista) await page.getByRole('button', { name: vista, exact: true }).click();
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).exclude('canvas').analyze();
      const graves = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(graves.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
    });
  }
});

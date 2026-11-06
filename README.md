# Parque Cidade Viva — maquete digital conceitual 3D

Projeto acadêmico SENAC. **Não** é BIM, projeto executivo, levantamento georreferenciado, orçamento oficial nem gêmeo digital. A área de 100.000 m², o contorno do terreno, custos e capacidades são **hipóteses ou pendências**.

Leia primeiro `CLAUDE.md` e `Parque_Cidade_Viva_Prompt_Mestre_REVISADO.md`. Documentação de trabalho em `docs/`.

## Situação

**Versão 1.0.0 — etapas D0 a D8 concluídas** (ver `CHANGELOG.md`, `docs/TEST_REPORT.md` e `docs/LIMITES.md`).

O que dá para fazer:

- **Explorar**: girar, aproximar e clicar em setores, edifícios e instalações; abrir fichas com função, núcleo, estado, fase física, custo e pendências. Tudo também pela lista acessível (teclado).
- **Pavimentos**: no ginásio (4 níveis) e no centro cultural (3), alternar fechado / explodido / corte e isolar um nível.
- **Camadas e exibição** (botão sobre a maquete): ligar/desligar camadas temáticas, colorir por situação do custo ou por fase física, modo noite, rótulos e qualidade gráfica.
- **Orçamento**: estrutura completa, filtros, cobertura e exportação CSV (abre no Excel).
- **Programas**: 15 programas sociais propostos e oportunidades de editais como referência.
- **Apresentar**: percurso guiado em 13 passos para a banca do SENAC (setas ← → do teclado).

## Como rodar

Requer Node.js 20.19 ou superior.

```bash
npm ci
```

```bash
npm run dev
```

Outros scripts: `npm run build`, `npm run typecheck`, `npm run test`, `npm run lint` e `npm run e2e` (testes no navegador com Playwright; requer o Chromium do Playwright instalado).

## App desktop (executável)

O mesmo app roda como programa de computador (Electron), offline:

```bash
npm run desktop
```

Gerar os instaladores (saem em `release/`, que não vai para o Git):

```bash
npm run dist:desktop
```

- Windows: `ParqueCidadeViva-<versão>-windows-portatil.exe` (abre direto, sem instalar) e `...-windows-x64.zip`.
- Linux: `ParqueCidadeViva-<versão>-linux-x86_64.AppImage` (dar permissão de execução e abrir).
- Os executáveis não são assinados digitalmente: o Windows pode mostrar o aviso do SmartScreen ("Mais informações" → "Executar assim mesmo").
- Em computadores sem placa de vídeo compatível, o 3D usa renderização por software (mais lenta); use "Qualidade: baixa".

## Site

`npm run build` gera um site estático em `dist/`, com caminhos relativos: pode ser publicado em qualquer hospedagem estática (inclusive numa subpasta).

## Estrutura

```text
src/data/        dados-semente (setores, edifícios, orçamento, terreno)
src/lib/         geometria, cálculo orçamentário, validação, detecção de WebGL
src/scene/       cena 3D (React Three Fiber)
src/components/  lista de objetos, ficha, custos, controles da cena
src/features/    orçamento, programas sociais, apresentação, seleção
src/app/         App e estado compartilhado (Zustand)
e2e/             testes ponta a ponta (Playwright + axe)
tests/           Vitest
docs/            requisitos, premissas, decisões, plano, backlog, relatório de testes
referencias/     imagens de referência (não são planta cadastral)
modelos/         arquivos .blend e .glb (Git LFS)
```

## Editar dados

- Áreas dos setores: `src/data/sectors.ts` (a soma precisa dar 100.000 m²; o teste falha se não der).
- Disposição dos setores: `FAIXAS_IMPLANTACAO` em `src/data/layout.ts` (os polígonos são recalculados automaticamente).
- Instalações: `src/data/facilities.ts`. Os testes verificam se cada instalação cabe no seu setor e não se sobrepõe a outra.
- Contorno do terreno: `CONTORNO_REFERENCIA_PX` em `src/data/terrain.ts`. Troque por levantamento técnico quando existir.
- Custos: `src/data/budget.ts`. Deixe `null` quando não houver quantidade, preço, **fonte** e data-base. Nunca use 0 para "sem dado".

## Arquivos 3D (`.blend` e `.glb`)

Versionados com [Git LFS](https://git-lfs.com) (`.gitattributes`), com travamento para evitar edição simultânea.

- `modelos/blend/`: arquivos de trabalho do Blender
- `modelos/glb/`: modelos exportados

Primeira vez (uma vez por computador):

```bash
git lfs install
```

Antes de editar um modelo:

```bash
git pull
```

```bash
git lfs lock modelos/blend/nome-do-arquivo.blend
```

Depois do commit e push:

```bash
git lfs unlock modelos/blend/nome-do-arquivo.blend
```

Ver travas ativas:

```bash
git lfs locks
```

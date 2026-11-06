# Parque Cidade Viva — maquete digital conceitual 3D

Projeto acadêmico SENAC. **Não** é BIM, projeto executivo, levantamento georreferenciado, orçamento oficial nem gêmeo digital. A área de 100.000 m², o contorno do terreno, custos e capacidades são **hipóteses ou pendências**.

Leia primeiro `CLAUDE.md` e `Parque_Cidade_Viva_Prompt_Mestre_REVISADO.md`. Documentação de trabalho em `docs/`.

## Situação

- **D0** (diagnóstico), **D1** (vertical slice) e **D2** (implantação geral: 8 setores, 10 núcleos, instalações) concluídas. Ver `docs/TEST_REPORT.md`.
- D3 a D8 aguardam validação do D2.

## Como rodar

Requer Node.js 20.19 ou superior.

```bash
npm ci
```

```bash
npm run dev
```

Outros scripts: `npm run build`, `npm run typecheck`, `npm run test`, `npm run lint`.

## Estrutura

```text
src/data/        dados-semente (setores, edifícios, orçamento, terreno)
src/lib/         geometria, cálculo orçamentário, validação, detecção de WebGL
src/scene/       cena 3D (React Three Fiber)
src/components/  lista de objetos, ficha, custos
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

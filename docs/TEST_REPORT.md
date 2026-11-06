# Relatório de testes

## D2 — 06/11/2026

Mesmo ambiente do D1 (Node v22.23.4, npm 10.9.9, Chromium do Playwright com WebGL por SwiftShader).

### Comandos executados e resultados reais

| Comando | Resultado |
|---|---|
| `npm ci` | OK |
| `npm run typecheck` | Código de saída 0 |
| `npm run lint` | Código de saída 0, sem avisos |
| `npm run test` | **5 arquivos, 35 testes, 35 aprovados** |
| `npm run build` | Código de saída 0. Aviso mantido: `ParkScene` com 970 kB (258 kB gzip) |
| `npx vite preview` + script Playwright | Cena renderizou; cliques, teclado e celular verificados (abaixo); **nenhum erro** no console |

### Novos testes (D2)

- `tests/layout.test.ts` (8): validação geométrica completa (`validarImplantacao()` sem erros: área de cada setor, setores dentro do terreno, instalações e edifícios dentro do seu setor, nenhuma sobreposição, coletores ≥ 15 m, caminhos dentro do terreno); cada setor uma vez no layout; **amostragem de mais de 5.000 pontos: cada ponto do terreno pertence a exatamente um setor**; 10 núcleos ligados a objetos e sem área; catálogo 1 campo / 2 quadras / 1 restaurante / 3 quiosques / ≥ 3 sanitários; coleta em pontos estratégicos; trilha hipotética fora do terreno com aviso; nada `verificado`.
- `tests/selection.test.tsx` (+3): os 8 setores abrem ficha pela lista com área (inclusão como "reserva proposta"); instalações mostram custo agrupado "A calcular", núcleos e aviso da coleta seletiva; centro cultural com 3 níveis.
- `tests/geometry.test.ts`: recorte por eixo, divisão por área e ponto em polígono convexo.

### Inspeção visual (navegador headless)

- `docs/capturas/d2-visao-geral.png`: 8 setores coloridos com bordas e rótulos, caminhos, ≈ 300 árvores instanciadas, ginásio, centro cultural, campo, quadras, praça, anfiteatro, horta, estacionamento e trilha tracejada com rótulo "Trilha hipotética — pendente".
- `docs/capturas/d2-selecao.png`: clique no campo abre a ficha; tooltip "Custo: A calcular (lançamento agrupado ESP-001)".
- Cliques no canvas selecionaram corretamente **ginásio**, **restaurante** e **campo society** (títulos do painel conferidos pelo script).
- Teclado: foco no botão "Ginásio multifuncional" + Enter abriu a ficha; `Escape` fechou.
- `docs/capturas/d2-celular.png` (iPhone 13 emulado): sem rolagem horizontal (390 = 390 px); rótulos desligados por padrão.
- Defeito encontrado e corrigido: o primeiro rótulo HTML do drei ficava vazio (ver DT-16).

### Não verificado / limitações

- Toque e leitor de tela em dispositivo real: não testados.
- Arrasto/zoom da câmera não exercitados por script.
- Contraste não medido por ferramenta.
- Teste E2E continua fora do repositório (script local).

### Próximo passo

Validação humana do D2. Depois, D3 (pavimentos explodidos/isolados do ginásio e do centro cultural).

---


## D0 + D1 — 06/11/2026 (histórico)

Ambiente: contêiner Linux, Node v22.23.4, npm 10.9.9, Chromium do Playwright pré-instalado (WebGL por SwiftShader, em software).

### Comandos executados e resultados reais

| Comando | Resultado |
|---|---|
| `sha256sum -c` (manifesto do pacote) | 10/10 arquivos OK |
| `npm install --save-exact …` | Lockfile gerado; dependências com versões fixas |
| `rm -rf node_modules && npm ci` | OK (instalação limpa a partir do `package-lock.json`) |
| `npm run typecheck` | Código de saída 0, sem erros |
| `npm run lint` | Código de saída 0, sem avisos |
| `npm run test` | **4 arquivos, 24 testes, 24 aprovados** |
| `npm run build` | Código de saída 0. Aviso: bloco `ParkScene` com 944 kB (251 kB gzip) > 500 kB |
| `npm run dev` | Servidor respondeu HTTP 200 em `http://localhost:5173/` |
| `npx vite preview` + script Playwright (Chromium headless) | Cena 3D renderizou; clique e hover verificados (abaixo) |

### Testes automatizados (Vitest)

- `tests/geometry.test.ts` (9): área/centroide, auto-interseção, polígono degenerado, normalização, bisseção; terreno simples e convexo, área normalizada = 100.000 m², rótulo de escala, setor de esporte = 20.000 m² dentro do terreno.
- `tests/data.test.ts` (6): validação cruzada sem erros; soma 100.000 m²/100%; original 95.000 m² + reserva proposta; nada `verificado`; ginásio 4 níveis e centro cultural 3; aviso de viabilidade e áreas `null`.
- `tests/budget.test.ts` (5): `null` ≠ R$ 0; sementes sem preço; subtotal exige dados e fonte; pai/filho sem dupla contagem; OPEX fora do CAPEX e cobertura parcial.
- `tests/selection.test.tsx` (4, jsdom, sem WebGL): alternativa textual e selo; seleção do ginásio pela lista abre ficha com 4 níveis, aviso e "A calcular" (sem "R$ 0"); `Escape` fecha; setor e terreno abrem fichas hipotéticas.

### Inspeção visual (feita de verdade, em navegador headless)

- `docs/capturas/d1-visao-geral.png`: terreno na mesma orientação da imagem de referência, setor de esporte na faixa inferior, ginásio com 4 faixas de nível, selo "Geometria conceitual — escala não certificada" e botão "Visão geral".
- `docs/capturas/d1-selecao.png`: hover mostra o tooltip "Ginásio multifuncional / Custo: A calcular"; **clique no canvas** selecionou o ginásio (título do painel confirmado pelo script), com ficha, aviso de viabilidade e tabela GIN-001/AQU-001 "A calcular / A cotar".
- Console do navegador: só avisos do Three.js (`THREE.Clock` obsoleto; `PCFSoftShadowMap` → `PCFShadowMap`). Nenhum erro.

### Não verificado / limitações

- Toque (touch) em dispositivo real e leitor de tela real: **não testados**.
- O botão "Visão geral" e o arrasto da órbita não foram exercitados por script; só inspecionados no código.
- Layout em celular (< 760 px): CSS responsivo escrito, mas **sem captura** nesta etapa.
- Não há teste E2E no projeto ainda (previsto no backlog); a verificação visual usou um script local fora do repositório.
- Contraste não foi medido por ferramenta.

### Próximo passo

Validação humana do D1. Só então iniciar o D2 (ver `docs/BACKLOG.md`).

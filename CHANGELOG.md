# Changelog

## 1.0.0 — estimativas e financiamento

- Estimativa de ordem de grandeza (nov/2026) no app e no site: resumo na aba Orçamento (implantação, operação por ano, equipe), visões por item, equipe e operação e financiamento, faixa nas fichas e no percurso de apresentação.
- Orçamento rastreável inalterado: preços continuam "A calcular" até haver fonte e data-base.
- Contas essenciais (luz, água e esgoto, gás, internet, telefone, coleta) por consumo × tarifa e materiais de consumo no custo de operação, que passou a R$ 7,9 mi a R$ 23 mi por ano.
- Visão "Materiais": preços de referência de 2026 e quantidades dos principais materiais da obra (parte do custo de implantação).
- Anexo em Word com memória de cálculo e fontes (`docs/Parque_Cidade_Viva_Estimativas_e_Financiamento.docx`).

## 1.0.0 — empacotamento

- App desktop com Electron: executável portátil e `.zip` para Windows, AppImage para Linux (`npm run dist:desktop`).
- Build com caminhos relativos (`base: './'`), usado tanto pelo app desktop quanto pelo site.
- Renderização 3D por software como reserva no app desktop quando a GPU não estiver disponível.

## 1.0.0 — 06/11/2026

Entrega das etapas D0–D8 da maquete digital conceitual.

- **D0** — Inventário dos anexos (hashes conferidos), requisitos, premissas, 11 divergências documentais registradas, plano e backlog.
- **D1** — App Vite + React + TypeScript + React Three Fiber; terreno ilustrativo normalizado; câmera orbital; seleção por clique e lista acessível; custo "A calcular"; fallback sem WebGL.
- **D2** — 8 setores sem sobreposição (100.000 m² hipotéticos), 10 núcleos, 21 instalações, caminhos, ~300 árvores instanciadas, trilha hipotética, coleta seletiva em pontos estratégicos.
- **D3** — Ginásio (4 níveis) e centro cultural (3): fechado, explodido, corte e isolamento de nível, com interiores ilustrativos e aviso de viabilidade.
- **D4** — Orçamento com a estrutura do estudo v1 §10.2 + OPEX, CAPEX/OPEX separados, filtros, cobertura e exportação CSV protegida.
- **D5** — 15 programas sociais propostos com limites, indicadores e espaços; oportunidades de editais como referência.
- **D6** — Percurso de apresentação em 13 passos com riscos, benefícios e fases físicas F0–F4.
- **D7** — Qualidade baixa/média/alta, modo noite com postes, camadas temáticas, cores por custo e por fase, bundle dividido.
- **D8** — 46 testes unitários, 7 E2E (incluindo axe), auditoria de textos, relatório de limites.
- Git LFS para `.glb` e `.blend` com travamento.

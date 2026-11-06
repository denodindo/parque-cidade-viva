# Requisitos (D0)

Natureza: **maquete digital conceitual 3D** para projeto acadêmico SENAC. Não é BIM, projeto executivo, levantamento georreferenciado, licenciamento, orçamento oficial nem gêmeo digital conectado a operação real.

Legenda de origem: **PM** = prompt mestre v2.1; **V1** = estudo conceitual v1.0; **V2** = estudo v2.0; **CL** = `CLAUDE.md`.

## RF — Requisitos funcionais

| ID | Requisito | Origem | Etapa |
|---|---|---|---|
| RF-01 | Visão aérea/orbital com zoom e retorno à visão geral | PM §7.1 | **D1 ✅** |
| RF-02 | Terreno irregular ilustrativo, título e placa "Geometria conceitual — escala não certificada" | PM §7.2 | **D1 ✅** |
| RF-03 | Seleção por clique, toque e teclado; lista acessível de objetos; hover apenas como melhoria | PM §7.3 | **D1 ✅** (3 objetos) |
| RF-04 | Painel do elemento: nome, função, setor, núcleo, nível, estado, área/quantidade, custo ou "A calcular", fonte/data, pendências | PM §7.5 | **D1 ✅** (ginásio, setor esporte, terreno) |
| RF-05 | Oito setores territorializados, sem sobreposição, somando 100.000 m² hipotéticos | PM §2, §10 D2 | D2 (dados prontos em D1) |
| RF-06 | Dez núcleos funcionais com relação `nucleo_id → setor_id`, sem alterar a soma territorial | PM §3 | D2 |
| RF-07 | Quadras, campo, praças, caminhos, vegetação, sanitários, restaurante e 3 quiosques | PM §4.3 | D2 |
| RF-08 | Ginásio em 4 níveis e centro cultural em 3; explodir/isolar pavimentos; corte simplificado; aviso de viabilidade | PM §4.1–4.2, §7.4 | D3 (dados prontos em D1) |
| RF-09 | Camadas: verde, esporte, cultura/educação, infância, circulação, serviços, inclusão, sustentabilidade, custos, fases físicas | PM §7.6 | D2/D4/D6 |
| RF-10 | Orçamento interativo: CAPEX/OPEX separados, filtros, cobertura, exportação CSV protegida contra fórmulas | PM §8 | D4 (núcleo do cálculo em D1) |
| RF-11 | Fichas de programas sociais com `id`, `eixo`, `espacos_ids`, `equipe_pendente`, `indicadores_propostos`, `capacidade_hipotetica`, `status`… | PM §6 | D5 |
| RF-12 | Percurso SENAC (modo apresentação): roteiro, riscos (§13), benefícios, fases físicas F0–F4 | PM §7.9, §11, §13 | D6 |
| RF-13 | Trilha/conexão ecológica exibida tracejada/opcional com aviso | PM §5 | D2 |
| RF-14 | Coletores seletivos em pontos estratégicos — **nunca** a cada 2 m | PM §5, V1 §6.4, CL | D2/D7 |
| RF-15 | Estética progressiva (vegetação animada, água, dia/noite, pessoas estilizadas) | PM §7.10 | D7 |

## RNF — Requisitos não funcionais

| ID | Requisito | Origem | Situação em D1 |
|---|---|---|---|
| RNF-01 | Funcionar localmente, sem API paga, sem autenticação, sem banco remoto, sem dados pessoais | PM §9, CL | ✅ |
| RNF-02 | Vite + React + TypeScript + Three.js/R3F/Drei; versões fixadas com `package-lock.json`; `npm ci` funcional | PM §9, §12 | ✅ |
| RNF-03 | Scripts reais `dev`, `build`, `typecheck`, `test`, `lint` | PM §12 | ✅ |
| RNF-04 | Acessibilidade: foco visível, teclado, contraste, alternativa textual, `prefers-reduced-motion`, não depender só de cor | PM §7.11 | Parcial (ver TEST_REPORT) |
| RNF-05 | Fallback quando WebGL falhar | PM §7.12 | ✅ (detecção + limite de erro) |
| RNF-06 | Desempenho: presets de qualidade, instanciamento, carga sob demanda | PM §7.12 | Cena carregada sob demanda (lazy); demais em D7 |
| RNF-07 | Dados separados da interface, IDs estáveis e únicos, referências cruzadas válidas | PM §9 | ✅ (`validarDados()` testado) |

## RD — Regras de dados (validadas por teste automatizado)

| ID | Regra | Teste |
|---|---|---|
| RD-01 | `sum(areas) === 100000` e `sum(percentuais) === 100` só no cenário de estudo | `tests/data.test.ts` |
| RD-02 | 5.000 m² de inclusão/horta = reserva **proposta**; imagem original = 95.000 m² | `tests/data.test.ts` |
| RD-03 | Ginásio = exatamente 4 níveis; centro cultural = exatamente 3 | `tests/data.test.ts` |
| RD-04 | `null` nunca vira R$ 0; subtotal só com quantidade, unitário, unidade e fonte válidos | `tests/budget.test.ts` |
| RD-05 | Pai e filho não são somados duas vezes (somente folhas) | `tests/budget.test.ts` |
| RD-06 | OPEX não entra no CAPEX; total sempre "parcial" com cobertura | `tests/budget.test.ts` |
| RD-07 | Terreno fecha, não se auto-intersecta e, normalizado, é rotulado como escala conceitual | `tests/geometry.test.ts` |
| RD-08 | Distinguir `area_territorial_m2`, `projecao_no_solo_m2`, `area_construida_total_m2`, `area_pavimento_m2` | Modelo de dados (D1 parcial) |
| RD-09 | 1 campo, 2 quadras externas, 1 restaurante, 3 quiosques no catálogo | D2 |
| RD-10 | Nenhum texto declara parceria, vaga, licença ou financiamento como confirmados | D5/D6 (revisão de textos) |

## Limites inegociáveis (CL, PM §6)

O parque não se apresenta como certificador de EJA, serviço clínico, Centro POP, abrigo ou órgão de benefícios; não promete ingresso universitário, emprego, atendimento especializado ou recursos de editais; não gamifica vulnerabilidade social; não armazena dados pessoais.

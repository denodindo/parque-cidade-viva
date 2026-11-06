# Relatório de limites (D8)

O que este aplicativo **é**: uma maquete digital conceitual 3D para apresentação acadêmica (SENAC) do Parque Cidade Viva, com dados rastreáveis e incertezas visíveis.

O que **não é**: BIM, projeto executivo, levantamento topográfico ou georreferenciado, licenciamento, orçamento oficial, garantia de financiamento ou "gêmeo digital" ligado a um parque real.

## Dados

| Tema | Situação |
|---|---|
| Área de 100.000 m² | Hipótese. Contorno lido de captura de mapa e reescalado ("escala visual normalizada"). Norte e escala reais não comprovados. |
| Setores | Áreas do quadro de estudo; posição de cada setor é proposta ilustrativa. Os 5.000 m² de inclusão/horta são reserva proposta. |
| Edifícios e instalações | Volumes e dimensões ilustrativos. Projeção, área construída e lotação: "a definir". Auditório de 300 lugares é meta, não capacidade licenciada. |
| Quadras elevadas do ginásio | Viabilidade estrutural, acústica, de segurança e de operação pendente (aviso visível). |
| Trilha / conexão ecológica | Hipotética (tracejada), condicionada a titularidade e licenciamento. |
| Orçamento | 30 lançamentos, **nenhum com valor**: sem quantitativo, preço, fonte e data-base. Não existe "custo total do parque". |
| Programas sociais | 15 propostas. Nenhuma parceria, vaga, capacidade ou resultado confirmado. |
| Editais | Referência do relatório de 05/11/2026; valores de programas inteiros; prazos a reconferir; nenhuma inscrição feita. |
| Fases físicas | Atribuição proposta (F1–F4), sem meses nem custos. |
| Riscos | Classificação qualitativa proposta, não laudo. |

## Software

- Funciona localmente, sem API paga, sem login, sem banco remoto e sem coletar dados pessoais.
- Sem WebGL, a cena é substituída por descrição textual; fichas, pavimentos, orçamento, programas e apresentação continuam funcionando.
- Não implementados (opcionais): câmera humana, água/vegetação animadas, pessoas estilizadas, XLSX/PDF, edição de custos.
- Rótulos dos setores se sobrepõem em telas estreitas (desligados por padrão no celular).
- Verificações automatizadas não substituem teste com usuários reais, incluindo pessoas com deficiência.

## Para substituir hipóteses por dados reais

1. Contorno: `CONTORNO_REFERENCIA_PX` em `src/data/terrain.ts` (ou trocar por coordenadas de levantamento e remover a normalização).
2. Áreas e disposição: `src/data/sectors.ts` e `FAIXAS_IMPLANTACAO` em `src/data/layout.ts`.
3. Custos: `src/data/budget.ts` — preencher `quantidade`, `custo_unitario_brl`, `fonte` e `data_base` juntos; os testes recusam valor sem fonte.
4. Rodar `npm run test` e `npm run e2e`: as validações apontam sobreposições, áreas que não fecham e referências quebradas.

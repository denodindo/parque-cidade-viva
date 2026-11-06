# Decisões e pendências

Regra: em divergência entre documentos, registrar aqui, mostrar a origem e adotar a interpretação **conservadora** (PM §1).

## Divergências entre documentos

| # | Divergência | Origem | Decisão adotada |
|---|---|---|---|
| DV-01 | O quadro original soma 95.000 m², mas declara 100.000 m² | `distribuicao_original.jpeg` × V1 §3 | Reserva proposta de 5.000 m² para inclusão/horta; soma verificada por teste |
| DV-02 | V1 §4 fala em "oito núcleos" (iguais aos setores); V2 §4 e PM §3 em "dez núcleos funcionais" | V1 × V2/PM | Setores (8, territoriais) e núcleos (10, funcionais) são entidades distintas; núcleo referencia setor sem somar área (D2) |
| DV-03 | Piscina "semiolímpica de 25 m" (V1 §5.1, V2 §5.1) × "piscina de referência 25 m" (PM §4.1) | V1/V2 × PM | Redação do PM: 25 m de referência; dimensões, raias e profundidade a definir |
| DV-04 | Piscina menor "de iniciação/terapia" (V1) × "de iniciação" (PM) | V1 × PM | "Iniciação"; uso terapêutico só com profissionais e pactuação (pendência) |
| DV-05 | 3º pavimento do ginásio: V1 sem tênis de mesa; V2 com tênis de mesa e e-sports educativos; PM com tênis de mesa e salas multiuso | V1 × V2 × PM | Programa do PM; e-sports educativos ficam como opção da V2, não modelada |
| DV-06 | Fases físicas: V1 §13 tem 6 fases (0–5) com equipamentos principais antes dos espaços externos; V2 §15 e PM §11 têm F0–F4 com "parque essencial" primeiro | V1 × V2/PM | F0–F4 do PM (garante OPEX antes de equipamentos complexos). Fases físicas não definem a ordem do software |
| DV-07 | Nomes de programas: "Esporte para Todos", "Primeira Oportunidade", "Comunidade Ativa" (V1) × "Movimento para Todos", "Estação de Oportunidades" etc. (V2) | V1 × V2 | Seguir a tabela do PM §6 em D5; nomes da V2 marcados como propostas de programação |
| DV-08 | Restaurante com café, almoço e jantar (V1 §6.2) × "sem presumir operação completa desde o primeiro dia" (V2 §9) | V1 × V2 | Conservador (V2): horários a definir por demanda |
| DV-09 | Exportação CSV/XLSX/PDF (V1 §11.1) × CSV local (PM §7.7) | V1 × PM | CSV local no MVP (D4); XLSX/PDF no backlog |
| DV-10 | Stack V1 inclui Framer Motion, Tailwind, Zustand, Recharts e "banco de dados conforme escopo"; PM pede o mínimo e nada remoto | V1 × PM | D1 usa só React, R3F e Drei; demais bibliotecas apenas quando uma etapa exigir |
| DV-11 | V1 §11.1: tooltip de custo no hover; PM §7.3: hover é só melhoria, clique/teclado obrigatórios | V1 × PM | Ambos: seleção por clique e lista acessível; tooltip no hover como complemento |

## Decisões técnicas (D1)

| # | Decisão | Motivo |
|---|---|---|
| DT-01 | Terreno = quadrilátero convexo lido da imagem, normalizado para 100.000 m² e rotulado "escala visual normalizada" | PM §2: não extrair medidas exatas da captura |
| DT-02 | Setor de esporte recortado por bisseção (faixa z ≥ zCut) até 20.000 m² | Mostra um setor coerente com os dados sem sobrepor áreas |
| DT-03 | Lista acessível é a forma principal de seleção; a cena 3D tem `aria-hidden` | Garante seleção por teclado e leitores de tela sem depender do WebGL |
| DT-04 | Cena carregada sob demanda (`React.lazy`) e envolvida por limite de erro → alternativa textual | Fallback quando WebGL falha; página nunca fica em branco |
| DT-05 | Sem Zustand em D1: estado local em `App` | Só há um estado compartilhado simples; evitar dependência sem uso (PM §9) |
| DT-06 | Somente lançamentos folha são somados; pais com filhos ficam fora do total parcial | PM §8: impedir dupla contagem |
| DT-07 | Valor com preço mas sem fonte é inválido (`valor sem fonte`) | PM §8 e CL: não inventar custo |
| DT-08 | TypeScript 6.0.3 em vez do 7.x mais recente | O npm resolveu essa versão para ficar compatível com o `typescript-eslint` |
| DT-09 | Git LFS para `.glb` e `.blend` com travamento (`lockable`) | Blender/GLB opcionais para refinamento; arquivos binários sem mesclagem |

## Decisões técnicas (D2)

| # | Decisão | Motivo |
|---|---|---|
| DT-10 | Setores gerados por fatiamento em faixas (z) e colunas (x) a partir das áreas do quadro, não desenhados à mão | Áreas exatas, sem sobreposição e recalculáveis se o contorno mudar |
| DT-11 | Setor "circulação" = faixa do eixo principal com a área agregada (12.000 m²); caminhos desenhados em outros setores contam na área desses setores | Regra de atribuição explícita, sem dupla contagem (PM §2) |
| DT-12 | Núcleos não têm área; referenciam setores, e cada instalação/edifício referencia núcleos | Núcleo ≠ setor (PM §3) |
| DT-13 | Instalações ligadas a lançamentos **agrupados** do V1 §10.2 (ESP-001, ALI-001 etc.) com `objeto_3d_id` nulo; painel avisa que não há custo individual | Evitar inventar custo por objeto; detalhamento por objeto fica para o D4 |
| DT-14 | Código SRV-001 criado para edificações de apoio (administração, manutenção, Ponto de Orientação Cidadã) | Não há código equivalente no V1 §10.2; registrado como criação do D2 |
| DT-15 | Coletores com `setor_id: null` ("distribuído pelo parque") e validação de espaçamento mínimo | Pontos estratégicos em vários setores (V1 §6.4) |
| DT-16 | Rótulos HTML da cena usam uma camada fixa (`portal`) | Defeito observado: sem ela, o primeiro `<Html>` do drei ficava vazio (o elemento é recriado quando o alvo muda após conectar os eventos) |
| DT-17 | Rótulos dos setores ligados por padrão só em telas ≥ 760 px | No celular se sobrepõem na faixa central; podem ser ligados manualmente |
| DT-18 | Ficha do objeto acima da lista na barra lateral | No D1 a ficha ficava abaixo da lista e exigia rolagem |

## Decisões técnicas (D3–D8)

| # | Decisão | Motivo |
|---|---|---|
| DT-19 | Estado compartilhado com Zustand (`src/app/store.ts`) | Cena, fichas, abas e apresentação passaram a compartilhar seleção, modos e câmera (PM §9 permite Zustand para estado compartilhado) |
| DT-20 | Modos do edifício: fechado, explodido (níveis afastados 16 m na cena), corte (paredes frontais removidas) e isolamento de nível (demais níveis em fantasma) | PM §7.4; o seletor de nível funciona também sem WebGL |
| DT-21 | Interiores por nível ilustrativos; só a piscina de 25 m vem dos documentos | Leitura dos pavimentos sem inventar dimensões de projeto |
| DT-22 | Estrutura orçamentária completa do V1 §10.2 + OPEX (V1 §11, V2 §14), tudo `null`; ACA-001 criado como filho de GIN-001 | Mostrar o que falta orçar e testar a regra pai/filho com dados reais do projeto |
| DT-23 | **Sem cenário de preços ilustrativos** | O PM §8 permite, mas exigiria inventar preços; preferimos cobertura 0% honesta |
| DT-24 | CSV com `;`, BOM UTF-8, cabeçalho de procedência, vazios para ausentes e proteção contra fórmulas | Abre corretamente no Excel pt-BR; PM §8 |
| DT-25 | 15 programas: os nomes do PM §6 + "Comunidade Ativa" (V1 §7.7) para cultura + dois de sustentabilidade/alimentação com nomes descritivos | Não inventar marcas; cobrir os eixos dos documentos |
| DT-26 | Oportunidades do relatório exibidas só como referência (valores do programa todo, prazos "a reconferir") | Relatório de 05/11/2026; não são recursos obtidos |
| DT-27 | Fases físicas atribuídas a cada objeto (F1–F4) como **proposta** baseada no PM §11 | Camada "fases físicas" (PM §7.6) sem meses nem custos |
| DT-28 | Camadas desligadas deixam o objeto cinza, sem escondê-lo | Mantém a leitura espacial; materiais opacos evitam falhas de transparência |
| DT-29 | "Custos" e "fases" são modos de cor exclusivos, com legenda em texto | Evita sobrepor dois códigos de cor |
| DT-30 | Auditoria automática de textos (`FRASES_PROIBIDAS`) | Impede regressões que afirmem parceria, vaga, licença ou financiamento como confirmados |
| DT-31 | Bundle: Three.js e R3F/Drei em blocos separados, carregados só com a cena; limite de aviso 800 kB | O núcleo do Three.js tem ~743 kB e não é divisível; carga inicial caiu para ~303 kB |
| DT-32 | E2E com `@playwright/test` 1.63.0 (mesma versão do Chromium pré-instalado) e axe-core | Fluxo pedido no PM §12 e verificação de acessibilidade |
| DT-33 | Aba "Apresentar" (em vez de "Apresentação") | Nome cabia cortado na barra lateral |
| DT-34 | Câmera humana, vegetação animada, água animada e pessoas estilizadas **não** implementadas | Opcionais no PM §7.1/§7.10; priorizado o que comunica o conceito com segurança |
| DT-35 | **Estimativa paramétrica de ordem de grandeza** em documento separado (`docs/Parque_Cidade_Viva_Estimativas_e_Financiamento.docx`, memória de cálculo em `docs/estimativas/`), a pedido do responsável em 06/11/2026: faixas de custo por item, equipe e salários, OPEX e mapa de financiadores | O responsável pediu valores. Cada linha indica se vem de referência pública citada (CUB-SP set/2026, Novo PAC, licitações e CAGED 2026) ou de hipótese do estudo. **O orçamento do aplicativo continua `null` / "A calcular"**: as faixas não são preço SINAPI, cotação nem orçamento oficial, e não entram no app até haver quantidades medidas e fontes com data (mantém DT-23) |
| DT-36 | Estimativa **exibida no app e no site** a pedido do responsável (06/11/2026): resumo no topo da aba Orçamento, visões "Estimativa por item", "Equipe e operação" e "Financiamento", faixa nas fichas de edifícios, instalações e setores e no passo de orçamento da apresentação. Dados em `src/data/estimates.ts`, cálculo em `src/lib/estimativa.ts` | A visão "Orçamento rastreável" continua padrão e sem preço ("A calcular"); o CSV exporta só o rastreável. As faixas trazem sempre o rótulo "ordem de grandeza" e a base (referência ou hipótese). Validação cruzada exige código de orçamento e objeto existentes; a auditoria de frases proibidas inclui os textos novos |
| DT-37 | Contas essenciais calculadas por **consumo × tarifa** (energia em kWh e água em m³ por uso, mais gás, internet, telefone e coleta) e materiais de consumo da operação como linhas próprias do OPEX; nova visão "Materiais" com preços de referência de 2026 (Lar Pontual, SINAPI e SICRO via Orçamentor) e quantidades dos principais materiais por índices de consumo | Pedido do responsável. Tarifas: fatura comercial Enel SP abr/2026 e tabela Sabesp categoria pública com reajuste de 2026, em faixa. Os materiais de obra são **parte** do CAPEX e não se somam a ele; a regra está escrita na tela, no anexo e testada |

## Pendências (externas ao software)

| # | Pendência | Bloqueia |
|---|---|---|
| PE-01 | Matrícula, perímetro, topografia e área reais do terreno | Substituir o contorno ilustrativo |
| PE-02 | Norte e escala reais | Orientação correta da maquete |
| PE-03 | Titularidade e autorização da trilha / área ecológica vizinha | Ligação tracejada da trilha (D2) |
| PE-04 | Estudo estrutural, acústico e de evacuação das quadras elevadas | Remover aviso de viabilidade do ginásio |
| PE-05 | Quantitativos, composições SINAPI-SP, cotações e data-base | Qualquer valor monetário |
| PE-06 | Pactuação de programas sociais (SUAS, SUS, escolas, OSCs) | Status além de `proposto` em D5 |
| PE-07 | Termos de uso das capturas de satélite, se o repositório for público | Manter `referencias/` versionado |

## Pendências do software (abertas após D1)

- ~~Aviso de bundle grande~~ resolvido no D7 (DT-31).
- Avisos do Three.js em tempo de execução: `THREE.Clock` obsoleto (vem do R3F) e `PCFSoftShadowMap` substituído por `PCFShadowMap`. Sem efeito visual observado.
- `npm audit`: 10 avisos moderados (`minimatch`) em ferramentas de desenvolvimento (ESLint/typescript-eslint); não vão para o bundle. A correção sugerida rebaixa o ESLint (quebra de compatibilidade); reavaliar.
- Seleção tátil não testada em dispositivo real; teste E2E automatizado ainda não existe no projeto.
- Rótulos dos setores se sobrepõem em telas estreitas (mitigado desligando-os por padrão); posicionamento inteligente fica para o D7.
- Lançamentos agrupados (ESP-001, ALI-001…) continuam agrupados: desdobrar por objeto só quando houver quantitativos (não há dado para dividir).

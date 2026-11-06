# PARQUE CIDADE VIVA
## Especificação mestre revisada para Claude Code

**Versão 2.1 — revisão técnica de 05/11/2026**  
**Natureza:** projeto acadêmico conceitual SENAC; maquete 3D interativa local; não é projeto executivo, BIM, georreferenciamento, orçamento oficial, autorização administrativa ou garantia de financiamento.

> **Missão do Claude Code:** ler integralmente este arquivo e os três PDFs originais, examinar as três imagens do terreno e entregar software funcional de forma incremental. Separar fatos, premissas, propostas e pendências. Não fabricar medidas, orçamentos, fontes, parceiros, licenças, lotações, resultados sociais ou testes.

## 0. Diagnóstico da revisão: erros e ambiguidades corrigidos

| Questão identificada | Tratamento obrigatório |
|---|---|
| O quadro original soma 95.000 m², mas declara 100.000 m². | Adotar provisoriamente 5.000 m² adicionais para inclusão/horta, explicitamente identificados como **proposta não medida**. Conferir soma automaticamente. |
| O perímetro da imagem não foi levantado topograficamente. | Produzir geometria **ilustrativa**, sem afirmar correspondência métrica/cadastral. Nunca extrair medidas exatas da captura. |
| O documento anterior ainda tratava lixeiras a cada 2 m como opção quase executável. | **Não** criar lixeiras a cada 2 m por padrão; usar pontos estratégicos, conforme o estudo v1, seção 6.4. |
| Faltava distribuição vertical do centro cultural. | Modelar **térreo + 1º + 2º**, conforme o estudo v1, seção 5.2. |
| As fases de construção poderiam ser confundidas com fases do software. | Manter dois cronogramas independentes: **desenvolvimento digital** e **implantação física**. |
| O orçamento aceitava risco de somar itens sem fonte ou pais/filhos duplicados. | Custo ausente é `null`, não zero; mostrar cobertura do orçamento e somar apenas lançamentos não duplicados. |
| O termo “gêmeo digital” sugeria dados do mundo real integrados. | Nome técnico do entregável: **maquete digital conceitual 3D**. Não afirmar monitoramento real. |
| A viabilidade estrutural das quadras elevadas não foi provada. | Representar a ideia solicitada, porém com aviso visível **“arranjo sujeito a estudo estrutural, acústico, de segurança e de operação”**. |
| Cabeçalhos de tabelas do PDF anterior tinham contraste insuficiente. | Corrigir o design editorial e testar visualmente todas as páginas do novo PDF. |
| A lista de plugins misturava dependências opcionais, gratuitas e serviços sujeitos a limites. | Identificar pré-requisitos e custos separadamente; nenhum plugin deve ser requisito para iniciar o MVP. |

## 1. Base documental, hierarquia e status de evidência

**Arquivos obrigatórios, na mesma pasta do projeto:**

1. `Parque_Cidade_Viva_Estudo_Conceitual.pdf` — documento base, 25 páginas. Priorizar seus limites técnicos e suas decisões explícitas.
2. `Parque_Cidade_Viva_Estudo_Conceitual_V2_Visao_Ampliada.pdf` — visão ampliada, 12 páginas, incluindo dez núcleos, programação e governança.
3. `Relatorio_Mensal_Oportunidades_Parque_Cidade_Viva_2026-11-05.pdf` — referências de editais e oportunidades, 6 páginas; não implica recursos obtidos.
4. `referencias/terreno_poligono.jpeg`, `referencias/terreno_sem_preenchimento.jpeg` e `referencias/distribuicao_original.jpeg` — referências visuais, não planta cadastral.
5. Link geográfico fornecido: <https://maps.app.goo.gl/iBMJWN6EfL87gvqx6?g_st=aw>. Apenas referência; não extrair latitude, longitude, área ou titularidade sem fonte verificável.

**Classificações obrigatórias nos dados e na interface:**

- `informado`: intenção ou requisito trazido nos documentos.
- `proposto`: solução conceitual recomendada, ainda não aprovada.
- `hipotetico`: valor de simulação explicitamente não verificado.
- `verificado`: somente com fonte, data, identificação e evidência anexada; não aplicar por suposição.
- `pendente`: depende de estudo, licença, profissional ou dado externo.

Se documentos divergirem, registrar o conflito em `docs/DECISOES_E_PENDENCIAS.md`, mostrar a origem e usar a interpretação conservadora. Não ocultar divergências. A versão 2.1 orienta a implementação digital, mas não substitui os documentos acadêmicos de referência.

## 2. Terreno e quadro territorial provisório

**Área de estudo:** 100.000 m² (10 ha) **hipotéticos**, não certificados. A imagem original enumera setores que totalizam 95.000 m². A reserva de 5.000 m² abaixo é proposta, conforme os estudos v1/v2.

| Setor mutuamente exclusivo, contabilizado uma vez | Área (m²) | Participação |
|---|---:|---:|
| Bosques, jardins e parque verde | 30.000 | 30% |
| Esporte e atividades físicas | 20.000 | 20% |
| Praças, eventos e anfiteatro | 10.000 | 10% |
| Centro cultural e educacional | 8.000 | 8% |
| Playgrounds e lazer familiar | 7.000 | 7% |
| Circulação, acessibilidade e ciclovias | 12.000 | 12% |
| Estacionamento e serviços | 8.000 | 8% |
| Inclusão social e horta comunitária (**reserva proposta**) | 5.000 | 5% |
| **TOTAL** | **100.000** | **100%** |

**Regras geométricas:**

- Respeitar visualmente o perímetro irregular visto nas imagens, mas permitir substituir o contorno futuramente por levantamento técnico; a orientação do norte e a escala reais não estão comprovadas.
- Modelar um polígono simples fechado, sem auto-interseções. Para a maquete, normalizar a escala **somente como exercício ilustrativo**. Registrar a transformação e sua natureza hipotética.
- Calcular a área do polígono por algoritmo geométrico e validar; não afirmar que a imagem prova a área. Se o polígono for reescalado para 100.000 m², rotular como **escala visual normalizada**.
- Distinguir `area_territorial_m2`, `projecao_no_solo_m2`, `area_construida_total_m2` e `area_pavimento_m2`. Um prédio de três ou quatro níveis **não** ocupa três ou quatro vezes a mesma área territorial.
- Setores territoriais não devem se sobrepor quando se somam percentuais. Elementos como caminhos internos, jardins de edifícios e quadras devem ter uma regra explícita de atribuição para não contar duas vezes.
- Prever área permeável, drenagem, acessos de emergência, logística, manutenção, sombra, vegetação e borda ecológica. Não marcar distância de segurança, largura viária ou cota como legalmente conforme sem estudo.

## 3. Masterplan: dez núcleos funcionais

1. **Parque vivo e biodiversidade:** bosques, jardins, sombra, viveiro, jardim sensorial, contemplação e educação ambiental.
2. **Esporte e movimento:** ginásio, piscinas, academia, quadras, campo, caminhada, corrida, esporte adaptado e festivais.
3. **Cultura e criação:** auditório, biblioteca, oficinas, exposição e pequeno estúdio comunitário.
4. **Educação e futuro:** Educa Povão, EJA articulada, inclusão digital, preparação acadêmica e orientação de carreira.
5. **Infância e família:** playgrounds por idade, leitura infantil, convivência e espaços para responsáveis.
6. **Convivência e eventos:** praça, anfiteatro, feiras, cinema e encontros comunitários.
7. **Cidadania e inclusão:** orientação, encaminhamento social, acolhimento diurno condicionado e acessibilidade.
8. **Alimentação e economia local:** restaurante, três quiosques, educação alimentar e economia comunitária.
9. **Sustentabilidade:** horta, compostagem, triagem, educação ambiental e eficiência de recursos.
10. **Operação e segurança:** administração, primeiros socorros, limpeza, manutenção, depósitos, sanitários, equipe e circulação técnica.

Setores e núcleos são coisas diferentes: um núcleo funcional pode ocupar parte de um setor sem criar uma nova área a somar. Criar relação de referência `nucleo_id -> setor_id` sem alterar a soma territorial.

## 4. Programa arquitetônico que deve aparecer no 3D

### 4.1 Ginásio multifuncional: quatro níveis conceituais

| Nível | Funções mínimas |
|---|---|
| **Térreo** | Piscina de referência **25 m** (demais dimensões, raias e profundidade a definir), piscina menor de iniciação, recepção, duchas, vestiários, sanitários acessíveis, primeiros socorros, depósitos, casa de máquinas e tratamento de água. |
| **1º pavimento** | Duas quadras de basquete adaptáveis a voleibol e uma quadra indoor de futsal **sem dimensões homologadas presumidas**, proteção, apoio e depósitos. |
| **2º pavimento** | Musculação, cardio, treinamento funcional, avaliação física, alongamento, atividades coletivas, vestiários e apoio. |
| **3º pavimento** | Jogos, convivência, descanso, tênis de mesa e salas multiuso. Terraço somente como possibilidade condicionada. |

- Representar circulação vertical, elevadores, escadas, áreas técnicas e saída de emergência como **necessidades de projeto**, nunca prova de conformidade.
- Quadras elevadas criam desafios de estrutura, vãos, vibração, acústica, evacuação e custos; marcar **viabilidade pendente**. Se houver conflito de espaço, não “resolver” ocultamente: documentar alternativa para validação humana.
- Atividades de polo aquático e serviços terapêuticos/saúde dependem de espaço, parâmetros de piscina, profissionais habilitados e pactuação; não anunciá-los como funcionamento confirmado.

### 4.2 Centro cultural e educacional: três níveis conceituais

| Nível | Funções mínimas |
|---|---|
| **Térreo** | Auditório com **meta de até 300 lugares**, palco, bastidores, camarins, audiovisual, apoio, sanitários, acessibilidade e saídas de emergência a validar. |
| **1º pavimento** | Biblioteca, atendimento, acervo, leitura, espaço infantil, estudo individual e coletivo. |
| **2º pavimento** | Laboratório de TI, salas de aula, formação digital, cursos profissionalizantes, orientação acadêmica, empreendedorismo e salas de reunião. |

A lotação de 300 é um **objetivo**, não capacidade licenciada. Prever ambiente multiuso/estúdio pequeno como opção programática, sem inventar estúdio complexo ou equipamento caro.

### 4.3 Equipamentos externos, conforto e operação

- Um campo society médio/grande e **duas** quadras esportivas híbridas externas. Modalidades, medidas e drenagem condicionadas a estudo.
- Circuito de caminhada/corrida, estações de alongamento, bicicletários, bancos, bebedouros, sinalização e sombra.
- Restaurante principal e **três quiosques**, com logística, apoio, estoque, cozinha, resíduos e critérios sanitários pendentes.
- Praças, anfiteatro, playgrounds, áreas de descanso, jardins e horta; viveiro, compostagem e triagem ambiental.
- Sanitários acessíveis e demais sanitários distribuídos, fraldários quando necessários, duchas, vestiários, primeiros socorros, zeladoria, depósitos, pessoal e administração.
- Percursos públicos, serviços, carga/descarga e emergência devem ter rotas identificadas e **não** presumidamente dimensionadas segundo norma.

## 5. Resíduos, trilha, meio ambiente e acesso

- **Lixeiras não devem ser colocadas a cada 2 metros.** Distribuir coletores seletivos em pontos de geração e fluxo, sem bloquear faixa livre acessível; posição e número permanecem sujeitos a plano de operação.
- A trilha e a conexão física com a área ecológica vizinha são **hipóteses condicionadas** à titularidade, gestão da área, licenciamento ambiental, segurança, erosão, conservação e autorização. No 3D, exibir ligação **tracejada/opcional** com aviso de pendência.
- Drenagem, manejo de águas pluviais, permeabilidade, tratamento de piscinas, consumo de água, energia, sombreamento e espécies vegetais devem ser identificados como requisitos de estudo. Não prometer neutralidade de carbono ou reúso sem projeto.
- Não reproduzir imagens de satélite como textura comercial sem checar os termos de uso. Preferir imagens de referência apenas para análise visual e geometria própria no aplicativo.

## 6. Programas sociais e serviços (propostas, não convênios existentes)

| Eixo | Projetos e conteúdo |
|---|---|
| Educação | **Educa Povão** (ENEM, vestibular, redação, SISU, PROUNI e FIES com informações atualizadas); **EJA e retomada escolar** vinculadas à rede; apoio pedagógico. |
| Tecnologia, trabalho e renda | **Primeiro Passo Digital**, **Estação de Oportunidades**, **Laboratório Criativo**, **Empreender no Bairro**, formação audiovisual e orientação profissional. |
| Esporte inclusivo | **Esporte para Todos** (base documental), iniciação esportiva, meninas e mulheres, pessoas idosas e com deficiência; os nomes **Meninas em Campo**, **Ativa 60+** e **Parque Acessível** são propostas de programação. |
| Cidadania e famílias | **Cidadão Consciente**, participação social, direitos, convivência, mediação, projeto de vida e atividades familiares. |
| Proteção social | **Recomeçar** e Ponto de Orientação Cidadã: escuta inicial, orientação, convivência diurna e encaminhamento à rede pública, com equipe e protocolos quando pactuados. |
| Cultura | Música, dança, artes visuais, audiovisual, teatro, leitura, saraus, oficinas e exposições, sujeitos a equipe e orçamento. |

Cada cadastro deve conter `id`, `nome`, `eixo`, `descricao`, `espacos_ids`, `publico_alvo`, `equipe_pendente`, `indicadores_propostos`, `capacidade_hipotetica`, `status`, `dependencias` e `custo_recorrente_id` quando houver.

**Limites inegociáveis:** o parque não se apresenta como instituição certificadora de EJA, serviço de saúde clínico, Centro POP, abrigo ou órgão de benefícios sem autorização; não promete ingresso universitário, vagas de emprego, atendimento especializado ou recursos de editais. Não gamificar vulnerabilidade social. Não armazenar dados pessoais de visitantes na maquete.

## 7. Requisitos funcionais da maquete digital

1. **Visão aérea / orbital** com zoom e retorno à visão geral; câmera humana opcional em etapa posterior.
2. **Terreno irregular ilustrativo**, setores com cores identificáveis, legenda, título e placa “Geometria conceitual — escala não certificada”.
3. **Seleção por clique, toque e teclado**; hover apenas como melhoria. Objetos principais devem ser descobertos também por lista acessível.
4. **Pavimentos explodidos**, isolamento por nível e corte arquitetônico simplificado para ginásio (4 níveis) e centro cultural (3 níveis).
5. **Painel do elemento**: nome, função, setor, núcleo, nível, estado da proposta, área/quantidade quando disponível, custo rastreado ou “A calcular”, fonte/data e pendências.
6. **Camadas**: verde, esporte, cultura/educação, infância, circulação, serviços, inclusão, sustentabilidade, custos e fases físicas.
7. **Orçamento interativo** com filtros, estimativas claramente separadas, exportação CSV local e indicadores do grau de cobertura.
8. **Projetos sociais** com fichas e indicadores identificados como metas, cenários ou dados reais (não confundir).
9. **Percurso SENAC** (modo apresentação) com roteiro, riscos, benefícios, prioridades e avisos de incerteza.
10. **Estética progressiva**: árvores e prédios com geometria simples primeiro; vegetação animada, água, iluminação diurna/noturna, pessoas estilizadas e desafios educativos depois do MVP.
11. **Acessibilidade digital**: foco visível, suporte a teclado, contraste, descrição textual, redução de movimento, interface sem depender só de cor; validar com testes, sem declarar certificação automática.
12. **Desempenho**: qualidade baixa/média/alta, redução de sombras e efeitos, instanciamento de árvores e mobiliário, assets carregados sob demanda, liberação de recursos gráficos e fallback quando WebGL falhar.

A interface deve sempre distinguir **existente, conceitual, proposto, simulado e validado**. Não chamar o aplicativo de modelo BIM executivo nem “digital twin” conectado ao parque real.

## 8. Orçamento sem valores fictícios e sem duplicidade

**Dados mínimos por lançamento:**

```json
{
  "id": "AQU-001",
  "objeto_3d_id": "piscina-25m",
  "nome": "Piscina de referência 25 m",
  "setor_id": "esporte",
  "categoria": "equipamento_ou_obra_a_classificar",
  "tipo": "CAPEX",
  "quantidade": null,
  "unidade": "a_definir",
  "custo_unitario_brl": null,
  "subtotal_brl": null,
  "fonte": null,
  "data_base": null,
  "status": "a_cotar",
  "parent_id": null,
  "incluido_no_total": false,
  "observacoes": "Sem quantitativo e composição validados"
}
```

**Regras do cálculo:**

- Valores desconhecidos devem permanecer `null`; o texto de interface será **“A cotar”**, **“A calcular”** ou **“Sem referência”**. Não transformar ausência em `R$ 0`.
- Subtotal só é calculável se **quantidade e custo unitário válidos** estiverem preenchidos. Quantidade negativa, unitário negativo e unidade desconhecida devem gerar validação, não resultado silencioso.
- O subtotal agregado deve considerar **lançamentos folha**, sem somar novamente componentes-pai que já representem o mesmo custo. Aplicar controle explícito de duplicidade, inclusões e exclusões.
- Separar **CAPEX**, implantação de programas e **OPEX** por período (mensal/anual). Não apresentar CAPEX+OPEX como um único “custo da obra”.
- Não declarar “custo total do parque” se houver itens não orçados; apresentar **“total parcial de itens com dados” + “itens pendentes” + grau de cobertura**.
- Fontes futuras: SINAPI-SP com competência e composição, tabelas públicas aplicáveis ou cotação documentada. SICRO apenas quando aderente ao serviço. BDI, encargos, contingência e tributos **dependem do regime e da memória de cálculo**; não aplicar taxa genérica a todos os itens.
- Se forem oferecidos cenários ilustrativos, isolar seus dados dos custos rastreados, etiquetar **“hipotético, não oficial”** e exigir ativação consciente no painel. Não inventar preços para compor a apresentação padrão.
- Exportar CSV com cabeçalhos, indicação da data-base, fonte e status; proteger contra fórmula iniciada com `=`, `+`, `-` ou `@` nos campos textuais. Manter log local de alterações se houver edição.
- Editais mencionados no relatório são **oportunidades para programas**, não financiamento integral da construção. Seus valores referem-se aos programas publicados, não a recursos aprovados para o parque. Datas, prazos, retificações e elegibilidade devem ser revistos antes de qualquer uso.

## 9. Arquitetura de software simples e verificável

**Stack inicial recomendada:** Node.js compatível com a versão escolhida do Vite; Vite + React + TypeScript; Three.js + React Three Fiber + Drei; Zustand somente para estado compartilhado; Recharts para painéis; CSS modular ou Tailwind se realmente simplificar. Vitest para regras de negócio; Playwright opcional para fluxo end-to-end. Blender e glTF/GLB são opcionais para etapa de refinamento. **Rapier não é obrigatório no MVP.**

**Priorizar funcionamento local sem API paga, sem autenticação e sem banco de dados remoto.** Dados-semente em TypeScript/JSON; preferências locais com `localStorage` apenas quando úteis. Usar dados públicos não pessoais; não coletar informações de usuários reais.

Estrutura sugerida:

```text
Parque-Cidade-Viva/
  CLAUDE.md
  Parque_Cidade_Viva_Prompt_Mestre_REVISADO.md
  Parque_Cidade_Viva_Estudo_Conceitual.pdf
  Parque_Cidade_Viva_Estudo_Conceitual_V2_Visao_Ampliada.pdf
  Relatorio_Mensal_Oportunidades_Parque_Cidade_Viva_2026-11-05.pdf
  referencias/{terreno_poligono.jpeg,terreno_sem_preenchimento.jpeg,distribuicao_original.jpeg}
  docs/{PROJECT_PLAN.md,REQUIREMENTS.md,ASSUMPTIONS.md,DECISOES_E_PENDENCIAS.md,BACKLOG.md,TEST_REPORT.md}
  src/
    app/
    scene/{Terrain.tsx,ParkScene.tsx,CameraControls.tsx,BuildingFloors.tsx}
    data/{sectors.ts,buildings.ts,programs.ts,budget.ts}
    features/{selection,budget,social,presentation}
    components/{Sidebar,Tooltip,Legend,QualitySettings}
    lib/{geometry.ts,budget-calculator.ts,validation.ts}
    styles/
  public/assets/
  tests/
  package.json
  package-lock.json
  README.md
```

Manter geometrias e dados separados da interface; IDs estáveis e únicos para cada instalação; referências cruzadas válidas. Evitar imports quebrados e bibliotecas instaladas sem uso. Fixar versões por lockfile e registrar requisitos do Node. Não instalar scripts de origens desconhecidas nem copiar ativos sem licença.

## 10. Fases de DESENVOLVIMENTO DIGITAL (não são fases da obra)

| Etapa de software | Entrega concreta | Condição de aceite |
|---|---|---|
| **D0 — Leitura e diagnóstico** | `REQUIREMENTS.md`, `ASSUMPTIONS.md`, `DECISOES_E_PENDENCIAS.md`, `PROJECT_PLAN.md`, backlog e inventário dos anexos. | Divergências registradas, prioridades claras, escopo MVP limitado. |
| **D1 — Vertical slice navegável** | Projeto inicia localmente; terreno irregular conceitual; câmera orbital; um setor, um edifício selecionável; tooltip e painel de custo “A calcular”. | Servidor funcional, compilação, teste de seleção e captura visual quando possível. |
| **D2 — Implantação geral** | Oito setores territorializados sem duplicação; dez núcleos relacionados; quadras, campo, praças, caminhos, vegetação, sanitários e alimentação com geometrias leves. | Setores são clicáveis e os dados territoriais somam 100.000 m² hipotéticos. |
| **D3 — Edifícios** | Ginásio em 4 níveis; centro cultural em 3; explodir/isolar pavimentos, aviso de viabilidade pendente. | Pavimentos corretos em dados e interface; transições acessíveis. |
| **D4 — Custos** | Orçamento por objeto, CAPEX/OPEX, fontes/status, filtros e exportação CSV. | Testes impedem falsa precisão, soma dupla e `null` tratado como zero. |
| **D5 — Projetos sociais** | Fichas dos programas e vínculos com espaços, indicadores propostos. | Não há parcerias ou resultados inventados. |
| **D6 — Apresentação SENAC** | Percurso guiado, riscos, status e cronograma físico por fases. | Apresentação completa sem navegar manualmente por menus complexos. |
| **D7 — Polimento** | Animação leve, luz, vegetação, presets de qualidade, otimizações, interface responsiva. | Sem regressão de acessibilidade ou de desempenho. |
| **D8 — Auditoria final** | Build, testes, revisão visual, instruções, changelog e relatório de limites. | Nenhuma falha crítica conhecida; falhas restantes listadas com transparência. |

**Regra central:** o Claude Code deve implementar **D0 e D1 primeiro**. Antes de começar D2, entregar resultados testáveis de D1 e um resumo de pendências. Cada mudança deve ser pequena, compilável e documentada.

## 11. Fases de IMPLANTAÇÃO FÍSICA (somente cenário acadêmico)

| Fase de obra | Conceito | Dependência |
|---|---|---|
| **F0 — Validação** | Terreno, matrícula, topografia, sondagens, ambiente, demanda, acessos, participação e governança. | Evidências e estudos profissionais. |
| **F1 — Parque essencial** | Caminhos, iluminação, sanitários, sombra, praça, lazer simples, limpeza e segurança. | Custeio e manutenção viáveis. |
| **F2 — Esporte e educação inicial** | Quadras/campo, salas de estudo, biblioteca de partida, cursos e programação. | Equipe, demanda e parcerias. |
| **F3 — Centro integrado** | Ginásio/piscinas, centro cultural/auditório, restaurante e serviços ampliados. | Engenharia, projetos, licenças, CAPEX e OPEX assegurados. |
| **F4 — Excelência e inovação** | Laboratório criativo, estúdio, programas avançados, melhorias de impacto. | Evidência de resultado e financiamento sustentável. |

Não criar cronograma físico em meses, custo ou previsão de inauguração sem base. O cronograma físico não deve determinar a ordem de desenvolvimento das telas do aplicativo.

## 12. Testes automatizados e critérios de aceite

**Scripts esperados, implementados de fato:** `npm run dev`, `npm run build`, `npm run typecheck`, `npm run test` e `npm run lint` (se um script ainda não existir, declarar claramente e criar antes de atestar sucesso). Gerar e preservar `package-lock.json`; conferir `npm ci` após a geração do lockfile. Não alegar sucesso para comandos que não foram executados.

**Validações de dados:**

- `sum(areas_m2) === 100000` e `sum(percentuais) === 100` **apenas para o cenário de estudo**.
- `5.000 m²` de inclusão/horta marcado como **reserva proposta**.
- IDs únicos; todo `objeto_3d_id` e referência de núcleo/setor deve apontar para dado existente.
- Ginásio tem exatamente **4 níveis** (térreo/1º/2º/3º) e centro cultural exatamente **3** (térreo/1º/2º).
- Um campo externo, duas quadras externas, um restaurante e três quiosques no catálogo de instalações.
- Um preço ausente (`null`) **não** aparece como R$ 0 e deixa o orçamento parcial/incompleto.
- Um item-pai e seu item-filho **não** são contados duas vezes.
- OPEX anual não entra no CAPEX de implantação; dados de simulação não se confundem com dados documentados.
- Ao selecionar qualquer instalação principal, o painel deve abrir e mostrar sua ficha (mesmo sem custos); acessar os níveis via seletor sem WebGL avançado quando necessário.
- O terreno irregular se fecha e não se auto-intersecta; se normalizado, a interface sinaliza escala conceitual.
- Nenhum texto declara parcerias, vagas, liberação ambiental, licenças ou financiamento como confirmados sem evidência.

**Validações de experiência:**

- A página abre sem tela em branco; há alternativa textual se WebGL indisponível.
- Mouse, teclado e toque operam o núcleo mínimo do projeto; foco visível; `prefers-reduced-motion` respeitado.
- O navegador não deve travar ao criar muitas árvores/lixeiras; instanciar, limitar detalhe e reduzir efeitos em qualidade baixa.
- Teste E2E (quando ambiente/browser permitir): abrir página, trocar setor, selecionar edifício, abrir pavimento, ver custo “A calcular”, entrar no modo apresentação e exportar CSV.
- Se Playwright não conseguir renderizar WebGL no ambiente, relatar a limitação e testar UI/dados separadamente; não afirmar visual 3D verificado sem inspeção real.
- Ao concluir cada etapa, atualizar `docs/TEST_REPORT.md` com comandos, saída resumida, falhas, capturas quando disponíveis e tarefas restantes.

## 13. Matriz de riscos que deve aparecer na apresentação

| Risco / incerteza | Severidade conceitual | Ação antes de obras |
|---|---|---|
| Titularidade, perímetro e 10 ha não certificados | Crítico | Matrícula, cadastro, topografia, verificação fundiária. |
| Borda ecológica e conexão da trilha | Alto | Estudo ambiental, gestão da área, autorizações. |
| Estrutura vertical do ginásio, piscinas e quadras | Alto | Estudo arquitetônico e engenharia multidisciplinar. |
| Acessibilidade, saídas e segurança contra incêndio | Alto | Projetos específicos e análise pelos órgãos competentes. |
| Operação: equipes, água, energia, manutenção | Alto | Modelo anual de OPEX e gestão. |
| Programas sociais com parcerias ainda não formalizadas | Alto | Pactuação, equipe, orçamento e proteção dos usuários. |
| Custos incompletos e editais não garantidos | Alto | Quantitativos, fontes, cotações, elegibilidade e financiamento. |
| Performance e compatibilidade do aplicativo | Moderado | MVP leve, testes, fallback e qualidade ajustável. |

Esses níveis são **classificações qualitativas propostas**, não laudo de risco profissional.

## 14. Ferramentas e plugins: opção de custo zero para o código

**Instalação não é obrigatória para D0/D1.** Priorizar projetos de código aberto e recursos locais. Plugins podem ser gratuitos para instalar, mas **uso do Claude Code pode consumir assinatura/créditos**, e serviços externos podem exigir conta ou ter limites.

| Recurso | Utilidade | Condição/observação |
|---|---|---|
| **Frontend Design** | Interface e visual profissional | Plugin de interface do marketplace oficial; opção, não pré-requisito. |
| **Superpowers** | Planejamento, testes, depuração | Projeto de skills aberto; existe marketplace comunitário `obra/superpowers-marketplace`. Confirmar instalação. |
| **Playwright** | Automatizar testes | Framework open source; plugin/MCP opcional, podendo funcionar apenas como dependência do projeto. |
| **TypeScript LSP** | Análise de código | Requer servidor TypeScript instalado, por exemplo `npm install -g typescript-language-server typescript`; além do plugin, conferir funcionamento. |
| **Context7** | Documentação atualizada | Plugin remoto com autenticação/limites próprios; dispensável ao MVP. |
| **Code Review** | Revisar mudanças e PRs | Útil após existir repositório; pode consumir chamadas de modelo. |
| **Blender** | Modelos 3D e exportação glTF/GLB | Gratuito e open source; não necessário para primitivas do MVP. |
| **Git** | Histórico e rollback | Gratuito localmente; GitHub opcional. |

**Pontos de referência verificáveis:**

- Claude Code plugins: <https://code.claude.com/docs/en/plugins>
- Plugin oficial Frontend Design: <https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design>
- Plugin TypeScript LSP: <https://github.com/anthropics/claude-plugins-official/tree/main/plugins/typescript-lsp>
- Superpowers e marketplace: <https://github.com/obra/superpowers-marketplace>
- Context7: <https://github.com/upstash/context7>
- Playwright: <https://playwright.dev/>
- Blender: <https://www.blender.org/>

Instalar plugins pelo painel `/plugin` do Claude Code e confirmar os identificadores apresentados na instância local antes de executar comandos. Um plugin com falha de instalação não deve bloquear o projeto. Evitar adicionar vários plugins antes de obter o primeiro build.

## 15. Prompt inicial para EXECUTAR no Claude Code

**Cole exatamente a instrução a seguir ao abrir esta pasta no Claude Code:**

> Leia primeiro `CLAUDE.md`, este `Parque_Cidade_Viva_Prompt_Mestre_REVISADO.md` e os três PDFs originais, inspecionando também as três imagens em `referencias/`. Não suponha que a área do terreno, as licenças, os custos ou as parcerias estejam verificados. Faça uma auditoria de requisitos e inconsistências. Execute **somente D0 e D1**, gerando os arquivos de planejamento, um aplicativo React + TypeScript + React Three Fiber mínimo, terreno irregular ilustrativo, câmera orbital, um edifício selecionável e painel de custo com “A calcular”. Instale apenas dependências essenciais e fixe versões com `package-lock.json`. Execute realmente `npm run build`, a verificação de tipos e os testes disponíveis; quando puder, abra o navegador e verifique visualmente. Documente resultados em `docs/TEST_REPORT.md`. Não invente testes executados, valores monetários ou medidas. Ao terminar, pare e apresente resumo, arquivos alterados, comandos testados, erros, pendências e próximo passo. **Não implemente D2–D8 ainda**.

## 16. Notas de qualidade editorial e limites

O documento foi revisado para reduzir contradições internas, erros de soma e ambiguidades de implementação, **não para garantir inexistência absoluta de falhas**. Engenharia, normas, cadastro fundiário, custos e viabilidade operacional permanecem pendentes de documentação e profissionais competentes. A aplicação 3D deve sempre revelar essa incerteza aos visitantes.

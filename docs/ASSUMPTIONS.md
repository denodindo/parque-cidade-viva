# Premissas adotadas (D0/D1)

Toda premissa abaixo é **hipótese de trabalho** e pode ser substituída por dado técnico. Nenhuma está `verificado`.

| ID | Premissa | Status | Origem | Onde aparece |
|---|---|---|---|---|
| P-01 | Área de estudo de 100.000 m² (10 ha) | `hipotetico` | V1 §2, V2 §1, PM §2 | `src/data/sectors.ts` (`AREA_ESTUDO_M2`) |
| P-02 | Reserva de 5.000 m² para inclusão social e horta, fechando 95.000 → 100.000 m² | `proposto` | V1 §3, V2 §3, PM §0 | setor `inclusao` |
| P-03 | Contorno do terreno = 4 vértices lidos visualmente em `terreno_poligono.jpeg` (pixels: (310,252), (513,722), (313,800), (158,460)) | `hipotetico` | Imagem de referência | `src/data/terrain.ts` |
| P-04 | Escala visual normalizada: o contorno (96.877 px²) é centralizado e reescalado uniformemente para 100.000 m² (≈1,016 m/px). O fator **não** é medição e não prova a área | `hipotetico` | PM §2 | `TERRENO.fator_escala_m_por_px`, painel do terreno |
| P-05 | Eixo x da cena = direita da imagem; eixo z = para baixo da imagem. Norte real **não** comprovado; câmera inicial alinhada à imagem | `hipotetico` | PM §2 | `ParkScene.tsx` |
| P-06 | Implantação dos 8 setores em faixas (de cima para baixo): verde · inclusão/infância/praças/cultura · circulação · esporte/serviços. Cada fatia é recortada por bisseção com a área exata do quadro. **Posições ilustrativas** (substitui a faixa única de esporte do D1) | `proposto` | Decisão de D2 | `src/data/layout.ts` |
| P-07 | Volumes na cena: ginásio 70 × 45 m, centro cultural 50 × 40 m, 6 m por nível: **dimensões ilustrativas**, não de projeto; `projecao_no_solo_m2` e `area_construida_total_m2` permanecem `null` | `hipotetico` | Decisão de D1/D2 | `buildings.ts` (`planta_ilustrativa`) |
| P-08 | Lançamentos GIN-001, AQU-001 (filho de GIN-001), CUL-001, ESP-001, ALI-001, AMB-001, PAI-001, CIR-001, MOB-001 e SRV-001 sem quantidade, preço, fonte e data-base | `pendente` | V1 §10.2, PM §8 | `src/data/budget.ts` |
| P-09 | Data das fontes exibida: 05/11/2026 (data dos documentos) | `informado` | Capas dos PDFs | Painel |
| P-10 | Instalações (campo 56 × 36 m, quadras 28 × 16 m, praça r = 22 m, anfiteatro r = 16 m etc.): tamanhos **ilustrativos** para a maquete, sem homologação esportiva nem norma | `hipotetico` | Decisão de D2 | `src/data/facilities.ts` |
| P-11 | Árvores distribuídas por sorteio determinístico (≈ 300) só para representar sombra/massa vegetal; **não** é inventário arbóreo nem projeto paisagístico | `hipotetico` | Decisão de D2 | `src/lib/vegetation.ts` |
| P-12 | Espaçamento mínimo de 15 m entre pontos de coleta, usado só como trava contra a ideia de "lixeira a cada 2 m"; posição e número reais dependem do plano de resíduos | `proposto` | Decisão de D2 | `ESPACAMENTO_MINIMO_COLETORES_M` |

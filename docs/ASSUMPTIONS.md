# Premissas adotadas (D0/D1)

Toda premissa abaixo é **hipótese de trabalho** e pode ser substituída por dado técnico. Nenhuma está `verificado`.

| ID | Premissa | Status | Origem | Onde aparece |
|---|---|---|---|---|
| P-01 | Área de estudo de 100.000 m² (10 ha) | `hipotetico` | V1 §2, V2 §1, PM §2 | `src/data/sectors.ts` (`AREA_ESTUDO_M2`) |
| P-02 | Reserva de 5.000 m² para inclusão social e horta, fechando 95.000 → 100.000 m² | `proposto` | V1 §3, V2 §3, PM §0 | setor `inclusao` |
| P-03 | Contorno do terreno = 4 vértices lidos visualmente em `terreno_poligono.jpeg` (pixels: (310,252), (513,722), (313,800), (158,460)) | `hipotetico` | Imagem de referência | `src/data/terrain.ts` |
| P-04 | Escala visual normalizada: o contorno (96.877 px²) é centralizado e reescalado uniformemente para 100.000 m² (≈1,016 m/px). O fator **não** é medição e não prova a área | `hipotetico` | PM §2 | `TERRENO.fator_escala_m_por_px`, painel do terreno |
| P-05 | Eixo x da cena = direita da imagem; eixo z = para baixo da imagem. Norte real **não** comprovado; câmera inicial alinhada à imagem | `hipotetico` | PM §2 | `ParkScene.tsx` |
| P-06 | Setor de esporte posicionado na faixa inferior do terreno (junto à avenida visível na imagem), recortado por bisseção para ter 20.000 m² na escala normalizada. **Posição ilustrativa** | `proposto` | Decisão de D1 | `SETOR_ESPORTE_GEOMETRIA` |
| P-07 | Volume do ginásio 70 × 45 m em planta e 6 m por nível na cena: **dimensões ilustrativas**, não de projeto; `projecao_no_solo_m2` e `area_construida_total_m2` permanecem `null` | `hipotetico` | Decisão de D1 | `BuildingFloors.tsx`, `buildings.ts` |
| P-08 | Lançamentos orçamentários GIN-001, AQU-001 (filho de GIN-001) e CUL-001 sem quantidade, preço, fonte e data-base | `pendente` | V1 §10.2, PM §8 | `src/data/budget.ts` |
| P-09 | Data das fontes exibida: 05/11/2026 (data dos documentos) | `informado` | Capas dos PDFs | Painel |

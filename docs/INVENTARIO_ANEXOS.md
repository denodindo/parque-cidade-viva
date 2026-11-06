# Inventário dos anexos (D0)

Pacote recebido: `Parque_Cidade_Viva_Claude_Code_PACOTE_REVISADO.zip` (revisão 2.1, 05/11/2026). Todos os arquivos foram conferidos contra `MANIFESTO_SHA256.json` (`sha256sum -c`: 10/10 OK). Os PDFs enviados separadamente na conversa têm hashes idênticos aos do pacote.

| Arquivo | Páginas / tamanho | Como foi lido | Papel |
|---|---|---|---|
| `CLAUDE.md` | 1,7 KB | Integral | Instruções permanentes ao Claude Code |
| `LEIA-ME.txt` | 0,9 KB | Integral | Instruções de uso do pacote |
| `Parque_Cidade_Viva_Prompt_Mestre_REVISADO.md` | 31,5 KB | Integral | Especificação mestre v2.1 (fonte canônica para o software) |
| `Parque_Cidade_Viva_Prompt_Mestre_REVISADO.pdf` | 12 p. | Texto extraído (`pdftotext`), conferência por amostragem com o `.md` | Versão diagramada do prompt mestre |
| `Parque_Cidade_Viva_Estudo_Conceitual.pdf` | 25 p. | Texto integral via `pdftotext` | Documento base (v1.0) — prioridade para limites técnicos |
| `Parque_Cidade_Viva_Estudo_Conceitual_V2_Visao_Ampliada.pdf` | 12 p. | Texto integral via `pdftotext` | Visão ampliada (v2.0): dez núcleos, programas, governança |
| `Relatorio_Mensal_Oportunidades_Parque_Cidade_Viva_2026-11-05.pdf` | 6 p. | Texto integral via `pdftotext` | Editais e oportunidades — **não** são recursos obtidos |
| `referencias/terreno_poligono.jpeg` | 113 KB | Inspeção visual | Contorno desenhado sobre imagem aérea (base do terreno ilustrativo) |
| `referencias/terreno_sem_preenchimento.jpeg` | 122 KB | Inspeção visual | Mesmo enquadramento sem preenchimento |
| `referencias/distribuicao_original.jpeg` | 40 KB | Inspeção visual | Quadro de áreas original (7 setores, soma 95.000 m²) |
| `MANIFESTO_SHA256.json` | 1,6 KB | Usado na conferência | Hashes do pacote |

**Limitações da leitura:** as imagens embutidas nos PDFs (p. ex. páginas 4, 6 e 7 do estudo v1) não foram extraídas; correspondem às três imagens de `referencias/`, que foram inspecionadas diretamente. O link do Google Maps (§1.5 do prompt mestre) **não** foi acessado e nenhuma coordenada, área ou titularidade foi extraída dele.

**Observação sobre as imagens:** são capturas de um serviço de mapas com imagem de satélite. Ficam no repositório apenas como referência de análise (prompt mestre §5); não são usadas como textura no aplicativo. Se o repositório for público, conferir os termos de uso antes de mantê-las versionadas.

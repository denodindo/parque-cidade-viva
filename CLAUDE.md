# Parque Cidade Viva — instruções permanentes ao Claude Code

**Leia por completo `Parque_Cidade_Viva_Prompt_Mestre_REVISADO.md` antes de alterar código.** Consulte os três PDFs de referência e as três imagens em `referencias/`. Se um leitor de PDF não estiver disponível, relate explicitamente e peça um formato alternativo; não finja que leu.

O produto é uma **maquete digital conceitual acadêmica SENAC**, não BIM, projeto executivo, levantamento georreferenciado, licenciamento, orçamento oficial ou gêmeo digital conectado a operações reais.

## Restrições inegociáveis

- Os 100.000 m² são hipótese; 5.000 m² para inclusão/horta são reserva proposta. Não inferir limites reais da imagem.
- Ginásio tem térreo mais 3 pavimentos; centro cultural tem térreo mais 2 pavimentos. Quadras elevadas são hipótese sujeita a engenharia.
- Não instalar lixeiras a cada 2 m; usar pontos estratégicos de coleta seletiva.
- Não inventar custo, preço SINAPI, parceria, edital aprovado, métricas sociais reais, licenças ou capacidade licenciada. `null` nunca vale zero.
- CAPEX e OPEX separados; jamais contar custos de pais e filhos duas vezes.
- Desenvolver em passos pequenos e verificáveis. Começar **somente D0 e D1**.
- Usar bibliotecas gratuitas e dados locais, sem API paga obrigatória e sem coleta de dados pessoais.
- Não declarar build/teste/inspeção visual bem-sucedidos sem tê-los executado.

## Entrega após cada fase

Atualize `docs/TEST_REPORT.md` com comandos executados, resultados reais, pendências e próximos passos; mantenha o projeto compilável e documente decisões importantes em `docs/DECISOES_E_PENDENCIAS.md`. Se uma dependência opcional travar o avanço, simplifique e mantenha o MVP rodando.

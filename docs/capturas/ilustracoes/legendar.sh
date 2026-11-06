#!/bin/sh
# Põe faixa de título nas vistas da maquete (maquete-bruto → maquete).
cd "$(dirname "$0")"
F=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
G=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf
while IFS='|' read -r arq titulo; do
  convert "maquete-bruto/$arq.png" -fill '#12291FEB' -draw "rectangle 0,1012 1920,1080" \
    -font "$F" -pointsize 30 -fill '#E9A23B' -annotate +40+1057 "$titulo" \
    -font "$G" -pointsize 20 -fill '#BFD4C6' -gravity SouthEast -annotate +40+24 'Vista da maquete digital 3D · geometria conceitual, escala não certificada' \
    "maquete/$arq.png"
done <<LISTA
01-visao-geral|Maquete · visão geral do parque
02-noite|Maquete · o parque à noite
03-ginasio|Maquete · ginásio multifuncional
04-ginasio-pavimentos|Maquete · ginásio com os quatro níveis separados
05-centro-cultural|Maquete · centro cultural e educacional
06-centro-cultural-pavimentos|Maquete · centro cultural com os três níveis separados
07-praca-anfiteatro|Maquete · praça central e anfiteatro
08-playgrounds|Maquete · playgrounds e lazer familiar
09-campo-quadras|Maquete · campo society e quadras
10-horta-inclusao|Maquete · horta, viveiro e inclusão
11-bosque|Maquete · bosque, caminhos e jardim sensorial
12-restaurante-quiosques|Maquete · restaurante e quiosques
LISTA

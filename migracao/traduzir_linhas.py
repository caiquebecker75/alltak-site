#!/usr/bin/env python3
"""Tradução EN/ES do conteúdo das linhas de produto (descrição + specs).
Limpa as specs (limpar_specs.py), corrige fragmentos do PT e gera
src/data/wp/linhas-i18n.json com {slug: {en: {...}, es: {...}}}.
Falha (exit 1) se alguma string ficar sem tradução."""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from limpar_specs import limpar, normalizar

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

# ---- specs: PT → (EN, ES), chaves na forma canônica (ponto final) ----
TR = {
    'Indicações': ('Recommended uses', 'Indicaciones'),
    'Armazenagem': ('Storage', 'Almacenamiento'),
    'Propriedades Físicas': ('Physical properties', 'Propiedades físicas'),
    'Propriedades Físicas:': ('Physical properties:', 'Propiedades físicas:'),
    'Recomendações': ('Recommendations', 'Recomendaciones'),
    'Fornecimento e durabilidade': ('Supply and durability', 'Suministro y durabilidad'),
    'Características': ('Features', 'Características'),
    'Características técnicas:': ('Technical features:', 'Características técnicas:'),
    'Importante:': ('Important:', 'Importante:'),
    'Durabilidade': ('Durability', 'Durabilidad'),
    'Durabilidade esperada': ('Expected durability', 'Durabilidad esperada'),
    'Validade:': ('Shelf life:', 'Vigencia:'),
    'Frontal:': ('Face film:', 'Frontal:'),
    'Frontal': ('Face film', 'Frontal'),
    'Adesivo:': ('Adhesive:', 'Adhesivo:'),
    'Liner:': ('Liner:', 'Liner:'),
    'Papel siliconado:': ('Siliconized paper:', 'Papel siliconado:'),
    'Estabilidade Dimensional:': ('Dimensional stability:', 'Estabilidad dimensional:'),
    '48 hs a 70ºC': ('48 h at 70ºC', '48 h a 70ºC'),
    'Estabilidade Dimensional: 48 hs a 70ºC': ('Dimensional stability: 48 h at 70ºC', 'Estabilidad dimensional: 48 h a 70ºC'),
    'Aplicar em superfície lisa e plana previamente limpa utilizando álcool isopropílico evitando assim o contato com impurezas, oleosidade ou qualquer outro produto químico.': (
        'Apply on a smooth, flat surface previously cleaned with isopropyl alcohol, avoiding contact with impurities, grease or any other chemical product.',
        'Aplicar sobre una superficie lisa y plana previamente limpiada con alcohol isopropílico, evitando el contacto con impurezas, grasa o cualquier otro producto químico.'),
    'Depois de aplicado evitar produtos agressivos e atritos constantes, usar sabão neutro.': (
        'After application, avoid aggressive products and constant friction; use neutral soap.',
        'Después de la aplicación, evitar productos agresivos y fricciones constantes; usar jabón neutro.'),
    'Depois de aplicado evitar produtos agressivos e atritos constantes.': (
        'After application, avoid aggressive products and constant friction.',
        'Después de la aplicación, evitar productos agresivos y fricciones constantes.'),
    'Armazenar a temperaturas entre 20º e 30ºC, umidade relativa do ar entre 40% e 50%.': (
        'Store at temperatures between 20ºC and 30ºC, with relative humidity between 40% and 50%.',
        'Almacenar a temperaturas entre 20ºC y 30ºC, con humedad relativa entre 40% y 50%.'),
    'Armazenar a temperaturas entre 20º e 30ºC, umidade relativa do ar entre 40% a 50%.': (
        'Store at temperatures between 20ºC and 30ºC, with relative humidity between 40% and 50%.',
        'Almacenar a temperaturas entre 20ºC y 30ºC, con humedad relativa entre 40% y 50%.'),
    'Armazenar a temperaturas entre 20o e 30oC, umidade relativa do ar entre 40% a 50%.': (
        'Store at temperatures between 20ºC and 30ºC, with relative humidity between 40% and 50%.',
        'Almacenar a temperaturas entre 20ºC y 30ºC, con humedad relativa entre 40% y 50%.'),
    'Validade: 2 anos a partir da data de fabricação, estando acondicionado na embalagem original e em local apropriado.': (
        'Shelf life: 2 years from the manufacturing date, kept in the original packaging in a suitable place.',
        'Vigencia: 2 años a partir de la fecha de fabricación, conservado en el embalaje original y en un lugar adecuado.'),
    '2 anos a partir da data de fabricação, estando acondicionado na embalagem original e em local apropriado.': (
        '2 years from the manufacturing date, kept in the original packaging in a suitable place.',
        '2 años a partir de la fecha de fabricación, conservado en el embalaje original y en un lugar adecuado.'),
    'Utilização de solvente em excesso diminui o tempo de durabilidade do produto.': (
        "Excessive use of solvent reduces the product's durability.",
        'El uso excesivo de solvente reduce la durabilidad del producto.'),
    'Ligado ao alumínio (encolhimento) 0,127%': ('Bonded to aluminum (shrinkage): 0.127%', 'Adherido al aluminio (contracción): 0,127%'),
    'Ligado ao alumínio (encolhimento) 0,109%': ('Bonded to aluminum (shrinkage): 0.109%', 'Adherido al aluminio (contracción): 0,109%'),
    'Não indicada aplicação em superfícies rugosas e/ou porosas.': (
        'Not recommended for rough and/or porous surfaces.',
        'No se recomienda la aplicación sobre superficies rugosas y/o porosas.'),
    'Não indicada aplicação em superfícies corrugadas, rugosas e/ou porosas.': (
        'Not recommended for corrugated, rough and/or porous surfaces.',
        'No se recomienda la aplicación sobre superficies corrugadas, rugosas y/o porosas.'),
    '2 anos a temperaturas entre 20ºC a 30ºC e com UR entre 40% e 50%.': (
        '2 years at temperatures between 20ºC and 30ºC, with RH between 40% and 50%.',
        '2 años a temperaturas entre 20ºC y 30ºC, con HR entre 40% y 50%.'),
    '2 anos a temperaturas entre 20ºC a 30ºC e mantendo uma umidade relativa do ar entre 40% e 50%.': (
        '2 years at temperatures between 20ºC and 30ºC, keeping relative humidity between 40% and 50%.',
        '2 años a temperaturas entre 20ºC y 30ºC, manteniendo la humedad relativa entre 40% y 50%.'),
    '6 meses a temperaturas entre 20ºC a 30ºC e com UR entre 40% e 50%.': (
        '6 months at temperatures between 20ºC and 30ºC, with RH between 40% and 50%.',
        '6 meses a temperaturas entre 20ºC y 30ºC, con HR entre 40% y 50%.'),
    '1 ano a temperaturas entre 20ºC a 30ºC e com UR entre 40% e 50%.': (
        '1 year at temperatures between 20ºC and 30ºC, with RH between 40% and 50%.',
        '1 año a temperaturas entre 20ºC y 30ºC, con HR entre 40% y 50%.'),
    'Boa estabilidade em superfícies lisas e curvas, resistente a impactos leves.': (
        'Good stability on smooth and curved surfaces, resistant to light impacts.',
        'Buena estabilidad en superficies lisas y curvas, resistente a impactos leves.'),
    'Instalar imediatamente após corte.': ('Install immediately after cutting.', 'Instalar inmediatamente después del corte.'),
    'Em trabalhos com recorte, instalar imediatamente após o corte.': (
        'For cut jobs, install immediately after cutting.',
        'En trabajos con corte, instalar inmediatamente después del corte.'),
    'Em trabalhos com recorte, instalar imediatamente após o corte/remoção do liner. A espatulação e pressão após a aplicação garantem melhor desempenho do adesivo.': (
        'For cut jobs, install immediately after cutting/removing the liner. Squeegeeing and pressure after application ensure better adhesive performance.',
        'En trabajos con corte, instalar inmediatamente después del corte/retiro del liner. El espatulado y la presión después de la aplicación garantizan un mejor desempeño del adhesivo.'),
    'Adesivo: acrílico reposicionável 20g/m² (+/- 2g/m²).': (
        'Adhesive: repositionable acrylic, 20 g/m² (+/- 2 g/m²).',
        'Adhesivo: acrílico reposicionable, 20 g/m² (+/- 2 g/m²).'),
    'Adesivo: acrílico reposicionável 20g/m2 (+ 2g/m2).': (
        'Adhesive: repositionable acrylic, 20 g/m² (+ 2 g/m²).',
        'Adhesivo: acrílico reposicionable, 20 g/m² (+ 2 g/m²).'),
    'Adesivo: acrílico reposicionável 20g/m² (+ 2g/m²).': (
        'Adhesive: repositionable acrylic, 20 g/m² (+ 2 g/m²).',
        'Adhesivo: acrílico reposicionable, 20 g/m² (+ 2 g/m²).'),
    'Adesivo: Acrílico Permanente: (baixa: 5 g/m2; médio: 10g/m2 e alto: 15 g/m2)': (
        'Adhesive: permanent acrylic (low: 5 g/m²; medium: 10 g/m²; high: 15 g/m²)',
        'Adhesivo: acrílico permanente (baja: 5 g/m²; media: 10 g/m²; alta: 15 g/m²)'),
    'Adesivo: Acrílico Permanente: 30g/m2': ('Adhesive: permanent acrylic, 30 g/m²', 'Adhesivo: acrílico permanente, 30 g/m²'),
    'Adesivo: Acrílico Permanente: 21 g/m²': ('Adhesive: permanent acrylic, 21 g/m²', 'Adhesivo: acrílico permanente, 21 g/m²'),
    'Adesivo: Acrílico Permanente 20 g/m²': ('Adhesive: permanent acrylic, 20 g/m²', 'Adhesivo: acrílico permanente, 20 g/m²'),
    'acrílico permanente 20g/m2 ( +/- 2g/m2)': ('permanent acrylic, 20 g/m² (+/- 2 g/m²)', 'acrílico permanente, 20 g/m² (+/- 2 g/m²)'),
    'Acrílico HIGH TACK permanente 20g/m2 (+ 2g/m2).': (
        'Permanent HIGH TACK acrylic, 20 g/m² (+ 2 g/m²).',
        'Acrílico HIGH TACK permanente, 20 g/m² (+ 2 g/m²).'),
    'Adesivo base solvente, 40 g/m²': ('Solvent-based adhesive, 40 g/m²', 'Adhesivo base solvente, 40 g/m²'),
    'Material acondicionado em caixa e bobinas de papelão com larguras de 0,50m ou 1,00m': (
        'Material packed in boxes and cardboard rolls, 0.50 m or 1.00 m wide',
        'Material embalado en cajas y bobinas de cartón con anchos de 0,50 m o 1,00 m'),
    'Material acondicionado em caixa e bobinas de papelão com larguras de 1,00m': (
        'Material packed in boxes and cardboard rolls, 1.00 m wide',
        'Material embalado en cajas y bobinas de cartón con ancho de 1,00 m'),
    'Material acondicionado em caixa e bobinas de papelão com largura de 1,00m.': (
        'Material packed in boxes and cardboard rolls, 1.00 m wide.',
        'Material embalado en cajas y bobinas de cartón con ancho de 1,00 m.'),
    'Material acondicionado em caixa e bobinas de papelão com largura de 1,00 ou 1,22m': (
        'Material packed in boxes and cardboard rolls, 1.00 m or 1.22 m wide',
        'Material embalado en cajas y bobinas de cartón con ancho de 1,00 m o 1,22 m'),
    'Material acondicionado em caixa e bobinas de papelão com largura de 0,46m.': (
        'Material packed in boxes and cardboard rolls, 0.46 m wide.',
        'Material embalado en cajas y bobinas de cartón con ancho de 0,46 m.'),
    'Material acondicionado em caixa e bobinas de papelão com largura de 1,38m.': (
        'Material packed in boxes and cardboard rolls, 1.38 m wide.',
        'Material embalado en cajas y bobinas de cartón con ancho de 1,38 m.'),
    'Material acondicionado em caixa de papelão com largura de 1,38m.': (
        'Material packed in cardboard boxes, 1.38 m wide.',
        'Material embalado en caja de cartón con ancho de 1,38 m.'),
    'Material acondicionado em caixa e bobinas de papelão com largura de 1,38m e Liner de 170g/m².': (
        'Material packed in boxes and cardboard rolls, 1.38 m wide, with a 170 g/m² liner.',
        'Material embalado en cajas y bobinas de cartón con ancho de 1,38 m y liner de 170 g/m².'),
    'Material acondicionado em caixas e bobinas de papelão com largura de 1,38m. Para as cores branca e preto há disponibilidade também na largura de 1,22m.': (
        'Material packed in boxes and cardboard rolls, 1.38 m wide. White and black are also available in 1.22 m width.',
        'Material embalado en cajas y bobinas de cartón con ancho de 1,38 m. Los colores blanco y negro también están disponibles en ancho de 1,22 m.'),
    'Material acondicionado em caixa de papelão com largura de 1,38m. Consulte a disponibilidade do ULTRA BLACK PIANO na largura de 1,22m com liner 140g/m².': (
        'Material packed in cardboard boxes, 1.38 m wide. Ask about ULTRA BLACK PIANO availability in 1.22 m width with a 140 g/m² liner.',
        'Material embalado en caja de cartón con ancho de 1,38 m. Consulte la disponibilidad de ULTRA BLACK PIANO en ancho de 1,22 m con liner de 140 g/m².'),
    'Material acondicionado em caixa e bobinas de papelão de diversas larguras.': (
        'Material packed in boxes and cardboard rolls in various widths.',
        'Material embalado en cajas y bobinas de cartón de varios anchos.'),
    '• Material acondicionado em caixas e bobinas de papelão com larguras de 0,50 e 1,00m.': (
        '• Material packed in boxes and cardboard rolls, 0.50 and 1.00 m wide.',
        '• Material embalado en cajas y bobinas de cartón con anchos de 0,50 y 1,00 m.'),
    'Durabilidade esperada: 6 meses. Também pode se estender ou diminuir em virtude das técnicas de aplicação e conservação.': (
        'Expected durability: 6 months. It may also extend or shorten depending on application and care techniques.',
        'Durabilidad esperada: 6 meses. También puede extenderse o reducirse según las técnicas de aplicación y conservación.'),
    'Durabilidade esperada: 1 ano. Também pode se estender ou diminuir em virtude das técnicas de aplicação e conservação.': (
        'Expected durability: 1 year. It may also extend or shorten depending on application and care techniques.',
        'Durabilidad esperada: 1 año. También puede extenderse o reducirse según las técnicas de aplicación y conservación.'),
    'Durabilidade esperada: 2 anos. Também pode se estender ou diminuir em virtude das técnicas de aplicação e conservação.': (
        'Expected durability: 2 years. It may also extend or shorten depending on application and care techniques.',
        'Durabilidad esperada: 2 años. También puede extenderse o reducirse según las técnicas de aplicación y conservación.'),
    'Durabilidade esperada: 3 anos. Também pode se estender ou diminuir em virtude das técnicas de aplicação e conservação.': (
        'Expected durability: 3 years. It may also extend or shorten depending on application and care techniques.',
        'Durabilidad esperada: 3 años. También puede extenderse o reducirse según las técnicas de aplicación y conservación.'),
    'Durabilidade esperada: 5 anos para uso em exteriores. A Alltak não se responsabiliza pela durabilidade da impressão.': (
        'Expected durability: 5 years for outdoor use. Alltak is not responsible for the durability of the print.',
        'Durabilidad esperada: 5 años para uso en exteriores. Alltak no se responsabiliza por la durabilidad de la impresión.'),
    'Durabilidade esperada: 5 anos para uso em exteriores (Ultra Cristal 2 anos).': (
        'Expected durability: 5 years for outdoor use (Ultra Cristal: 2 years).',
        'Durabilidad esperada: 5 años para uso en exteriores (Ultra Cristal: 2 años).'),
    'Durabilidade esperada: para SATIN: 5 anos para uso em exteriores;': (
        'Expected durability: for SATIN: 5 years for outdoor use;',
        'Durabilidad esperada: para SATIN: 5 años para uso en exteriores;'),
    'Para SATIN PEARL WHITE e SATIN cores metálicas: 1 ano para uso em exteriores;': (
        'For SATIN PEARL WHITE and SATIN metallic colors: 1 year for outdoor use;',
        'Para SATIN PEARL WHITE y los colores metálicos de SATIN: 1 año para uso en exteriores;'),
    'Na horizontal estas durabilidades são reduzidas a 30%. Também pode se estender ou diminuir em virtude das técnicas de aplicação e conservação.': (
        'On horizontal surfaces these durabilities are reduced by 30%. They may also extend or shorten depending on application and care techniques.',
        'En superficies horizontales estas durabilidades se reducen un 30%. También pueden extenderse o reducirse según las técnicas de aplicación y conservación.'),
    'Auto extinguível: Teste montado em alumínio': ('Self-extinguishing: test mounted on aluminum', 'Autoextinguible: prueba montada sobre aluminio'),
    'Frontal: PVC super calandrado polimérico 100μm (micra).': (
        'Face film: polymeric super-calendered PVC, 100 μm (microns).',
        'Frontal: PVC polimérico supercalandrado de 100 μm (micras).'),
    'PVC super calandrado polimérico 100 µm (micra).': (
        'Polymeric super-calendered PVC, 100 μm (microns).',
        'PVC polimérico supercalandrado de 100 μm (micras).'),
    'Frontal: PVC super calandrado polimérico 80µm (micra) para cores sólidas e 100µm (micra) para cores metálicas.': (
        'Face film: polymeric super-calendered PVC, 80 μm (microns) for solid colors and 100 μm (microns) for metallic colors.',
        'Frontal: PVC polimérico supercalandrado de 80 μm (micras) para colores sólidos y 100 μm (micras) para colores metálicos.'),
    'Frontal: PVC super calandrado polimérico 80 μm e 100μm (micra).': (
        'Face film: polymeric super-calendered PVC, 80 μm and 100 μm (microns).',
        'Frontal: PVC polimérico supercalandrado de 80 μm y 100 μm (micras).'),
    'Frontal: PVC super calandrado polimérico 100μm (micra), 120 μm para o Black Piano, e 170 μm (micra) para a cor Argent Metallic.': (
        'Face film: polymeric super-calendered PVC, 100 μm (microns), 120 μm for Black Piano and 170 μm (microns) for Argent Metallic.',
        'Frontal: PVC polimérico supercalandrado de 100 μm (micras), 120 μm para Black Piano y 170 μm (micras) para el color Argent Metallic.'),
    'Frontal em PVC super calandrado polimérico': ('Face film in polymeric super-calendered PVC', 'Frontal de PVC polimérico supercalandrado'),
    'PVC calandrado 80 micra (µm)': ('Calendered PVC, 80 microns (μm)', 'PVC calandrado de 80 micras (μm)'),
    'SATIN: PVC super calandrado polimérico 80µm (micra) cor sólida e 100µm (micra) cor metálica.': (
        'SATIN: polymeric super-calendered PVC, 80 μm (microns) for solid colors and 100 μm (microns) for metallic colors.',
        'SATIN: PVC polimérico supercalandrado de 80 μm (micras) para color sólido y 100 μm (micras) para color metálico.'),
    'SATIN PEARL WHITE: PVC super calandrado polimérico 160µm (micra);': (
        'SATIN PEARL WHITE: polymeric super-calendered PVC, 160 μm (microns);',
        'SATIN PEARL WHITE: PVC polimérico supercalandrado de 160 μm (micras);'),
    'SATIN: papel couché siliconizado 170g/m²;': (
        'SATIN: siliconized coated paper, 170 g/m²;',
        'SATIN: papel couché siliconado de 170 g/m²;'),
    'SATIN PEARL WHITE: papel couché siliconizado 170g/m².': (
        'SATIN PEARL WHITE: siliconized coated paper, 170 g/m².',
        'SATIN PEARL WHITE: papel couché siliconado de 170 g/m².'),
    'Liner: Papel couché siliconizado 170g/m2.': (
        'Liner: siliconized coated paper, 170 g/m².',
        'Liner: papel couché siliconado de 170 g/m².'),
    'Liner: Papel couché siliconizado 170g/m².': (
        'Liner: siliconized coated paper, 170 g/m².',
        'Liner: papel couché siliconado de 170 g/m².'),
    'Papel couché siliconizado 140g/m².': ('Siliconized coated paper, 140 g/m².', 'Papel couché siliconado de 140 g/m².'),
    'duas faces papel 120g/m2': ('two-sided paper, 120 g/m²', 'papel de dos caras, 120 g/m²'),
    'Liner PET 140 micra': ('PET liner, 140 microns', 'Liner PET de 140 micras'),
    'Desenvolvido para proteção e personalização de veículos, podendo ser utilizado para recorte.': (
        'Developed for vehicle protection and customization; it can also be used for cutting.',
        'Desarrollado para la protección y personalización de vehículos; también puede usarse para corte.'),
    'Desenvolvido para proteção e personalização de veículos, aceita impressão digital, podendo ser utilizado para recorte.': (
        'Developed for vehicle protection and customization; accepts digital printing and can be used for cutting.',
        'Desarrollado para la protección y personalización de vehículos; acepta impresión digital y puede usarse para corte.'),
    'Utilizada para fixação de materiais diversos que não possuam cola (papel fotográfico, papel de parede, placas, etc).': (
        'Used to attach materials that have no adhesive of their own (photo paper, wallpaper, boards, etc.).',
        'Utilizada para fijar materiales que no tienen adhesivo propio (papel fotográfico, papel tapiz, placas, etc.).'),
    'Utilizada para proteção de mascaramento para pinturas em geral.': (
        'Used as masking protection for painting jobs in general.',
        'Utilizada como protección de enmascarado para pinturas en general.'),
    'Utilizada para transferências de imagens impressas ou recortadas.': (
        'Used to transfer printed or cut images.',
        'Utilizada para transferir imágenes impresas o recortadas.'),
    'Utilizadas para etiquetas de troca de óleo, áreas de baixas temperaturas e úmidas (geladeiras de vidro, box de banheiros e vitrines).': (
        'Used for oil-change labels and cold or damp areas (glass coolers, shower enclosures and shop windows).',
        'Utilizadas para etiquetas de cambio de aceite y zonas frías o húmedas (refrigeradores de vidrio, mamparas de baño y vitrinas).'),
    'Laminação para Piso faz parte da Linha Alltak Laminação . Utilizado como antiderrapante, além de proteger seu piso.': (
        'Floor Lamination is part of the Alltak Lamination line. Used as an anti-slip layer while also protecting your floor.',
        'La laminación para pisos forma parte de la línea Alltak Laminación. Se usa como antideslizante, además de proteger el piso.'),
    'Transparente, Texturizado, Opaco': ('Clear, Textured, Opaque', 'Transparente, Texturizado, Opaco'),
    'A lavagem do veículo envelopado deve ser realizada com água e sabão neutro (shampoo automotivo de pH neutro).': (
        'Wrapped vehicles must be washed with water and neutral soap (pH-neutral automotive shampoo).',
        'El lavado del vehículo rotulado debe realizarse con agua y jabón neutro (champú automotriz de pH neutro).'),
    'Para materiais texturizados, deve-se usar esponja macia nas áreas de contato direto com poeiras, lama, etc.': (
        'For textured materials, use a soft sponge on areas in direct contact with dust, mud, etc.',
        'Para materiales texturizados, usar una esponja suave en las zonas de contacto directo con polvo, barro, etc.'),
    'Enxaguar com água em abundância e realizar a secagem do veículo.': (
        'Rinse with plenty of water and dry the vehicle.',
        'Enjuagar con abundante agua y secar el vehículo.'),
    'A grade quadriculada impressa no liner não possui métrica, portanto, sem referência para corte.': (
        'The grid printed on the liner has no measurements, so it is not a cutting reference.',
        'La cuadrícula impresa en el liner no tiene métrica, por lo tanto no sirve de referencia para el corte.'),
    'Rolos de 1,52 x 18 m (largura 152 cm, bobinas de 18 m)': (
        'Rolls of 1.52 x 18 m (152 cm wide, 18 m rolls)',
        'Rollos de 1,52 x 18 m (ancho de 152 cm, bobinas de 18 m)'),
    'Espessura de 100 micra (120 micra em Ruby Glaze, Sakura Pink, Silver Sky Blue e Thunderstorm Gray)': (
        '100-micron thickness (120 microns on Ruby Glaze, Sakura Pink, Silver Sky Blue and Thunderstorm Gray)',
        'Espesor de 100 micras (120 micras en Ruby Glaze, Sakura Pink, Silver Sky Blue y Thunderstorm Gray)'),
    'Sistema AIRFLOW antibolhas: otimiza em até 50% o tempo de aplicação': (
        'AIRFLOW bubble-free system: cuts application time by up to 50%',
        'Sistema AIRFLOW antiburbujas: optimiza hasta 50% el tiempo de aplicación'),
    'Efeito metalizado e brilho intenso': ('Metallic effect and intense gloss', 'Efecto metalizado y brillo intenso'),
    'Película de proteção': ('Protective film', 'Película de protección'),
    'Material direcional': ('Directional material', 'Material direccional'),
    'Acabamentos especiais': ('Special finishes', 'Acabados especiales'),
    'Sahara Matte Cooper Metallic (18EVO19M)': ('Sahara Matte Cooper Metallic (18EVO19M)', 'Sahara Matte Cooper Metallic (18EVO19M)'),
    'Sunset Pearl Matte Orange (18EVO20M)': ('Sunset Pearl Matte Orange (18EVO20M)', 'Sunset Pearl Matte Orange (18EVO20M)'),
    'Shadow Matte Black (18EVO02)': ('Shadow Matte Black (18EVO02)', 'Shadow Matte Black (18EVO02)'),
    'acabamento fosco': ('matte finish', 'acabado mate'),
    'acabamento fosco metalizado': ('metallic matte finish', 'acabado mate metalizado'),
    'AW: Auto Wrap': ('AW: Auto Wrap', 'AW: Auto Wrap'),
    'Importante: materiais transparentes ou translúcidos como o ULTRA CRISTAL não possuem sistema AIRFLOW.': (
        'Important: clear or translucent materials such as ULTRA CRISTAL do not have the AIRFLOW system.',
        'Importante: los materiales transparentes o translúcidos como ULTRA CRISTAL no tienen sistema AIRFLOW.'),
    'Nossos produtos não fazem parte da cadeia produtiva de autopeças e materiais para construção.': (
        'Our products are not part of the auto-parts or construction-materials supply chain.',
        'Nuestros productos no forman parte de la cadena productiva de autopartes ni de materiales de construcción.'),
    'Laminado por eletrostática.': ('Electrostatically laminated.', 'Laminado por electrostática.'),
    'Branco Glossy (Brilho), Branco Matte (Fosco), Transparente Glossy (Brilho) e Transparente Matte (Fosco).': (
        'White Glossy (gloss), White Matte (matte), Clear Glossy (gloss) and Clear Matte (matte).',
        'Blanco Glossy (brillo), Blanco Matte (mate), Transparente Glossy (brillo) y Transparente Matte (mate).'),
    'Aplicação Mínima (+ 10º a 40ºC )': ('Minimum application temperature (+10º to 40ºC)', 'Aplicación mínima (+10º a 40ºC)'),
    'Uso final ( -20º a +90ºC )': ('End use (-20º to +90ºC)', 'Uso final (-20º a +90ºC)'),
    # ---- Mold n' Hold ----
    'Acabamento preto texturizado, que simula o plástico de fábrica dos veículos': (
        'Black textured finish that mimics the factory plastic trim of vehicles',
        'Acabado negro texturizado que simula el plástico de fábrica de los vehículos'),
    'Medida: 23 m x 1 cm (0,39 inches x 23 yards)': (
        'Size: 23 m x 1 cm (0.39 inches x 23 yards)',
        'Medida: 23 m x 1 cm (0,39 pulgadas x 23 yardas)'),
    'Uso: selagem e acabamento de bordas em veículos envelopados': (
        'Use: edge sealing and finishing on wrapped vehicles',
        'Uso: sellado y acabado de bordes en vehículos rotulados'),
    # ---- Alltak® Decor (azulejo, básicas, cristais, estampados, kroma, pedras, tijolo, wood) ----
    'Rolos de 1,22 m x 25 m': ('Rolls of 1.22 m x 25 m', 'Rollos de 1,22 m x 25 m'),
    'Rolos de 1,22 m x 50 m': ('Rolls of 1.22 m x 50 m', 'Rollos de 1,22 m x 50 m'),
    'Jateado nas larguras de 1,00-1,22 e 1,50 m': (
        'Frosted in widths of 1.00-1.22 and 1.50 m',
        'Esmerilado en anchos de 1,00-1,22 y 1,50 m'),
    'PVC calandrado polimérico': ('Polymeric calendered PVC', 'PVC calandrado polimérico'),
    'PVC calandrado monomérico': ('Monomeric calendered PVC', 'PVC calandrado monomérico'),
    'Espessura 100 μm (micra)': ('Thickness: 100 μm (microns)', 'Espesor: 100 μm (micras)'),
    'Espessura 160 μm (micra)': ('Thickness: 160 μm (microns)', 'Espesor: 160 μm (micras)'),
    'Espessura 80-100 μm (micra)': ('Thickness: 80-100 μm (microns)', 'Espesor: 80-100 μm (micras)'),
    'Espessura 150-160 μm (micra)': ('Thickness: 150-160 μm (microns)', 'Espesor: 150-160 μm (micras)'),
    'Adesivo acrílico super permanente': ('Super-permanent acrylic adhesive', 'Adhesivo acrílico superpermanente'),
    'Adesivo acrílico permanente': ('Permanent acrylic adhesive', 'Adhesivo acrílico permanente'),
    'Acabamento texturizado opaco': ('Opaque textured finish', 'Acabado texturizado opaco'),
    'Acabamento texturizado opaco (concreto)': ('Opaque textured finish (concrete)', 'Acabado texturizado opaco (concreto)'),
    'Acabamento texturizado transparente': ('Clear textured finish', 'Acabado texturizado transparente'),
    'Acabamento brilhante (mármores)': ('Glossy finish (marbles)', 'Acabado brillante (mármoles)'),
    'Frontal PVC calandrado polimérico 140µm (micra)': (
        'Face film in polymeric calendered PVC, 140 μm (microns)',
        'Frontal de PVC calandrado polimérico de 140 μm (micras)'),
    'Frontal mais rígido': ('Stiffer face film', 'Frontal más rígido'),
    'Liner papel couché 140g/m²': ('Coated-paper liner, 140 g/m²', 'Liner de papel couché de 140 g/m²'),
    'Acabamento fosco texturizado': ('Textured matte finish', 'Acabado mate texturizado'),
    'Por que é Diferente?': ('Why is it different?', '¿Por qué es diferente?'),
    'Não é papel. É revestimento vinílico': (
        'It is not paper. It is a vinyl covering',
        'No es papel. Es revestimiento vinílico'),
    'Alltak® Decor é confeccionado em 100% PVC.': (
        'Alltak® Decor is made of 100% PVC.',
        'Alltak® Decor está fabricado en 100% PVC.'),
    'Calandrado de alta qualidade e já vem com adesivo para facilitar a instalação, sem sujeira, sem cheiro, antimofo, antifungo e alta resistência.': (
        'High-quality calendered material that already comes with adhesive for easy installation: no mess, no smell, anti-mold, anti-fungus and highly resistant.',
        'Calandrado de alta calidad que ya viene con adhesivo para facilitar la instalación: sin suciedad, sin olor, antimoho, antihongos y de alta resistencia.'),
    'Sistema airflow (anti-bolhas)': ('Airflow system (bubble-free)', 'Sistema Airflow (antiburbujas)'),
    'Sistema inovador desenvolvido pela Alltak® para a linha Kroma Forma que facilita , agiliza a instalação e evita as indesejáveis bolhas de ar': (
        'Innovative system developed by Alltak® for the Kroma Forma line that makes installation easier and faster and prevents unwanted air bubbles',
        'Sistema innovador desarrollado por Alltak® para la línea Kroma Forma que facilita y agiliza la instalación y evita las indeseables burbujas de aire'),
    'Sistema fusion': ('Fusion System', 'Sistema Fusion'),
    'Alltak®Decor possui dupla camada, protegendo a imagem, deixando o material mais resistente e ainda mais bonito!': (
        'Alltak® Decor has a double layer that protects the print, making the material more resistant and even more beautiful!',
        '¡Alltak® Decor tiene doble capa, que protege la imagen y deja el material más resistente y aún más bonito!'),
    'Fácil limpeza e alta resistência': ('Easy cleaning and high resistance', 'Fácil limpieza y alta resistencia'),
    'Por conta do Sistema Fusion, os filmes Alltak® Decor possuem resistência a produtos abrasivos e podem ser facilmente limpos com produtos convencionais.': (
        'Thanks to the Fusion System, Alltak® Decor films resist abrasive products and can be easily cleaned with conventional products.',
        'Gracias al Sistema Fusion, las películas Alltak® Decor resisten productos abrasivos y pueden limpiarse fácilmente con productos convencionales.'),
    'Super adesão': ('Super adhesion', 'Superadherencia'),
    'Os revestimentos adesivos Alltak® Decor possuem adesivo de alta fixação, mesmo em superfícies irregulares* sua aderência é superior.': (
        'Alltak® Decor adhesive coverings have a high-grip adhesive; even on irregular surfaces* their adhesion is superior.',
        'Los revestimientos adhesivos Alltak® Decor tienen un adhesivo de alta fijación; incluso en superficies irregulares* su adherencia es superior.'),
    '*Faça testes prévios de aderência antes da aplicação': (
        '*Run adhesion tests before application',
        '*Realice pruebas previas de adherencia antes de la aplicación'),
    'Termomoldável': ('Thermoformable', 'Termomoldeable'),
    'Alltak® Decor suporta a temperatura e podem ser moldados em cantos e cavidades leves, deixando um acabamento impecável.': (
        'Alltak® Decor withstands heat and can be molded around corners and light recesses, leaving a flawless finish.',
        'Alltak® Decor soporta la temperatura y puede moldearse en esquinas y cavidades leves, dejando un acabado impecable.'),
    'Textura realista': ('Realistic texture', 'Textura realista'),
    'Os revestimentos adesivos Alltak® Decor possuem texturas que dão um toque de sofisticação e realidade a cada estampa!': (
        'Alltak® Decor adhesive coverings have textures that add a touch of sophistication and realism to every pattern!',
        '¡Los revestimientos adhesivos Alltak® Decor tienen texturas que dan un toque de sofisticación y realismo a cada estampado!'),
    'Obra limpa, rápida, sem transtorno, sem sujeira, e com muita personalidade': (
        'A clean, fast job, with no hassle, no mess and lots of personality',
        'Obra limpia, rápida, sin molestias, sin suciedad y con mucha personalidad'),
    'Versatilidade de aplicações. Esse produto pode ser aplicado em diversas superfícies, como: móveis, paredes, eletrodomésticos, objetos e muito mais.': (
        'Versatile applications. This product can be applied to many surfaces, such as furniture, walls, appliances, objects and much more.',
        'Versatilidad de aplicaciones. Este producto puede aplicarse en diversas superficies, como muebles, paredes, electrodomésticos, objetos y mucho más.'),
    'Desde que a superfície esteja limpa e seca': (
        'As long as the surface is clean and dry',
        'Siempre que la superficie esté limpia y seca'),
    'A aplicação é rápida, sem transtornos, sem cheiro, sem quebra quebra e sem sujeira.': (
        'Application is fast, with no hassle, no smell, no demolition and no mess.',
        'La aplicación es rápida, sin molestias, sin olor, sin demoliciones y sin suciedad.'),
    'Grande variedade de padrões e texturas, para todos os estilos.': (
        'A wide variety of patterns and textures for every style.',
        'Gran variedad de diseños y texturas para todos los estilos.'),
    'Renova e protege móveis, eletrodomésticos, paredes e objetos, dando uma nova cara!': (
        'Renews and protects furniture, appliances, walls and objects, giving them a whole new look!',
        '¡Renueva y protege muebles, electrodomésticos, paredes y objetos, dándoles un aspecto nuevo!'),
    'Fácil limpeza e manutenção.': ('Easy cleaning and maintenance.', 'Fácil limpieza y mantenimiento.'),
    'Processo 100% reversível. Cansou, trocou!': (
        '100% reversible process. Tired of it? Change it!',
        'Proceso 100% reversible. ¿Se cansó? ¡Cámbielo!'),
    'Mais econômico e de excelente custo benefício': (
        'More economical and excellent value for money',
        'Más económico y con excelente relación costo-beneficio'),
    'Um ambiente visualmente renovado traz uma satisfação e cria uma nova atmosfera positiva e estimulante!': (
        'A visually renewed space brings satisfaction and creates a new, positive and stimulating atmosphere!',
        '¡Un ambiente visualmente renovado brinda satisfacción y crea una nueva atmósfera positiva y estimulante!'),
    # ---- FPP / PPF (proteção de pintura) ----
    'Acabamento Transparente Brilhante ou fosco': ('Clear glossy or matte finish', 'Acabado transparente brillante o mate'),
    'Adesivo Acrílico reposicionável, mais facilidade na aplicação': (
        'Repositionable acrylic adhesive for easier application',
        'Adhesivo acrílico reposicionable, para mayor facilidad de aplicación'),
    'PVC Calandrado 150 μm (micra).': ('Calendered PVC, 150 μm (microns).', 'PVC calandrado de 150 μm (micras).'),
    'Película de Proteção Moldável (Versão Brilhante)': (
        'Conformable protective film (glossy version)',
        'Película de protección moldeable (versión brillante)'),
    '2 Anos de durabilidade contra amarelamento': (
        '2-year durability against yellowing',
        '2 años de durabilidad contra el amarillamiento'),
    'Proteção U.V.': ('U.V. protection', 'Protección U.V.'),
    'Largura 1,38 m: bobinas com 25 m': ('Width 1.38 m: 25 m rolls', 'Ancho de 1,38 m: bobinas de 25 m'),
    'Alta flexibilidade e moldabilidade em superfícies curvas': (
        'High flexibility and conformability on curved surfaces',
        'Alta flexibilidad y moldeabilidad en superficies curvas'),
    'Pode ser aquecido com soprador térmico': ('Can be heated with a heat gun', 'Puede calentarse con pistola de calor'),
    'Durabilidade esperada* de 2 anos': ('Expected durability* of 2 years', 'Durabilidad esperada* de 2 años'),
    'Importante: Durabilidade podendo variar de acordo com as condições climáticas e cuidados na manutenção do veículo.': (
        'Important: Durability may vary according to weather conditions and the care taken in maintaining the vehicle.',
        'Importante: La durabilidad puede variar según las condiciones climáticas y los cuidados en el mantenimiento del vehículo.'),
    'Importante: Partes horizontais como Teto e Capô, possuem durabilidade reduzida, pois sofrem maior ação climática por conta da exposição excessiva aos raios solares e intempéries.': (
        'Important: Horizontal parts such as the roof and hood have reduced durability, as they suffer greater weathering due to excessive exposure to sunlight and the elements.',
        'Importante: Las partes horizontales como el techo y el capó tienen durabilidad reducida, ya que sufren una mayor acción climática por la exposición excesiva a los rayos solares y a la intemperie.'),
    'Importante: Não possui característica “Auto-regenerativa” quando exposto ao calor': (
        'Important: It does not have “self-healing” properties when exposed to heat',
        'Importante: No tiene característica “autorregenerativa” cuando se expone al calor'),
    'Instruções de aplicação: Recomendamos sempre a instalação em ambientes fechados, com temperatura controlada, entre 18ºC a 25ºC, livre de poeira e com as portas fechadas. A temperatura da lataria também deve ser ambiente, “não instale o material se a lataria estiver quente”! Podem ficar algumas marcas no material ao final da instalação. Não se preocupe, essas marcas irão sumir ao longo dos dias quando o veículo sair ao sol e calor.': (
        "Application instructions: We always recommend installing indoors, at a controlled temperature between 18ºC and 25ºC, in a dust-free area with the doors closed. The bodywork must also be at room temperature: “do not install the material if the bodywork is hot”! Some marks may remain on the material at the end of the installation. Don't worry, these marks will disappear over the following days as the vehicle is exposed to sun and heat.",
        'Instrucciones de aplicación: Recomendamos siempre la instalación en ambientes cerrados, con temperatura controlada, entre 18ºC y 25ºC, libres de polvo y con las puertas cerradas. La temperatura de la carrocería también debe ser la del ambiente: “¡no instale el material si la carrocería está caliente!”. Pueden quedar algunas marcas en el material al final de la instalación. No se preocupe, esas marcas desaparecerán con los días, cuando el vehículo salga al sol y al calor.'),
    'Lavagem: O veículo deve ser limpo usando somente água e shampoo neutro, sem produtos abrasivos, ceras ou derivados.': (
        'Washing: The vehicle must be cleaned using only water and neutral shampoo, without abrasive products, waxes or their derivatives.',
        'Lavado: El vehículo debe limpiarse usando solo agua y champú neutro, sin productos abrasivos, ceras ni derivados.'),
    'Limpeza: Recomendamos o uso de uma CLAY BAR para descontaminação e remoção de imperfeições na lataria.': (
        'Cleaning: We recommend using a CLAY BAR to decontaminate the bodywork and remove imperfections.',
        'Limpieza: Recomendamos el uso de una CLAY BAR para descontaminar la carrocería y remover imperfecciones.'),
    'Limpeza: Momentos antes da aplicação use o “Kleaner da linha WRAP CARE Alltak. Esse produto possui na sua composição o Isopropanol (Álcool isopropílico) que proporciona uma descontaminação completa e melhora o desempenho e aderência do material': (
        'Cleaning: Moments before application, use “Kleaner” from the WRAP CARE Alltak line. This product contains isopropanol (isopropyl alcohol), which provides complete decontamination and improves the performance and adhesion of the material',
        'Limpieza: Momentos antes de la aplicación, use “Kleaner” de la línea WRAP CARE Alltak. Este producto contiene isopropanol (alcohol isopropílico), que proporciona una descontaminación completa y mejora el desempeño y la adherencia del material'),
    'Instalação: Use uma quantidade pequena de shampoo neutro (johnson’s) 2ml/litro de água para promover a maleabilidade do material na superfície.': (
        'Installation: Use a small amount of neutral shampoo (johnson’s), 2 ml/liter of water, to make the material easier to work on the surface.',
        'Instalación: Use una pequeña cantidad de champú neutro (johnson’s), 2 ml/litro de agua, para favorecer la maleabilidad del material sobre la superficie.'),
    'Instalação: Inicie a o processo de aplicação do meio para as extremidades, assim você vai removendo o excesso de shampoo acumulado.': (
        'Installation: Start the application process from the center toward the edges, so you gradually remove the excess shampoo that builds up.',
        'Instalación: Inicie el proceso de aplicación del centro hacia los extremos; así irá retirando el exceso de champú acumulado.'),
    'Instalação: Não utilize espátulas de feltro, elas não possuem a pressão suficiente para ativar o tack do adesivo.': (
        'Installation: Do not use felt squeegees; they do not provide enough pressure to activate the adhesive tack.',
        'Instalación: No utilice espátulas de fieltro; no ejercen la presión suficiente para activar el tack del adhesivo.'),
    'Instalação: Use o soprador térmico para moldar peças curvas.': (
        'Installation: Use the heat gun to mold curved parts.',
        'Instalación: Use la pistola de calor para moldear piezas curvas.'),
    'Instalação: Após finalizado, remova a película de proteção transparente.': (
        'Installation: Once finished, remove the clear protective film.',
        'Instalación: Una vez finalizado, retire la película de protección transparente.'),
    'Instalação: Reaqueça usando o soprador térmico para garantir a conformidade a aderência total do material, principalmente nos cantos e nas curvas.': (
        'Installation: Reheat with the heat gun to ensure full conformity and adhesion of the material, especially on corners and curves.',
        'Instalación: Vuelva a calentar con la pistola de calor para garantizar la conformidad y la adherencia total del material, principalmente en las esquinas y curvas.'),
    'Instalação: Após a instalação podem ficar algumas manchas (veículos de cor escura), isso é uma reação química do contato da água com o adesivo. Devemos respeitar o tempo de cura do adesivo de 48h.': (
        "Installation: After installation, some stains may remain (on dark-colored vehicles); this is a chemical reaction caused by water coming into contact with the adhesive. The adhesive's 48h curing time must be respected.",
        'Instalación: Después de la instalación pueden quedar algunas manchas (vehículos de color oscuro); se trata de una reacción química del contacto del agua con el adhesivo. Se debe respetar el tiempo de curado del adhesivo de 48h.'),
    'Manutenção: Lembrando que o objetivo da película é proteger a pintura. Caso tenha algum dano, troque a película e mantenha seu veículo protegido.': (
        'Maintenance: Remember that the purpose of the film is to protect the paint. If it gets damaged, replace the film and keep your vehicle protected.',
        'Mantenimiento: Recuerde que el objetivo de la película es proteger la pintura. Si sufre algún daño, cambie la película y mantenga su vehículo protegido.'),
    'Manutenção: Não utilize produtos abrasivos, lave somente com água e shampoo neutro. Não recomendamos lavar em equipamentos de “LAVA JATO”; suas cerdas podem riscar e soltar o material da lataria.': (
        'Maintenance: Do not use abrasive products; wash only with water and neutral shampoo. We do not recommend washing in automatic “CAR WASH” equipment; its bristles can scratch the material and lift it off the bodywork.',
        'Mantenimiento: No utilice productos abrasivos; lave solo con agua y champú neutro. No recomendamos lavar en equipos de “LAVADO AUTOMÁTICO”; sus cerdas pueden rayar el material y despegarlo de la carrocería.'),
    'Manutenção: Se for estacionar por um longo período, procure locais cobertos ou com sombra.': (
        'Maintenance: If you are going to park for a long period, look for covered or shaded places.',
        'Mantenimiento: Si va a estacionar por un período prolongado, busque lugares cubiertos o con sombra.'),
    'Manutenção: Não recomendamos estacionar em baixo de árvores, pois detritos são inevitáveis.': (
        'Maintenance: We do not recommend parking under trees, as falling debris is unavoidable.',
        'Mantenimiento: No recomendamos estacionar debajo de árboles, ya que los residuos son inevitables.'),
    'Manutenção: Procure limpar as sujeiras imediatamente, afim de evitar manchas irreversíveis na película.': (
        'Maintenance: Try to clean off any dirt immediately to avoid irreversible stains on the film.',
        'Mantenimiento: Procure limpiar la suciedad de inmediato, a fin de evitar manchas irreversibles en la película.'),
    # FPP: frase inteira (antes partida em 5 itens pelos links do WordPress)
    'Manutenção: Para maior durabilidade e proteção do material, recomendamos o uso regular do Protetik, selante cerâmico da linha Wrap Care Alltak. Esse produto possui proteção contra os raios UV, preservando a cor e evitando o desbotamento. Além disso, possui hidrorrepelência, como uma vitrificação, facilitando a manutenção e a lavagem.': (
        'Maintenance: For greater durability and protection of the material, we recommend regular use of Protetik, the ceramic sealant from the Alltak Wrap Care line. This product offers protection against UV rays, preserving the color and preventing fading. It is also water-repellent, like a vitrification, making maintenance and washing easier.',
        'Mantenimiento: Para mayor durabilidad y protección del material, recomendamos el uso regular de Protetik, sellador cerámico de la línea Wrap Care de Alltak. Este producto ofrece protección contra los rayos UV, preservando el color y evitando la decoloración. Además, es hidrorrepelente, como una vitrificación, lo que facilita el mantenimiento y el lavado.'),
    # (frase partida em 5 itens no PT: "uso regular do “protetik” selante cerâmico da linha “WRAP CARE Alltak“.")
    'Manutenção: Para maior durabilidade e proteção do material, recomendamos o uso regular do “': (
        'Maintenance: For greater durability and protection of the material, we recommend regular use of “',
        'Mantenimiento: Para mayor durabilidad y protección del material, recomendamos el uso regular de “'),
    'Manutenção: protetik': ('Maintenance: protetik', 'Mantenimiento: protetik'),
    'Manutenção: ” selante cerâmico da linha “': (
        'Maintenance: ”, the ceramic sealant from the “',
        'Mantenimiento: ”, sellador cerámico de la línea “'),
    'Manutenção: WRAP CARE Alltak': ('Maintenance: WRAP CARE Alltak', 'Mantenimiento: WRAP CARE Alltak'),
    'Manutenção: “. Esse produto possui proteção contra os raios U.V., preservando a cor, evitando o desbotamento. Além disso possui hidrorepelência, como uma vitrificação, facilitando a manutenção e a lavagem.': (
        'Maintenance: ” line. This product offers protection against U.V. rays, preserving the color and preventing fading. It is also water-repellent, like a vitrification, making maintenance and washing easier.',
        'Mantenimiento: ”. Este producto ofrece protección contra los rayos U.V., preservando el color y evitando la decoloración. Además, es hidrorrepelente, como una vitrificación, lo que facilita el mantenimiento y el lavado.'),
    'Manutenção: Consulte os boletins técnicos': ('Maintenance: See the technical bulletins', 'Mantenimiento: Consulte los boletines técnicos'),
    'Manutenção: fpp - filme de proteção de pintura': (
        'Maintenance: fpp - paint protection film',
        'Mantenimiento: fpp - película de protección de pintura'),
    'Manutenção: Confira os nossos vídeos sobre o PPF da Alltak!': (
        "Maintenance: Check out our videos about Alltak's PPF!",
        'Mantenimiento: ¡Vea nuestros videos sobre el PPF de Alltak!'),
    # ---- Premium ----
    'Frontal: PVC supercalandrado polimérico': ('Face film: polymeric super-calendered PVC', 'Frontal: PVC polimérico supercalandrado'),
    'Liner: papel couché siliconizado 130 g/m²': ('Liner: siliconized coated paper, 130 g/m²', 'Liner: papel couché siliconado de 130 g/m²'),
    'Adesivo: acrílico permanente': ('Adhesive: permanent acrylic', 'Adhesivo: acrílico permanente'),
    'Indicações: envelopamento de móveis, eletrodomésticos, objetos, sinalização e propaganda': (
        'Recommended uses: wrapping of furniture, appliances and objects, signage and advertising',
        'Indicaciones: rotulación de muebles, electrodomésticos y objetos, señalización y publicidad'),
    'Corte macio, que aumenta a durabilidade da lâmina de recorte': (
        'Smooth cutting that extends the life of the cutting blade',
        'Corte suave, que aumenta la durabilidad de la cuchilla de corte'),
    # ---- Wrap Care: Adesive Killer, Kleaner, Protetik ----
    'Modo de usar: pulverize uma pequena quantidade do produto na área a ser limpa.': (
        'How to use: spray a small amount of the product on the area to be cleaned.',
        'Modo de uso: rocíe una pequeña cantidad del producto en el área a limpiar.'),
    'Modo de usar: aguarde alguns segundos e esfregue com a ajuda de um pincel ou de uma espátula plástica macia até sentir o desprendimento da contaminação.': (
        'How to use: wait a few seconds and scrub with a brush or a soft plastic squeegee until you feel the contamination coming loose.',
        'Modo de uso: espere unos segundos y frote con la ayuda de un pincel o de una espátula plástica suave hasta sentir que la contaminación se desprende.'),
    'Modo de usar: pulverize água em abundância e continue esfregando para a remoção total do resíduo; a água também aumenta o rendimento.': (
        'How to use: spray plenty of water and keep scrubbing until the residue is completely removed; water also increases the yield.',
        'Modo de uso: rocíe abundante agua y siga frotando hasta remover totalmente el residuo; el agua también aumenta el rendimiento.'),
    'Modo de usar: seque a peça em seguida com um pano de microfibra limpo e seco. Se necessário, repita a operação.': (
        'How to use: then dry the part with a clean, dry microfiber cloth. If necessary, repeat the operation.',
        'Modo de uso: a continuación, seque la pieza con un paño de microfibra limpio y seco. Si es necesario, repita la operación.'),
    'Observação: o produto tem afinidade com a maioria dos tipos de cola de adesivos, mas é necessário um pequeno teste para confirmar a compatibilidade com a contaminação.': (
        'Note: the product is compatible with most types of adhesive glue, but a small test is needed to confirm compatibility with the contamination.',
        'Observación: el producto tiene afinidad con la mayoría de los tipos de pegamento de adhesivos, pero es necesaria una pequeña prueba para confirmar la compatibilidad con la contaminación.'),
    'Instruções: use sempre EPIs, como luvas e máscara.': (
        'Instructions: always wear PPE, such as gloves and a mask.',
        'Instrucciones: use siempre EPP, como guantes y mascarilla.'),
    'Instruções: mantenha longe do alcance das crianças.': (
        'Instructions: keep out of the reach of children.',
        'Instrucciones: manténgase fuera del alcance de los niños.'),
    'Instruções: aplique o produto em ambientes ventilados e leia as instruções antes de usar.': (
        'Instructions: apply the product in ventilated areas and read the instructions before use.',
        'Instrucciones: aplique el producto en ambientes ventilados y lea las instrucciones antes de usar.'),
    'Modo de usar: lave o carro.': ('How to use: wash the car.', 'Modo de uso: lave el auto.'),
    'Modo de usar: descontamine a pintura com uma barra descontaminante e enxágue o veículo.': (
        'How to use: decontaminate the paint with a decontamination clay bar and rinse the vehicle.',
        'Modo de uso: descontamine la pintura con una barra descontaminante y enjuague el vehículo.'),
    'Modo de usar: com a pintura seca, pulverize uma pequena quantidade do produto em área não superior a 50 cm x 50 cm.': (
        'How to use: with the paint dry, spray a small amount of the product over an area no larger than 50 cm x 50 cm.',
        'Modo de uso: con la pintura seca, rocíe una pequeña cantidad del producto en un área no mayor a 50 cm x 50 cm.'),
    'Modo de usar: faça a remoção com um pano de microfibra limpo e seco.': (
        'How to use: wipe it off with a clean, dry microfiber cloth.',
        'Modo de uso: retírelo con un paño de microfibra limpio y seco.'),
    'Instruções: aplique o produto em ambientes ventilados.': (
        'Instructions: apply the product in ventilated areas.',
        'Instrucciones: aplique el producto en ambientes ventilados.'),
    'Instruções: use pano de microfibra limpo e seco, ou um pano que não solte fiapos.': (
        'Instructions: use a clean, dry microfiber cloth or a lint-free cloth.',
        'Instrucciones: use un paño de microfibra limpio y seco, o un paño que no suelte pelusa.'),
    'Instruções: produto inflamável. Mantenha fora do alcance das crianças e animais domésticos.': (
        'Instructions: flammable product. Keep out of the reach of children and pets.',
        'Instrucciones: producto inflamable. Manténgase fuera del alcance de los niños y de los animales domésticos.'),
    'Modo de usar: certifique-se de que a superfície esteja limpa e seca.': (
        'How to use: make sure the surface is clean and dry.',
        'Modo de uso: asegúrese de que la superficie esté limpia y seca.'),
    'Modo de usar: agite bem o produto antes de usar.': (
        'How to use: shake the product well before use.',
        'Modo de uso: agite bien el producto antes de usar.'),
    'Modo de usar: pulverize uma pequena névoa do produto na superfície do veículo, em área máxima de 60 cm x 60 cm.': (
        'How to use: spray a light mist of the product on the vehicle surface, over a maximum area of 60 cm x 60 cm.',
        'Modo de uso: rocíe una ligera bruma del producto sobre la superficie del vehículo, en un área máxima de 60 cm x 60 cm.'),
    'Modo de usar: faça o acabamento com um pano de microfibra limpo e seco, virando-o com frequência até obter o resultado desejado.': (
        'How to use: finish with a clean, dry microfiber cloth, turning it frequently until you get the desired result.',
        'Modo de uso: haga el acabado con un paño de microfibra limpio y seco, volteándolo con frecuencia hasta obtener el resultado deseado.'),
    'Modo de usar: repita o processo até concluir o veículo. Se surgirem manchas, repita a aplicação.': (
        'How to use: repeat the process until the whole vehicle is done. If any smudges appear, repeat the application.',
        'Modo de uso: repita el proceso hasta terminar el vehículo. Si aparecen manchas, repita la aplicación.'),
    'Rendimento: um frasco de 500 ml protege até 10 veículos de passeio.': (
        'Coverage: one 500 ml bottle protects up to 10 passenger cars.',
        'Rendimiento: un frasco de 500 ml protege hasta 10 vehículos de pasajeros.'),
    'Instruções: mantenha longe do alcance das crianças e aplique em ambientes ventilados.': (
        'Instructions: keep out of the reach of children and apply in ventilated areas.',
        'Instrucciones: manténgase fuera del alcance de los niños y aplique en ambientes ventilados.'),
}

# ---- descrições: slug → {pt (corrigida, opcional), en, es} ----
DESC = {
    'laminacoes': {
        'en': 'Our lamination film was developed for interior decoration. Widely used as an anti-slip layer for floors and to protect printed images.',
        'es': 'Nuestro adhesivo de laminación fue desarrollado para la decoración de ambientes. Muy utilizado como antideslizante para pisos y para la protección de imágenes.',
    },
    'mascara-de-protecao': {
        'pt': 'Aplicar em superfície lisa e plana previamente limpa utilizando álcool isopropílico. Depois de aplicado evitar produtos agressivos e atritos constantes, usar sabão neutro. Material acondicionado em caixa e bobinas de papelão com larguras de 0,50m ou 1,00m. Durabilidade esperada: 6 meses. Também pode se estender ou diminuir em virtude das técnicas de aplicação e conservação.',
        'en': 'Apply on a smooth, flat surface previously cleaned with isopropyl alcohol. After application, avoid aggressive products and constant friction; use neutral soap. Material packed in boxes and cardboard rolls, 0.50 m or 1.00 m wide. Expected durability: 6 months. It may also extend or shorten depending on application and care techniques.',
        'es': 'Aplicar sobre una superficie lisa y plana previamente limpiada con alcohol isopropílico. Después de la aplicación, evitar productos agresivos y fricciones constantes; usar jabón neutro. Material embalado en cajas y bobinas de cartón con anchos de 0,50 m o 1,00 m. Durabilidad esperada: 6 meses. También puede extenderse o reducirse según las técnicas de aplicación y conservación.',
    },
    'pisos': {
        'pt': 'Laminação para Piso faz parte da Linha Alltak Laminação. Utilizado como antiderrapante, além de proteger seu piso. Aplicar em superfície lisa e plana previamente limpa utilizando álcool isopropílico. Material acondicionado em caixa e bobinas de papelão com largura de 1,00 ou 1,22m. Durabilidade esperada: 2 anos. Também pode se estender ou diminuir em virtude das técnicas de aplicação e conservação. Armazenar a temperaturas entre 20º e 30ºC, umidade relativa do ar entre 40% e 50%. Validade: 2 anos a partir da data de fabricação, estando acondicionado na embalagem original e em local apropriado.',
        'en': 'Floor Lamination is part of the Alltak Lamination line. Used as an anti-slip layer while also protecting your floor. Apply on a smooth, flat surface previously cleaned with isopropyl alcohol. Material packed in boxes and cardboard rolls, 1.00 m or 1.22 m wide. Expected durability: 2 years. It may also extend or shorten depending on application and care techniques. Store at temperatures between 20ºC and 30ºC, with relative humidity between 40% and 50%. Shelf life: 2 years from the manufacturing date, kept in the original packaging in a suitable place.',
        'es': 'La laminación para pisos forma parte de la línea Alltak Laminación. Se usa como antideslizante, además de proteger el piso. Aplicar sobre una superficie lisa y plana previamente limpiada con alcohol isopropílico. Material embalado en cajas y bobinas de cartón con ancho de 1,00 m o 1,22 m. Durabilidad esperada: 2 años. También puede extenderse o reducirse según las técnicas de aplicación y conservación. Almacenar a temperaturas entre 20ºC y 30ºC, con humedad relativa entre 40% y 50%. Vigencia: 2 años a partir de la fecha de fabricación, conservado en el embalaje original y en un lugar adecuado.',
    },
    'kroma': {
        'en': 'High-quality calendered film that already comes with adhesive for easy installation: no mess, no smell, anti-mold, anti-fungus and highly resistant. Alltak® Decor has a double layer that protects the print, making the material more resistant and even more beautiful. Thanks to the Fusion System, Alltak® Decor films resist abrasive products and can be easily cleaned. Alltak® Decor adhesive coverings have a high-grip adhesive; even on irregular surfaces* their adhesion is superior. Alltak® Decor withstands heat and can be molded around corners and light recesses, leaving a flawless finish.',
        'es': 'Película calandrada de alta calidad que ya viene con adhesivo para facilitar la instalación: sin suciedad, sin olor, antimoho, antihongos y de alta resistencia. Alltak® Decor tiene doble capa, protegiendo la imagen y dejando el material más resistente y aún más bonito. Gracias al Sistema Fusion, las películas Alltak® Decor resisten productos abrasivos y pueden limpiarse fácilmente. Los revestimientos adhesivos Alltak® Decor tienen un adhesivo de alta fijación; incluso en superficies irregulares* su adherencia es superior. Alltak® Decor soporta la temperatura y puede moldearse en esquinas y cavidades leves, dejando un acabado impecable.',
    },
    'carbon': {
        'en': "Images are for illustration only; for a more accurate perception, request our color catalog from your nearest distributor. Developed for vehicle protection and customization; accepts digital printing and can be used for cutting. Store at temperatures between 20ºC and 30ºC, with relative humidity between 40% and 50%. Shelf life: 2 years from the manufacturing date, kept in the original packaging in a suitable place. Apply on a smooth, flat surface previously cleaned with isopropyl alcohol, avoiding contact with dust, impurities, grease or any other chemical product that could affect the material's adhesion. The material should only be applied to painted or freshly painted surfaces after at least three weeks and full curing; the compatibility of lacquers and paints must be tested by the user before application.",
        'es': 'Imágenes meramente ilustrativas; para una percepción más real, solicite nuestro catálogo de colores a su distribuidor más cercano. Desarrollado para la protección y personalización de vehículos; acepta impresión digital y puede usarse para corte. Almacenar a temperaturas entre 20ºC y 30ºC, con humedad relativa entre 40% y 50%. Vigencia: 2 años a partir de la fecha de fabricación, conservado en el embalaje original y en un lugar adecuado. Aplicar sobre una superficie lisa y plana previamente limpiada con alcohol isopropílico, evitando el contacto con polvo, impurezas, grasa o cualquier otro producto químico que pueda afectar la adherencia del material. El material solo debe aplicarse sobre superficies pintadas o recién pintadas respetando un plazo mínimo de tres semanas y el curado completo; la compatibilidad de lacas y pinturas debe ser probada por el usuario antes de la aplicación.',
    },
    'evolution-pro': {
        'en': 'Images are for illustration only. For a more accurate perception, request our color catalog from your nearest distributor. 100-micron thickness (120 microns on Ruby Glaze, Sakura Pink, Silver Sky Blue and Thunderstorm Gray). MATTE products have a translucent white protective film, which can give a false impression of the color when opening the box; once the film is removed, color and finish match the standards. Expected durability of 5 years outdoors. Metallic colors in general: 3 years. On horizontal applications (hood and roof) this durability is reduced by up to 30%; it may also extend or shorten depending on application techniques, care and weather exposure.',
        'es': 'Imágenes meramente ilustrativas. Para una percepción más real, solicite nuestro catálogo de colores a su distribuidor más cercano. Espesor de 100 micras (120 micras en Ruby Glaze, Sakura Pink, Silver Sky Blue y Thunderstorm Gray). Los productos MATTE (mate) tienen una película de protección blanca translúcida, lo que puede causar una falsa evaluación del color al abrir la caja; al retirar la película, el color y el acabado quedan conforme a los estándares. Durabilidad esperada de 5 años en exteriores. Colores metálicos en general: 3 años. En aplicaciones horizontales (capó y techo) esta durabilidad se reduce hasta un 30%; también puede extenderse o reducirse según las técnicas de aplicación, la conservación y la exposición a la intemperie.',
    },
    'fx': {
        'pt': 'Exclusivo sistema de micro canais, antibolhas, que otimizam o tempo de aplicação da película em até 50%. Contém Liner de papel couché siliconizado e adesivo acrílico reposicionável. Imagens meramente ilustrativas, para uma percepção mais real solicite nosso catálogo de cores no seu distribuidor mais próximo. Desenvolvido para proteção e personalização de veículos, podendo ser utilizado para recorte. Armazenar a temperaturas entre 20º e 30ºC, umidade relativa do ar entre 40% e 50%. Validade: 2 anos a partir da data de fabricação, estando acondicionado na embalagem original e em local apropriado. Aplicar em superfície lisa e plana previamente limpa utilizando álcool isopropílico. Depois de aplicado evitar produtos agressivos e atritos constantes, usar sabão neutro.',
        'en': 'Exclusive bubble-free micro-channel system that cuts film application time by up to 50%. Siliconized coated-paper liner and repositionable acrylic adhesive. Images are for illustration only; for a more accurate perception, request our color catalog from your nearest distributor. Developed for vehicle protection and customization; it can also be used for cutting. Store at temperatures between 20ºC and 30ºC, with relative humidity between 40% and 50%. Shelf life: 2 years from the manufacturing date, kept in the original packaging in a suitable place. Apply on a smooth, flat surface previously cleaned with isopropyl alcohol. After application, avoid aggressive products and constant friction; use neutral soap.',
        'es': 'Exclusivo sistema de microcanales antiburbujas que optimiza hasta 50% el tiempo de aplicación de la película. Liner de papel couché siliconado y adhesivo acrílico reposicionable. Imágenes meramente ilustrativas; para una percepción más real, solicite nuestro catálogo de colores a su distribuidor más cercano. Desarrollado para la protección y personalización de vehículos; también puede usarse para corte. Almacenar a temperaturas entre 20ºC y 30ºC, con humedad relativa entre 40% y 50%. Vigencia: 2 años a partir de la fecha de fabricación, conservado en el embalaje original y en un lugar adecuado. Aplicar sobre una superficie lisa y plana previamente limpiada con alcohol isopropílico. Después de la aplicación, evitar productos agresivos y fricciones constantes; usar jabón neutro.',
    },
    'jateado': {
        'en': 'Images are for illustration only; for a more accurate perception, request our color catalog from your nearest distributor. Developed for vehicle protection and customization; it can also be used for cutting. Material packed in boxes and cardboard rolls, 1.38 m wide, with a 170 g/m² liner. Expected durability: 5 years (except metallic colors: 1 year); on horizontal surfaces this durability is reduced by 30%. It may also extend or shorten depending on application and care techniques. Store at temperatures between 20ºC and 30ºC, with relative humidity between 40% and 50%. Shelf life: 2 years from the manufacturing date, kept in the original packaging in a suitable place.',
        'es': 'Imágenes meramente ilustrativas; para una percepción más real, solicite nuestro catálogo de colores a su distribuidor más cercano. Desarrollado para la protección y personalización de vehículos; también puede usarse para corte. Material embalado en cajas y bobinas de cartón con ancho de 1,38 m y liner de 170 g/m². Durabilidad esperada: 5 años (excepto colores metálicos: 1 año); en superficies horizontales esta durabilidad se reduce un 30%. También puede extenderse o reducirse según las técnicas de aplicación y conservación. Almacenar a temperaturas entre 20ºC y 30ºC, con humedad relativa entre 40% y 50%. Vigencia: 2 años a partir de la fecha de fabricación, conservado en el embalaje original y en un lugar adecuado.',
    },
    'klear': {
        'pt': 'Imagens meramente ilustrativas, para uma percepção mais real solicite nosso catálogo de cores no seu distribuidor mais próximo. Desenvolvido para proteção e personalização de veículos e faróis, podendo ser utilizado para recorte. Boa estabilidade em superfícies lisas e curvas, resistente a impactos leves. Armazenar a temperaturas entre 20º e 30ºC, umidade relativa do ar entre 40% e 50%. Validade: 2 anos a partir da data de fabricação, estando acondicionado na embalagem original e em local apropriado. Durabilidade esperada: 5 anos, com durabilidade reduzida a 30% na horizontal. Também pode se estender ou diminuir em virtude das técnicas de aplicação e conservação. Aplicar em superfície lisa e plana previamente limpa utilizando álcool isopropílico.',
        'en': 'Images are for illustration only; for a more accurate perception, request our color catalog from your nearest distributor. Developed for the protection and customization of vehicles and headlights; it can also be used for cutting. Good stability on smooth and curved surfaces, resistant to light impacts. Store at temperatures between 20ºC and 30ºC, with relative humidity between 40% and 50%. Shelf life: 2 years from the manufacturing date, kept in the original packaging in a suitable place. Expected durability: 5 years, reduced by 30% on horizontal surfaces. It may also extend or shorten depending on application and care techniques. Apply on a smooth, flat surface previously cleaned with isopropyl alcohol.',
        'es': 'Imágenes meramente ilustrativas; para una percepción más real, solicite nuestro catálogo de colores a su distribuidor más cercano. Desarrollado para la protección y personalización de vehículos y faros; también puede usarse para corte. Buena estabilidad en superficies lisas y curvas, resistente a impactos leves. Almacenar a temperaturas entre 20ºC y 30ºC, con humedad relativa entre 40% y 50%. Vigencia: 2 años a partir de la fecha de fabricación, conservado en el embalaje original y en un lugar adecuado. Durabilidad esperada: 5 años, reducida un 30% en superficies horizontales. También puede extenderse o reducirse según las técnicas de aplicación y conservación. Aplicar sobre una superficie lisa y plana previamente limpiada con alcohol isopropílico.',
    },
    'krusher': {
        'pt': 'Imagens meramente ilustrativas, para uma percepção mais real solicite nosso catálogo de cores no seu distribuidor mais próximo. Desenvolvido para proteção e personalização de veículos, podendo ser utilizado para recorte. Boa estabilidade em superfícies lisas e curvas, resistente a impactos leves. Armazenar a temperaturas entre 20º e 30ºC, umidade relativa do ar entre 40% e 50%. Validade: 2 anos a partir da data de fabricação, estando acondicionado na embalagem original e em local apropriado. Durabilidade esperada: 5 anos (exceto cores metálicas: 1 ano); na horizontal esta durabilidade é reduzida a 30%. Também pode se estender ou diminuir em virtude das técnicas de aplicação e conservação. Aplicar em superfície lisa e plana previamente limpa utilizando álcool isopropílico, evitando o contato com pó, impurezas, oleosidade ou qualquer outro produto químico que possa afetar a aderência do material.',
        'en': "Images are for illustration only; for a more accurate perception, request our color catalog from your nearest distributor. Developed for vehicle protection and customization; it can also be used for cutting. Good stability on smooth and curved surfaces, resistant to light impacts. Store at temperatures between 20ºC and 30ºC, with relative humidity between 40% and 50%. Shelf life: 2 years from the manufacturing date, kept in the original packaging in a suitable place. Expected durability: 5 years (except metallic colors: 1 year); on horizontal surfaces this durability is reduced by 30%. It may also extend or shorten depending on application and care techniques. Apply on a smooth, flat surface previously cleaned with isopropyl alcohol, avoiding contact with dust, impurities, grease or any other chemical product that could affect the material's adhesion.",
        'es': 'Imágenes meramente ilustrativas; para una percepción más real, solicite nuestro catálogo de colores a su distribuidor más cercano. Desarrollado para la protección y personalización de vehículos; también puede usarse para corte. Buena estabilidad en superficies lisas y curvas, resistente a impactos leves. Almacenar a temperaturas entre 20ºC y 30ºC, con humedad relativa entre 40% y 50%. Vigencia: 2 años a partir de la fecha de fabricación, conservado en el embalaje original y en un lugar adecuado. Durabilidad esperada: 5 años (excepto colores metálicos: 1 año); en superficies horizontales esta durabilidad se reduce un 30%. También puede extenderse o reducirse según las técnicas de aplicación y conservación. Aplicar sobre una superficie lisa y plana previamente limpiada con alcohol isopropílico, evitando el contacto con polvo, impurezas, grasa o cualquier otro producto químico que pueda afectar la adherencia del material.',
    },
    'satin': {
        'en': 'Images are for illustration only; for a more accurate perception, request our color catalog from your nearest distributor. Store at temperatures between 20ºC and 30ºC, with relative humidity between 40% and 50%. Shelf life: 2 years from the manufacturing date, kept in the original packaging in a suitable place. Packed in boxes and cardboard rolls, 1.38 m wide; white and black are also available in 1.22 m width. On horizontal surfaces these durabilities are reduced by 30%. They may also extend or shorten depending on application and care techniques. Apply on a smooth, flat surface previously cleaned with isopropyl alcohol. After application, avoid aggressive products and constant friction; use neutral soap.',
        'es': 'Imágenes meramente ilustrativas; para una percepción más real, solicite nuestro catálogo de colores a su distribuidor más cercano. Almacenar a temperaturas entre 20ºC y 30ºC, con humedad relativa entre 40% y 50%. Vigencia: 2 años a partir de la fecha de fabricación, conservado en el embalaje original y en un lugar adecuado. Embalado en cajas y bobinas de cartón con ancho de 1,38 m; los colores blanco y negro también están disponibles en ancho de 1,22 m. En superficies horizontales estas durabilidades se reducen un 30%. También pueden extenderse o reducirse según las técnicas de aplicación y conservación. Aplicar sobre una superficie lisa y plana previamente limpiada con alcohol isopropílico. Después de la aplicación, evitar productos agresivos y fricciones constantes; usar jabón neutro.',
    },
    'ultra': {
        'en': 'A high-gloss polymeric super-calendered PVC film, available in solid and metallic colors. Siliconized coated-paper liner with AIRFLOW 3.0 technology, repositionable acrylic adhesive and protective film. Images are for illustration only; for a more accurate perception, request our color catalog from your nearest distributor. Developed for full wraps, protection and customization of vehicles; it can also be used for electronic cutting. Good stability on smooth and curved surfaces, resistant to light impacts. Face film: polymeric super-calendered PVC, 100 μm (microns), 120 μm for Black Piano and 170 μm (microns) for Argent Metallic. Store at temperatures between 20ºC and 30ºC, with relative humidity between 40% and 50%.',
        'es': 'Película de PVC polimérico supercalandrado de alto brillo, disponible en colores sólidos y metálicos. Liner de papel couché siliconado con tecnología AIRFLOW 3.0, adhesivo acrílico reposicionable y película de protección. Imágenes meramente ilustrativas; para una percepción más real, solicite nuestro catálogo de colores a su distribuidor más cercano. Desarrollado para la rotulación total, protección y personalización de vehículos; también puede usarse para corte electrónico. Buena estabilidad en superficies lisas y curvas, resistente a impactos leves. Frontal: PVC polimérico supercalandrado de 100 μm (micras), 120 μm para Black Piano y 170 μm (micras) para el color Argent Metallic. Almacenar a temperaturas entre 20ºC y 30ºC, con humedad relativa entre 40% y 50%.',
    },
    'eletrostatico': {
        'pt': 'Produto com excelente printabilidade e ancoragem da tinta, homologado pelos principais fabricantes de máquinas e tintas. Alltak® Print é uma linha de películas de PVC, produzida com adesivo acrílico permanente, removível e reposicionável, especialmente desenvolvida para impressão em Flexografia, Offset, Serigrafia e Digital. Película de PVC sem adesivo, com aderência por estática. Muito utilizada para etiquetas de troca de óleo, áreas de baixas temperaturas e úmidas (geladeiras de vidro, box de banheiros e vitrines). Durabilidade esperada: 2 anos. Também pode se estender ou diminuir em virtude das técnicas de aplicação e conservação.',
        'en': 'A product with excellent printability and ink anchoring, approved by the main machine and ink manufacturers. Alltak® Print is a line of PVC films produced with permanent, removable and repositionable acrylic adhesive, specially developed for flexography, offset, screen and digital printing. PVC film without adhesive that clings by static. Widely used for oil-change labels and cold or damp areas (glass coolers, shower enclosures and shop windows). Expected durability: 2 years. It may also extend or shorten depending on application and care techniques.',
        'es': 'Producto con excelente imprimibilidad y anclaje de la tinta, homologado por los principales fabricantes de máquinas y tintas. Alltak® Print es una línea de películas de PVC producida con adhesivo acrílico permanente, removible y reposicionable, especialmente desarrollada para impresión en flexografía, offset, serigrafía y digital. Película de PVC sin adhesivo, con adherencia por estática. Muy utilizada para etiquetas de cambio de aceite y zonas frías o húmedas (refrigeradores de vidrio, mamparas de baño y vitrinas). Durabilidad esperada: 2 años. También puede extenderse o reducirse según las técnicas de aplicación y conservación.',
    },
    'color': {
        'pt': 'Indicada para aplicações como sinalização, propaganda, design, decoração e identificação de frotas. Imagens meramente ilustrativas, para uma percepção mais real solicite nosso catálogo de cores no seu distribuidor mais próximo. Aplicar em superfície lisa e plana previamente limpa utilizando álcool isopropílico. Depois de aplicado evitar produtos agressivos e atritos constantes, usar sabão neutro. Material acondicionado em caixas e bobinas de papelão com larguras de 0,50 e 1,00m. Durabilidade esperada: 5 anos (exceto a cor Prata, 2 anos, e Flex Prata, 6 meses). Importante: a durabilidade pode se estender ou diminuir em virtude das técnicas de aplicação e conservação.',
        'en': 'Recommended for applications such as signage, advertising, design, decoration and fleet identification. Images are for illustration only; for a more accurate perception, request our color catalog from your nearest distributor. Apply on a smooth, flat surface previously cleaned with isopropyl alcohol. After application, avoid aggressive products and constant friction; use neutral soap. Material packed in boxes and cardboard rolls, 0.50 and 1.00 m wide. Expected durability: 5 years (except Silver, 2 years, and Flex Silver, 6 months). Important: durability may extend or shorten depending on application and care techniques.',
        'es': 'Indicada para aplicaciones como señalización, publicidad, diseño, decoración e identificación de flotas. Imágenes meramente ilustrativas; para una percepción más real, solicite nuestro catálogo de colores a su distribuidor más cercano. Aplicar sobre una superficie lisa y plana previamente limpiada con alcohol isopropílico. Después de la aplicación, evitar productos agresivos y fricciones constantes; usar jabón neutro. Material embalado en cajas y bobinas de cartón con anchos de 0,50 y 1,00 m. Durabilidad esperada: 5 años (excepto el color Plata, 2 años, y Flex Plata, 6 meses). Importante: la durabilidad puede extenderse o reducirse según las técnicas de aplicación y conservación.',
    },
    'moldnhold': {
        'en': 'Successfully launched on the international market, Mold n’ Hold works as a safety and finishing tape for the edges of wrapped vehicles.\n\nBesides sealing the edges, it works as a mask to hide the car’s color, creating a perfect and secure finish. It is a black textured material that mimics the factory plastic finish of vehicles.\n\nMold n’ Hold is a quick and easy solution to prevent the film from lifting at the outermost parts of the wrap, preserving the look and durability of the job.',
        'es': 'Lanzado con éxito en el mercado internacional, Mold n’ Hold funciona como una cinta de seguridad y acabado en los bordes de vehículos rotulados.\n\nAdemás de sellar los bordes, funciona como una máscara para ocultar el color del auto, creando un acabado perfecto y seguro. Es un material texturizado negro que simula el acabado plástico de fábrica de los vehículos.\n\nMold n’ Hold es una solución rápida y fácil para evitar el levantamiento de la película en las partes extremas de la rotulación, manteniendo la estética y la durabilidad del trabajo.',
    },
    'dupla-face': {
        'en': 'Specially developed for technical applications where durability and practicality are essential, Alltak® Tec is a line of PVC adhesive films, produced with permanent acrylic adhesive and 100% Brazilian technology, that allows precise cutting and is easy to apply.',
        'es': 'Desarrollada especialmente para aplicaciones técnicas en las que la durabilidad y la practicidad son imprescindibles, Alltak® Tec es una línea de películas adhesivas de PVC, producida con adhesivo acrílico permanente y tecnología 100% brasileña, que permite un corte preciso y es de fácil aplicación.',
    },
    'mascara-de-transferencia': {
        'en': 'ALLTAK TEC transfer masks are developed for technical applications and are designed to transfer cut vinyl graphics onto a wide range of surfaces. They consist of a PVC film and an adhesive specific to this application, with lower coat weights than conventional adhesives (see technical bulletin), allowing more precise and flawless work; they are supplied with clear and translucent blue film.',
        'es': 'Las máscaras de transferencia ALLTAK TEC están desarrolladas para aplicaciones técnicas y tienen como objetivo transferir adhesivos de corte a las más diversas superficies. Están compuestas por una película de PVC y un adhesivo propio para esta aplicación, con gramajes más bajos que los adhesivos de uso convencional (ver boletín técnico), lo que permite un trabajo con más precisión y perfección; se suministran con película transparente y azul translúcida.',
    },
    'auto-wrap': {
        'en': 'ALLTAK® Auto Wrap (AW) adhesive is a high-performance polymeric super-calendered PVC film with Airflow 3.0 technology (bubble-free) and a repositionable adhesive that reduces the time needed for vehicle applications and customizations. A product with excellent conformability, printability and ink anchoring, approved by the leading machine and ink manufacturers on the market thanks to its potential for solvent-based, UV, latex, flexography, offset and screen printing. It has a 170 g/m² siliconized coated-paper liner.',
        'es': 'El adhesivo Auto Wrap (AW) ALLTAK® es una película de PVC polimérico supercalandrado de alto desempeño, con tecnología Airflow 3.0 (no deja burbujas) y adhesivo reposicionable que reduce el tiempo de las aplicaciones y personalizaciones vehiculares. Producto con excelente moldeabilidad, imprimibilidad y anclaje de la tinta, homologado por los principales fabricantes de máquinas y tintas del mercado gracias a su potencial en impresión base solvente, UV, látex, flexografía, offset y serigrafía. Contiene liner de papel couché siliconado de 170 g/m².',
    },
    'protecao-de-pintura-ppf': {
        'en': 'The Alltak FPP protective film is made of high-tech calendered PVC and offers a superior level of protection against small impacts, everyday scratches, road debris, acid rain and weathering, as well as resistance to chemical products*.\n\nThis film can also be used in architecture, protecting furniture, countertops, appliances and much more!',
        'es': 'La película de protección FPP Alltak fue desarrollada en PVC calandrado de alta tecnología y ofrece un nivel de protección superior contra pequeños impactos, rayones del día a día, residuos de la carretera, lluvia ácida e intemperie, además de resistencia a productos químicos*.\n\n¡Esta película también puede utilizarse en arquitectura, protegiendo muebles, mesadas, electrodomésticos y mucho más!',
    },
    'print-flex': {
        'en': 'A product with excellent printability and ink anchoring, approved by the main machine and ink manufacturers, Alltak® Print is a line of PVC films, with Printable Adhesive Vinyl, produced with permanent, removable and repositionable acrylic adhesive. Alltak® Print was specially developed for flexography, offset, screen and digital printing.',
        'es': 'Producto con excelente imprimibilidad y anclaje de la tinta, homologado por los principales fabricantes de máquinas y tintas, Alltak® Print es una línea de películas de PVC, con vinil adhesivo para impresión, producida con adhesivo acrílico permanente, removible y reposicionable. Alltak® Print fue especialmente desarrollada para impresión en flexografía, offset, serigrafía y digital.',
    },
    'premium': {
        'en': 'The new Premium is a polymeric super-calendered PVC film for the Sign & Design concept, ideal for applications that require greater color coverage, conformability and vibrant shades. It provides smooth cutting, extending the life of the cutting blade.\n\nThanks to its high performance, it is increasingly sought after by customization professionals to renew residential and corporate spaces. Recommended for wrapping furniture, appliances and objects, and for signage and advertising.',
        'es': 'El nuevo Premium es una película de PVC polimérico supercalandrado para el concepto Sign & Design, ideal para aplicaciones que requieren mayor cubrimiento de color, moldeabilidad y tonalidades vibrantes. Proporciona un corte suave, aumentando la durabilidad de la cuchilla de corte.\n\nDebido a su alto desempeño, es cada vez más buscado por los profesionales de la personalización para renovar ambientes residenciales y corporativos. Indicado para la rotulación de muebles, electrodomésticos y objetos, señalización y publicidad.',
    },
    'killer': {
        'en': 'Adesive Killer is a powerful ally in removing glue residue left on surfaces. Its exclusive formula removes it easily and does not harm the car’s paint.\n\nIt is pH-neutral and can be used on many surfaces, provided a test is first carried out on a small part of the surface. A product no installer should be without in their daily work. Its yield is excellent: a small amount efficiently removes a large amount of glue.\n\nIt is part of the Wrap Care line, developed by Alltak® exclusively for the wrapping segment: pre-installation, care and removal of adhesive vinyl.',
        'es': 'Adesive Killer es un poderoso aliado en la remoción de residuos de pegamento que quedan en la superficie. Su fórmula exclusiva los remueve con facilidad y no daña la pintura del automóvil.\n\nTiene pH neutro y puede utilizarse en diversas superficies, siempre que antes se haga una prueba en una pequeña parte de la superficie. Un producto que no puede faltar en el día a día de cualquier instalador. Su rendimiento es excelente: una pequeña cantidad remueve con eficiencia una gran parte del pegamento.\n\nForma parte de la línea Wrap Care, desarrollada por Alltak® exclusivamente para el segmento de la rotulación: preinstalación, conservación y remoción del vinil adhesivo.',
    },
    'kleaner': {
        'en': 'Kleaner is a product developed for surface preparation. It removes wax and abrasive residues and promotes better adhesion of the adhesive vinyl. Its formula cleans the surface completely, increasing durability and preserving the properties of the material.\n\nIt can be used on any surface, such as acrylic, glass, metal sheets, PVC or PS boards, as well as vehicle bodywork and plastic parts. Use it moments before application, right after washing: this ensures a clean installation, ready to receive the adhesive vinyl.\n\nIt is part of the Wrap Care line, developed by Alltak® exclusively for the wrapping segment: pre-installation, care and removal of adhesive vinyl.',
        'es': 'Kleaner es un producto desarrollado para la preparación de la superficie. Remueve residuos de ceras y abrasivos y promueve una mayor adherencia del vinil adhesivo. Su fórmula limpia completamente la superficie, aumentando la durabilidad y preservando las propiedades del material.\n\nPuede utilizarse en cualquier superficie, como acrílico, vidrio, chapas metálicas, placas de PVC o PS, además de la carrocería y las piezas plásticas de los vehículos. Utilícelo momentos antes de la aplicación, justo después del lavado: así garantiza una instalación limpia y lista para recibir el vinil adhesivo.\n\nForma parte de la línea Wrap Care, desarrollada por Alltak® exclusivamente para el segmento de la rotulación: preinstalación, conservación y remoción del vinil adhesivo.',
    },
    'protetik': {
        'en': 'Protetik is a unique and exclusive product to be applied once the wrap is finished, ensuring greater protection against UV rays and giving more intensity to the color of the adhesive vinyl. Excellent value for money and easy application.\n\nIt can be used regularly as a great ally in protecting and preserving adhesive vinyl, preventing fading and extending its durability for much longer. It is water-repellent, like a “vitrification”, making maintenance and washing easier. One 500 ml bottle protects up to 10 passenger cars.\n\nIt is part of the Wrap Care line, developed by Alltak® exclusively for the wrapping segment: pre-installation, care and removal of adhesive vinyl.',
        'es': 'Protetik es un producto único y exclusivo para aplicarse una vez terminada la rotulación, garantizando mayor protección contra los rayos UV y dando más intensidad al color del vinil adhesivo. Excelente relación costo-beneficio y fácil aplicación.\n\nPuede utilizarse regularmente como un gran aliado en la protección y conservación del vinil adhesivo, evitando la decoloración y extendiendo la durabilidad por mucho más tiempo. Es hidrorrepelente, como una “vitrificación”, lo que facilita el mantenimiento y el lavado. Un frasco de 500 ml rinde para proteger hasta 10 vehículos de pasajeros.\n\nForma parte de la línea Wrap Care, desarrollada por Alltak® exclusivamente para el segmento de la rotulación: preinstalación, conservación y remoción del vinil adhesivo.',
    },
}


def traduzir(s, i):
    """Busca com tolerância a pontuação final (.;) e sem ponto."""
    if s in TR:
        return TR[s][i]
    if s.endswith(';') and s[:-1] + '.' in TR:
        t = TR[s[:-1] + '.'][i]
        return t[:-1] + ';' if t.endswith('.') else t + ';'
    if s.endswith((';', '.')) and s[:-1] in TR:
        return TR[s[:-1]][i] + s[-1]
    if s + '.' in TR:
        t = TR[s + '.'][i]
        return t[:-1] if t.endswith('.') else t
    return None


def main() -> int:
    caminho = os.path.join(BASE, 'src/data/wp/linhas.json')
    ls = json.load(open(caminho))
    i18n = {}
    faltando = set()
    for l in ls:
        l['specs'] = limpar(l['specs'])
        l['descricao'] = DESC.get(l['slug'], {}).get('pt') or normalizar(l['descricao'])
        en, es = [], []
        for s in l['specs']:
            t_en, t_es = traduzir(s, 0), traduzir(s, 1)
            if t_en is None or t_es is None:
                faltando.add(s)
                continue
            en.append(t_en)
            es.append(t_es)
        d = DESC.get(l['slug'], {})
        if l['descricao'] and not d.get('en'):
            faltando.add(f'[descricao sem tradução] {l["slug"]}')
        i18n[l['slug']] = {
            'en': {'descricao': d.get('en', ''), 'specs': en},
            'es': {'descricao': d.get('es', ''), 'specs': es},
        }
    if faltando:
        print(f'FALTAM {len(faltando)} traduções:')
        for s in sorted(faltando):
            print(' -', s)
        return 1
    json.dump(ls, open(caminho, 'w'), ensure_ascii=False, indent=1)
    json.dump(i18n, open(os.path.join(BASE, 'src/data/wp/linhas-i18n.json'), 'w'), ensure_ascii=False, indent=1)
    n = sum(1 for v in i18n.values() if v['en']['descricao'] or v['en']['specs'])
    print(f'ok: linhas.json limpo (PT) + linhas-i18n.json com {n} linhas traduzidas (EN e ES)')
    return 0


if __name__ == '__main__':
    sys.exit(main())

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

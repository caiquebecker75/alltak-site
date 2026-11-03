"""Deixa a cartela Wraps igual ao catálogo Out/2026 (aprovado pela Alltak em nov/2026).

Retira as cores fora do catálogo, inclui as que faltavam, acerta nomes e códigos
e atualiza as fichas. Impact Black e Ultra Cristal não estão no PDF: entraram a
pedido da Alltak, com as especificações passadas por ela. Evolution Pro e IWC
têm catálogo próprio e não mudam. Roda uma vez só.

Uso:  python -X utf8 -I migracao/wraps_catalogo_out2026.py
"""
import json
import shutil
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
CAT = RAIZ / 'src' / 'data' / 'catalog'
BOBINA = RAIZ / 'public' / 'colors' / 'wraps' / 'bobina'
UPLOADS = RAIZ / 'public' / 'wp-uploads'

RETIRAR = {'18S84M', '18U57', '18U67', '18UD06M', '18US01M', '18UD08M', '18U51M', '18E502', '18E503', '18E504', '18E505'}
NOMES = {
    '18S74M': 'Satin Adamantium Metallic',
    '18J932M': 'Jateado Grey Metallic',
    '18US02M': 'Ultra Star Yellow',
    '184D70': '4D Carbon Black',
    '18E501': '5 Elemento Graphite Metallic',
}
ACABAMENTOS = {'18FPP01': 'Brilhante Cristal', '18FPP02': 'Fosco Cristal'}
KLEAR = [
    ('18KLG02', 'Klear Gloss Yellow', '#f5d400', '2020/12/Klear-Gloss-Yellow.jpg'),
    ('18KLG03', 'Klear Gloss Red', '#e0444a', '2020/12/Klear-Gloss-RED-SC.jpg'),
    ('18KLG07', 'Klear Gloss Smoked', '#6f6a5f', '2020/12/KLEAR-GLOSS-SMOKED.jpg'),
    ('18KLG08', 'Klear Gloss Smoked Black Mask', '#2a2620', '2022/05/klear-black-fume-black-mask-alltak-adesivos.jpg'),
]


def ler(nome):
    return json.loads((CAT / nome).read_text('utf8'))


def gravar(nome, dados):
    (CAT / nome).write_text(json.dumps(dados, ensure_ascii=False, indent=1) + '\n', 'utf8')


def ficha(pt, en, es):
    return {'en': {'descricao': '', 'specs': en}, 'es': {'descricao': '', 'specs': es},
            'fonte': 'Alltak Wraps 2026', 'pt': {'descricao': '', 'specs': pt}}


def foto_ultra_cristal():
    """A imagem é a do FPP Brilhante, como pediu a Alltak, sem o nome impresso nela."""
    im = Image.open(BOBINA / '18fpp01-fpp-gloss-cristal-x-protection.jpg').convert('RGB')
    # o fundo é um degradê liso: refaz o canto a partir das bordas limpas
    a = np.asarray(im).astype(float)
    x0, y0 = 560, 610
    alto, largo = a.shape[0] - y0, a.shape[1] - x0
    borda_sup = a[y0 - 4:y0, x0:].mean(axis=0)[None, :, :]
    borda_esq = a[y0:, x0 - 4:x0].mean(axis=1)[:, None, :]
    canto = a[y0 - 4:y0, x0 - 4:x0].mean(axis=(0, 1))[None, None, :]
    a[y0:, x0:] = np.clip(borda_sup + borda_esq - canto, 0, 255)
    im = Image.fromarray(a.astype('uint8'))
    regiao = (x0 - 12, y0 - 12, a.shape[1], a.shape[0])
    im.paste(im.crop(regiao).filter(ImageFilter.GaussianBlur(4)), regiao[:2])
    im.save(BOBINA / '18u01-ultra-cristal.jpg', 'JPEG', quality=88, optimize=True, progressive=True)


def main():
    cores = [c for c in ler('wraps.json') if c['code'] not in RETIRAR]
    pos = {c['code']: i for i, c in enumerate(cores)}
    for c in cores:
        if c['code'] in NOMES:
            c['name'] = NOMES[c['code']]
        if c['code'] in ACABAMENTOS:
            c['acabamento'] = ACABAMENTOS[c['code']]
        if c['code'] == '18UCF01':
            c['semCodigo'] = True  # "não tem código" no catálogo
        if c['code'] == '18FXIMPACT70':
            c['code'] = '18FX180'
            del c['semCodigo']

    novas = {
        '18S45': [{'code': '18S80M', 'name': 'Satin Brown Metallic', 'family': 'Satin', 'acabamento': 'Acetinado Metálico',
                   'hex': '#6b5a3e', 'swatch': '18S80M_sw.jpg', 'applied': '18S80M_ap.jpg'}],
        '18U70': [{'code': '18U01', 'name': 'Ultra Cristal', 'family': 'Ultra', 'acabamento': 'Brilhante',
                   'hex': '#e8e8e8', 'swatch': None, 'applied': None, 'bobina': 'bobina/18u01-ultra-cristal.jpg'}],
        '18K10': [{'code': c, 'name': n, 'family': 'Klear', 'acabamento': 'Brilhante', 'hex': h, 'swatch': None, 'applied': None,
                   'bobina': f'bobina/{c.lower()}-{n.lower().replace(" ", "-")}.jpg'} for c, n, h, _ in KLEAR],
    }
    for depois_de, lista in sorted(novas.items(), key=lambda kv: -pos[kv[0]]):
        cores[pos[depois_de] + 1:pos[depois_de] + 1] = lista
    gravar('wraps.json', cores)

    foto_ultra_cristal()
    for c, n, _, arq in KLEAR:
        shutil.copy2(UPLOADS / arq, BOBINA / f'{c.lower()}-{n.lower().replace(" ", "-")}.jpg')

    f = ler('fichas.json')
    for cod in RETIRAR:
        f['cores'].pop(f'wraps:{cod}', None)
    f['cores']['wraps:18S80M'] = ficha(
        ['Acabamento: acetinado metálico', 'Dimensões: rolos de 1,38 × 25 m', 'Filme: PVC calandrado 100 micra',
         'Adesivo: acrílico reposicionável', 'Tecnologia: sistema Airflow antibolhas'],
        ['Finish: satin metallic', 'Dimensions: 1.38 × 25 m rolls', 'Film: calendered PVC, 100 microns',
         'Adhesive: repositionable acrylic', 'Technology: Airflow bubble-free system'],
        ['Acabado: metálico satinado', 'Dimensiones: rollos de 1,38 × 25 m', 'Película: PVC calandrado 100 micras',
         'Adhesivo: acrílico reposicionable', 'Tecnología: Airflow sistema antiburbujas'])
    f['cores']['wraps:18FX180'] = ficha(
        ['Acabamento: texturizado fosco', 'Dimensões: bobinas de 1,22 × 25 m', 'Espessura: 140 micras',
         'Adesivo: acrílico reposicionável', 'Tecnologia: sistema Airflow antibolhas'],
        ['Finish: textured matte', 'Dimensions: 1.22 × 25 m rolls', 'Thickness: 140 microns',
         'Adhesive: repositionable acrylic', 'Technology: Airflow bubble-free system'],
        ['Acabado: texturizado mate', 'Dimensiones: bobinas de 1,22 × 25 m', 'Espesor: 140 micras',
         'Adhesivo: acrílico reposicionable', 'Tecnología: Airflow sistema antiburbujas'])
    f['cores']['wraps:18U01'] = ficha(
        ['Uso: proteção da pintura de veículos, laminação de imagens e impressão digital', 'Frontal: calandrado transparente',
         'Espessura: 100 micras', 'Largura: 1,38 × 25 m', 'Película de proteção: moldável', 'Acabamento: brilhante'],
        ['Use: vehicle paint protection, image lamination and digital printing', 'Face film: transparent calendered',
         'Thickness: 100 microns', 'Width: 1.38 × 25 m', 'Protective film: moldable', 'Finish: glossy'],
        ['Uso: protección de la pintura de vehículos, laminación de imágenes e impresión digital', 'Frontal: calandrado transparente',
         'Espesor: 100 micras', 'Ancho: 1,38 × 25 m', 'Película protectora: moldeable', 'Acabado: brillante'])
    f['cores'] = dict(sorted(f['cores'].items()))

    def trocar(linha, lingua, velho, novo):
        specs = f['linhas'][linha][lingua]['specs']
        i = next(i for i, s in enumerate(specs) if velho in s)
        specs[i] = specs[i].replace(velho, novo)

    trocar('ultra', 'pt', '18UD06M, 18UD07M, 18UD08M, 18UD09M e 18UD10M', '18UD07M e 18UD10M')
    trocar('ultra', 'en', '18UD06M, 18UD07M, 18UD08M, 18UD09M and 18UD10M', '18UD07M and 18UD10M')
    trocar('ultra', 'es', '18UD06M, 18UD07M, 18UD08M, 18UD09M y 18UD10M', '18UD07M y 18UD10M')
    trocar('carbon', 'pt', 'Cores 5 Elemento: Red (18E504), Yellow (18E502), Pink (18E503), Blue (18E505) e Graphite Metallic (18E501)',
           'Cor 5 Elemento: Graphite Metallic (18E501)')
    trocar('carbon', 'en', '5 Elemento colors: Red (18E504), Yellow (18E502), Pink (18E503), Blue (18E505) and Graphite Metallic (18E501)',
           '5 Elemento color: Graphite Metallic (18E501)')
    trocar('carbon', 'es', 'Colores 5 Elemento: Red (18E504), Yellow (18E502), Pink (18E503), Blue (18E505) y Graphite Metallic (18E501)',
           'Color 5 Elemento: Graphite Metallic (18E501)')
    gravar('fichas.json', f)
    print(len(cores), 'cores na Wraps')


if __name__ == '__main__':
    main()

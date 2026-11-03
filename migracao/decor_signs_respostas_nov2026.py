"""Aplica as respostas da Alltak sobre os catálogos Decor e Signs (nov/2026).

Decor: entram Kroma Forma Olaria, Merlot, Falésia e Fendi, com a bobina e a foto
aplicada recortadas das páginas do catálogo (p. 59 a 62); sai a linha Básicas.
Signs: Prata e Ouro duram 12 meses, Prata Flex 6, e a Fluor Squad saiu de linha
(a Premium fica com as 30 cores do catálogo). Roda uma vez só.

Uso:  python -X utf8 -I migracao/decor_signs_respostas_nov2026.py
"""
import json
from pathlib import Path

import pypdfium2 as pdfium
from PIL import ImageStat

RAIZ = Path(__file__).resolve().parent.parent
CAT = RAIZ / 'src' / 'data' / 'catalog'
WP = RAIZ / 'src' / 'data' / 'wp'
DECOR = RAIZ / 'public' / 'colors' / 'decor'

KROMA = [('977KF25', 'Olaria', 59), ('977KF26', 'Merlot', 60), ('977KF28', 'Falésia', 61), ('977KF23', 'Fendi', 62)]
SEM_ACENTO = {'Falésia': 'falesia'}


def ler(p: Path):
    return json.loads(p.read_text('utf8'))


def gravar(p: Path, dados, fim='\n'):
    p.write_text(json.dumps(dados, ensure_ascii=False, indent=1) + fim, 'utf8')


def kroma():
    pdf = pdfium.PdfDocument(RAIZ / 'public' / 'catalogos' / 'catalogo-decor-2026.pdf')
    cores = ler(CAT / 'decor.json')
    img = ler(CAT / 'imagens.json')
    novas = []
    for cod, nome, pag in KROMA:
        im = pdf[pag - 1].render(scale=2).to_pil().convert('RGB')
        L, A = im.size
        rolo = im.crop((int(L * .636), int(A * .466), int(L * .968), int(A * .944)))
        rolo.thumbnail((900, 900))
        arq = f"977kf{cod[-2:]}-kroma-forma-{SEM_ACENTO.get(nome, nome.lower())}.jpg"
        rolo.save(DECOR / 'bobina' / arq, 'JPEG', quality=88, optimize=True, progressive=True)
        # só a parte da foto antes da diagonal do texto
        foto = im.crop((0, int(A * .06), int(L * .29), int(A * .943)))
        foto.thumbnail((900, 1000))
        foto.save(DECOR / f'{cod}_ap.jpg', 'JPEG', quality=86, optimize=True, progressive=True)
        img[f'decor/{cod}_ap.jpg'] = {'h': foto.height, 'ok': True, 'w': foto.width}
        w, h = rolo.size
        r, g, b = ImageStat.Stat(rolo.crop((int(w * .2), int(h * .45), int(w * .45), int(h * .75)))).mean
        novas.append({'code': cod, 'name': f'Kroma Forma {nome}', 'hex': f'#{int(r):02x}{int(g):02x}{int(b):02x}',
                      'swatch': None, 'applied': f'{cod}_ap.jpg', 'family': 'Kroma', 'bobina': f'bobina/{arq}', 'semTextura': True})
    i = next(i for i, c in enumerate(cores) if c['name'] == 'Kroma Forma Avelã Cremoso')
    cores[i:i] = novas
    gravar(CAT / 'decor.json', cores)
    gravar(CAT / 'imagens.json', dict(sorted(img.items())))


def basicas():
    gravar(WP / 'linhas.json', [l for l in ler(WP / 'linhas.json') if l['slug'] != 'basicas'])
    i18n = ler(WP / 'linhas-i18n.json')
    del i18n['basicas']
    gravar(WP / 'linhas-i18n.json', i18n)
    red = ler(WP / 'redirects.json')
    red['/produtos/arquitetura/basicas/'] = '/produtos/arquitetura'
    gravar(WP / 'redirects.json', red)


def signs():
    f = ler(CAT / 'fichas.json')
    avisos = f['avisos']['signs']
    durab = {'pt': 'Cores Prata e Ouro: durabilidade de 12 meses. Prata Flex: 6 meses.',
             'en': 'Silver and Gold colors: 12-month durability. Silver Flex: 6 months.',
             'es': 'Colores Plata y Oro: durabilidad de 12 meses. Plata Flex: 6 meses.'}
    for lang, lista in avisos.items():
        assert len(lista) == 5, lista
        avisos[lang] = [lista[0], durab[lang]] + lista[3:]
    premium = f['linhas']['premium']
    trocas = {
        'pt': ('Cores: disponível em 30 cores', 'Uso: leia o boletim técnico antes de utilizar o produto.'),
        'en': ('Colors: available in 30 colors', 'Use: read the technical data sheet before using the product.'),
        'es': ('Colores: disponible en 30 colores', 'Uso: lea el boletín técnico antes de utilizar el producto.'),
    }
    for lang, (cores, uso) in trocas.items():
        specs = premium[lang]['specs']
        specs[next(i for i, s in enumerate(specs) if ' 33 ' in s)] = cores
        specs[next(i for i, s in enumerate(specs) if 'Fluor' in s)] = uso
    gravar(CAT / 'fichas.json', f)


if __name__ == '__main__':
    kroma()
    basicas()
    signs()

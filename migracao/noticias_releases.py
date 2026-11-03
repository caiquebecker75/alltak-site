"""Importa para /noticias os releases da Alltak (.docx da A4&Holofote, nov/2026).

O nome do arquivo começa com a data do texto (MMDDAAAA), que vira a data da
notícia e define a ordem. De cada release saem título, linha fina, entretítulos,
parágrafos, listas, imagens e legendas, na ordem do documento. Ficam de fora o
"Sobre a Alltak", os contatos para a imprensa (e o que vier depois deles) e as
linhas de fotos em alta para jornalistas (pastas do Drive).

Saída: public/wp-blog/<slug>.json, public/noticias/<slug>-N.jpg e o índice
src/data/wp/blog.json (reexecutar substitui as notícias da leva anterior).

Uso:  python -X utf8 -I migracao/noticias_releases.py "<pasta Releases Alltak>"
"""
import io
import json
import re
import shutil
import sys
import unicodedata
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
INDICE = RAIZ / 'src' / 'data' / 'wp' / 'blog.json'
POSTS = RAIZ / 'public' / 'wp-blog'
FOTOS = RAIZ / 'public' / 'noticias'

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'

# arquivos com o mesmo texto de outro: "revisado(1)" é cópia exata e o
# institucional de ago/2025 só muda o título em relação ao de jan/2026
IGNORAR = {'08242026_alltak_pós_festival_interlagos - revisado(1)', '08052025_alltak_institucional_VS21'}
CORTE = re.compile(r'^(sobre a alltak|(contatos?|informa[çc][õo]es) para a imprensa)', re.I)
FOTOS_IMPRENSA = re.compile(r'drive\.google\.com|^mais fotos no|^confira as imagens da', re.I)
LEGENDA = re.compile(r'cr[ée]ditos?\b|divulga[çc][ãa]o', re.I)


def nfc(t: str) -> str:
    return unicodedata.normalize('NFC', t)


def slugify(t: str) -> str:
    s = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode().lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s[:90].rsplit('-', 1)[0] if len(s) > 90 else s


def linhas_do_paragrafo(p, rels):
    """Divide o parágrafo nas quebras de linha; devolve as linhas e as imagens."""
    linhas, atual, imgs = [], [], []

    def fecha():
        if atual:
            txt = ''.join(t for t, _ in atual)
            neg = sum(len(t) for t, b in atual if b)
            linhas.append((re.sub(r'\s+', ' ', txt).strip(), neg >= len(txt.strip()) * .9))
            atual.clear()

    for r in p.iter(W + 'r'):
        rp = r.find(W + 'rPr')
        marca = rp.find(W + 'b') if rp is not None else None
        b = marca is not None and marca.get(W + 'val') not in ('0', 'false')
        for el in r.iter():
            if el.tag == W + 't':
                atual.append((el.text or '', b))
            elif el.tag == W + 'tab':
                atual.append((' ', b))
            elif el.tag == W + 'br':
                fecha()
            elif el.tag == A + 'blip':
                alvo = rels.get(el.get(R + 'embed'))
                if alvo and alvo not in imgs:
                    imgs.append(alvo)
    fecha()
    return [l for l in linhas if l[0]], imgs


def ler_docx(arq: Path):
    z = zipfile.ZipFile(arq)
    rels = {r.get('Id'): r.get('Target') for r in ET.fromstring(z.read('word/_rels/document.xml.rels'))}
    corpo = ET.fromstring(z.read('word/document.xml')).find(W + 'body')
    itens = []
    for p in corpo.iter(W + 'p'):
        linhas, imgs = linhas_do_paragrafo(p, rels)
        estilo = p.find(f'{W}pPr/{W}pStyle')
        estilo = estilo.get(W + 'val') if estilo is not None else ''
        lista = p.find(f'{W}pPr/{W}numPr') is not None
        if imgs:
            itens.append({'imgs': imgs})
        for txt, neg in linhas:
            itens.append({'txt': txt, 'neg': neg, 'legenda': estilo == 'Legenda', 'lista': lista})
    return z, itens


def salvar_foto(z, alvo, destino: Path):
    im = Image.open(io.BytesIO(z.read('word/' + alvo))).convert('RGBA')
    fundo = Image.new('RGB', im.size, 'white')
    fundo.paste(im, mask=im.getchannel('A'))
    fundo.thumbnail((1600, 1600))
    fundo.save(destino, 'JPEG', quality=84, optimize=True, progressive=True)


def importar(arq: Path):
    z, itens = ler_docx(arq)
    m = re.match(r'(\d{2})(\d{2})(\d{4})_', arq.stem)
    data = f'{m[3]}-{m[1]}-{m[2]}'
    corte = next((i for i, it in enumerate(itens) if CORTE.match(it.get('txt', ''))), len(itens))
    itens = [it for it in itens[:corte] if not FOTOS_IMPRENSA.search(it.get('txt', ''))]
    titulo = itens.pop(0)['txt']
    linha_fina = ''
    # linha fina: vem logo depois do título, antes da imagem ou sem ponto final
    if 'txt' in itens[0] and not itens[0]['legenda'] and len(itens[0]['txt']) < 320 and (
            'imgs' in itens[1] or not itens[0]['txt'].endswith('.')):
        linha_fina = itens.pop(0)['txt']
    slug = slugify(titulo)
    blocos, n, i = [], 0, 0
    while i < len(itens):
        it = itens[i]
        i += 1
        if 'imgs' in it:
            srcs = []
            for alvo in it['imgs']:
                n += 1
                salvar_foto(z, alvo, FOTOS / f'{slug}-{n}.jpg')
                srcs.append(f'./noticias/{slug}-{n}.jpg')
            bloco = {'tipo': 'imagens', 'srcs': srcs}
            prox = itens[i] if i < len(itens) else {}
            if prox.get('txt') and (prox['legenda'] or (len(prox['txt']) < 300 and LEGENDA.search(prox['txt']))):
                bloco['legenda'] = prox['txt']
                i += 1
            blocos.append(bloco)
            continue
        t = it['txt']
        if it['lista'] or t.startswith('•'):
            blocos.append({'tipo': 'item', 'texto': t.lstrip('• ').strip()})
        elif it['neg'] and len(t) < 110 and not t.endswith((':', '.', ';', ',')):
            blocos.append({'tipo': 'titulo', 'texto': t})
        else:
            blocos.append({'tipo': 'texto', 'texto': t})
    capa = next((b['srcs'][0] for b in blocos if b['tipo'] == 'imagens'), None)
    primeiro = next(b['texto'] for b in blocos if b['tipo'] == 'texto')
    resumo = linha_fina or (primeiro if len(primeiro) <= 200 else primeiro[:200].rsplit(' ', 1)[0] + '…')
    return {'slug': slug, 'titulo': titulo, 'data': data, 'capa': capa, 'resumo': resumo,
            'linhaFina': linha_fina, 'blocos': blocos, 'texto': '', 'imagens': []}


def main(pasta: Path):
    indice = json.loads(INDICE.read_text('utf8'))
    antigos = [p for p in indice if not p.get('release')]
    for p in indice:
        if p.get('release'):
            (POSTS / f"{p['slug']}.json").unlink(missing_ok=True)
    shutil.rmtree(FOTOS, ignore_errors=True)
    FOTOS.mkdir(parents=True)
    ignorar = {nfc(x) for x in IGNORAR}
    novos = [importar(a) for a in sorted(pasta.rglob('*.docx')) if nfc(a.stem) not in ignorar]
    slugs = [p['slug'] for p in novos + antigos]
    assert len(set(slugs)) == len(slugs), 'slug repetido'
    for p in novos:
        (POSTS / f"{p['slug']}.json").write_text(json.dumps(p, ensure_ascii=False), 'utf8')
    resumo = [{'slug': p['slug'], 'titulo': p['titulo'], 'data': p['data'], 'capa': p['capa'], 'resumo': p['resumo'], 'release': True}
              for p in sorted(novos, key=lambda p: p['data'], reverse=True)]
    INDICE.write_text(json.dumps(resumo + antigos, ensure_ascii=False, indent=1), 'utf8')
    print(len(novos), 'notícias;', len(resumo + antigos), 'no total; sem imagem:', [p['slug'] for p in novos if not p['capa']])


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))

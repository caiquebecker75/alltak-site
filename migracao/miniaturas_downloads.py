"""Gera a miniatura de cada arquivo da página Downloads (src/data/downloads.ts).

  - PDF: primeira página renderizada
  - TIF/JPG/PNG: a própria imagem
  - ZIP: a primeira imagem de dentro do pacote (wallpapers, patterns)
  - perfis de cor (.icc/.icm/.oms) não têm imagem: o site mostra um ícone
Arquivos remotos (alltak.com.br) são baixados para uma pasta de cache.

Saída: public/downloads/miniaturas/<nome>.jpg (480 px) e
src/data/miniaturas.json ({arquivo: caminho da miniatura}).

Uso:  python -X utf8 -I migracao/miniaturas_downloads.py <pasta de cache>
"""
import io
import json
import re
import sys
import urllib.request
import zipfile
from pathlib import Path

import pypdfium2
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
FONTE = RAIZ / 'src' / 'data' / 'downloads.ts'
SAIDA = RAIZ / 'public' / 'downloads' / 'miniaturas'
INDICE = RAIZ / 'src' / 'data' / 'miniaturas.json'
WP = 'https://alltak.com.br/wp-content/uploads'
IMAGEM = ('.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp')


def arquivos() -> list[str]:
    s = FONTE.read_text('utf8')
    s = s.replace('${WP}', WP)
    lista = re.findall(r"arquivo: [`']([^`']+)[`']", s)
    # perfis de cor montados com map(): só para pular, não precisam de miniatura
    return [a for a in lista if '${' not in a and not a.lower().endswith(('.icc', '.icm', '.oms'))]


def obter(arq: str, cache: Path) -> bytes:
    if arq.startswith('./'):
        return (RAIZ / 'public' / arq[2:]).read_bytes()
    destino = cache / re.sub(r'[^A-Za-z0-9._-]+', '_', arq.split('/uploads/')[-1])
    if not destino.exists():
        req = urllib.request.Request(arq, headers={'User-Agent': 'Mozilla/5.0'})
        destino.write_bytes(urllib.request.urlopen(req, timeout=120).read())
    return destino.read_bytes()


def imagem_de(arq: str, dados: bytes) -> Image.Image | None:
    ext = Path(arq.split('?')[0]).suffix.lower()
    if ext == '.pdf':
        pdf = pypdfium2.PdfDocument(dados)
        pagina = pdf[0]
        escala = 900 / max(pagina.get_size())
        return pagina.render(scale=escala).to_pil()
    if ext in IMAGEM:
        Image.MAX_IMAGE_PIXELS = None
        return Image.open(io.BytesIO(dados))
    if ext == '.zip':
        with zipfile.ZipFile(io.BytesIO(dados)) as z:
            nomes = sorted(n for n in z.namelist() if n.lower().endswith(IMAGEM) and not n.startswith('__MACOSX'))
            if nomes:
                Image.MAX_IMAGE_PIXELS = None
                return Image.open(io.BytesIO(z.read(nomes[0])))
    return None


def main(cache: Path) -> None:
    cache.mkdir(parents=True, exist_ok=True)
    SAIDA.mkdir(parents=True, exist_ok=True)
    indice = {}
    for arq in arquivos():
        nome = re.sub(r'[^a-z0-9]+', '-', Path(arq.split('?')[0]).stem.lower()).strip('-') + '.jpg'
        try:
            im = imagem_de(arq, obter(arq, cache))
        except Exception as e:  # noqa: BLE001 - registra e segue
            print('ERRO', arq, e)
            continue
        if im is None:
            print('sem imagem', arq)
            continue
        im = im.convert('RGB')
        im.thumbnail((480, 480))
        im.save(SAIDA / nome, 'JPEG', quality=82, optimize=True, progressive=True)
        indice[arq] = f'./downloads/miniaturas/{nome}'
        print('ok', nome, im.size)
    INDICE.write_text(json.dumps(indice, ensure_ascii=False, indent=1) + '\n', 'utf8')
    print(len(indice), 'miniaturas; índice em', INDICE.relative_to(RAIZ))


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))

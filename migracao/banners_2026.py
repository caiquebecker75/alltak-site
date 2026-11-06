"""Imagens dos banners e menus do site (75LAB, nov/2026, apresentação "IMAGENS SITE").

Converte as artes em alta da pasta do Drive para o tamanho e o formato do site:
  - banner rotativo (3840×1200, sem texto: o texto fica no site) → 2560 e 1280 px,
    e a versão do celular (1080×1920, texto no alto)
  - categorias Wraps/Decor/Signs (paralelogramo com transparência)
  - linhas de produto (trapézios alternados com transparência)
  - produção nacional (trapézio com transparência)
  - Alltak Academy: faixas (foto à direita, transparência à esquerda) e cards
Saída: public/assets/2026/<nome>.webp

Uso:  python -X utf8 -I migracao/banners_2026.py "<pasta com as imagens>"
"""
import sys
import unicodedata
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / 'public' / 'assets' / '2026'

# arquivo da pasta (sem o prefixo 75LAB-ALLTAK-2026-BANNER-) → nome no site, largura máxima
ARTES = {
    'EVOLUTION.jpg': ('rotativo-evolution', 2560),
    'REVEST.jpg': ('rotativo-revestfacil', 2560),
    'ROTATIVO-DECOR.jpg': ('rotativo-muxarabi', 2560),
    'ROTATIVO-SIGNS.jpg': ('rotativo-signs', 2560),
    'ROTATIVO-MOBILE-EVOLUTION.jpg': ('mobile-evolution', 1080),
    'ROTATIVO-MOBILE-REVEST.jpg': ('mobile-revestfacil', 1080),
    'ROTATIVO-MOBILE-DECOR.jpg': ('mobile-muxarabi', 1080),
    'ROTATIVO-MOBILE-SIGNS.jpg': ('mobile-signs', 1080),
    'CATEGORIA-WRAPS.png': ('categoria-wraps', 1600),
    'CATEGORIA-DECOR.png': ('categoria-decor', 1600),
    'CATEGORIA-SIGNS.png': ('categoria-signs', 1600),
    'PRODUTOS-AUTOMOTIVO.png': ('produtos-automotivo', 1137),
    'DECOR.png': ('produtos-arquitetura', 1137),
    'IMPRESSAO.png': ('produtos-impressao', 1137),
    'PRODUTOS-DESIGNESIGNS.png': ('produtos-sign-design', 1137),
    'APLICACOES-TECNICAS.png': ('produtos-aplicacoes-tecnicas', 1137),
    'WRAP-CARE.png': ('produtos-wrap-care', 1137),
    'ACESSORIOS.png': ('produtos-acessorios', 1137),
    'PRODUCAO-NACIONAL.png': ('producao-nacional', 808),
    'ACADEMY.png': ('academy-academia', 1175),
    'ACADEMY-2.png': ('academy-experience', 1175),
    'ACADEMY-3.png': ('academy-decor', 1175),
    'ACADEMY.1.jpg': ('academy-academia-card', 528),
    'ACADEMY-2.1.jpg': ('academy-experience-card', 528),
    'ACADEMY-3.1.jpg': ('academy-decor-card', 528),
}


def sem_acento(t: str) -> str:
    return unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode()


def main(pasta: Path) -> None:
    SAIDA.mkdir(parents=True, exist_ok=True)
    feitos = set()
    for f in sorted(pasta.iterdir()):
        chave = sem_acento(f.name).replace('75LAB-ALLTAK-2026-BANNER-', '')
        if chave not in ARTES:
            continue
        nome, largura = ARTES[chave]
        im = Image.open(f)
        im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
        if im.width > largura:
            im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
        im.save(SAIDA / f'{nome}.webp', 'WEBP', quality=82, method=6)
        if nome.startswith('rotativo-'):  # versão menor para o celular
            m = im.resize((1280, round(im.height * 1280 / im.width)), Image.LANCZOS)
            m.save(SAIDA / f'{nome}-1280.webp', 'WEBP', quality=80, method=6)
        feitos.add(chave)
        print(nome, im.size)
    faltam = set(ARTES) - feitos
    if faltam:
        sys.exit(f'faltam: {sorted(faltam)}')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))

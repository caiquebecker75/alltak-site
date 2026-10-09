"""Limpa os recortes das fotos de cor (public/colors/{wraps,decor,signs}).

As fotos vieram recortadas dos catalogos online e muitas trazem faixas
brancas, pedacos de texto do catalogo ou de outra foto nas bordas. Isso
aparece na ficha da cor e nas artes de marketplace (enquadramento ruim).

O script:
  1. acha a maior regiao continua de "conteudo" (linhas/colunas que nao sao
     quase todas brancas) e recorta a imagem nela;
  2. nas bobinas Wraps, corta tambem a sombra cinza que o catalogo desenha
     a esquerda/acima do rolo;
  3. grava a imagem limpa por cima (os originais ficam no historico do git);
  4. gera src/data/catalog/imagens.json com largura/altura e se a imagem e
     utilizavel (tiras finas e recortes quebrados sao marcados como ruins).

Uso:  python -I migracao/limpar_imagens_cores.py [--dry] [--so arquivo ...]
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
CORES = RAIZ / 'public' / 'colors'
SAIDA = RAIZ / 'src' / 'data' / 'catalog' / 'imagens.json'

BRANCO = 236          # pixel "quase branco" (todos os canais acima disso)
LINHA_VAZIA = 0.93    # linha/coluna com >= 93% de branco conta como borda
# fotos de ambiente do Decor: o catalogo poe um painel branco de texto ao lado
# da foto (corte diagonal); colunas com mais da metade branca saem junto
COLUNA_VAZIA_AMBIENTE = 0.5
FOLGA = 6             # buracos de ate 6px dentro do conteudo nao quebram a regiao
LADO_MIN = 200        # menor lado aceitavel depois do recorte
PROPORCAO_MAX = 3.2   # mais alongado que isso e tira de recorte, nao foto
AREA_MIN = 0.45       # recorte que mantem menos que isso da imagem e descartado
SALTO_SOMBRA = 40     # queda de brilho (0-255) que marca o fim da sombra da bobina


def maior_trecho(cheio: np.ndarray) -> tuple[int, int] | None:
    """Maior sequencia de True (tolerando buracos curtos). Retorna [ini, fim)."""
    idx = np.flatnonzero(cheio)
    if idx.size == 0:
        return None
    melhor, ini, ant = (idx[0], idx[0] + 1), idx[0], idx[0]
    for i in idx[1:]:
        if i - ant > FOLGA:
            if ant + 1 - ini > melhor[1] - melhor[0]:
                melhor = (ini, ant + 1)
            ini = i
        ant = i
    if ant + 1 - ini > melhor[1] - melhor[0]:
        melhor = (ini, ant + 1)
    return int(melhor[0]), int(melhor[1])


def caixa_conteudo(im: Image.Image, lim_col: float = LINHA_VAZIA) -> tuple[int, int, int, int] | None:
    a = np.asarray(im.convert('RGB'), dtype=np.uint8)
    branco = (a > BRANCO).all(axis=2)
    # duas passadas: linhas -> colunas dentro das linhas -> linhas de novo
    caixa = (0, 0, a.shape[1], a.shape[0])
    for _ in range(2):
        x0, y0, x1, y1 = caixa
        sub = branco[y0:y1, x0:x1]
        linhas = maior_trecho(sub.mean(axis=1) < LINHA_VAZIA)
        if not linhas:
            return None
        sub = sub[linhas[0]:linhas[1]]
        cols = maior_trecho(sub.mean(axis=0) < lim_col)
        if not cols:
            return None
        caixa = (x0 + cols[0], y0 + linhas[0], x0 + cols[1], y0 + linhas[1])
    return caixa


def corte_sombra(im: Image.Image) -> tuple[int, int, int, int] | None:
    """Bobinas Wraps: o catalogo desenha uma sombra cinza a esquerda e em cima
    do rolo. Ela termina numa borda nitida (salto forte de brilho entre duas
    colunas/linhas vizinhas); corta exatamente ali."""
    a = np.asarray(im.convert('L'), dtype=float)
    h, w = a.shape

    def borda(perfil: np.ndarray, ate: int) -> int:
        d = np.diff(perfil[:ate])
        i = int(np.argmin(d)) if d.size else 0
        # salto colado na margem (i < 3) e so o pixel da borda, nao sombra
        return i + 1 if d.size and d[i] < -SALTO_SOMBRA and i >= 3 else 0

    x0 = borda(a.mean(axis=0), int(w * 0.4))
    y0 = borda(a[:, x0:].mean(axis=1), int(h * 0.15))
    return (x0, y0, w, h) if x0 or y0 else None


def utilizavel(w: int, h: int) -> bool:
    return min(w, h) >= LADO_MIN and max(w, h) / max(1, min(w, h)) <= PROPORCAO_MAX


def main() -> None:
    dry = '--dry' in sys.argv
    so = set(sys.argv[sys.argv.index('--so') + 1:]) if '--so' in sys.argv else None
    manifesto: dict[str, dict] = json.loads(SAIDA.read_text('utf8')) if SAIDA.exists() and so else {}
    for arq in sorted(CORES.glob('*/*.jpg')):
        chave = f'{arq.parent.name}/{arq.name}'
        if so and chave not in so:
            continue
        im = Image.open(arq)
        im.load()
        W, H = im.size
        ambiente = arq.parent.name == 'decor' and arq.stem.endswith('_ap')
        caixa = caixa_conteudo(im, COLUNA_VAZIA_AMBIENTE if ambiente else LINHA_VAZIA)
        if caixa and caixa != (0, 0, W, H):
            novo = im.convert('RGB').crop(caixa)
            # so aceita o recorte se ele ainda e uma foto de verdade e nao jogou
            # fora a maior parte da imagem (sinal de que pegou a regiao errada)
            if utilizavel(*novo.size) and novo.size[0] * novo.size[1] >= AREA_MIN * W * H:
                if not dry:
                    novo.save(arq, quality=92, optimize=True)
                print(f'recorte {chave}: {W}x{H} -> {novo.size[0]}x{novo.size[1]}')
                im = novo
        if arq.parent.name == 'wraps' and arq.stem.endswith('_sw'):
            sombra = corte_sombra(im)
            if sombra:
                novo = im.convert('RGB').crop(sombra)
                if not dry:
                    novo.save(arq, quality=92, optimize=True)
                print(f'sombra  {chave}: {im.size[0]}x{im.size[1]} -> {novo.size[0]}x{novo.size[1]}')
                im = novo
        w, h = im.size
        manifesto[chave] = {'w': w, 'h': h, 'ok': utilizavel(w, h)}
        if not manifesto[chave]['ok']:
            print(f'RUIM    {chave}: {w}x{h}')
    if not dry:
        SAIDA.write_text(json.dumps(manifesto, indent=1, sort_keys=True), 'utf8')
    print(len(manifesto), 'imagens no manifesto')


if __name__ == '__main__':
    main()

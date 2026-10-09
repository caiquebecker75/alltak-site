"""Gera os visuais do carrossel de campanhas da home (public/assets/campanhas/).

O carrossel monta os três banners com o mesmo esquema: texto no próprio site
(à esquerda, mesma tipografia e posição) e um visual à direita. Este script
prepara esses visuais a partir das artes originais, que eram prints do topo do
site antigo (logo, menu e bandeira embutidos) com o texto queimado na imagem:

  iwc-visual.webp        fotos + leque da arte IWC, fundo transparente
  iwc-padrao.png         uma repetição do fundo de caveiras da arte IWC
  muxarabi-visual.webp   ambiente + rolo da arte Wood Muxarabi, fundo transparente
  revestfacil-foto.jpg   foto do RevestFácil no ponto de venda (loja 2026)
  revestfacil-amostras.jpg  amostras no stand 2026 (sem a placa do topo)
  revestfacil-logo.png   logo RevestFácil para fundo escuro, sem margem

As fontes do RevestFácil vêm do repositório da proposta de stand
(Caiquebecker/alltak-revestfacil-haus-decor-2027, docs/assets/img); passe a
pasta com rf-h-dark.png, 2026-loja.jpg e 2026-amostras.jpg como argumento.

Uso:  python -I migracao/banners_campanha.py <pasta-revestfacil>
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
ASSETS = RAIZ / 'public' / 'assets'
SAIDA = ASSETS / 'campanhas'

CORTE_TOPO = 80  # faixa com logo/menu/bandeira do site antigo


def salvar_webp(rgba: np.ndarray, nome: str) -> None:
    im = Image.fromarray(rgba.clip(0, 255).astype(np.uint8), 'RGBA')
    caixa = im.getbbox()
    im = im.crop(caixa)
    im.save(SAIDA / nome, 'WEBP', quality=88, method=6)
    print(nome, im.size)


def mascara(dif: np.ndarray, limiar: float, fecha: int, borda: float, corte=None) -> np.ndarray:
    """Conteúdo = o que difere do fundo. Vãos totalmente cercados de conteúdo
    (ex.: a textura do cartão do leque, parecida com o fundo) contam como
    conteúdo. `corte(m)` zera áreas (texto) antes de preencher os vãos."""
    m = Image.fromarray(((dif > limiar) * 255).astype(np.uint8))
    m = m.filter(ImageFilter.MaxFilter(fecha)).filter(ImageFilter.MinFilter(fecha))
    if corte:
        a = np.asarray(m).copy()
        corte(a)
        m = Image.fromarray(a)
    # preenche vãos: o fundo é o que se alcança pelas bordas de cima e dos
    # lados (a de baixo não: o cartão do leque encosta nela)
    a = np.pad(np.asarray(m), ((1, 0), (1, 1)))
    a[-1, 1:-1] = np.where(a[-1, 1:-1] == 0, 255, a[-1, 1:-1])
    m = Image.fromarray(np.vstack([a, np.full((1, a.shape[1]), 255, np.uint8)])).copy()  # copy: floodfill precisa de imagem gravável
    ImageDraw.floodfill(m, (0, 0), 128)
    a = np.asarray(m)[1:-1, 1:-1]
    m = Image.fromarray(np.where(a == 128, 0, 255).astype(np.uint8))
    m = m.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(borda))
    return np.asarray(m, dtype=float) / 255


def iwc() -> None:
    orig = np.asarray(Image.open(ASSETS / 'banner-wraps.jpg').convert('RGB'), dtype=float)
    # fundo de caveiras: período 226 x 373 px, amostra limpa à direita
    px, py, ax, ay = 226, 373, 1650, 90
    Image.fromarray(orig[ay:ay + py, ax:ax + px].astype(np.uint8)).save(SAIDA / 'iwc-padrao.png', optimize=True)
    print('iwc-padrao.png', (px, py))
    oh, ow = orig.shape[:2]
    U, V = np.meshgrid(np.arange(ow), np.arange(oh))
    fundo = orig[ay + np.mod(V - ay, py), ax + np.mod(U - ax, px)]

    def corte(a: np.ndarray) -> None:
        # só fotos e leque: tira o texto (à esquerda) e a faixa do menu antigo
        a[:, :540] = 0
        a[:700, :665] = 0
        a[:CORTE_TOPO] = 0

    # fotos azuis e leque colorido x fundo neutro: conta a diferença para o
    # padrão e também a saturação (a borda escura da 1ª foto é azul-escura)
    croma = orig.max(axis=2) - orig.min(axis=2)
    dif = np.maximum(np.abs(orig - fundo).mean(axis=2), croma)
    alfa = mascara(dif, 18, 21, 1.2, corte)
    # a borda esquerda da 1ª foto é uma reta inclinada, mas ali a foto escurece
    # e se confunde com o fundo; mede a reta (1º pixel azul de cada linha) e
    # recorta por ela, com 1px de suavização
    ys = np.arange(130, 500)
    xs = np.array([560 + int(np.argmax(croma[y, 560:900] > 40)) for y in ys])
    ok = np.abs(xs - np.median(xs - np.polyval(np.polyfit(ys, xs, 1), ys)) - np.polyval(np.polyfit(ys, xs, 1), ys)) < 6
    a, b = np.polyfit(ys[ok], xs[ok], 1)
    print(f'borda da 1a foto: x = {a:.3f}*y + {b:.1f}')
    yy = np.arange(oh)[:, None]
    xx = np.arange(ow)[None, :]
    fora = (yy < 540) & (xx < 900)
    alfa = np.where(fora, alfa * np.clip(xx - (a * yy + b) + 1, 0, 1), alfa)
    # entre a 1ª foto e o leque sobram pedaços pretos do fundo; tira o que é
    # escuro e neutro ali (as folhas do leque são coloridas ou claras)
    caixa = np.zeros_like(alfa, dtype=bool)
    caixa[530:700, 540:760] = True
    escuro_neutro = (croma < 30) & (orig.mean(axis=2) < 90)
    alfa = np.where(caixa & escuro_neutro, 0, alfa)
    salvar_webp(np.dstack([orig, alfa * 255]), 'iwc-visual.webp')


def muxarabi() -> None:
    orig = np.asarray(Image.open(ASSETS / 'banner-decor.jpg').convert('RGB'), dtype=float)
    navy = np.array([0, 32, 91], dtype=float)

    def corte(a: np.ndarray) -> None:
        a[:720, :535] = 0  # texto "Lançamento Wood Muxarabi Confira" (termina em x≈530)
        a[:CORTE_TOPO] = 0

    alfa = mascara(np.abs(orig - navy).mean(axis=2), 14, 9, 1.0, corte)
    salvar_webp(np.dstack([orig, alfa * 255]), 'muxarabi-visual.webp')


def revestfacil(pasta: Path) -> None:
    logo = Image.open(pasta / 'rf-h-dark.png').convert('RGBA')
    logo = logo.crop(logo.getbbox())
    logo.save(SAIDA / 'revestfacil-logo.png', optimize=True)
    print('revestfacil-logo.png', logo.size)
    foto = Image.open(pasta / '2026-loja.jpg').convert('RGB')
    # a foto traz um triângulo azul aplicado no canto direito; fica fora do corte
    w, h = foto.size
    foto = foto.crop((0, 0, round(w * 0.74), h))
    foto.save(SAIDA / 'revestfacil-foto.jpg', quality=88, optimize=True, progressive=True)
    print('revestfacil-foto.jpg', foto.size)
    # amostras: sem a placa do topo e longe do triângulo azul da diagonal
    # inferior direita (o paralelogramo do banner esconde o canto de baixo)
    am = Image.open(pasta / '2026-amostras.jpg').convert('RGB').crop((0, 150, 560, 825))
    am.save(SAIDA / 'revestfacil-amostras.jpg', quality=88, optimize=True, progressive=True)
    print('revestfacil-amostras.jpg', am.size)


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    SAIDA.mkdir(exist_ok=True)
    iwc()
    muxarabi()
    revestfacil(Path(sys.argv[1]))


if __name__ == '__main__':
    main()

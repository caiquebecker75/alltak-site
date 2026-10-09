"""Recompõe a arte do banner IWC (public/assets/banner-wraps.jpg) em formato
panorâmico para o carrossel de campanhas da home.

A arte original (1920x995, ~1,93:1) é um print do topo do site antigo: traz o
logo, o menu e a bandeira embutidos na faixa de cima. No carrossel (62vh de
altura, 2,6 a 3,4:1) o corte em "cover" comia o "LINHA" em cima, o
"IMPERDÍVEIS!" embaixo e o leque de cores.

O script:
  1. tira a faixa do menu antigo (topo);
  2. separa o conteúdo (texto, fotos, leque) do fundo de caveiras e refaz o
     fundo inteiro a partir de uma amostra limpa do padrão, na mesma fase.
     Isso tira a vinheta escura da borda esquerda da arte, que aparecia como
     uma faixa ao estender o fundo;
  3. coloca a arte num quadro 3:1, com o fundo continuando para as laterais;
  4. grava public/assets/banner-iwc-panoramico.jpg.

Uso:  python -I migracao/banner_iwc_panoramico.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / 'public' / 'assets' / 'banner-wraps.jpg'
SAIDA = RAIZ / 'public' / 'assets' / 'banner-iwc-panoramico.jpg'

CORTE_TOPO = 80          # faixa com logo/menu/bandeira do site antigo
W, H = 2880, 960         # 3:1
# trecho só de padrão (sem texto nem foto) usado como amostra do fundo
AMOSTRA = (1650, 90)     # canto (x, y) na arte original
LIMIAR = 18              # diferença para o padrão acima disso = conteúdo
FECHA = 21               # fecha os vãos pretos entre as fotos (são conteúdo)
# o fundo só é refeito à esquerda disto (zona do texto, onde está a vinheta);
# daqui em diante fotos e leque ficam intactos (o cartão do leque tem a mesma
# textura de caveiras e seria confundido com o fundo)
LIMITE_REFAZ = 600


def periodo(perfil: np.ndarray, faixa: range) -> int:
    p = perfil - perfil.mean()
    return max(faixa, key=lambda k: np.corrcoef(p[:-k], p[k:])[0, 1])


def main() -> None:
    orig = np.asarray(Image.open(ORIGEM).convert('RGB'), dtype=float)
    cinza = orig.mean(axis=2)
    # períodos do padrão: 2 trapézios na horizontal, 3 fileiras na vertical
    px = periodo(cinza[90:450, 1600:1920].mean(axis=0), range(218, 234))
    py = periodo(cinza[80:990, 0:130].mean(axis=1), range(366, 380))
    print('periodo do padrao', px, py)

    ax, ay = AMOSTRA

    def padrao(u: np.ndarray, v: np.ndarray) -> np.ndarray:
        """Fundo de caveiras na coordenada (u, v) da arte original."""
        su = (ax + np.mod(u - ax, px)).astype(int).clip(0, orig.shape[1] - 1)
        sv = (ay + np.mod(v - ay, py)).astype(int).clip(0, orig.shape[0] - 1)
        return orig[sv, su]

    # 1) máscara do conteúdo: o que difere do padrão na mesma posição
    oh, ow = orig.shape[:2]
    U, V = np.meshgrid(np.arange(ow), np.arange(oh))
    fundo_orig = padrao(U, V)
    dif = np.abs(orig - fundo_orig).mean(axis=2)
    m = Image.fromarray(((dif > LIMIAR) * 255).astype(np.uint8))
    m = m.filter(ImageFilter.MaxFilter(FECHA)).filter(ImageFilter.MinFilter(FECHA))
    m = m.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(3))
    alfa = np.asarray(m, dtype=float)[..., None] / 255
    alfa[:, LIMITE_REFAZ:] = 1
    # transição suave até o limite, para não marcar uma linha vertical
    rampa = np.linspace(0, 1, 80)[None, :, None]
    alfa[:, LIMITE_REFAZ - 80:LIMITE_REFAZ] = np.maximum(alfa[:, LIMITE_REFAZ - 80:LIMITE_REFAZ], rampa)
    limpa = orig * alfa + fundo_orig * (1 - alfa)

    # 2) quadro 3:1: fundo gerado em tudo, conteúdo da arte por cima
    arte = limpa[CORTE_TOPO:]
    alfa = alfa[CORTE_TOPO:]
    ah, aw = arte.shape[:2]
    esc = H / ah
    nova_w = round(aw * esc)
    ox = (W - nova_w) // 2
    X, Y = np.meshgrid(np.arange(W), np.arange(H))
    quadro = padrao((X - ox) / esc, Y / esc + CORTE_TOPO)
    a = np.asarray(Image.fromarray(arte.clip(0, 255).astype(np.uint8)).resize((nova_w, H), Image.LANCZOS), dtype=float)
    al = np.asarray(Image.fromarray((alfa[..., 0] * 255).astype(np.uint8)).resize((nova_w, H), Image.LANCZOS), dtype=float)[..., None] / 255
    trecho = quadro[:, ox:ox + nova_w]
    quadro[:, ox:ox + nova_w] = a * al + trecho * (1 - al)

    Image.fromarray(quadro.clip(0, 255).astype(np.uint8)).save(SAIDA, quality=90, optimize=True, progressive=True)
    print('gravado', SAIDA.relative_to(RAIZ), f'{W}x{H}', 'arte em x', ox, '..', ox + nova_w)


if __name__ == '__main__':
    main()

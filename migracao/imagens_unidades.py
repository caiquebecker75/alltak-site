"""Imagens conceituais das 3 unidades de negócio da Home (StickyUnits), out/2026.

Montadas a partir das fotos oficiais da cartela (public/colors/*):
  - Wraps: faixas inclinadas (o ângulo do trapézio da marca), cada uma com um
    carro envelopado numa cor diferente
  - Decor: mosaico das superfícies dos revestimentos (Kroma, madeira, mármore,
    azulejo, jardim), sem ambiente montado
  - Signs: fileira de bobinas de vinil coloridas
Saída: public/assets/unidades/<unidade>.jpg (1600×1200, o card recorta em trapézio).

Uso:  python -X utf8 -I migracao/imagens_unidades.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
CORES = RAIZ / 'public' / 'colors'
SAIDA = RAIZ / 'public' / 'assets' / 'unidades'
W, H = 1600, 1200


def abrir(rel: str) -> Image.Image:
    return Image.open(CORES / rel).convert('RGB')


def wraps() -> Image.Image:
    fotos = ['wraps/18S84M_ap.jpg', 'wraps/18S41M_ap.jpg', 'wraps/18S32_ap.jpg', 'wraps/18S192M_ap.jpg', 'wraps/18S21_ap.jpg']
    out = Image.new('RGB', (W, H), (8, 8, 10))
    n = len(fotos)
    incl = int(H * 0.38)  # deslocamento horizontal do topo (inclinação da marca)
    passo = (W + incl) / n
    for k, f in enumerate(fotos):
        x0 = int(k * passo - incl)
        largura = int(passo) + 2
        foto = ImageOps.fit(abrir(f), (largura + incl, H), centering=(0.5, 0.5))
        mascara = Image.new('L', (W, H), 0)
        ImageDraw.Draw(mascara).polygon([(x0 + incl, 0), (x0 + incl + largura, 0), (x0 + largura, H), (x0, H)], fill=255)
        camada = Image.new('RGB', (W, H))
        camada.paste(foto, (x0, 0))
        out.paste(camada, (0, 0), mascara)
        # fio escuro entre as faixas
        ImageDraw.Draw(out).line([(x0 + incl, 0), (x0, H)], fill=(8, 8, 10), width=8)
    return out


def decor() -> Image.Image:
    # recorte da superfície (metade esquerda da folha, abaixo da borda e longe do logo e do nome)
    pecas = [
        'kroma-forma-mandarino', 'wood-freijo-galicia', 'marmore-calacatta-oro', 'kroma-forma-azul-petroleo',
        'decor-porto', 'kroma-forma-verde-botanico', 'wood-ripado-vigo', 'kroma-forma-rosa-suave',
        'kroma-forma-malbec', 'marmore-nero', 'jardim-tropical', 'wood-carvalho-capuccino',
    ]
    arquivos = {p.stem.split('-', 1)[1]: p for p in (CORES / 'decor' / 'bobina').glob('*.jpg')}
    out = Image.new('RGB', (W, H), (0, 32, 91))
    cols, rows, gap = 4, 3, 10
    tw, th = (W - gap * (cols - 1)) // cols, (H - gap * (rows - 1)) // rows
    for k, nome in enumerate(pecas):
        im = Image.open(arquivos[nome]).convert('RGB')
        s = im.width
        sup = im.crop((int(s * .02), int(s * .34), int(s * .5), int(s * .9)))
        out.paste(ImageOps.fit(sup, (tw, th)), ((k % cols) * (tw + gap), (k // cols) * (th + gap)))
    return out


def signs() -> Image.Image:
    cores = ['127320-vermelho-tomate', '127312-laranja-intenso', '127311-amarelo-ouro', '127340-verde-abacate',
             '127350-azul-celeste', '127353-azul-royal', '773330-magenta', '773333-roxo']
    pasta = CORES / 'signs' / 'bobina'
    out = Image.new('RGB', (W, H), (38, 38, 40))
    n = len(cores)
    larg = W // n
    for k, nome in enumerate(cores):
        im = Image.open(next(pasta.glob(f'{nome}*.jpg'))).convert('RGB')
        s = im.width
        # a bobina fica em pé entre ~20% e ~40% da largura da foto
        faixa = im.crop((int(s * .17), 0, int(s * .43), int(s * .78)))
        out.paste(ImageOps.fit(faixa, (larg, H), centering=(0.5, 0.0)), (k * larg, 0))
    return out


def main() -> None:
    SAIDA.mkdir(parents=True, exist_ok=True)
    for nome, fazer in (('wraps', wraps), ('decor', decor), ('signs', signs)):
        fazer().save(SAIDA / f'{nome}.jpg', 'JPEG', quality=86, optimize=True, progressive=True)
        print('ok', nome)


if __name__ == '__main__':
    main()

"""Gera as texturas usadas no 3D (public/textures/decor-3d/<código>.jpg).

As texturas de public/textures/decor são recortes de foto: repetidas lado a
lado, mostram uma emenda a cada repetição. Espelhar a cada repetição escondia
a emenda, mas criava losangos e chevrons simétricos que não existem no padrão
(muito visível em mármores e madeiras claras). Aqui cada textura vira uma
versão que repete sem emenda, conforme o tipo de desenho:

  orgânico   (madeira, mármore, concreto, Kroma, jardim...): funde a imagem
             com ela mesma deslocada em meia largura e meia altura. As bordas
             passam a vir do miolo da foto, que é contínuo, e não sobra simetria;
  geométrico (ripado reto, muxarabi, tijolo, metrô, azulejo): fica como está, porque a
             fusão duplicaria as linhas do desenho;
  painel     (ripados ondulados): fotos de um painel inteiro, que não
             repetem; o 3D aplica numa peça só (ver FurnitureStudio).

Ajustes pontuais: o Wood Burl traz um reflexo de luz da foto no canto
superior esquerdo, que sai num recorte antes.

Uso:  python -I migracao/texturas_sem_emenda.py
"""
import json
import re
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / 'public' / 'textures' / 'decor'
SAIDA = RAIZ / 'public' / 'textures' / 'decor-3d'
DECOR = RAIZ / 'src' / 'data' / 'catalog' / 'decor.json'
LADO = 512

GEOMETRICO = re.compile(r'ripado lugo|muxarabi|tijolo|metr[oô]|^decor ', re.I)
PAINEL = re.compile(r'ripado (vigo|burgo|leon)', re.I)
RECORTE = {'977D122': (70, 70, 512, 512)}  # Burl: reflexo de luz no canto


def iluminacao_uniforme(im: Image.Image) -> np.ndarray:
    """Tira a variação de luz da foto (cantos mais escuros, reflexo suave):
    divide pela versão bem desfocada e devolve o brilho médio. O desenho
    (veios, poros) fica; o que marcava cada repetição como um bloco sai."""
    a = np.asarray(im, dtype=float)
    # desfoque com borda circular, para não escurecer as bordas
    grande = Image.fromarray(np.tile(a, (3, 3, 1)).astype(np.uint8)).filter(ImageFilter.GaussianBlur(LADO / 6))
    luz = np.asarray(grande, dtype=float)[LADO:2 * LADO, LADO:2 * LADO] + 1
    return a / luz * luz.mean(axis=(0, 1))


def sem_emenda(a: np.ndarray) -> np.ndarray:
    """Duas passadas separadas (horizontal, depois vertical). Em cada uma, a
    imagem é fundida com ela mesma deslocada em meia largura: peso 1 no miolo
    (foto original) e 0 nas bordas (cópia deslocada, cujas bordas vêm do miolo
    da foto e emendam entre si). A emenda da cópia cai no miolo, onde o peso é
    1, então não aparece. Fazer as duas direções juntas deixava uma cruz."""
    for eixo in (1, 0):
        n = a.shape[eixo]
        deslocada = np.roll(a, n // 2, axis=eixo)
        t = 1 - np.abs(np.linspace(-1, 1, n))
        peso = np.clip(t * 4, 0, 1)  # fusão só na faixa das bordas
        peso = peso * peso * (3 - 2 * peso)  # smoothstep
        peso = peso[None, :, None] if eixo == 1 else peso[:, None, None]
        a = a * peso + deslocada * (1 - peso)
    return a


def main() -> None:
    SAIDA.mkdir(exist_ok=True)
    nomes = {c['code']: c['name'] for c in json.loads(DECOR.read_text('utf8'))}
    tipos = {'orgânico': 0, 'geométrico': 0, 'painel': 0}
    for arq in sorted(ORIGEM.glob('*.jpg')):
        cod = arq.stem
        nome = nomes.get(cod, '')
        im = Image.open(arq).convert('RGB')
        if cod in RECORTE:
            im = im.crop(RECORTE[cod])
        im = im.resize((LADO, LADO), Image.LANCZOS)
        if GEOMETRICO.search(nome) or PAINEL.search(nome):
            tipo = 'painel' if PAINEL.search(nome) else 'geométrico'
            out = im
        else:
            tipo = 'orgânico'
            out = Image.fromarray(sem_emenda(iluminacao_uniforme(im)).clip(0, 255).astype(np.uint8))
        tipos[tipo] += 1
        out.save(SAIDA / arq.name, quality=90, optimize=True)
    print(tipos, '->', SAIDA.relative_to(RAIZ))


if __name__ == '__main__':
    main()

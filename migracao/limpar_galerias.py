"""Limpa as galerias de cores das linhas (src/data/wp/linhas.json -> cores).

A migracao do WordPress trouxe para a galeria de cada linha imagens que eram
do layout do site antigo: bandeiras PT/EN, botao "download do boletim",
"Design sem nome", logos, selos, icones, banners de check-list/manual e
miniaturas de outras linhas (algumas com rotulo trocado). Elas se repetem em
quase todas as fichas, o que aparecia como conteudo duplicado. Tambem havia o
mesmo arquivo enviado mais de uma vez (ex.: Adesive-Killer-1, -1-1, -1-2).

Regras (nessa ordem):
  1. rotulo de elemento de layout (lista LIXO abaixo) sai;
  2. imagem presente em 3 ou mais linhas sai (era elemento compartilhado),
     exceto na linha de que ela e o produto;
  3. imagem minuscula (icone) ou SVG sai;
  4. dentro da mesma linha, a mesma foto fica uma vez so, na versao de maior
     resolucao. Mesma foto = mesmo nome de arquivo (ignorando o sufixo -1/-2
     que o WordPress poe em reenvios) e visualmente igual, ou praticamente
     identica. So a comparacao visual nao basta: variantes brilho/fosco e
     cores da mesma serie sao quase iguais em miniatura.

Uso:  python -I migracao/limpar_galerias.py [--dry]
"""
import json
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path

import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
LINHAS = RAIZ / 'src' / 'data' / 'wp' / 'linhas.json'
PUBLIC = RAIZ / 'public'

LIXO = re.compile(
    r'^(PT-BR|ENG|ESP|PDF|TOPICO|LOGO|\d+( \d+)?)$'
    r'|DOWNLOAD DO BOLETIM|DESIGN SEM NOME|SEM NOME \d+ X|\bLOGO\b|^SELO |^BANNER '
    r'|BAIXE (CHECK ?LIST|MANUAL)|\.SVG$',
    re.I,
)
LADO_MIN = 160
MESMA_FOTO = 4.0   # diferenca media (0-255) entre miniaturas 32x32, mesmo nome de arquivo
IDENTICA = 0.5     # abaixo disso e a mesma imagem mesmo com nome diferente
COMPARTILHADA = 3


def arquivo_local(src: str) -> Path:
    return PUBLIC / src.removeprefix('./')


def normalizar(s: str) -> str:
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()


def da_propria_linha(linha: dict, cor: dict) -> bool:
    """Imagem compartilhada continua na linha de que ela e o produto
    (ex.: a foto 'Dupla Face' fica na linha dupla-face)."""
    alvo = normalizar(linha['slug'])
    return alvo in normalizar(cor['rotulo']) or alvo in normalizar(Path(cor['arquivo']).stem)


def assinatura(p: Path) -> np.ndarray:
    with Image.open(p) as im:
        return np.asarray(im.convert('L').resize((32, 32)), dtype=float)


def base_nome(src: str) -> str:
    return re.sub(r'-(\d+|\d+x\d+)$', '', Path(src).stem.lower())


def mesma_foto(a: tuple[dict, np.ndarray], b: tuple[dict, np.ndarray]) -> bool:
    d = np.abs(a[1] - b[1]).mean()
    return d < IDENTICA or (d < MESMA_FOTO and base_nome(a[0]['arquivo']) == base_nome(b[0]['arquivo']))


def main() -> None:
    dry = '--dry' in sys.argv
    linhas = json.loads(LINHAS.read_text('utf8'))

    em_linhas: dict[str, set[str]] = defaultdict(set)
    for l in linhas:
        for c in l['cores']:
            em_linhas[c['arquivo']].add(l['slug'])

    removidas = defaultdict(list)
    for l in linhas:
        novas: list[tuple[dict, np.ndarray, int]] = []  # (cor, assinatura, area)
        for c in l['cores']:
            motivo = None
            p = arquivo_local(c['arquivo'])
            area = 0
            if LIXO.search(c['rotulo'].strip()):
                motivo = 'layout'
            elif len(em_linhas[c['arquivo']]) >= COMPARTILHADA and not da_propria_linha(l, c):
                motivo = 'compartilhada'
            elif p.suffix.lower() == '.svg' or not p.exists():
                motivo = 'svg/inexistente'
            else:
                try:
                    with Image.open(p) as im:
                        area = im.size[0] * im.size[1]
                        if min(im.size) < LADO_MIN:
                            motivo = 'icone'
                except Exception:
                    motivo = 'ilegivel'
            if not motivo:
                ass = assinatura(p)
                igual = next((i for i, (k, a, _) in enumerate(novas) if mesma_foto((k, a), (c, ass))), None)
                if igual is not None:
                    motivo = 'repetida'
                    # fica a de maior resolucao, na posicao da primeira
                    if area > novas[igual][2]:
                        removidas[motivo].append(f"{l['slug']}: {novas[igual][0]['rotulo']}")
                        novas[igual] = (c, ass, area)
                        continue
                else:
                    novas.append((c, ass, area))
            if motivo:
                removidas[motivo].append(f"{l['slug']}: {c['rotulo']}")
        l['cores'] = [c for c, _, _ in novas]

    total = sum(len(v) for v in removidas.values())
    for m, itens in removidas.items():
        print(f'{m}: {len(itens)}')
        for i in itens[:6]:
            print('   ', i)
    print('removidas', total, '| restantes', sum(len(l['cores']) for l in linhas))
    if not dry:
        LINHAS.write_text(json.dumps(linhas, ensure_ascii=False, indent=1) + '\n', 'utf8')


if __name__ == '__main__':
    main()

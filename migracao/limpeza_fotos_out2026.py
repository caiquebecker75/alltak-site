"""Revisão da cartela (out/2026), idempotente.

  - Wood Ripado Leon (977D98) saiu de linha: sai do site.
  - Kroma Forma Argento, Grafite, Cinza Fóssil e Gamboge não vieram no Drive de
    fotos oficiais: usam a foto de bobina da página Kroma do site antigo (a
    imagem que tinham era uma faixa fina ou a arte de ambiente recortada).
  - Fotos "aplicadas" antigas que são arte de carrossel com recorte branco num
    canto, ou só uma faixa fina, saem da galeria da cor (fica a bobina).

Uso:  python -X utf8 -I migracao/limpeza_fotos_out2026.py
"""
import json
from pathlib import Path

from PIL import Image, ImageStat

RAIZ = Path(__file__).resolve().parent.parent
CAT = RAIZ / 'src' / 'data' / 'catalog'
PUB = RAIZ / 'public'
FORA_DE_LINHA = {('decor', '977D98')}
BOBINA_ANTIGA = {  # código → foto de bobina da página Kroma do site antigo
    '977KF08': 'wp-uploads/2023/04/Kroma_Argento_Site.jpg',
    '977KF09': 'wp-uploads/2023/04/Kroma_Grafite_Site.jpg',
    '977KF03': 'wp-uploads/2023/02/Kroma_Cinza-Fossil_Site.jpg',
    '977KF24': 'wp-uploads/2024/07/KROMA-FORMA-GAMBOGE_site.jpg',
}


def ruim(p: Path) -> bool:
    im = Image.open(p).convert('RGB')
    w, h = im.size
    if w / h > 3 or h / w > 3:
        return True  # faixa
    cantos = [im.crop((int(w * .88), 0, w, int(h * .12))), im.crop((0, 0, int(w * .12), int(h * .12)))]
    return any(ImageStat.Stat(c).mean[0] > 245 and ImageStat.Stat(c).stddev[0] < 6 for c in cantos)


def main() -> None:
    for linha in ('wraps', 'decor'):
        arq = CAT / f'{linha}.json'
        d = [c for c in json.loads(arq.read_text('utf8')) if (linha, c['code']) not in FORA_DE_LINHA]
        tiradas = 0
        for c in d:
            if linha == 'decor' and c['code'] in BOBINA_ANTIGA:
                origem = PUB / BOBINA_ANTIGA[c['code']]
                destino = PUB / 'colors' / 'decor' / 'bobina' / f"{c['code'].lower()}-antiga.jpg"
                destino.parent.mkdir(parents=True, exist_ok=True)
                im = Image.open(origem).convert('RGB')
                im.thumbnail((900, 900))
                im.save(destino, 'JPEG', quality=84, optimize=True, progressive=True)
                c['bobina'] = f'bobina/{destino.name}'
            ap = c.get('applied')
            if ap and (PUB / 'colors' / linha / ap).exists() and ruim(PUB / 'colors' / linha / ap):
                c['applied'] = None
                tiradas += 1
        arq.write_text(json.dumps(d, ensure_ascii=False, indent=1) + '\n', 'utf8')
        print(linha, len(d), 'cores;', tiradas, 'fotos aplicadas com recorte/faixa retiradas da galeria')


if __name__ == '__main__':
    main()

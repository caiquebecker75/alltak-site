"""Ajustes de cartela pedidos pela Alltak em out/2026 (idempotente).

Wraps
  - FX: saem Graphite Rave (18FXR932M) e Black Rave (18FXR70); entra Impact
    Black, com a mesma imagem do Jateado Black (código oficial ainda não
    informado: o site não mostra código para ela).
  - Satin: sai Satin Brown Metallic (18S80M).
  - Ultra: saem Ultra Kosmic Valerian Gold (18UK02M), Ultra Kosmic Starfire
    Purple (18UK03M) e Ultra Green Bright Jade Metallic (18UD09M).
  - Nova família Evolution Pro: as 21 cores da página do site antigo
    (fotos em wp-uploads/2026/09), acabamento do catálogo Evolution Pro.

Decor
  - Famílias renomeadas: Kroma, Wood, Estampa (jardins), Azulejos, Cristais,
    Pedras (mármores, Lombardia, concretos, tijolos) e Piso Decor.
  - Piso Decor com os 5 pisos do catálogo (fotos Pisotak Decor do site antigo);
    o Deck Valência mostrava a foto do Greenday e passa a ter a própria.
  - Cristais: as 8 cores do carrossel da página Cristais do site antigo.

Uso:  python -X utf8 -I migracao/ajustes_cores_out2026.py <pasta com as fotos Pisotak baixadas>
      (depois: python -X utf8 -I migracao/integrar_catalogos.py migracao/catalogos)
"""
import json
import re
import sys
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
CAT = RAIZ / 'src' / 'data' / 'catalog'
PUB = RAIZ / 'public'
OUT_WRAPS = RAIZ / 'migracao' / 'catalogos' / 'out-wraps.json'


def ler(nome: str) -> list:
    return json.loads((CAT / nome).read_text('utf8'))


def gravar(nome: str, d: list) -> None:
    (CAT / nome).write_text(json.dumps(d, ensure_ascii=False, indent=1) + '\n', 'utf8')


def cor_media(img: Image.Image) -> str:
    """Hex da média do centro da imagem (a foto da bobina ocupa o meio)."""
    w, h = img.size
    centro = img.convert('RGB').crop((w * 3 // 10, h * 3 // 10, w * 7 // 10, h * 7 // 10)).resize((1, 1), Image.Resampling.BOX)
    return '#%02x%02x%02x' % centro.getpixel((0, 0))


def salvar_foto(origem: Path, destino: Path, lado: int = 900) -> str:
    im = Image.open(origem).convert('RGB')
    im.thumbnail((lado, lado))
    destino.parent.mkdir(parents=True, exist_ok=True)
    im.save(destino, 'JPEG', quality=84, optimize=True, progressive=True)
    return cor_media(im)


def titulo(s: str) -> str:
    return ' '.join(p.capitalize() for p in s.split())


def wraps() -> None:
    d = ler('wraps.json')
    fora = {'18FXR932M', '18FXR70', '18S80M', '18UK02M', '18UK03M', '18UD09M'}
    d = [c for c in d if c['code'] not in fora]
    if not any(c['name'] == 'Impact Black' for c in d):
        i = max(k for k, c in enumerate(d) if c['family'] == 'Fx')
        d.insert(i + 1, {'code': '18FXIMPACT70', 'name': 'Impact Black', 'family': 'Fx', 'acabamento': 'Texturizado Fosco',
                         'hex': '#141414', 'swatch': '18J70_sw.jpg', 'applied': '18J70_ap.jpg', 'semCodigo': True})
    # Evolution Pro
    bruto = json.loads(OUT_WRAPS.read_text('utf8'))
    catalogo = {**bruto['cores'], **bruto.get('cores_evolution_pro', {})}
    d = [c for c in d if c['family'] != 'Evolution Pro']
    for f in sorted((PUB / 'wp-uploads' / '2026' / '09').glob('EVOLUTION-PRO-*-18EVO*.jpg')):
        m = re.match(r'EVOLUTION-PRO-(.+)-(18EVO\d+M?)(?:-v\d)?\.jpg$', f.name)
        if not m:
            continue
        code = m.group(2)
        cat = catalogo.get(code, {})
        nome = cat.get('nome') or 'Evolution Pro ' + titulo(m.group(1).replace('-', ' '))
        acab = next((s.split(': ', 1)[1] for s in cat.get('pt', {}).get('specs', []) if s.startswith('Acabamento:')), '')
        hexa = salvar_foto(f, PUB / 'colors' / 'wraps' / f'{code}_sw.jpg')
        d.append({'code': code, 'name': nome, 'family': 'Evolution Pro', 'acabamento': acab[:1].upper() + acab[1:],
                  'hex': hexa, 'swatch': f'{code}_sw.jpg', 'applied': None})
    gravar('wraps.json', d)
    print('wraps:', len(d), 'cores;', sum(c['family'] == 'Evolution Pro' for c in d), 'Evolution Pro')


FAMILIA_DECOR = [
    (r'^Kroma', 'Kroma'), (r'^Wood', 'Wood'), (r'^Jardim', 'Estampa'), (r'^(Metrô|Decor Porto|Decor Lisboa)', 'Azulejos'),
    (r'^Cristal', 'Cristais'), (r'^(Mármore|Lombarda|Concreto|Tijolo)', 'Pedras'),
]
PISOS = [  # código, nome no catálogo, foto Pisotak do site antigo
    ('977TP01', 'Greenday', 'Pisotak-Decor-Green-Day_site.jpg'),
    ('977TP69', 'Mármore Marquina', 'Pisotak-Decor_Marmore-Marquina_site.jpg'),
    ('977TP75', 'Deck Madrid', 'Pisotak-Decor_Deck-Madrid_site.jpg'),
    ('977TP74', 'Deck Valência', 'Pisotak-Decor_Deck-Valencia_site.jpg'),
    ('977TP49', 'Decor Concreto', 'Pisotak-Decor_Concreto_site.jpg'),
]
CRISTAIS = [  # código do catálogo Decor, nome, imagem do carrossel do site antigo
    ('977C01', 'Cristal Jateado', '2026/02/Carrossel_Cristais_Out-2025_Latam_04.jpg-1.jpeg'),
    ('977C10', 'Cristal Quadra', '2026/02/Carrossel_Cristais_Out-2025_Latam_05.jpg-1.jpeg'),
    ('977C04', 'Cristal Condessa', '2026/02/Carrossel_Cristais_Out-2025_Latam_06.jpg-1.jpeg'),
    ('977C13', 'Cristal Rave', '2026/02/Carrossel_Cristais_Out-2025_Latam_07.jpg-1.jpeg'),
    ('977C12', 'Cristal Krusher', '2026/02/Carrossel_Cristais_Out-2025_Latam_08.jpg-1.jpeg'),
    ('977C07', 'Cristal Carbonium', '2026/02/Carrossel_Cristais_Out-2025_Latam_09.jpg-1.jpeg'),
    ('977C014', 'Cristal Persiana', '2026/02/Carrossel_Cristais_Out-2025_Latam_10.jpg-1.jpeg'),
    ('977C15', 'Cristal Jardim Tropical', '2026/03/Jardim-Tropical-Cristal_site.jpg.jpeg'),
]


def decor(pasta_pisos: Path) -> None:
    d = ler('decor.json')
    d = [c for c in d if c.get('family') not in ('Piso Decor', 'Cristais') and c['code'] != '977TP74']
    for code, nome, foto in CRISTAIS:
        sw = f'{code}_sw.jpg'
        hexa = salvar_foto(PUB / 'wp-uploads' / foto, PUB / 'colors' / 'decor' / sw)
        # sem textura plana: não entram nos simuladores 3D (filme para vidro)
        d.append({'code': code, 'name': nome, 'hex': hexa, 'swatch': sw, 'applied': None, 'semTextura': True})
    for code, nome, foto in PISOS:
        sw = f'{code}_sw.jpg'
        hexa = salvar_foto(pasta_pisos / foto, PUB / 'colors' / 'decor' / sw)
        d.append({'code': code, 'name': nome, 'hex': hexa, 'swatch': sw, 'applied': None, 'family': 'Piso Decor', 'semTextura': True})
    for c in d:
        if c.get('family') == 'Piso Decor':
            continue
        c['family'] = next((f for padrao, f in FAMILIA_DECOR if re.search(padrao, c['name'])), c.get('family', ''))
    gravar('decor.json', d)
    fams: dict[str, int] = {}
    for c in d:
        fams[c['family']] = fams.get(c['family'], 0) + 1
    print('decor:', len(d), 'cores', fams)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    wraps()
    decor(Path(sys.argv[1]))

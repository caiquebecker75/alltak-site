"""Fotos oficiais de bobina (Drive da 75LAB/Alltak, out/2026) nas cores do site.

Pastas do Drive: LINHA DECOR (subpastas por família), LINHA SIGNS, LINHA WRAPS,
LINHA EVOLUTION PRO e LINHA IWC. Cada foto 1080×1080 mostra a bobina com o nome
e o código impressos; os PSDs e os modelos 3D do simulador não entram aqui.

O que faz (idempotente):
  - casa cada foto com a cor do site pelo nome do arquivo (e por uma tabela de
    apelidos quando a grafia difere) e grava public/colors/<linha>/bobina/*.jpg
    (900 px); o campo "bobina" do JSON passa a ser a foto da cartela. Em Signs a
    foto antiga já era a bobina, então "applied" também passa a ser a nova.
  - inclui as cores que estão no Drive e ainda não estavam no site, com o código
    impresso na foto (Kroma, mármores/Lombarda brilho, Crema Marfil, Zaragoza,
    tijolos, 5 Elemento, Ultra Free Yellow, FPP) e a família IWC (40 cores, sem
    código na foto: o site não mostra código para elas).
  - corrige nomes que a foto oficial escreve diferente (ex.: Satin Yellon).

Uso:  python -X utf8 -I migracao/imagens_drive_out2026.py <pasta img do Drive>
      (pastas: DECOR/<família>/, SIGNS/, WRAPS/, EVOLUTION_PRO/, IWC/)
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
CAT = RAIZ / 'src' / 'data' / 'catalog'
PUB = RAIZ / 'public' / 'colors'


def norm(s: str) -> str:
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()


def chave_arquivo(nome: str) -> str:
    t = re.sub(r'[\x00-\x1f]', '', nome)
    t = re.sub(r'(-1080x1080px)?\.jpe?g$', '', t, flags=re.I)
    t = re.sub(r'^(ALLTAK-DECOR-|ALLTAK-SIGNS-|WRAPS-|Evolution-Pro-|IWC-)', '', t, flags=re.I)
    t = re.sub(r'^(AZULEJOS-|ESTAMPAS-|PISO-DECOR-)', '', t)
    return norm(t)


def cor_media(im: Image.Image) -> str:
    w, h = im.size  # a bobina fica à esquerda/centro; o texto, embaixo à direita
    c = im.convert('RGB').crop((int(w * .2), int(h * .2), int(w * .55), int(h * .7))).resize((1, 1), Image.Resampling.BOX)
    return '#%02x%02x%02x' % c.getpixel((0, 0))


def salvar(origem: Path, linha: str, nome_arq: str) -> tuple[str, str]:
    im = Image.open(origem).convert('RGB')
    hexa = cor_media(im)
    im.thumbnail((900, 900))
    destino = PUB / linha / 'bobina' / nome_arq
    destino.parent.mkdir(parents=True, exist_ok=True)
    im.save(destino, 'JPEG', quality=84, optimize=True, progressive=True)
    return f'bobina/{nome_arq}', hexa


def slug(s: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', norm(s)).strip('-')


# grafia do arquivo do Drive → código no site (quando o nome não bate)
APELIDOS = {
    'wraps': {
        'brushed graphite metallic': '18FXB932M', 'krusher white metallic': '18K10',
        'ultra star yellow metallic': '18US02M', 'ultra star red metallic': '18US01M',
        'ultra biscayne blue': '18U57', 'jateado military green': '18J383', 'jateado gray metallic': '18J932M',
        '4d carbon black metallic': '184D70', '5 elemento graphite': '18E501', 'satin pearl white metallic': '18S946P',
        'satin adamantium gray metallic': '18S74M', 'satin yellow': '18S21', 'ultra acai bery': '18U40',
        'ultra vanilla ice cream': '18U89', 'acid lemon': '18EVO21M',
    },
    'decor': {'kroma forma avorio off white': '977KF34', 'concreto@piso': '977TP49'},
}
# nome como está impresso na foto oficial, quando difere do site
RENOMEAR = {
    '18S21': 'Satin Yellow', '18S74M': 'Satin Adamantium Gray Metallic', '18J932M': 'Jateado Gray Metallic',
    '18US01M': 'Ultra Star Red Metallic', '18US02M': 'Ultra Star Yellow Metallic', '18U57': 'Ultra Biscayne Blue',
    '184D70': '4D Carbon Black Metallic', '18E501': '5 Elemento Graphite', '18K10': 'Krusher White',
    # com a versão brilho chegando, a do site (fosco) ganha o acabamento no nome
    '977D90': 'Metrô Branco Fosco', '977D116': 'Lombarda Cenere Fosco', '977D117': 'Lombarda Sabbia Fosco',
    '977D102': 'Mármore Calacatta Oro Fosco', '977D106': 'Mármore Grígio Fosco', '977D86': 'Mármore Lunare Fosco',
    '977D96': 'Mármore Marquina Fosco', '977D121': 'Mármore Tivoli Fosco',
}
# cores do Drive que ainda não estavam no site: chave do arquivo → (código impresso na foto, nome, família)
NOVAS = {
    'decor': {
        'metro branco brilho': ('977D91', 'Metrô Branco Brilho', 'Azulejos'),
        'kroma forma avela cremoso': ('977KF27', 'Kroma Forma Avelã Cremoso', 'Kroma'),
        'kroma forma azul boreal': ('977KF29', 'Kroma Forma Azul Boreal', 'Kroma'),
        'kroma forma azul urbano': ('977KF30', 'Kroma Forma Azul Urbano', 'Kroma'),
        'kroma forma branco artico': ('977KF05', 'Kroma Forma Branco Ártico', 'Kroma'),
        'kroma forma malbec': ('977KF33', 'Kroma Forma Malbec', 'Kroma'),
        'kroma forma noz moscada': ('977KF31', 'Kroma Forma Noz-Moscada', 'Kroma'),
        'kroma forma rosa suave': ('977KF40', 'Kroma Forma Rosa Suave', 'Kroma'),
        # a foto traz 977KF34 (código do Avorio); o catálogo Decor dá 977KFT52
        'kroma forma tramatto aveia': ('977KFT52', 'Kroma Forma Tramatto Aveia', 'Kroma'),
        'kroma forma tramatto off white': ('977KFT51', 'Kroma Forma Tramatto Off-White', 'Kroma'),
        'kroma forma tramatto palha': ('977KFT50', 'Kroma Forma Tramatto Palha', 'Kroma'),
        'kroma forma verde oliva': ('977KF27', 'Kroma Forma Verde Oliva', 'Kroma'),
        'kroma listras aveia': ('977KFL49', 'Kroma Listras Aveia', 'Kroma'),
        'kroma listras azul boreal': ('977KFL47', 'Kroma Listras Azul Boreal', 'Kroma'),
        'kroma listras cinza neblina': ('977KFL46', 'Kroma Listras Cinza Neblina', 'Kroma'),
        'kroma listras rosa suave': ('977KFL48', 'Kroma Listras Rosa Suave', 'Kroma'),
        'kroma rattan off white': ('977KR13', 'Kroma Rattan Off-White', 'Kroma'),
        'kroma wood lerida': ('977KW06', 'Kroma Wood Lérida', 'Kroma'),
        'kroma wood segovia': ('', 'Kroma Wood Segovia Off-White', 'Kroma'),  # foto sem código
        'kroma wood avila': ('977KW02', 'Kroma Wood Ávila', 'Kroma'),
        'lombarda cenere brilho': ('977D114', 'Lombarda Cenere Brilho', 'Pedras'),
        'lombarda sabbia brilho': ('977D115', 'Lombarda Sabbia Brilho', 'Pedras'),
        'marmore calacatta oro brilho': ('977D101', 'Mármore Calacatta Oro Brilho', 'Pedras'),
        'marmore crema marfil brilho': ('977D103', 'Mármore Crema Marfil Brilho', 'Pedras'),
        'marmore crema marfil fosco': ('977D104', 'Mármore Crema Marfil Fosco', 'Pedras'),
        'marmore grigio brilho': ('977D105', 'Mármore Grígio Brilho', 'Pedras'),
        'marmore lunare brilho': ('977D87', 'Mármore Lunare Brilho', 'Pedras'),
        'marmore marquina brilho': ('977D95', 'Mármore Marquina Brilho', 'Pedras'),
        'marmore tivoli brilho': ('977D120', 'Mármore Tivoli Brilho', 'Pedras'),
        'tijolo branco': ('977D28', 'Tijolo Branco', 'Pedras'),
        'tijolo vermelho': ('977D29', 'Tijolo Vermelho', 'Pedras'),
        'wood freijo zaragoza brilho': ('977D124', 'Wood Freijó Zaragoza Brilho', 'Wood'),
        'wood freijo zaragoza fosco': ('977D123', 'Wood Freijó Zaragoza Fosco', 'Wood'),
    },
    'wraps': {
        '5 elemento blue': ('18E505', '5 Elemento Blue', 'Carbon', 'Brilhante'),
        '5 elemento pink': ('18E503', '5 Elemento Pink', 'Carbon', 'Brilhante'),
        '5 elemento red': ('18E504', '5 Elemento Red', 'Carbon', 'Brilhante'),
        '5 elemento yellow': ('18E502', '5 Elemento Yellow', 'Carbon', 'Brilhante'),
        'ultra free yellow': ('18UCF01', 'Ultra Free Yellow', 'Ultra', 'Brilhante'),
        'fpp gloss cristal': ('18FPP01', 'FPP Gloss Cristal X-Protection', 'FPP', 'Brilhante'),
        'fpp matte cristal': ('18FPP02', 'FPP Matte Cristal X-Protection', 'FPP', 'Fosco'),
    },
}
REMOVIDAS = {'black rave', 'graphite rave', 'satin brown metallic', 'ultra green bright jade metallic',
             'ultra kosmic starfire purple', 'ultra kosmic valerian gold'}
# IWC: nomes do catálogo IWC; Golden Harmony é Matte na foto (Satin no catálogo)
ACAB_IWC = {'gloss': 'Brilhante', 'matte': 'Fosco', 'satin': 'Acetinado'}


def nome_iwc(chave: str) -> str:
    fix = {'golde harmony': 'golden harmony'}
    for a, b in fix.items():
        chave = chave.replace(a, b)
    return 'IWC ' + ' '.join(p.capitalize() for p in chave.split())


def main(pasta: Path) -> None:
    dados = {l: json.loads((CAT / f'{l}.json').read_text('utf8')) for l in ('wraps', 'decor', 'signs')}
    # tira o que uma execução anterior incluiu, para recomeçar do mesmo ponto
    for l, d in dados.items():
        dados[l] = [c for c in d if not c.get('doDrive')]
    def achar(l, code=None, chave=None, piso=False):
        for c in dados[l]:
            if code and c['code'] == code:
                return c
            if chave is None:
                continue
            fam = c.get('family') or c.get('serie') or ''
            if l == 'decor' and (fam == 'Piso Decor') != piso:
                continue
            if l == 'wraps' and fam == 'Evolution Pro':
                nomes = {norm(c['name']), norm(c['name'])[14:]}
            else:
                nomes = {norm(c['name']), norm(f"{fam} {c['name']}")}
                if fam == 'TEC':  # Signs TEC vem na pasta como "COLOR-..."
                    nomes.add('color ' + norm(c['name']))
                if norm(c['name']).startswith('fx '):
                    nomes.add(norm(c['name'])[3:])
            if chave in nomes:
                return c
        return None
    relatorio = {'trocadas': 0, 'novas': 0, 'sem_par': [], 'sem_foto': []}
    usados = set()
    for raiz, l in (('DECOR', 'decor'), ('SIGNS', 'signs'), ('WRAPS', 'wraps'), ('EVOLUTION_PRO', 'wraps'), ('IWC', 'wraps')):
        for f in sorted((pasta / raiz).rglob('*.jpg')):
            k = chave_arquivo(f.name)
            piso = 'PISO DECOR' in f.parts
            if l == 'wraps' and k in REMOVIDAS:
                continue
            if raiz == 'IWC':
                nome = nome_iwc(k)
                arq, hexa = salvar(f, l, f'iwc-{slug(k)}.jpg')
                dados[l].append({'code': f'IWC-{slug(k).upper()}', 'name': nome, 'family': 'IWC',
                                 'acabamento': ACAB_IWC[k.split()[0]], 'hex': hexa, 'swatch': None, 'applied': None,
                                 'bobina': arq, 'semCodigo': True, 'doDrive': True})
                relatorio['novas'] += 1
                continue
            ap = APELIDOS.get(l, {})
            code = ap.get(k + '@piso') if piso else ap.get(k)
            c = achar(l, code=code) if code else achar(l, chave=k, piso=piso)
            if c is None and k.endswith(' fosco') and not piso:
                c = achar(l, chave=k[:-6])
            nova = NOVAS.get(l, {}).get(k)
            if c is None and nova:
                code, nome, fam = nova[:3]
                arq, hexa = salvar(f, l, f'{slug(code or nome)}-{slug(nome)}.jpg')
                item = {'code': code or f'SEM-{slug(nome).upper()}', 'name': nome, 'family': fam, 'hex': hexa,
                        'swatch': None, 'applied': None, 'bobina': arq, 'doDrive': True}
                if not code:
                    item['semCodigo'] = True
                if l == 'decor':
                    item['semTextura'] = True
                else:
                    item['acabamento'] = nova[3]
                dados[l].append(item)
                relatorio['novas'] += 1
                continue
            if c is None:
                relatorio['sem_par'].append(f'{raiz}: {f.name}')
                continue
            arq, _ = salvar(f, l, f'{slug(c["code"])}-{slug(c["name"])}.jpg')
            c['bobina'] = arq
            if l == 'signs':
                c['applied'] = arq
            usados.add((l, c['code'], c['name']))
            relatorio['trocadas'] += 1
    for l, d in dados.items():
        for c in d:
            if c['code'] in RENOMEAR and not c.get('doDrive'):
                c['name'] = RENOMEAR[c['code']]
            if not c.get('bobina') and not c.get('doDrive'):
                relatorio['sem_foto'].append(f"{l}: {c['code']} {c['name']}")
        (CAT / f'{l}.json').write_text(json.dumps(d, ensure_ascii=False, indent=1) + '\n', 'utf8')
    print(json.dumps(relatorio, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))

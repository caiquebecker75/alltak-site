"""Fotos padronizadas dos cards da página Encontre um Instalador (out/2026).

As fotos novas (uniforme Pro Expert, fundo branco com o trapézio azul) valem só
para a grade da página principal; ao abrir o perfil continua a foto que o
instalador enviou. Vieram da pasta "Novo Logo" do Drive da Alltak:
  - JPG 1000×1000: usados como estão (reduzidos)
  - PNG 2160×3840 (artes de stories com nome e cidade escritos): recorta-se o
    quadrado da foto, no mesmo enquadramento dos JPGs, e apaga-se o logo de cima
Os nomes dos arquivos são apelidos ("Bruno", "Rodrigo"...): a tabela abaixo diz
de quem é cada um (os ambíguos foram conferidos comparando com a foto atual;
"Bruno (1)" é o Bruno Lima, "Bruno 2" o Bruno Oliveira, "Samuel" o Samuel Vieira).
"Eduardo - ColaComigo" é o Eduardo Borges, que saiu da página.

Saída: public/instaladores/cards/<slug>.jpg. O instaladores.py lê essa pasta.

Uso:  python -X utf8 -I migracao/fotos_cards_instaladores.py <pasta com as fotos>
"""
import sys
import unicodedata
from pathlib import Path

from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / 'public' / 'instaladores' / 'cards'

ARQUIVO_PARA_SLUG = {
    'Adilson': 'adilson-lopes', 'Alex': 'alex-hander', 'Antonio Betinho': 'antonio', 'Bismarkis': 'bismarkis-santos',
    'Bruno Rodrigues': 'bruno-rodrigues', 'Bruno': 'bruno-andrey', 'Calebe': 'calebe-san-martins',
    'Demurie': 'demurie-silva', 'Eduardo': 'eduardo-chardosim-stabel', 'Ercy': 'erci-junior',
    'Esaú Farias': 'esau-de-jesus-farias', 'Fabio': 'fabio-braga', 'Fernando': 'fernando-de-mello-cordeiro',
    'Gaston': 'gaston-garcete', 'Gerval': 'gerval-farias', 'Gustavo Rojas': 'gustavo-rojas', 'Gustavo': 'gustavo-cardoso',
    'Iago': 'iago-batista', 'Jairson': 'jairson-de-azevedo', 'Leandro Spectrum': 'leandro-costa-ribeiro-spectrum',
    'Leandro Tindaro': 'leandro-tindaro', 'Leandro': 'leandro-simoes', 'Lucas': 'lucas-lopes',
    'Luciano Nunes': 'luciano-nunes-barbosa', 'Lucio': 'lucio-gomes', 'Marcel': 'marcel',
    'Marcelo TK': 'marcelo-menon-fernandes-tk', 'Marcelo': 'marcelo-ramos', 'Marcio': 'marcio-arts',
    'Raphael': 'raphael', 'Renan': 'renan-tirelli', 'Ricardo Telles': 'ricardo-santos-telles-de-mattos',
    'Rodrigo#jpg': 'rodrigo-paulo', 'Rodrigo#png': 'rodrigo-barbosa-abreu-bueno-cardoso', 'Rubens': 'rubens-falchetto',
    'Samuel Ferreira': 'samuel-washington-ferreira-da-frota', 'Sávio': 'savio-figueiredo-dos-santos',
    'Sergio': 'sergio-raimundo', 'Silvano': 'silvanio-pereira-de-almeida', 'Thiago Sossai': 'thiago-sossai',
    'Thiago': 'thiago-da-print', 'Willian': 'willian-henrique', 'Yan Facini 2': 'yan-cutrim-costa-facini',
    # 2ª leva (out/2026)
    'Albert': 'albert-de-souza-lousada', 'Alexander': 'alexander-rivera', 'Bruno (1)': 'bruno-lima',
    'Bruno 2': 'bruno-oliveira-lopes-da-silva', 'Caio': 'caio-vieira', 'Camila': 'camila-scotti',
    'Cordero': 'damian-cordero', 'Esdras': 'esdras-farias', 'Glauco': 'glauco-martins', 'James': 'james-garcia',
    'Jefferson': 'jefferson-rafael', 'Kayron': 'kayron-silva-da-silva', 'Leonardo': 'leonardo-cardoso-felix',
    'Martin': 'martin-ulivi', 'Mathias': 'mathias-gian-lucca-berea-maciel', 'Muryllo': 'muryllo-vellasques',
    'Rafael': 'rafael-xavier', 'Rodrigo Nogueira': 'rodrigo-nogueira', 'Rodrigo San Martin': 'rodrigo-de-paula-san-martins',
    'Samuel': 'samuel-vieira', 'Simone': 'simone-nunes', 'Tiago': 'tiago-securella', 'Valmir': 'valmir-rodrigues',
    'Wellington': 'francisco-wellington-da-silva', 'Willert': 'willert-swann-nepomuceno-raiol',
}
IGNORAR = {'Eduardo - ColaComigo'}  # Eduardo Borges saiu da página


def quadrado_do_story(im: Image.Image) -> Image.Image:
    """Arte vertical 2160×3840: o trapézio vai de y≈576 a y≈2189."""
    lado, base = 1792, 2189
    x0 = (im.width - lado) // 2
    c = im.crop((x0, base - lado, x0 + lado, base))
    ImageDraw.Draw(c).rectangle((0, 0, lado, 168), fill='white')  # resto do logo "PRO EXPERT"
    return c


def main(pasta: Path) -> None:
    SAIDA.mkdir(parents=True, exist_ok=True)
    feitos, sem = [], []
    for f in sorted(pasta.iterdir()):
        if f.suffix.lower() not in ('.jpg', '.jpeg', '.png'):
            continue
        nome = unicodedata.normalize('NFC', f.stem)
        if nome in IGNORAR:
            continue
        slug = ARQUIVO_PARA_SLUG.get(f'{nome}#{f.suffix.lower()[1:]}') or ARQUIVO_PARA_SLUG.get(nome)
        if not slug:
            sem.append(f.name)
            continue
        im = Image.open(f).convert('RGB')
        if im.height > im.width * 1.3:
            im = quadrado_do_story(im)
        im.thumbnail((800, 800))
        im.save(SAIDA / f'{slug}.jpg', 'JPEG', quality=84, optimize=True, progressive=True)
        feitos.append(slug)
    print(len(feitos), 'fotos de card gravadas; sem dono na tabela:', sem)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))

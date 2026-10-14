"""Gera src/data/instaladores.json: os perfis Pro Expert da página Instaladores.

Junta duas fontes:
  - src/data/wp/instaladores.json  (31 perfis migrados do WordPress, com o
    texto bruto da página: telefone, cidade, Instagram e bio misturados)
  - migracao/instaladores-novos.json (16 aprovados em out/2026, já separados)

Do texto antigo saem cidade, telefone e bio limpos (sem entidades HTML, ícones
nem quebras de linha no meio da frase). A foto é a primeira imagem real do
perfil: no WordPress a lista começa pelas bandeiras do seletor de idioma e
termina em dois ícones comuns a todas as páginas. O perfil duplicado (Bruno
Rodrigues, em dois endereços) fica uma vez só, com foto.

Uso:  python -X utf8 -I migracao/instaladores.py
"""
import html
import json
import re
import unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ANTIGOS = RAIZ / 'src' / 'data' / 'wp' / 'instaladores.json'
NOVOS = RAIZ / 'migracao' / 'instaladores-novos.json'
SAIDA = RAIZ / 'src' / 'data' / 'instaladores.json'

NAO_FOTO = re.compile(r'bandeira|\.svg$|Design-sem-nome-2025-07-17', re.I)
ICONE_FONE, ICONE_CIDADE, ICONE_INSTA, ICONE_MAPA = '', '', '', ''
MINUSCULAS = {'de', 'da', 'do', 'das', 'dos', 'e'}


def slugify(s: str) -> str:
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def nome_proprio(s: str) -> str:
    """'CALEBE SAN MARTINS' -> 'Calebe San Martins' (mantém 'de', 'da'...)."""
    s = re.sub(r'\s+', ' ', s.replace('​', '')).strip()
    if s != s.upper() and s != s.lower():
        return s
    palavras = s.lower().split(' ')
    return ' '.join(p if i and p in MINUSCULAS else p[:1].upper() + p[1:] for i, p in enumerate(palavras))


def limpar(s: str) -> str:
    s = html.unescape(s).replace('\xa0', ' ').replace('​', '')
    return re.sub(r'[ \t]+', ' ', s).strip()


def juntar_paragrafos(linhas: list[str]) -> str:
    """O texto do WordPress quebra linha no meio da frase; só abre parágrafo
    novo quando a linha anterior termina uma frase."""
    out: list[str] = []
    for l in linhas:
        if out and not re.search(r'[.!?:…"”)]$', out[-1]):
            out[-1] += ' ' + l
        else:
            out.append(l)
    return '\n'.join(out)


def separar_antigo(texto: str) -> dict:
    linhas = [limpar(l) for l in texto.split('\n')]
    linhas = [l for l in linhas if l and l not in ('>', '/', 'Mapa', ICONE_MAPA)]
    # cabeçalho: "INSTALADORES PRO EXPERT", nome, "INSTALADOR(A)"
    i = next((k for k, l in enumerate(linhas) if l.upper().startswith('INSTALADOR') and k > 0), 1) + 1
    fones: list[str] = []
    cidade = ''
    campo = None
    while i < len(linhas):
        l = linhas[i]
        if l in (ICONE_FONE, ICONE_CIDADE, ICONE_INSTA):
            campo = l
        elif campo == ICONE_FONE and l == '(':  # "(\n75) 99946-5345"
            linhas[i + 1] = '(' + linhas[i + 1]
        elif campo == ICONE_FONE and re.fullmatch(r'[+()\d\s-]+', l):
            fones.append(re.sub(r'\)(\d)', r') \1', l.replace('+ ', '+')))
        elif campo == ICONE_CIDADE and not cidade:
            cidade = l
        elif campo == ICONE_INSTA and (l.startswith(('@', '/', 'http')) or ' ' not in l):
            pass  # o Instagram já vem em campo próprio
        else:
            break
        i += 1
    bio = [l for l in linhas[i:] if not l.startswith(('http', '@'))]
    homenagem = bool(bio) and bio[0].startswith('Uma Homenagem')
    return {'cidade': local(cidade), 'telefone': ' / '.join(fones),
            'bio': juntar_paragrafos(bio[homenagem:]), 'homenagem': homenagem}


ESTADOS = {'santa catarina': 'SC', 'são paulo': 'SP', 'rio grande do sul': 'RS', 'paraná': 'PR', 'bahia': 'BA'}


def local(s: str) -> str:
    """Padroniza 'CURITIBA – PR', 'Fortaleza/CE/Brasil', 'Penha / Santa Catarina
    / Brasil' em 'Cidade / UF' (ou 'Cidade / País' fora do Brasil)."""
    partes = [p.strip() for p in re.split(r'\s*[/–]\s*|(?<=[A-Z])-(?=[A-Z]{2}$)', s) if p.strip()]
    partes = [p for p in partes if p.lower() != 'brasil']
    if len(partes) > 1:  # só o estado vira sigla; "São Paulo" sozinho é a cidade
        partes[1:] = [ESTADOS.get(p.lower(), p) for p in partes[1:]]
    return ' / '.join(p if len(p) <= 3 or p != p.upper() else nome_proprio(p) for p in partes)


def main() -> None:
    antigos = json.loads(ANTIGOS.read_text('utf8'))
    perfis: dict[str, dict] = {}
    for p in antigos:
        fotos = [f for f in p['fotos'] if not NAO_FOTO.search(f)]
        partes = separar_antigo(p['texto'])
        perfil = {
            'slug': p['slug'],
            'nome': nome_proprio(p['nome']),
            'segmento': None,
            'cidade': partes['cidade'],
            'telefone': partes['telefone'],
            'instagram': p['instagram'],
            'bio': partes['bio'],
            'foto': fotos[0] if fotos else None,
        }
        if partes['homenagem']:
            perfil['homenagem'] = True
        atual = perfis.get(p['slug'])
        # duplicado: fica o que tem foto
        if not atual or (not atual['foto'] and perfil['foto']):
            perfis[p['slug']] = perfil
    for n in json.loads(NOVOS.read_text('utf8'))['novos']:
        slug = slugify(n['nome'])
        foto = RAIZ / 'public' / 'instaladores' / f'{slug}.jpg'
        perfis[slug] = {
            'slug': slug,
            'nome': n['nome'],
            'segmento': n['segmento'],
            'cidade': n['cidade'],
            'telefone': n['telefone'],
            'instagram': f"https://www.instagram.com/{n['instagram']}" if n['instagram'] else None,
            'bio': n['bio'],
            'foto': f'./instaladores/{slug}.jpg' if foto.exists() else None,
            'novo': True,
        }
    lista = sorted(perfis.values(), key=lambda p: slugify(p['nome']))
    SAIDA.write_text(json.dumps(lista, ensure_ascii=False, indent=1) + '\n', 'utf8')
    print(f'{len(lista)} perfis ({sum(1 for p in lista if p.get("novo"))} novos), '
          f'sem foto: {[p["nome"] for p in lista if not p["foto"]]}')
    print('gravado', SAIDA.relative_to(RAIZ))


if __name__ == '__main__':
    main()

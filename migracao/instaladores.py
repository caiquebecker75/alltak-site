"""Gera src/data/instaladores.json: os perfis da página Encontre um Instalador.

Todos são Instaladores Pro Expert. Fontes:
  - migracao/instaladores-listagem.json: a listagem oficial do site antigo
    (alltak.com.br/instaladores-pro-expert/), com a ordem, as categorias do
    filtro (Automotivo, Decorativo, Instrutores), foto, telefone, cidade e
    Instagram de cada card. É ela que define quem aparece.
  - src/data/wp/instaladores.json: a página individual de cada perfil
    migrado do WordPress (história); quem não veio na migração tem o texto
    da própria página na listagem.
  - migracao/instaladores-novos.json: os 16 certificados em out/2026.
  - migracao/instaladores-ajustes.json: correções da Alltak (quem sai, nomes
    completos, categorias). O slug (e a foto) continuam os da listagem.

Do texto das páginas saem cidade, telefone e história limpos (sem entidades
HTML, ícones nem quebras de linha no meio da frase); telefone, cidade e
Instagram do card da listagem têm prioridade. As fotos ficam em
public/instaladores/<slug>.jpg (baixadas da listagem, máx. 900px). O texto do
Diego Ferraz Lopes trazia colada no fim uma citação do Calebe San Martins; sai.

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
LISTAGEM = RAIZ / 'migracao' / 'instaladores-listagem.json'
AJUSTES = RAIZ / 'migracao' / 'instaladores-ajustes.json'
FOTOS = RAIZ / 'public' / 'instaladores'
# trechos de outro perfil colados por engano no texto do WordPress
TRECHO_ALHEIO = {'diego-ferraz-lopes': '“Me apaixonei pela área'}
SAIDA = RAIZ / 'src' / 'data' / 'instaladores.json'

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
    def palavra(i: int, p: str) -> str:
        if p.startswith('(') and len(p.strip('()')) <= 3:  # siglas: "(TK)"
            return p
        p = p.lower()
        if i and p in MINUSCULAS:
            return p
        return ('(' + p[1:2].upper() + p[2:]) if p.startswith('(') else p[:1].upper() + p[1:]
    return ' '.join(palavra(i, p) for i, p in enumerate(s.split(' ')))


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
    insta = None
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
            h = re.sub(r'^(https?://(www\.)?instagram\.com/|[/@ ]+)', '', l).strip('/@ ')
            if h and not insta:
                insta = f'https://www.instagram.com/{h}'
        else:
            break
        i += 1
    bio = [l for l in linhas[i:] if not l.startswith(('http', '@'))]
    homenagem = bool(bio) and bio[0].startswith('Uma Homenagem')
    return {'cidade': local(cidade), 'telefone': ' / '.join(fones), 'instagram': insta,
            'bio': juntar_paragrafos(bio[homenagem:]), 'homenagem': homenagem}


ESTADOS = {'santa catarina': 'SC', 'são paulo': 'SP', 'rio grande do sul': 'RS', 'paraná': 'PR', 'bahia': 'BA'}


def local(s: str) -> str:
    """Padroniza 'CURITIBA – PR', 'Fortaleza/CE/Brasil', 'Penha / Santa Catarina
    / Brasil' em 'Cidade / UF' (ou 'Cidade / País' fora do Brasil)."""
    partes = [p.strip() for p in re.split(r'\s*[/–]\s*|\s+-\s+|(?<=[A-Z])-(?=[A-Z]{2}$)', s) if p.strip()]
    partes = [p for p in partes if p.lower() != 'brasil']
    if len(partes) > 1:  # só o estado vira sigla; "São Paulo" sozinho é a cidade
        partes[1:] = [ESTADOS.get(p.lower(), p) for p in partes[1:]]
    partes = [p for i, p in enumerate(partes) if i == 0 or p != partes[i - 1]]  # "SÃO PAULO/SP" -> SP / SP
    return ' / '.join(p if len(p) <= 3 or p != p.upper() else nome_proprio(p) for p in partes)


def fone(f: str) -> str:
    return re.sub(r'\)(\d)', r') \1', f.replace('+ ', '+')).strip()


def telefone(card: list[str], pagina: str) -> str:
    """O do card da listagem vale; se o card trouxe menos números que a página
    (marcação diferente) e os do card estão nela, usa os da página."""
    if not card:
        return pagina

    def dig(f: str) -> str:
        return re.sub(r'\D', '', f)[-8:]
    da_pagina = pagina.split(' / ') if pagina else []
    if len(card) < len(da_pagina) and {dig(f) for f in card} <= {dig(f) for f in da_pagina}:
        return pagina
    return ' / '.join(fone(f) for f in card)


def main() -> None:
    paginas: dict[str, dict] = {}
    for p in json.loads(ANTIGOS.read_text('utf8')):
        # Bruno Rodrigues tem duas páginas: fica a de texto mais completo
        if p['slug'] not in paginas or len(p['texto']) > len(paginas[p['slug']]['texto']):
            paginas[p['slug']] = p
    perfis: list[dict] = []
    for c in json.loads(LISTAGEM.read_text('utf8'))['instaladores']:
        wp = paginas.get(c['pagina']) or paginas.get(slugify(c['nome']))
        texto = c.get('texto') or (wp or {}).get('texto', '')
        partes = separar_antigo(texto)
        nome = nome_proprio(c['nome'])
        slug = slugify(nome)
        bio = partes['bio']
        if c['pagina'] in TRECHO_ALHEIO:
            bio = bio.split(TRECHO_ALHEIO[c['pagina']])[0].rstrip()
        perfil = {
            'slug': slug,
            'nome': nome,
            'categorias': c['categorias'],
            'cidade': local(c['cidade']) if c['cidade'] else partes['cidade'],
            'telefone': telefone(c['telefones'], partes['telefone']),
            'instagram': c['instagram'] or (wp or {}).get('instagram') or partes['instagram'],
            'bio': bio,
            'foto': f'./instaladores/{slug}.jpg' if (FOTOS / f'{slug}.jpg').exists() else None,
        }
        if partes['homenagem']:
            perfil['homenagem'] = True
        perfis.append(perfil)
    for n in json.loads(NOVOS.read_text('utf8'))['novos']:
        slug = slugify(n['nome'])
        perfis.append({
            'slug': slug,
            'nome': n['nome'],
            'categorias': [n['segmento']],
            'cidade': n['cidade'],
            'telefone': n['telefone'],
            'instagram': f"https://www.instagram.com/{n['instagram']}" if n['instagram'] else None,
            'bio': n['bio'],
            'foto': f'./instaladores/{slug}.jpg' if (FOTOS / f'{slug}.jpg').exists() else None,
        })
    ajustes = json.loads(AJUSTES.read_text('utf8'))
    perfis = [p for p in perfis if p['slug'] not in ajustes['remover']]
    for p in perfis:
        p.update(ajustes['ajustes'].get(p['slug'], {}))
    faltam = (set(ajustes['remover']) | set(ajustes['ajustes'])) - {p['slug'] for p in perfis} - set(ajustes['remover'])
    assert not faltam, f'ajuste para perfil inexistente: {faltam}'
    assert len({p['slug'] for p in perfis}) == len(perfis), 'slug repetido'
    lista = sorted(perfis, key=lambda p: slugify(p['nome']))
    SAIDA.write_text(json.dumps(lista, ensure_ascii=False, indent=1) + '\n', 'utf8')
    conta = {c: sum(c in p['categorias'] for p in lista) for c in ('automotivo', 'decor', 'instrutor')}
    print(f'{len(lista)} perfis {conta}, sem foto: {[p["nome"] for p in lista if not p["foto"]]}, '
          f'sem história: {[p["nome"] for p in lista if not p["bio"]]}')
    print('gravado', SAIDA.relative_to(RAIZ))


if __name__ == '__main__':
    main()

"""Completa descrição e especificações das linhas que ficaram vazias na migração.

17 linhas (src/data/wp/linhas.json) vieram sem `descricao` (e algumas sem
`specs`) porque o layout das páginas no WordPress era diferente. A página de
linha então caía na meta description, que o WordPress corta em ~160
caracteres, no meio da frase ("... A temperatura").

O texto completo está em migracao/conteudo/paginas/produtos__<cat>__<slug>.json
(campo `texto`). Este script:
  1. decodifica entidades HTML e emenda linhas quebradas no meio da frase;
  2. separa a introdução (descrição) da ficha técnica (specs), pelos títulos
     de seção ("Características técnicas", "Especificações técnicas" ...);
  3. só preenche o que está vazio; o que já existia não é tocado;
  4. linhas cujo texto de origem vem duplicado ou com trechos de layout usam
     a versão revisada de migracao/descricoes-curadas.json.

Uso:  python -I migracao/completar_descricoes.py [--dry]
"""
import html
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
LINHAS = RAIZ / 'src' / 'data' / 'wp' / 'linhas.json'
CONTEUDO = RAIZ / 'migracao' / 'conteudo' / 'paginas'
CURADAS = RAIZ / 'migracao' / 'descricoes-curadas.json'
# erros de digitação do texto de origem
CORRECOES = {'essas marcar irão': 'essas marcas irão', 'aumetar': 'aumentar'}

# títulos que abrem a ficha técnica
FICHA = re.compile(
    r'^(o produto|especifica[çc][õo]es t[ée]cnicas|caracter[íi]sticas t[ée]cnicas:?|indica[çc][õo]es|propriedades f[íi]sicas)$',
    re.I,
)
# títulos de seção dentro da ficha (viram um item "Título:" na lista)
SECAO = re.compile(
    r'^(importante|instru[çc][õo]es de aplica[çc][ãa]o|lavagem|limpeza|instala[çc][ãa]o|manuten[çc][ãa]o|'
    r'indica[çc][õo]es|propriedades f[íi]sicas|armazenamento|validade|fornecimento|durabilidade|modo de uso|'
    r'como usar|recomenda[çc][õo]es)$',
    re.I,
)
LIXO = re.compile(r'^(>|&nbsp;|\s*|boletim t[ée]cnico.*|clique para baixar|download.*|o produto)$', re.I)
FIM_FRASE = re.compile(r'[.!?:;)"”]$')


def linhas_limpas(texto: str) -> list[str]:
    brutas = [html.unescape(l).replace('\xa0', ' ').strip() for l in texto.split('\n')]
    return [l for l in brutas if l and not LIXO.match(l)]


def emendar(ls: list[str]) -> list[str]:
    """Junta linhas quebradas no meio da frase: a anterior não termina em
    pontuação e a seguinte começa em minúscula (ou é um pedaço curto)."""
    out: list[str] = []
    for l in ls:
        if out and not FIM_FRASE.search(out[-1]) and (l[:1].islower() or l[:1] in ',.;') and not SECAO.match(l):
            out[-1] = (out[-1] + ('' if l[:1] in ',.;' else ' ') + l).strip()
        else:
            out.append(l)
    return out


def separar(ls: list[str], titulo: str) -> tuple[str, list[str]]:
    # tira o título repetido no topo (ex.: "MÁSCARA DE" / "TRANSFERÊNCIA")
    alvo = re.sub(r'\W+', '', titulo.lower())
    while ls and re.sub(r'\W+', '', ls[0].lower()) and re.sub(r'\W+', '', ls[0].lower()) in alvo:
        ls = ls[1:]
    i = next((k for k, l in enumerate(ls) if FICHA.match(l)), len(ls))
    intro = [l for l in ls[:i] if len(l) > 2]
    ficha = ls[i:]
    specs: list[str] = []
    secao = ''
    for l in ficha:
        if FICHA.match(l) and not SECAO.match(l):
            continue
        if SECAO.match(l):
            secao = l.rstrip(':')
            continue
        if specs and l.endswith(':') is False and specs[-1].endswith(':'):
            specs[-1] = f'{specs[-1]} {l}'  # "Frontal:" + "PVC calandrado ..."
            continue
        specs.append(f'{secao}: {l}' if secao and not l.endswith(':') else l)
    # ficha em CAIXA ALTA (linhas Decor): deixa em caixa de frase,
    # preservando unidades (μm, g/m², m)
    def caixa_de_frase(t: str) -> str:
        letras = [c for c in t if c.isalpha()]
        if letras and sum(c.isupper() for c in letras) / len(letras) >= 0.5:
            t = t[0] + t[1:].lower()
            t = re.sub(r'(?<![a-z])pvc(?![a-z])', 'PVC', t, flags=re.I)
        return t
    specs = [caixa_de_frase(s) for s in specs]
    return '\n\n'.join(intro), specs


def main() -> None:
    dry = '--dry' in sys.argv
    linhas = json.loads(LINHAS.read_text('utf8'))
    curadas = {k: v for k, v in json.loads(CURADAS.read_text('utf8')).items() if not k.startswith('_')}
    for l in linhas:
        if l['slug'] in curadas:
            c = curadas[l['slug']]
            l['descricao'] = c['descricao']
            l['specs'] = c['specs']
            print(f"{l['slug']:26} curada")
            continue
        if l['descricao'] and l['specs']:
            continue
        arq = CONTEUDO / f"produtos__{l['categoria']}__{l['slug']}.json"
        if not arq.exists():
            print('sem conteúdo:', l['slug'])
            continue
        texto = json.loads(arq.read_text('utf8')).get('texto') or ''
        for errado, certo in CORRECOES.items():
            texto = texto.replace(errado, certo)
        desc, specs = separar(emendar(linhas_limpas(texto)), l['nome'])
        mudou = []
        if not l['descricao'] and desc:
            l['descricao'] = desc
            mudou.append(f'descricao {len(desc)}c')
        if not l['specs'] and specs:
            l['specs'] = specs
            mudou.append(f'specs {len(specs)}')
        print(f"{l['slug']:26} {', '.join(mudou) or '-'}")
    if not dry:
        LINHAS.write_text(json.dumps(linhas, ensure_ascii=False, indent=1) + '\n', 'utf8')


if __name__ == '__main__':
    main()

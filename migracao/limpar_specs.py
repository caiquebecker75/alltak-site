#!/usr/bin/env python3
"""Limpeza das especificações das linhas (lixo de extração do WP):
rótulos de formulário, chamadas de outras linhas, fragmentos soltos.
Também decodifica entidades HTML e remove travessões.
Importado por traduzir_linhas.py; rodar direto imprime o que sobra."""
import html
import re

# Itens descartados por igualdade (depois de unescape + strip)
JUNK_EXATO = {
    '', ':', '2', ')', '(+/-2 g)', '(+/- 2 g/m', '​', '⁠',
    'POSSUI DÚVIDAS?', 'Nome', 'E-mail', 'Fone', 'Mensagem', 'ENVIAR',
    'VÍDEOS RELACIONADOS', 'GALERIA DE FOTOS', 'DICAS', 'ENVELOPAMENTO',
    'CHECK LIST', 'Um guia prático para você', 'instalador',
    'usar no momento do recebimento do', 'veículo', 'do seu cliente.',
    'Veja abaixo algumas', 'importantes de checagem antes do',
    'ALLTAK TUNING', 'ALLTAK TUNNING', 'ALLTAK TUNING.', 'ALLTAK TUNNING.',
    'ALLTAK PRINT', 'ALLTAK COLOR', 'COLOR', 'PREMIUM', 'PISOTAK',
    'DECOR CRISTAL', 'DUPLA FACE', 'JATEADO CRISTAL',
    'MÁSCARA DE TRANSFERÊNCIA', 'MÁSCARA DE PROTEÇÃO',
    'CONHEÇA TODA LINHA DE APLICAÇÃO TÉCNICAS', 'CONHEÇA TODA LINHA DE IMPRESSÃO',
    'AW, Auto Wrap', 'Bannertak', 'Print Flex', 'Eletrostático',
    'Download de', 'Obs.: para mais informações, consulte o',
    'ESPECIFICAÇÕES TÉCNICAS', 'Especificações Técnicas:', 'NOTAS:',
    'e também como manter seu caro envelopado por mais tempo com os materiais da linha',
}
JUNK_PREFIXO = ('Confira os trabalhos realizados',)


def normalizar(s: str) -> str:
    s = html.unescape(s)
    s = s.replace('​', '').replace('\xa0', ' ')
    # sem travessão: vira dois pontos no meio, some no início
    s = re.sub(r'^\s*[–—]\s*', '', s)
    s = re.sub(r'\s+[–—]\s+', ': ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s


def limpar(specs):
    out = []
    for s in specs:
        n = normalizar(s)
        # "g/m" + "2" soltos = superescrito perdido (g/m²)
        if n == '2' and out and out[-1].endswith('g/m'):
            out[-1] += '²'
            continue
        if n in JUNK_EXATO or n.startswith(JUNK_PREFIXO):
            continue
        # frases partidas pelo WP: emenda com o item anterior
        if out and (
            n.startswith(': ')
            or (out[-1].endswith('evitando') and n.startswith('assim'))
            or (out[-1].endswith(' P') and n.startswith('VC '))
            or (out[-1] == 'Material acondicionado' and n.startswith('em caixas'))
            or (out[-1].endswith('translúcidos') and n.startswith('como o'))
        ):
            sep = '' if out[-1].endswith(' P') or n.startswith(': ') else ' '
            out[-1] = out[-1] + sep + n
            continue
        out.append(n)
    return out


if __name__ == '__main__':
    import json, collections, os
    base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
    ls = json.load(open(os.path.join(base, 'src/data/wp/linhas.json')))
    cnt = collections.Counter()
    for l in ls:
        for s in limpar(l['specs']):
            cnt[s] += 1
    print('restam', len(cnt), 'strings únicas:')
    for s, n in cnt.most_common():
        print(f'{n}x | {s}')

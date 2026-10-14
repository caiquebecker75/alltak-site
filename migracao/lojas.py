"""Gera src/data/lojas.json: os pontos de venda da página Onde Comprar.

Fonte: a página alltak.com.br/onde-comprar/ do site antigo, salva em HTML.
Cada estado é um bloco "toggle" (<h5 class="et_pb_toggle_title">) com uma
tabela Cidade / Empresa / Endereço / Bairro / Telefone. A página repete tudo
numa versão para celular (tabela de duas colunas, "Cidade e Empresa"), que é
ignorada. Os nomes das empresas ficam como estão no site antigo.

Uso:  curl -sL -o onde.html https://alltak.com.br/onde-comprar/
      python -X utf8 -I migracao/lojas.py onde.html
"""
import html
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / 'src' / 'data' / 'lojas.json'
UF = {
    'Acre': 'AC', 'Alagoas': 'AL', 'Amapá': 'AP', 'Amazonas': 'AM', 'Bahia': 'BA', 'Ceará': 'CE',
    'Distrito Federal': 'DF', 'Espírito Santo': 'ES', 'Goiás': 'GO', 'Maranhão': 'MA', 'Mato Grosso': 'MT',
    'Mato Grosso do Sul': 'MS', 'Minas Gerais': 'MG', 'Pará': 'PA', 'Paraíba': 'PB', 'Paraná': 'PR',
    'Pernambuco': 'PE', 'Piauí': 'PI', 'Rio de Janeiro': 'RJ', 'Rio Grande do Norte': 'RN',
    'Rio Grande do Sul': 'RS', 'Rondônia': 'RO', 'Roraima': 'RR', 'Santa Catarina': 'SC', 'São Paulo': 'SP',
    'Sergipe': 'SE', 'Tocantins': 'TO',
}


def limpa(s: str) -> str:
    s = re.sub(r'<br\s*/?>', ' ', s)
    s = html.unescape(re.sub(r'<[^>]+>', '', s)).replace('\xa0', ' ')
    return re.sub(r'\s+', ' ', s).strip()


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src = Path(sys.argv[1]).read_text('utf8')
    lojas = []
    blocos = re.finditer(r'<h5 class="et_pb_toggle_title">(.*?)</h5>(.*?)(?=<h5 class="et_pb_toggle_title">|$)', src, re.S)
    for m in blocos:
        estado = limpa(m.group(1))
        if estado not in UF:
            continue
        for tb in re.findall(r'<table.*?</table>', m.group(2), re.S):
            cab = [limpa(c).lower() for c in re.findall(r'<th[^>]*>(.*?)</th>', tb, re.S)]
            if cab[:2] != ['cidade', 'empresa']:
                continue  # versão de celular, repetida
            corpo = re.search(r'<tbody.*?</tbody>', tb, re.S)
            for linha in re.findall(r'<tr[^>]*>(.*?)</tr>', corpo.group(0) if corpo else '', re.S):
                c = dict(zip(cab, [limpa(x) for x in re.findall(r'<td[^>]*>(.*?)</td>', linha, re.S)]))
                if not c.get('empresa'):
                    continue
                lojas.append({
                    'uf': UF[estado],
                    'estado': estado,
                    'cidade': c.get('cidade', ''),
                    'empresa': c['empresa'],
                    'endereco': c.get('endereço', ''),
                    'bairro': c.get('bairro', ''),
                    'telefone': c.get('telefone', ''),
                })
    lojas.sort(key=lambda l: (l['estado'], l['cidade'], l['empresa'].lower()))
    SAIDA.write_text(json.dumps(lojas, ensure_ascii=False, indent=1) + '\n', 'utf8')
    por_uf = {}
    for l in lojas:
        por_uf[l['uf']] = por_uf.get(l['uf'], 0) + 1
    print(len(lojas), 'lojas em', len(por_uf), 'estados', por_uf)
    print('gravado', SAIDA.relative_to(RAIZ))


if __name__ == '__main__':
    main()

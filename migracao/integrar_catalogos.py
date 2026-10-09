"""Gera src/data/catalog/fichas.json a partir dos catálogos digitais oficiais.

Os catálogos (Wraps 2026, Decor set/2026, Signs abr/2026, IWC, Evolution Pro)
foram lidos página a página e transcritos fielmente em JSON por linha e por
cor (descrição + ficha técnica, em PT, EN e ES):

  out-wraps.json, out-decor.json, out-signs.json  (pasta passada como argumento)

Este script junta os três num arquivo só, que o site usa com prioridade sobre
o texto antigo do WordPress:

  linhas: { <slug>: { pt|en|es: {descricao, specs[]}, fonte } }
  cores:  { "<linha>:<código>": { pt|en|es: {descricao, specs[]}, fonte } }
  avisos: { decor: {pt|en|es: [...]}, signs: {...} }   (benefícios / observações gerais)

Uso:  python -X utf8 -I migracao/integrar_catalogos.py <pasta-com-out-json>
"""
import json
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / 'src' / 'data' / 'catalog' / 'fichas.json'
CATALOGO = RAIZ / 'src' / 'data' / 'catalog'
NOMES_FONTE = {
    'wraps': 'Catálogo Alltak Wraps 2026',
    'decor': 'Catálogo Alltak Decor 2026',
    'signs': 'Catálogo Alltak Signs 2026',
}
IDIOMAS = ('pt', 'en', 'es')


def bloco(d: dict) -> dict:
    """Mantém só {descricao, specs} por idioma, sem campos vazios estranhos."""
    out = {}
    for lg in IDIOMAS:
        v = d.get(lg) or {}
        out[lg] = {
            'descricao': (v.get('descricao') or '').strip(),
            'specs': [s.strip() for s in v.get('specs') or [] if s and s.strip()],
        }
    return out


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    pasta = Path(sys.argv[1])
    fichas = {'linhas': {}, 'cores': {}, 'avisos': {}}
    for linha in ('wraps', 'decor', 'signs'):
        arq = pasta / f'out-{linha}.json'
        if not arq.exists():
            print('sem', arq.name)
            continue
        dados = json.loads(arq.read_text('utf8'))
        codigos = {c['code'] for c in json.loads((CATALOGO / f'{linha}.json').read_text('utf8'))}
        for slug, v in (dados.get('linhas') or {}).items():
            fichas['linhas'][slug] = {**bloco(v), 'fonte': NOMES_FONTE[linha]}
        sem_par = []
        for cod, v in (dados.get('cores') or {}).items():
            if cod not in codigos:
                sem_par.append(cod)
                continue
            fichas['cores'][f'{linha}:{cod}'] = {**bloco(v), 'fonte': NOMES_FONTE[linha]}
        for chave in ('beneficios', 'avisos'):
            if dados.get(chave):
                fichas['avisos'][linha] = {lg: dados[chave].get(lg, []) for lg in IDIOMAS}
        print(f'{linha}: {len(dados.get("linhas") or {})} linhas, '
              f'{sum(1 for k in fichas["cores"] if k.startswith(linha + ":"))}/{len(codigos)} cores'
              + (f', códigos sem par no site: {sem_par}' if sem_par else ''))
    SAIDA.write_text(json.dumps(fichas, ensure_ascii=False, indent=1, sort_keys=True) + '\n', 'utf8')
    print('gravado', SAIDA.relative_to(RAIZ))


if __name__ == '__main__':
    main()

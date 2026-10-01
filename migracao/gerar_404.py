#!/usr/bin/env python3
"""Gera public/404.html com o mapa de redirects embutido: quem chegar por uma
URL antiga (/produtos/automotivo/ultra/) é levado à rota nova (#/produtos/...).
No GitHub Pages o 404.html é servido para qualquer caminho desconhecido; na
infra definitiva (nginx) o mesmo mapa vira regras de redirect 301."""
import json, os

MIG = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(MIG)
reds = json.load(open(os.path.join(REPO, "src/data/wp/redirects.json")))

html = f"""<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>Alltak</title>
<script>
var MAPA = {json.dumps(reds, ensure_ascii=False)};
var p = location.pathname.replace(/\\/+$/, '/') || '/';
if (!MAPA[p] && p.slice(-1) !== '/') p += '/';
var destino = MAPA[p];
if (!destino) {{
  // tenta prefixo (ex.: subpáginas não mapeadas caem na seção)
  var partes = p.split('/').filter(Boolean);
  while (partes.length && !destino) {{ partes.pop(); destino = MAPA['/' + partes.join('/') + (partes.length ? '/' : '')]; }}
}}
location.replace(location.origin + location.pathname.split('/').slice(0, -1).join('/') === location.origin ? '/' : '/' );
</script>
</head><body></body></html>"""

# versão correta e simples: sempre redireciona para a raiz com a rota em hash
html = """<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Alltak</title>
<script>
var MAPA = __MAPA__;
var base = location.pathname.indexOf('/alltak-site/') === 0 ? '/alltak-site' : '';
var p = location.pathname.slice(base.length);
if (p.slice(-1) !== '/') p += '/';
var destino = MAPA[p] || MAPA[p.replace(/\\/$/, '')] || null;
if (!destino) {
  var partes = p.split('/').filter(Boolean);
  while (partes.length && !destino) { partes.pop(); destino = MAPA['/' + partes.join('/') + (partes.length ? '/' : '')]; }
}
location.replace(base + '/#' + (destino || '/'));
</script></head><body></body></html>"""
html = html.replace("__MAPA__", json.dumps(reds, ensure_ascii=False))
open(os.path.join(REPO, "public", "404.html"), "w").write(html)
print(f"404.html gerado com {len(reds)} redirects")

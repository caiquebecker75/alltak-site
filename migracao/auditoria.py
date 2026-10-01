#!/usr/bin/env python3
"""Auditoria de garantia da migração: confere item a item que TODO o conteúdo
do site antigo tem destino no site novo.

Regras de aprovação por URL antiga (221 do sitemap):
  1. tem rota nova em redirects.json, E
  2. o conteúdo foi preservado (linhas.json / blog / instaladores / downloads /
     paginas.json / eventos.json)
Assets: todo arquivo referenciado pelos dados gerados precisa existir em
public/wp-uploads (ou public/wp-blog). Boletins/catálogos: continuam no host
atual até a virada (mesma infra), então URLs alltak.com.br/wp-content são aceitas
quando listadas no espelho do HD.

Saída: migracao/MIGRACAO.md (relatório) + exit 1 se houver pendência.
"""
import json, os, re, sys, glob
from urllib.parse import urlparse

MIG = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(MIG)
D = lambda *p: os.path.join(REPO, *p)

inv = json.load(open(D("migracao", "inventario.json")))
redirects = json.load(open(D("src/data/wp/redirects.json")))
linhas = json.load(open(D("src/data/wp/linhas.json")))
blog = json.load(open(D("src/data/wp/blog.json")))
inst = json.load(open(D("src/data/wp/instaladores.json")))
dls = json.load(open(D("src/data/wp/downloads.json")))
pags = json.load(open(D("src/data/wp/paginas.json")))
evs = json.load(open(D("src/data/wp/eventos.json")))

conteudo_por_path = set()
for l in linhas: conteudo_por_path.add(l["url_antiga"].rstrip("/") + "/")
for p in blog: conteudo_por_path.add("/" + p["slug"] + "/")
for i in inst: conteudo_por_path.add(i["url_antiga"])
for g in dls.values(): conteudo_por_path.add(g["url_antiga"])
for path in pags: conteudo_por_path.add(path)
for e in evs: conteudo_por_path.add(e["url_antiga"])
conteudo_por_path.add("/events/")  # hub de eventos: itens individuais em eventos.json

pend_rota, pend_cont, mortas_origem = [], [], []
total = 0
for tipo in ("paginas", "posts", "eventos"):
    for url, meta in inv[tipo].items():
        total += 1
        path = urlparse(url).path
        if meta.get("status") != "ok":
            if "404" in str(meta.get("status")):
                # morta na própria origem (sitemap desatualizado do site antigo):
                # nada a migrar; precisa apenas de rota nova (redirect)
                mortas_origem.append(path)
                if not (path in redirects or path.rstrip("/") + "/" in redirects):
                    pend_rota.append(path)
            else:
                pend_cont.append((path, f"crawl: {meta.get('status')}"))
            continue
        tem_rota = path in redirects or path.rstrip("/") + "/" in redirects
        tem_cont = path in conteudo_por_path or path.rstrip("/") + "/" in conteudo_por_path
        if not tem_rota: pend_rota.append(path)
        if not tem_cont: pend_cont.append((path, "sem conteúdo preservado"))

# ---- assets referenciados pelos dados gerados ----
MIRROR = "/Volumes/hd caique becker/Mac Caique/Downloads/alltak-site/migracao-wp/uploads-mirror"
ajuste = json.load(open(D("migracao", "ajuste-assets.json"))) if os.path.exists(D("migracao", "ajuste-assets.json")) else {"mortos_site_antigo": []}
mortos = set(ajuste.get("mortos_site_antigo", []))
refs, refs_abs = set(), set()
def coleta(obj):
    if isinstance(obj, str):
        for m in re.findall(r"\./wp-uploads/[^\s\"'<>\)]+", obj): refs.add(m)
        for m in re.findall(r"https://alltak\.com\.br/wp-content/uploads/[^\s\"'<>\)]+", obj): refs_abs.add(m)
    elif isinstance(obj, list):
        for x in obj: coleta(x)
    elif isinstance(obj, dict):
        for x in obj.values(): coleta(x)
for fn in glob.glob(D("src/data/wp", "*.json")): coleta(json.load(open(fn)))
for fn in glob.glob(D("public/wp-blog", "*.json")): coleta(json.load(open(fn)))

falta_asset = [r for r in sorted(refs) if not os.path.exists(D("public", r[2:]))]
# absolutas: precisam existir no espelho do HD OU estar documentadas como mortas no site antigo
for a in sorted(refs_abs):
    rel = a.split("/wp-content/uploads/")[-1]
    if not os.path.exists(os.path.join(MIRROR, rel)) and rel not in mortos:
        falta_asset.append(a)

ok_urls = total - len(set(p for p in pend_rota)) - 0
rel = []
rel.append("# Relatório de migração · site antigo → site novo\n")
rel.append(f"- URLs no site antigo (sitemaps): **{total}**")
rel.append(f"- Com rota nova mapeada (redirects): **{total - len(pend_rota)}**")
rel.append(f"- Com conteúdo preservado nos dados: **{total - len(pend_cont)}**")
rel.append(f"- Assets referenciados pelo site novo: **{len(refs)}** · faltando no repo: **{len(falta_asset)}**")
rel.append(f"- Linhas de produto: **{len(linhas)}** · posts: **{len(blog)}** · instaladores: **{len(inst)}** · grupos de download: **{len(dls)}** · páginas avulsas: **{len(pags)}** · eventos: **{len(evs)}**")
if mortas_origem:
    rel.append(f"- URLs mortas NO SITE ANTIGO (404 na origem, sitemap deles desatualizado; recebem redirect): **{len(mortas_origem)}** · " + ", ".join(f"`{p}`" for p in mortas_origem))
rel.append("")
if pend_rota:
    rel.append("## ❌ Sem rota nova (redirects)\n" + "\n".join(f"- `{p}`" for p in sorted(set(pend_rota))))
if pend_cont:
    rel.append("## ❌ Sem conteúdo preservado\n" + "\n".join(f"- `{p}` · {m}" for p, m in sorted(set(pend_cont))))
if falta_asset:
    rel.append("## ❌ Assets faltando no repo\n" + "\n".join(f"- `{a}`" for a in falta_asset[:60]))
if not pend_rota and not pend_cont and not falta_asset:
    rel.append("## ✅ MIGRAÇÃO TOTAL VERIFICADA: 221/221 URLs com rota + conteúdo, todos os assets no lugar.")
open(D("migracao", "MIGRACAO.md"), "w").write("\n".join(rel) + "\n")
print("\n".join(rel[:8]))
print(f"pendencias: rotas={len(set(pend_rota))} conteudo={len(set(pend_cont))} assets={len(falta_asset)}")
sys.exit(0 if not (pend_rota or pend_cont or falta_asset) else 1)

#!/usr/bin/env python3
"""URLs fora do sitemap que também precisam migrar (ex.: Evolution Pro, noindex).
Roda após crawl.py: baixa, extrai e injeta em urls-sitemap.json + inventario.json."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from crawl import fetch, extract, slug_of, RAW_DIR

MIG = os.path.dirname(os.path.abspath(__file__))
EXTRAS = ["https://alltak.com.br/produtos/automotivo/evolution-pro/"]

urls = json.load(open(os.path.join(MIG, "urls-sitemap.json")))
inv = json.load(open(os.path.join(MIG, "inventario.json")))
novos_assets = set()
for url in EXTRAS:
    if url in urls["page-sitemap.xml"]:
        continue
    s = slug_of(url)
    page = fetch(url)
    os.makedirs(RAW_DIR, exist_ok=True)
    open(os.path.join(RAW_DIR, f"paginas__{s}.html"), "w").write(page)
    d = extract(url, page)
    outdir = os.path.join(MIG, "conteudo", "paginas")
    json.dump(d, open(os.path.join(outdir, f"{s}.json"), "w"), ensure_ascii=False, indent=1)
    urls["page-sitemap.xml"].append(url)
    inv["paginas"][url] = {"status": "ok", "titulo": d["title"], "imgs": len(d["imagens"]), "pdfs": len(d["pdfs"])}
    novos_assets.update(d["imagens"]); novos_assets.update(d["pdfs"])
    print("extra ok:", url, f"({len(d['imagens'])} imgs, {len(d['pdfs'])} pdfs)")

# baixa os assets extras para o espelho
from crawl import MIRROR_DIR
from urllib.parse import urlparse, unquote
for a in sorted(novos_assets):
    rel = unquote(urlparse(a).path.split("/wp-content/uploads/")[-1]).split("?")[0]
    dest = os.path.join(MIRROR_DIR, rel)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if not os.path.exists(dest):
        try:
            open(dest, "wb").write(fetch(a, binary=True))
            inv["assets"][a] = {"status": "ok", "arquivo": rel, "bytes": os.path.getsize(dest)}
        except Exception as e:
            inv["assets"][a] = {"status": f"ERRO {e}"}
json.dump(urls, open(os.path.join(MIG, "urls-sitemap.json"), "w"), indent=1, ensure_ascii=False)
json.dump(inv, open(os.path.join(MIG, "inventario.json"), "w"), indent=1, ensure_ascii=False)
print("complemento concluído")

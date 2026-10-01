#!/usr/bin/env python3
"""Crawler de migração do site antigo (alltak.com.br, WordPress+Divi).

Para cada URL dos sitemaps:
  - salva o HTML bruto (backup fiel) em RAW_DIR (HD externo)
  - extrai conteúdo estruturado -> migracao/conteudo/<tipo>/<slug>.json
  - acumula todos os assets referenciados (imagens/PDFs de /wp-content/uploads)

Depois: baixa todos os assets para o espelho em MIRROR_DIR (HD externo).
Gera migracao/inventario.json com o status de cada item (base da auditoria).
"""
import urllib.request, re, json, os, sys, time, html as htmllib
from urllib.parse import urlparse, unquote

BASE = "https://alltak.com.br"
REPO = os.path.dirname(os.path.abspath(__file__))
HD = "/Volumes/hd caique becker/Mac Caique/Downloads/alltak-site/migracao-wp"
RAW_DIR = os.path.join(HD, "raw-html")
MIRROR_DIR = os.path.join(HD, "uploads-mirror")
UA = {"User-Agent": "Mozilla/5.0 (migracao-75lab)"}

def fetch(url, binary=False, tries=3):
    for t in range(tries):
        try:
            req = urllib.request.Request(url, headers=UA)
            data = urllib.request.urlopen(req, timeout=40).read()
            return data if binary else data.decode("utf-8", "ignore")
        except Exception as e:
            if t == tries - 1:
                raise
            time.sleep(2 * (t + 1))

def slug_of(url):
    p = urlparse(url).path.strip("/")
    return (p or "home").replace("/", "__")

def extract(url, html):
    def m1(pat, flags=re.S):
        m = re.search(pat, html, flags)
        return htmllib.unescape(m.group(1)).strip() if m else None
    title = m1(r"<title>(.*?)</title>")
    desc = m1(r'<meta name="description" content="([^"]*)"')
    ogimg = m1(r'<meta property="og:image" content="([^"]*)"')
    pub = m1(r'property="article:published_time" content="([^"]*)"')
    h1 = m1(r"<h1[^>]*>(.*?)</h1>")
    if h1:
        h1 = re.sub(r"<[^>]+>", "", h1).strip()
    pid = m1(r"page-id-(\d+)", 0) or m1(r"postid-(\d+)", 0)
    # área de conteúdo (Divi): do main-content até o footer
    body = html
    mm = re.search(r'id="main-content"(.*?)<footer', html, re.S)
    if mm:
        body = mm.group(1)
    content_html = body
    text = re.sub(r"<script.*?</script>|<style.*?</style>", " ", body, flags=re.S)
    text = re.sub(r"<[^>]+>", "\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = "\n".join(l.strip() for l in text.splitlines() if l.strip())
    imgs = sorted(set(re.findall(r'(?:src|href)="(https?://alltak\.com\.br/wp-content/uploads/[^"]+?\.(?:jpe?g|png|gif|webp|svg))"', html, re.I)))
    pdfs = sorted(set(re.findall(r'href="(https?://alltak\.com\.br/wp-content/uploads/[^"]+?\.pdf[^"]*)"', html, re.I)))
    links = sorted(set(re.findall(r'href="(https?://alltak\.com\.br/[^"]*)"', html)))
    return {
        "url": url, "post_id": pid, "title": title, "h1": h1,
        "meta_description": desc, "og_image": ogimg, "published": pub,
        "imagens": imgs, "pdfs": pdfs, "links_internos": [l for l in links if "/wp-content/" not in l][:200],
        "texto": text[:60000], "html_conteudo": content_html[:400000],
    }

def main():
    urls = json.load(open(os.path.join(REPO, "urls-sitemap.json")))
    tipos = {"page-sitemap.xml": "paginas", "post-sitemap.xml": "posts", "mec-events-sitemap.xml": "eventos"}
    os.makedirs(RAW_DIR, exist_ok=True)
    inventario = {"paginas": {}, "posts": {}, "eventos": {}, "assets": {}}
    assets = set()
    for sm, lista in urls.items():
        tipo = tipos[sm]
        outdir = os.path.join(REPO, "conteudo", tipo)
        os.makedirs(outdir, exist_ok=True)
        for i, url in enumerate(lista):
            s = slug_of(url)
            try:
                page = fetch(url)
                open(os.path.join(RAW_DIR, f"{tipo}__{s}.html"), "w").write(page)
                data = extract(url, page)
                json.dump(data, open(os.path.join(outdir, f"{s}.json"), "w"), ensure_ascii=False, indent=1)
                assets.update(data["imagens"]); assets.update(data["pdfs"])
                inventario[tipo][url] = {"status": "ok", "titulo": data["title"], "imgs": len(data["imagens"]), "pdfs": len(data["pdfs"])}
            except Exception as e:
                inventario[tipo][url] = {"status": f"ERRO {e}"}
            if (i + 1) % 20 == 0:
                print(f"  {tipo}: {i+1}/{len(lista)}", flush=True)
            time.sleep(0.15)
        print(f"{tipo}: {len(lista)} processadas", flush=True)
    # download dos assets
    print(f"assets referenciados: {len(assets)}", flush=True)
    okA = errA = 0
    for i, a in enumerate(sorted(assets)):
        rel = unquote(urlparse(a).path.split("/wp-content/uploads/")[-1]).split("?")[0]
        dest = os.path.join(MIRROR_DIR, rel)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        if os.path.exists(dest) and os.path.getsize(dest) > 0:
            inventario["assets"][a] = {"status": "ok", "arquivo": rel, "bytes": os.path.getsize(dest)}
            okA += 1; continue
        try:
            data = fetch(a, binary=True)
            open(dest, "wb").write(data)
            inventario["assets"][a] = {"status": "ok", "arquivo": rel, "bytes": len(data)}
            okA += 1
        except Exception as e:
            inventario["assets"][a] = {"status": f"ERRO {e}"}
            errA += 1
        if (i + 1) % 100 == 0:
            print(f"  assets: {i+1}/{len(assets)}", flush=True)
        time.sleep(0.05)
    json.dump(inventario, open(os.path.join(REPO, "inventario.json"), "w"), ensure_ascii=False, indent=1)
    ok = sum(1 for t in tipos.values() for v in inventario[t].values() if v["status"] == "ok")
    err = sum(1 for t in tipos.values() for v in inventario[t].values() if v["status"] != "ok")
    print(f"FIM: conteudo ok={ok} erro={err} | assets ok={okA} erro={errA}")

if __name__ == "__main__":
    main()

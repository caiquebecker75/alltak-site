#!/usr/bin/env python3
"""Transforma o conteúdo cru do site antigo (migracao/conteudo/) em dados
organizados para o site novo:

  src/data/wp/linhas.json        linhas de produto (nome, descrição, cores, specs, BT)
  src/data/wp/blog.json          índice do blog (slug, título, data, resumo, capa)
  public/wp/blog/<slug>.json     conteúdo completo de cada post
  src/data/wp/instaladores.json  perfis Pro-Expert
  src/data/wp/downloads.json     arquivos de downloads (logos, patterns, perfis de cor, wallpapers)
  src/data/wp/paginas.json       texto das páginas institucionais (empresa, valores, cursos, etc.)
  src/data/wp/redirects.json     mapa URL antiga -> rota nova (dia da virada)

Assets: copia do espelho do HD para public/wp-uploads/ (recomprimindo imagens
grandes) e reescreve as URLs no conteúdo para caminho relativo ./wp-uploads/...
"""
import json, os, re, glob, shutil, html as H
from urllib.parse import urlparse, unquote

MIG = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(MIG)
MIRROR = "/Volumes/hd caique becker/Mac Caique/Downloads/alltak-site/migracao-wp/uploads-mirror"
OUT_DATA = os.path.join(REPO, "src/data/wp")
OUT_PUB = os.path.join(REPO, "public")
os.makedirs(OUT_DATA, exist_ok=True)

usados = set()  # assets realmente usados -> copiados

def rel_upload(url):
    return unquote(urlparse(url).path.split("/wp-content/uploads/")[-1]).split("?")[0]

def usar(url):
    """Marca o asset para cópia e devolve o caminho público novo."""
    rel = rel_upload(url)
    usados.add(rel)
    return f"./wp-uploads/{rel}"

def rewrite(texto_ou_html):
    if not texto_ou_html:
        return texto_ou_html
    def r(m):
        return usar(m.group(0))
    return re.sub(r"https?://alltak\.com\.br/wp-content/uploads/[^\s\"'<>\)]+", r, texto_ou_html)

def carregar(tipo):
    out = {}
    for f in sorted(glob.glob(os.path.join(MIG, "conteudo", tipo, "*.json"))):
        d = json.load(open(f))
        out[d["url"]] = d
    return out

def limpa_titulo(t):
    return re.sub(r"\s*\|\s*Alltak.*$", "", t or "").strip()

# ---------------- LINHAS DE PRODUTO ----------------
CATS = ["automotivo", "arquitetura", "impressao", "sign-design", "wrap-care", "acessorios", "aplicacoes-tecnicas"]

def transformar_linhas(paginas):
    linhas = []
    for url, d in paginas.items():
        path = urlparse(url).path.strip("/").split("/")
        if len(path) != 3 or path[0] != "produtos" or path[1] not in CATS:
            continue
        cat, slug = path[1], path[2]
        texto = d["texto"] or ""
        # specs: bloco após "ESPECIFICAÇÕES TÉCNICAS"
        specs = []
        m = re.search(r"ESPECIFICA[ÇC][ÕO]ES T[ÉE]CNICAS(.*?)(?:CORES DISPON|BOLETIM|DOWNLOADS|$)", texto, re.S | re.I)
        if m:
            specs = [l for l in m.group(1).splitlines() if l.strip() and len(l) < 160][:30]
        # descrição: primeiros parágrafos após o h1
        desc = []
        passou_h1 = False
        for l in texto.splitlines():
            if d.get("h1") and d["h1"].lower() in l.lower():
                passou_h1 = True
                continue
            if passou_h1 and len(l) > 80:
                desc.append(l)
            if len(" ".join(desc)) > 700:
                break
        # cores: imagens de galeria 1000x1000 com legenda no nome do arquivo
        cores = []
        for img in d["imagens"]:
            nome = os.path.basename(urlparse(img).path)
            if re.search(r"(scaled|banner|logo|icone|botao|-e\d{10,})", nome, re.I):
                continue
            base = unquote(re.sub(r"\.(jpe?g|png|webp)$", "", nome, flags=re.I))
            base = re.sub(r"-\d+[xX]\d+$", "", base)
            cod = re.search(r"((?:\d{2,3}[A-Z]{0,4}\d{2,4}[A-Z]{0,2})|(?:ALL\d{3}))\b", base.replace("-", " ").upper())
            cores.append({"arquivo": usar(img), "rotulo": base.replace("-", " ").strip(), "codigo": cod.group(1) if cod else None})
        # boletim técnico + pdfs
        bts = [usar(p) for p in d["pdfs"] if re.search(r"(BT-|Especif|ficha-tecnica)", p, re.I)]
        outros_pdfs = [usar(p) for p in d["pdfs"] if not re.search(r"(BT-|Especif|ficha-tecnica)", p, re.I)]
        linhas.append({
            "categoria": cat, "slug": slug, "nome": limpa_titulo(d.get("h1") or d.get("title")),
            "titulo_seo": d.get("title"), "meta_description": d.get("meta_description"),
            "descricao": " ".join(desc)[:900], "specs": specs,
            "boletins": bts, "pdfs_apoio": outros_pdfs,
            "cores": cores, "og_image": usar(d["og_image"]) if d.get("og_image") else None,
            "url_antiga": urlparse(url).path,
        })
    linhas.sort(key=lambda x: (x["categoria"], x["slug"]))
    json.dump(linhas, open(os.path.join(OUT_DATA, "linhas.json"), "w"), ensure_ascii=False, indent=1)
    return linhas

# ---------------- BLOG ----------------
def transformar_blog(posts):
    os.makedirs(os.path.join(OUT_PUB, "wp-blog"), exist_ok=True)
    idx = []
    for url, d in posts.items():
        slug = urlparse(url).path.strip("/")
        titulo = limpa_titulo(d.get("h1") or d.get("title"))
        texto = rewrite(d["texto"] or "")
        # remove navegação/lixo do começo e fim
        texto = re.sub(r"^[>\s]*", "", texto)
        capa = usar(d["og_image"]) if d.get("og_image") else None
        resumo = (d.get("meta_description") or re.sub(r"\s+", " ", texto)[:180]).strip()
        imagens = [usar(i) for i in d["imagens"] if "botao" not in i and "logo" not in i][:12]
        json.dump({"slug": slug, "titulo": titulo, "data": (d.get("published") or "")[:10],
                   "capa": capa, "resumo": resumo, "texto": texto, "imagens": imagens,
                   "url_antiga": "/" + slug + "/"},
                  open(os.path.join(OUT_PUB, "wp-blog", f"{slug}.json"), "w"), ensure_ascii=False)
        idx.append({"slug": slug, "titulo": titulo, "data": (d.get("published") or "")[:10],
                    "capa": capa, "resumo": resumo})
    idx.sort(key=lambda x: x["data"], reverse=True)
    json.dump(idx, open(os.path.join(OUT_DATA, "blog.json"), "w"), ensure_ascii=False, indent=1)
    return idx

# ---------------- INSTALADORES PRO-EXPERT ----------------
def transformar_instaladores(paginas):
    out = []
    extras = {"/bruno-rodrigues/", "/fabio-braga/", "/gaston-garcete/", "/rodrigo-nogueira/"}
    for url, d in paginas.items():
        path = urlparse(url).path
        eh_perfil = path.startswith("/instaladores-pro-expert/") and path.count("/") == 3
        if not (eh_perfil or path in extras):
            continue
        slug = path.strip("/").split("/")[-1]
        fotos = [usar(i) for i in d["imagens"] if not re.search(r"logo|icone|banner", i, re.I)][:6]
        insta = re.findall(r'https?://(?:www\.)?instagram\.com/[A-Za-z0-9_.]+', d.get("html_conteudo") or "")
        out.append({"slug": slug, "nome": limpa_titulo(d.get("h1") or d.get("title")),
                    "fotos": fotos, "instagram": insta[0] if insta else None,
                    "texto": rewrite(d["texto"])[:3000], "url_antiga": path})
    out.sort(key=lambda x: x["nome"] or "")
    json.dump(out, open(os.path.join(OUT_DATA, "instaladores.json"), "w"), ensure_ascii=False, indent=1)
    return out

# ---------------- DOWNLOADS ----------------
def transformar_downloads(paginas):
    grupos = {}
    alvo = {"/downloads/": "geral", "/downloads/catalogos/": "catalogos", "/downloads/logos/": "logos",
            "/downloads/pattern/": "patterns", "/downloads/perfis-de-cor/": "perfis-de-cor",
            "/downloads/wallpaper-alltak-tuning/": "wallpapers", "/downloads/downloads-do-instalador/": "instalador"}
    for url, d in paginas.items():
        path = urlparse(url).path
        if path not in alvo:
            continue
        itens = []
        hc = d.get("html_conteudo") or ""
        for m in re.finditer(r'<a[^>]+href="(https?://alltak\.com\.br/wp-content/uploads/[^"]+)"[^>]*>(.*?)</a>', hc, re.S):
            href, rot = m.group(1), re.sub(r"<[^>]+>", " ", m.group(2))
            rot = re.sub(r"\s+", " ", H.unescape(rot)).strip()
            itens.append({"rotulo": rot[:120] or os.path.basename(urlparse(href).path), "arquivo": usar(href)})
        # também zips/arquivos fora de uploads? (drive etc.)
        externos = sorted(set(re.findall(r'href="(https?://(?:drive\.google|docs\.google|www\.dropbox)[^"]+)"', hc)))
        grupos[alvo[path]] = {"titulo": limpa_titulo(d.get("h1") or d.get("title")), "itens": itens,
                              "links_externos": externos, "url_antiga": path}
    json.dump(grupos, open(os.path.join(OUT_DATA, "downloads.json"), "w"), ensure_ascii=False, indent=1)
    return grupos

# ---------------- PÁGINAS INSTITUCIONAIS / CURSOS / CAMPANHAS / NEWS ----------------
def transformar_paginas_avulsas(paginas):
    out = {}
    DL_GRUPOS = {"/downloads/catalogos/", "/downloads/logos/", "/downloads/pattern/",
                 "/downloads/perfis-de-cor/", "/downloads/wallpaper-alltak-tuning/",
                 "/downloads/downloads-do-instalador/"}
    for url, d in paginas.items():
        path = urlparse(url).path
        partes = path.strip("/").split("/")
        # pula só o que já é tratado em outra coleção:
        if path.startswith("/produtos/") and len(partes) == 3:
            continue  # páginas de linha -> linhas.json
        if path.startswith("/instaladores-pro-expert/") and len(partes) == 2:
            continue  # perfis -> instaladores.json
        if path in DL_GRUPOS:
            continue  # grupos -> downloads.json
        if path in ("/bruno-rodrigues/", "/fabio-braga/", "/gaston-garcete/", "/rodrigo-nogueira/"):
            continue
        out[path] = {"titulo": limpa_titulo(d.get("h1") or d.get("title")), "titulo_seo": d.get("title"),
                     "meta_description": d.get("meta_description"),
                     "texto": rewrite(d["texto"])[:20000],
                     "imagens": [usar(i) for i in d["imagens"]][:20],
                     "pdfs": [usar(p) for p in d["pdfs"]]}
    json.dump(out, open(os.path.join(OUT_DATA, "paginas.json"), "w"), ensure_ascii=False, indent=1)
    return out

# ---------------- EVENTOS (MEC) ----------------
def transformar_eventos(eventos):
    out = []
    for url, d in eventos.items():
        path = urlparse(url).path
        if path == "/events/":
            continue
        out.append({"url_antiga": path, "titulo": limpa_titulo(d.get("h1") or d.get("title")),
                    "texto": rewrite(d["texto"])[:4000],
                    "imagens": [usar(i) for i in d["imagens"]][:8]})
    json.dump(out, open(os.path.join(OUT_DATA, "eventos.json"), "w"), ensure_ascii=False, indent=1)
    return out

# ---------------- REDIRECTS ----------------
def gerar_redirects(linhas, blog_idx, instaladores):
    r = {}
    for l in linhas:
        r[l["url_antiga"]] = f"/produtos/{l['categoria']}/{l['slug']}"
    for cat in CATS:
        r[f"/produtos/{cat}/"] = "/produtos"
    for p in blog_idx:
        r["/" + p["slug"] + "/"] = f"/blog/{p['slug']}"
    for i in instaladores:
        r[i["url_antiga"]] = "/instaladores"
    fixos = {"/": "/", "/empresa/": "/sobre", "/contato/": "/contato", "/onde-comprar/": "/onde-comprar",
             "/politica-de-privacidade/": "/politica-de-privacidade", "/produtos/": "/produtos",
             "/downloads/": "/catalogos", "/downloads/catalogos/": "/catalogos", "/cursos/": "/cursos",
             "/news/": "/blog", "/news/blog/": "/blog", "/torne-se-um-instalador/": "/instaladores",
             "/links-uteis/": "/", "/valores/": "/sobre",
             # downloads (grupos migrados para a página de catálogos)
             "/downloads/logos/": "/catalogos", "/downloads/pattern/": "/catalogos",
             "/downloads/perfis-de-cor/": "/catalogos", "/downloads/wallpaper-alltak-tuning/": "/catalogos",
             "/downloads/downloads-do-instalador/": "/catalogos",
             "/downloads/area-do-instalador/": "/catalogos",
             "/downloads/area-do-instalador/cadastro-concluido/": "/catalogos",
             # cursos (conteúdo consolidado na página Cursos)
             "/cursos/academia-de-envelopamento/": "/cursos", "/cursos/alltak-experience/": "/cursos",
             "/cursos/aprenda-envelopamento-com-justin-pate/": "/cursos",
             "/cursos/treinamento-alltak-decor/": "/cursos",
             # campanhas legadas (conteúdo arquivado em paginas.json)
             "/campanhas/": "/", "/campanhas/decor/": "/decoracao",
             "/campanhas/nao-pinte-envelope/": "/", "/campanhas/pesquisa/": "/",
             "/campanhas/pesquisa/agradecimento-pesquisa/": "/",
             "/campanhas/vinil-ultra-brilho-novas-cores/": "/produtos/automotivo/ultra",
             "/campanhas/voce-brilhando/": "/",
             "/campanhas/voce-brilhando/agradecimento-voce-brilhando/": "/",
             # eventos e notícias legadas (arquivados em eventos.json/paginas.json)
             "/events/": "/blog",
             "/events/alltak-experience-campinas-sp-%f0%9f%93%8d-shopvinil-campinas/": "/blog",
             "/events/alltak-experience-sao-jose-dos-campos-sp-%f0%9f%93%8d-shopvinil-sao-jose-dos-campos/": "/blog",
             "/events/alltak-experience-sao-paulo-sp-%f0%9f%93%8d-redesign/": "/blog",
             "/events/alltak-experience-sorocaba-sp-%f0%9f%93%8d-ra-revestimentos/": "/blog",
             "/news/eventos/": "/blog", "/news/eventos/fespa-2019/": "/blog",
             "/news/eventos/vip-wrap-party/": "/blog", "/news/eventos/wrap-fest/": "/blog",
             "/wrap-fest-4-nordeste-2022/": "/blog",
             # avulsas
             "/alltak-airflow/": "/produtos", "/avaliacao/": "/",
             "/produtos/decor/": "/produtos",
             # mortas no site antigo (404 na origem; sitemap desatualizado)
             "/produtos/automotivo/kamo/": "/produtos", "/produtos/impressao/bannertak/": "/produtos"}
    r.update(fixos)
    json.dump(r, open(os.path.join(OUT_DATA, "redirects.json"), "w"), ensure_ascii=False, indent=1)
    return r

# ---------------- CÓPIA DOS ASSETS ----------------
def copiar_assets():
    destino = os.path.join(OUT_PUB, "wp-uploads")
    ok = faltando = 0
    tot_bytes = 0
    falt = []
    for rel in sorted(usados):
        src = os.path.join(MIRROR, rel)
        dst = os.path.join(destino, rel)
        if not os.path.exists(src):
            faltando += 1
            falt.append(rel)
            continue
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        if not os.path.exists(dst):
            shutil.copy2(src, dst)
        ok += 1
        tot_bytes += os.path.getsize(dst)
    json.dump({"copiados": ok, "faltando": falt}, open(os.path.join(MIG, "assets-status.json"), "w"), indent=1)
    return ok, faltando, tot_bytes

if __name__ == "__main__":
    paginas = carregar("paginas")
    posts = carregar("posts")
    eventos = carregar("eventos")
    linhas = transformar_linhas(paginas)
    blog_idx = transformar_blog(posts)
    inst = transformar_instaladores(paginas)
    dls = transformar_downloads(paginas)
    avulsas = transformar_paginas_avulsas(paginas)
    evs = transformar_eventos(eventos)
    reds = gerar_redirects(linhas, blog_idx, inst)
    ok, faltando, tb = copiar_assets()
    print(f"linhas={len(linhas)} posts={len(blog_idx)} instaladores={len(inst)} grupos_download={len(dls)} "
          f"paginas_avulsas={len(avulsas)} eventos={len(evs)} redirects={len(reds)}")
    print(f"assets usados={len(usados)} copiados={ok} faltando={faltando} ({tb/1048576:.1f} MB)")

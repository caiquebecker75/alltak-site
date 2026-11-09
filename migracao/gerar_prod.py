#!/usr/bin/env python3
"""Monta o pacote de produção (www.alltak.com.br) para a Cloudflare Pages:

  deploy-prod/
    (dist do build de produção, sem 404.html: o fallback SPA serve o index)
    wp-content/uploads/   espelho do WP (805 arquivos), menos os >24MB
    _redirects            222 URLs antigas em 301 + catálogos grandes no GitHub
    robots.txt, sitemap.xml

Antes: VITE_ROUTER=browser npm run build -- --base=/
Depois: npx wrangler pages deploy deploy-prod --project-name=alltak
"""
import json
import os
import shutil

MIG = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(MIG, '..')
DIST = os.path.join(BASE, 'dist')
DEPLOY = os.path.join(BASE, 'deploy-prod')
MIRROR = '/Volumes/hd caique becker/Mac Caique/Downloads/alltak-site/migracao-wp/uploads-mirror'
SITE = 'https://www.alltak.com.br'
LIMITE = 24 * 1024 * 1024  # Cloudflare Pages recusa arquivos de 25MB+

# arquivos grandes servidos como assets de release no GitHub (tag "catalogos")
GRANDES_RELEASE = 'https://github.com/caiquebecker75/alltak-site/releases/download/catalogos'

shutil.rmtree(DEPLOY, ignore_errors=True)
shutil.copytree(DIST, DEPLOY)
os.remove(os.path.join(DEPLOY, '404.html'))

# espelho de uploads (URLs antigas /wp-content/uploads/... continuam servindo)
grandes = []
for raiz, _, arquivos in os.walk(MIRROR):
    for a in arquivos:
        src = os.path.join(raiz, a)
        rel = os.path.relpath(src, MIRROR)
        if a.startswith('.'):
            continue
        if os.path.getsize(src) > LIMITE:
            grandes.append(rel)
            continue
        dest = os.path.join(DEPLOY, 'wp-content', 'uploads', rel)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copy2(src, dest)

# _redirects: URLs antigas -> rotas novas (301); grandes -> release do GitHub
linhas_redir = []
reds = json.load(open(os.path.join(BASE, 'src/data/wp/redirects.json')))
for antiga, nova in sorted(reds.items()):
    if antiga.rstrip('/') == nova:  # mesma rota, só sem a barra: o SPA resolve
        continue
    linhas_redir.append(f'{antiga} {nova} 301')
    linhas_redir.append(f'{antiga.rstrip("/")} {nova} 301')
for rel in grandes:
    nome = os.path.basename(rel)
    linhas_redir.append(f'/wp-content/uploads/{rel} {GRANDES_RELEASE}/{nome} 301')
open(os.path.join(DEPLOY, '_redirects'), 'w').write('\n'.join(linhas_redir) + '\n')

# robots + sitemap
open(os.path.join(DEPLOY, 'robots.txt'), 'w').write(
    f'User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n')

rotas = ['/', '/produtos', '/cores', '/catalogos', '/blog', '/decoracao', '/visualizador',
         '/onde-comprar', '/instaladores', '/cursos', '/contato', '/sobre',
         '/politica-de-privacidade', '/transparencia-salarial']
for l in json.load(open(os.path.join(BASE, 'src/data/wp/linhas.json'))):
    rotas.append(f"/produtos/{l['categoria']}/{l['slug']}")
for p in json.load(open(os.path.join(BASE, 'src/data/wp/blog.json'))):
    rotas.append(f"/blog/{p['slug']}")
for arq, linha in [('wraps.json', 'wraps'), ('decor.json', 'decor'), ('signs.json', 'signs')]:
    for c in json.load(open(os.path.join(BASE, 'src/data/catalog', arq))):
        if c.get('code'):
            rotas.append(f"/cor/{linha}/{c['code']}")
urls = '\n'.join(f'  <url><loc>{SITE}{r}</loc></url>' for r in dict.fromkeys(rotas))
open(os.path.join(DEPLOY, 'sitemap.xml'), 'w').write(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '\n</urlset>\n')

n_arq = sum(len(f) for _, _, f in os.walk(DEPLOY))
tam = sum(os.path.getsize(os.path.join(r, a)) for r, _, fs in os.walk(DEPLOY) for a in fs)
print(f'deploy-prod pronto: {n_arq} arquivos, {tam/1e6:.0f} MB')
print(f'redirects: {len(linhas_redir)} linhas · grandes no GitHub: {grandes}')
print(f'sitemap: {len(dict.fromkeys(rotas))} URLs')

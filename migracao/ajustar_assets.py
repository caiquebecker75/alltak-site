#!/usr/bin/env python3
"""Pós-processamento dos assets migrados:

1. PDFs pesados (>8 MB, os catálogos) saem do repo: as referências viram URL
   absoluta no host (mesma infra que continuará servindo /wp-content/uploads;
   cópia de segurança permanece no espelho do HD).
2. Miniaturas mortas (-WxH que dão 404 no site antigo) viram o arquivo original
   quando ele existe; senão a referência vira URL absoluta e entra no log de
   "mortos no site antigo".
3. Recompressão: imagens com lado > 1400 px são reduzidas (qualidade 82).

Reescreve src/data/wp/*.json e public/wp-blog/*.json. Gera ajuste-assets.json.
"""
import json, os, re, glob, shutil
from PIL import Image

MIG = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(MIG)
MIRROR = "/Volumes/hd caique becker/Mac Caique/Downloads/alltak-site/migracao-wp/uploads-mirror"
PUB = os.path.join(REPO, "public")
ABS = "https://alltak.com.br/wp-content/uploads/"
LIMITE_PDF = 8 * 1024 * 1024

log = {"pdfs_no_host": [], "variantes_trocadas": [], "mortos_site_antigo": [], "recomprimidas": 0,
       "bytes_antes": 0, "bytes_depois": 0}

def existe_pub(rel): return os.path.exists(os.path.join(PUB, "wp-uploads", rel))
def existe_mirror(rel): return os.path.exists(os.path.join(MIRROR, rel))

def original_de(rel):
    novo = re.sub(r"-\d+[xX]\d+(-\d+)?(\.[a-zA-Z]+)$", r"\2", rel)
    return novo if novo != rel else None

def resolver(ref):
    """ref = './wp-uploads/REL' -> ref corrigida"""
    rel = ref[len("./wp-uploads/"):]
    cam_pub = os.path.join(PUB, "wp-uploads", rel)
    # 1) pdf pesado -> host
    if rel.lower().endswith(".pdf"):
        src = cam_pub if os.path.exists(cam_pub) else os.path.join(MIRROR, rel)
        if os.path.exists(src) and os.path.getsize(src) > LIMITE_PDF:
            if os.path.exists(cam_pub):
                os.remove(cam_pub)
            if rel not in log["pdfs_no_host"]:
                log["pdfs_no_host"].append(rel)
            return ABS + rel
        return ref
    if existe_pub(rel):
        return ref
    # 2) faltando: tenta original
    orig = original_de(rel)
    if orig and (existe_pub(orig) or existe_mirror(orig)):
        if not existe_pub(orig):
            dst = os.path.join(PUB, "wp-uploads", orig)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(os.path.join(MIRROR, orig), dst)
        log["variantes_trocadas"].append(rel)
        return "./wp-uploads/" + orig
    # 3) morto
    if rel not in log["mortos_site_antigo"]:
        log["mortos_site_antigo"].append(rel)
    return ABS + rel

PADRAO = re.compile(r"\./wp-uploads/[^\s\"'<>\)]+")

def corrige(obj):
    if isinstance(obj, str):
        return PADRAO.sub(lambda m: resolver(m.group(0)), obj)
    if isinstance(obj, list):
        return [corrige(x) for x in obj]
    if isinstance(obj, dict):
        return {k: corrige(v) for k, v in obj.items()}
    return obj

for fn in glob.glob(os.path.join(REPO, "src/data/wp", "*.json")) + glob.glob(os.path.join(PUB, "wp-blog", "*.json")):
    d = json.load(open(fn))
    json.dump(corrige(d), open(fn, "w"), ensure_ascii=False, indent=1 if "src/data" in fn else None)

# 3) recompressão
for fn in glob.glob(os.path.join(PUB, "wp-uploads", "**", "*.*"), recursive=True):
    if not re.search(r"\.(jpe?g|png)$", fn, re.I):
        continue
    try:
        antes = os.path.getsize(fn)
        im = Image.open(fn)
        w, h = im.size
        if max(w, h) > 1400 or antes > 400_000:
            im = im.convert("RGB") if fn.lower().endswith(("jpg", "jpeg")) else im
            if max(w, h) > 1400:
                im.thumbnail((1400, 1400))
            if fn.lower().endswith(("jpg", "jpeg")):
                im.save(fn, quality=82, optimize=True)
            else:
                im.save(fn, optimize=True)
            depois = os.path.getsize(fn)
            if depois < antes:
                log["recomprimidas"] += 1
                log["bytes_antes"] += antes
                log["bytes_depois"] += depois
    except Exception:
        pass

json.dump(log, open(os.path.join(MIG, "ajuste-assets.json"), "w"), ensure_ascii=False, indent=1)
import subprocess
tam = subprocess.check_output(["du", "-sh", os.path.join(PUB, "wp-uploads")]).decode().split()[0]
print(f"pdfs no host={len(log['pdfs_no_host'])} variantes trocadas={len(log['variantes_trocadas'])} "
      f"mortos={len(log['mortos_site_antigo'])} recomprimidas={log['recomprimidas']} "
      f"({log['bytes_antes']//1048576}->{log['bytes_depois']//1048576} MB) | wp-uploads agora: {tam}")

// Downloads, organizados como no site antigo (alltak.com.br/downloads/): seis
// grupos, cada um com a sua lista. Os arquivos vêm da migração do WordPress
// (src/data/wp/downloads.json), sem os botões repetidos ("Clique aqui para
// baixar") e com nomes legíveis no lugar do nome do arquivo. Os três PDFs
// "Design sem nome" do grupo de logos foram abertos para dar o nome certo.

import type { Lang } from '../i18n'

type Texto = string | Record<Lang, string>
export type Arquivo = { nome: Texto; arquivo: string; desc?: Texto }
// pasta: grupo cujos arquivos ficam numa pasta externa (Google Drive); os
// itens são só as prévias das artes, e o download é um botão para a pasta
export type GrupoDownload = { slug: string; titulo: Texto; desc: Texto; itens: Arquivo[]; intro?: Texto; pasta?: string }

const WP = 'https://alltak.com.br/wp-content/uploads'

export const DOWNLOADS: GrupoDownload[] = [
  {
    slug: 'catalogos',
    titulo: { pt: 'Catálogos', en: 'Catalogs', es: 'Catálogos' },
    desc: { pt: 'Tenha acesso aos catálogos Alltak.', en: 'Get access to the Alltak catalogs.', es: 'Accede a los catálogos Alltak.' },
    itens: [
      { nome: 'Alltak Wraps 2026', arquivo: './catalogos/catalogo-wraps-2026.pdf',
        desc: { pt: 'Automotivo: envelopamento e proteção veicular.', en: 'Automotive: vehicle wrapping and protection.', es: 'Automotriz: ploteo y protección vehicular.' } },
      { nome: 'Alltak Decor 2026', arquivo: './catalogos/catalogo-decor-2026.pdf',
        desc: { pt: 'Arquitetura: revestimentos para interiores e ambientes.', en: 'Architecture: coverings for interiors.', es: 'Arquitectura: revestimientos para interiores.' } },
      { nome: 'Alltak Signs 2026', arquivo: './catalogos/catalogo-signs-2026.pdf',
        desc: { pt: 'Comunicação visual: sinalização, recorte e impressão.', en: 'Visual communication: signage, cutting and printing.', es: 'Comunicación visual: señalización, corte e impresión.' } },
      { nome: 'Alltak Evolution Pro', arquivo: `${WP}/2026/09/Catalogo-Digital-Alltak-Evolution-Pro-v2.pdf` },
      { nome: 'Alltak IWC', arquivo: `${WP}/2024/11/IWC-Alltak-Catalogo-Virtual.pdf` },
      { nome: 'Alltak Tools 2025', arquivo: './wp-uploads/2025/04/Catalogo-Alltak-Tools_2025.pdf' },
      { nome: 'BannerTak', arquivo: './wp-uploads/2021/03/Catalogo-Virtual_BannerTak_mar2021.pdf' },
    ],
  },
  {
    slug: 'logotipos',
    titulo: { pt: 'Logotipos Alltak', en: 'Alltak logos', es: 'Logotipos Alltak' },
    desc: { pt: 'Acesse aqui e veja todos os logotipos.', en: 'Find all the logos here.', es: 'Accede aquí a todos los logotipos.' },
    itens: [
      { nome: { pt: 'Guia da marca Alltak 2025', en: 'Alltak brand guide 2025', es: 'Guía de marca Alltak 2025' }, arquivo: './wp-uploads/2026/02/Guide_Alltak-Logo_2025.pdf' },
      { nome: { pt: 'Logo Alltak com escudo', en: 'Alltak logo with shield', es: 'Logo Alltak con escudo' }, arquivo: './wp-uploads/2025/08/Design-sem-nome-7.pdf' },
      { nome: 'Logo Alltak', arquivo: './wp-uploads/2026/02/Design-sem-nome-24-2.pdf' },
      { nome: { pt: 'Símbolo Alltak (escudo com caveira)', en: 'Alltak symbol (skull shield)', es: 'Símbolo Alltak (escudo con calavera)' }, arquivo: './wp-uploads/2025/08/Design-sem-nome-11.pdf' },
      { nome: 'Logo Alltak Decor', arquivo: './wp-uploads/2025/07/Alltak-DECOR.pdf' },
      { nome: 'Logo Alltak Wraps', arquivo: './wp-uploads/2025/07/Alltak-WRAPS.pdf' },
      { nome: 'Logo Alltak Signs', arquivo: './wp-uploads/2025/07/Alltak-SIGNS.pdf' },
    ],
  },
  {
    slug: 'perfis-de-cor',
    titulo: { pt: 'Perfis de cor', en: 'Color profiles', es: 'Perfiles de color' },
    desc: {
      pt: 'Acesse aqui e veja o perfil de cor ideal para o seu equipamento.',
      en: 'Find the ideal color profile for your equipment.',
      es: 'Encuentra el perfil de color ideal para tu equipo.',
    },
    itens: [
      ['GLOSS 720×720', '2021/01/alltakGLOSS720_720_JV150.icc'],
      ['GLOSS 1440×1440', '2021/01/alltakGLOSS1440_1440_JV150.icc'],
      ['MATT 540×720', '2021/01/alltakMATT540_720_JV150.icc'],
      ['MATT 540×720 (2)', '2021/02/alltakMATT540_720_JV150_02.icc'],
      ['MATT 720×1440', '2021/01/alltakMATT720_1440_JV150.icc'],
      ['MATT 720×1440 (2)', '2021/01/alltakMATT720_1440_JV150_02.icc'],
      ['Alltak Gloss 114 fast', '2021/01/Alltak114_FAST_cjv30.icc'],
      ['Alltak Gloss 122 foto', '2021/01/Alltak122_FOTO_cjv30.icc'],
      ['Alltak Gloss 134 art', '2021/01/Alltak134_ART_jvc30.icc'],
      ['Alltak Matte 214 fast', '2021/01/Alltak214_FAST_jvc30.icc'],
      ['Alltak Matte 222 foto', '2021/01/Alltak222_foto_cjv30.icc'],
      ['Alltak Matte 233 art', '2021/01/Alltak233_ART_jvc30.icc'],
      ['Alltak Jateado 317 fast', '2021/01/Alltak317_FAST_jvc30.icc'],
      ['Alltak Jateado 322 foto', '2021/01/Alltak322_FOTO_cjv30.icc'],
      ['Alltak 527 fast', '2021/01/Alltak527_FAST_cjv30.icc'],
      ['Alltak 533 foto', '2021/01/Alltak532_FOTO_cjv30.icc'],
      ['Alkosign Gloss 914 fast', '2021/01/Alltak914_FAST_jvc30.icc'],
      ['Alkosign Gloss 933 foto', '2021/01/Alltak933_FOTO_jvc30.icc'],
      ['Alkosign Mate 817 fast', '2021/01/Alltak817-FAST_JVC30.icc'],
      ['Alkosign Mate 832 foto', '2021/01/Alltak832_FOTO_cjv30.icc'],
      ['Alkosign Textura 727 fast', '2021/01/Alltak727_FAST_cjv30.icc'],
      ['Alkosign Textura 732 foto', '2021/01/Alltak732_FOTO_cjv30.icc'],
      ['Alkosign Arezzo D.I Branco', '2021/01/Alltak-Alkosign-Arezzo-D.I-Branco.oms'],
      ['Alkosign Linho', '2021/01/Alltak-Alkosign-Linho.oms'],
      ['Alkosign Sarja', '2021/01/Alltak-Alkosign-Sarja.oms'],
      ['AW Auto Wrap', '2021/01/Alltak-AW-Auto-Warp.oms'],
      ['Corolan', '2021/01/Alltak-Corolan.oms'],
      ['D.Print Blackout Branco GL', '2021/01/Alltak-D.Print-Blackout-Branco-GL.oms'],
      ['D.Print Blackout GL', '2021/01/Alltak-D.Print-Blackout-GL.oms'],
      ['D.Print Matt Branco', '2021/01/Alltak-D.Print-Matt-Branco.oms'],
      ['Eletrostático Branco', '2021/01/Alltak-Eletrostatico-Branco.oms'],
      ['Eletrostático Transparente', '2021/01/Alltak-Eletrostatico-Transparente.oms'],
      ['Transparente Brilho', '2021/01/Alltak-Transparente-Brilho.oms'],
      ['Transparente Matt', '2021/01/Alltak-Transparente-Matt.oms'],
      ['Tuning Jateado Branco Krusher', '2021/01/Alltak-Tuning-Jateado-Branco-Krusher.oms'],
      ['Alko Sign 720×720', '2021/01/AlkoSign_720x720_3P.icm'],
      ['Alltak Gloss 720×720', '2021/01/ALLTAK_gloss_720X720.icm'],
      ['Alltak Jateado 720×720', '2021/01/Alltak_JATEADO_720X720.icm'],
      ['Corolan 720×720', '2021/01/corolan_720X720.icm'],
      ['Teste de perfil', '2021/02/Teste-de-Perfil.icc'],
      ['Perfis Alko (Roland)', '2021/02/Perfil-Alltak-Maquina-Rolland.zip'],
    ].map(([nome, arq]) => ({ nome, arquivo: `${WP}/${arq}` })),
  },
  {
    slug: 'pattern',
    titulo: 'Pattern',
    desc: { pt: 'Brinde para os clientes Alltak: escolha o seu e baixe.', en: 'A gift for Alltak customers: pick yours and download.', es: 'Regalo para los clientes Alltak: elige el tuyo y descárgalo.' },
    itens: [
      { nome: { pt: 'Ferrugem', en: 'Rust', es: 'Óxido' }, arquivo: `${WP}/2021/01/ferrugem.zip` },
      { nome: { pt: 'Caveira', en: 'Skull', es: 'Calavera' }, arquivo: './wp-uploads/2021/01/caveira.pdf' },
      { nome: 'Wraptopus 35 cm', arquivo: `${WP}/2021/01/WRAPTOPUS_35-cm-Cromia.tif` },
      { nome: 'Rose Skull', arquivo: `${WP}/2021/01/rose_skull_pattern.tif` },
    ],
  },
  {
    slug: 'wallpaper',
    titulo: 'Wallpaper Alltak Tuning',
    desc: { pt: 'Acesse e veja todas as imagens.', en: 'See all the images.', es: 'Mira todas las imágenes.' },
    itens: [
      { nome: 'Wallpaper Alltak', arquivo: `${WP}/2021/01/wallpaper.zip` },
      { nome: { pt: 'Wallpaper Caveira', en: 'Skull wallpaper', es: 'Wallpaper Calavera' }, arquivo: `${WP}/2021/01/wallpaper-caveira.zip` },
      { nome: 'Skull Poker', arquivo: `${WP}/2021/01/Skullpoker.zip` },
    ],
  },
  {
    slug: 'instalador',
    titulo: { pt: 'Downloads do instalador', en: 'Installer downloads', es: 'Descargas del instalador' },
    desc: {
      pt: 'Conteúdo Alltak para instaladores.',
      en: 'Alltak content for installers.',
      es: 'Contenido Alltak para instaladores.',
    },
    itens: [
      { nome: { pt: 'Check-list para envelopamento', en: 'Wrapping checklist', es: 'Checklist de ploteo' }, arquivo: './wp-uploads/2021/01/check-list-para-envelopamento-ALLTAK.pdf' },
      { nome: { pt: 'Manual de limpeza e conservação', en: 'Cleaning and care manual', es: 'Manual de limpieza y conservación' }, arquivo: './wp-uploads/2021/01/manual-de-limpeza-e-conservacao-para-envelopamento-ALLTAK.pdf' },
    ],
  },
  {
    slug: 'area-do-instalador',
    titulo: { pt: 'Área do instalador', en: 'Installer area', es: 'Área del instalador' },
    desc: {
      pt: 'Artes para download para a sua área de envelopamento.',
      en: 'Artwork to download for your wrapping space.',
      es: 'Artes para descargar para tu área de ploteo.',
    },
    intro: {
      pt: 'Artes personalizadas Alltak para decorar e customizar o seu local de trabalho: baixe os arquivos e imprima de acordo com o seu espaço. Assim o seu cliente saberá que você tem Alltak na veia.',
      en: 'Custom Alltak artwork to decorate and personalize your workplace: download the files and print them to fit your space. That way your customers will know you have Alltak in your veins.',
      es: 'Artes personalizadas Alltak para decorar y personalizar tu lugar de trabajo: descarga los archivos e imprímelos según tu espacio. Así tu cliente sabrá que llevas Alltak en la sangre.',
    },
    pasta: 'https://drive.google.com/drive/folders/1oz5R78bf64OcSl4X6AJbmaXwXAbQNJH6',
    itens: [
      { nome: { pt: 'Painel institucional PDV', en: 'Point-of-sale institutional panel', es: 'Panel institucional PDV' }, desc: '300 × 130 cm',
        arquivo: './wp-uploads/2021/01/Alltak_PDV_painel_Institucional_300x130cm-scaled-1.jpg' },
      { nome: { pt: 'Painel linha automotiva', en: 'Automotive line panel', es: 'Panel línea automotriz' }, desc: '205 × 120 cm',
        arquivo: './wp-uploads/2021/01/Alltak_Painel-Linha-Automotiva_205x120cm-scaled-1.jpg' },
      { nome: { pt: 'Painel de cores automotiva', en: 'Automotive color panel', es: 'Panel de colores automotriz' }, desc: '120 × 100 cm',
        arquivo: './wp-uploads/2021/01/Alltak_Painel-de-cores_automotiva_120x100cm-scaled-1.jpg' },
    ],
  },
]

export const texto = (v: Texto, lang: Lang): string => (typeof v === 'string' ? v : v[lang])

// tipo do arquivo pela extensão: PDF, ZIP, TIF, ICC...
export const tipoArquivo = (arq: string): string => arq.split('?')[0].split('.').pop()?.toUpperCase() ?? ''

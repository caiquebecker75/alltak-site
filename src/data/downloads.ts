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
      { nome: 'Alltak Evolution Pro', arquivo: './catalogos/catalogo-evolution-pro-2026.pdf',
        desc: { pt: 'Linha premium de envelopamento: 21 cores com sistema AIRFLOW.', en: 'Premium wrapping line: 21 colors with the AIRFLOW system.', es: 'Línea premium de ploteo: 21 colores con sistema AIRFLOW.' } },
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
]

export const texto = (v: Texto, lang: Lang): string => (typeof v === 'string' ? v : v[lang])

// tipo do arquivo pela extensão: PDF, ZIP, TIF, ICC...
export const tipoArquivo = (arq: string): string => arq.split('?')[0].split('.').pop()?.toUpperCase() ?? ''

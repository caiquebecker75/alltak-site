import { Link } from 'react-router-dom'
import { type Color } from '../data/catalog'
import { useLeadGate } from '../lead/LeadGate'
import { STORE_URL } from '../data/site'

// Reusable color pop-up: applied product photo + color + texture, with
// gated downloads (boletim técnico / vídeo). Used by Cores and Produtos.
export default function ColorDetail({ color, onClose }: { color: Color; onClose: () => void }) {
  const { open } = useLeadGate()
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-3 md:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative grid max-h-[92vh] w-full max-w-4xl overflow-auto bg-alltak-coal md:grid-cols-2">
        {/* Cenário 1 — aplicado */}
        <div className="relative bg-black">
          {color.applied ? (
            <img src={color.applied} alt={`${color.name} aplicado`} className="h-56 w-full object-cover md:h-full" />
          ) : (
            <div className="h-56 w-full md:h-full" style={{ background: color.hex }} />
          )}
          <span className="absolute left-3 top-3 tag">{color.lineName}</span>
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-black/60 text-white hover:bg-alltak-blue"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Info + cenários 2 (cor) e 3 (textura) */}
        <div className="p-6">
          <div className="font-display text-xs font-bold uppercase tracking-[0.25em] text-alltak-blue">
            {color.family}
            {color.finish ? ` · ${color.finish}` : ''}
          </div>
          <h3 className="mt-1 font-display text-3xl font-extrabold uppercase text-white">{color.name}</h3>
          <div className="mt-1 font-display text-sm font-bold uppercase tracking-[0.2em] text-white/50">
            Código {color.code}
            {color.pantone ? ` · Pantone ${color.pantone}` : ''}
          </div>

          {/* cor + textura */}
          <div className="mt-5 flex gap-3">
            <div className="flex-1">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">Cor</div>
              <div className="h-20 w-full border border-white/15" style={{ background: color.hex }} />
              <div className="mt-1 text-center text-[10px] uppercase text-white/40">{color.hex}</div>
            </div>
            <div className="flex-1">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">Textura</div>
              <img src={color.swatch} alt={`${color.name} textura`} className="h-20 w-full object-cover border border-white/15" />
            </div>
          </div>

          <p className="mt-4 text-xs text-white/40">
            Imagem meramente ilustrativa. A cor pode variar conforme a tela. Solicite amostra física.
          </p>

          <div className="mt-5 flex flex-col gap-2.5">
            <button
              onClick={() => open({ title: `Boletim Técnico ${color.name} (${color.code})`, url: '#', kind: 'PDF' })}
              className="btn-trapezoid btn-blue justify-center"
            >
              Baixar boletim técnico ↓
            </button>
            <button
              onClick={() => open({ title: `Vídeo de aplicação ${color.name} (${color.code})`, url: '#', kind: 'Vídeo' })}
              className="btn-trapezoid btn-navy justify-center"
            >
              Assistir vídeo de aplicação ▶
            </button>
            {color.line === 'wraps' && (
              <Link to="/visualizador" className="btn-trapezoid btn-outline justify-center">
                Ver no visualizador 3D
              </Link>
            )}
            <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-outline justify-center">
              Comprar na Alltak Store ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

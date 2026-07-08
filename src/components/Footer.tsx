import { Link } from 'react-router-dom'
import { NAV, STORE_URL, YOUTUBE_URL, INSTAGRAM_URL } from '../data/site'
import Logo from './Logo'
import caveira from '../brand/caveira-simbolo.png'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-alltak-black">
      {/* official skull watermark */}
      <img
        src={caveira}
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute -right-10 -top-6 h-64 w-auto opacity-[0.05]"
        style={{ filter: 'brightness(0) invert(1)' }}
      />
      <div className="container-x relative grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo className="h-9" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Materiais para envelopamento, decoração e comunicação visual. Padrão e
            constância do começo ao fim, para quem vive de aplicação.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="text-sm text-white/70 hover:text-alltak-blue">
              Instagram
            </a>
            <span className="text-white/20">·</span>
            <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="text-sm text-white/70 hover:text-alltak-blue">
              YouTube
            </a>
            <span className="text-white/20">·</span>
            <a href={STORE_URL} target="_blank" rel="noreferrer" className="text-sm text-white/70 hover:text-alltak-blue">
              Alltak Store ↗
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold tracking-widest text-white/50">NAVEGAÇÃO</h4>
          <ul className="mt-4 space-y-2">
            {NAV.map((i) => (
              <li key={i.label}>
                {i.external ? (
                  <a href={i.to} target="_blank" rel="noreferrer" className="text-sm text-white/70 hover:text-white">
                    {i.label} ↗
                  </a>
                ) : (
                  <Link to={i.to} className="text-sm text-white/70 hover:text-white">
                    {i.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold tracking-widest text-white/50">MAIS</h4>
          <ul className="mt-4 space-y-2">
            <li><Link to="/instaladores" className="text-sm text-white/70 hover:text-white">Instaladores</Link></li>
            <li><Link to="/cursos" className="text-sm text-white/70 hover:text-white">Cursos</Link></li>
            <li><Link to="/contato" className="text-sm text-white/70 hover:text-white">Contato</Link></li>
            <li><Link to="/politica-de-privacidade" className="text-sm text-white/70 hover:text-white">Política de Privacidade</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/40 md:flex-row">
          <span>© {new Date().getFullYear()} Alltak. Todos os direitos reservados.</span>
          <span>Site institucional · reconstrução 75 LAB</span>
        </div>
      </div>
    </footer>
  )
}

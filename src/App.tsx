import { useEffect } from 'react'
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom'
import { previaAtiva } from './lib/previa'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import Preloader from './components/Preloader'
import WhatsApp from './components/WhatsApp'
import { LeadGateProvider } from './lead/LeadGate'
import { useT } from './i18n'
import Home from './pages/Home'
import { DownloadsInicio, DownloadsGrupo } from './pages/Downloads'
import Produtos from './pages/Produtos'
import Linha from './pages/Linha'
import RevestFacil from './pages/RevestFacil'
import Segmento from './pages/Segmento'
import Simulador from './pages/Simulador'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Cores from './pages/Cores'
import CorDetalhe from './pages/CorDetalhe'
import DecorStudio from './pages/DecorStudio'
import Visualizador from './pages/Visualizador'
import OndeComprar from './pages/OndeComprar'
import Instaladores from './pages/Instaladores'
import Cursos, { CursoDetalhe } from './pages/Cursos'
import Contato from './pages/Contato'
import Sobre from './pages/Sobre'
import Privacidade from './pages/Privacidade'
import Transparencia from './pages/Transparencia'

// Posição da âncora centralizada no espaço abaixo do cabeçalho fixo. Mede pelo
// offsetTop (sem as transformações da animação de entrada, que deslocam o
// bloco enquanto ele aparece). Se o bloco não cabe, alinha o topo logo abaixo
// do cabeçalho, para o título nunca ficar escondido.
function alvoDaAncora(el: HTMLElement): number {
  let top = 0
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) top += n.offsetTop
  const cabecalho = document.querySelector('header')?.getBoundingClientRect().height ?? 96
  const livre = innerHeight - cabecalho
  const folga = el.offsetHeight + 32 <= livre ? (livre - el.offsetHeight) / 2 : 16
  return Math.max(0, top - cabecalho - folga)
}

// Scroll to top on route change, or to the #anchor when a hash is present.
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector<HTMLElement>(hash)
      if (el) {
        const ir = () => {
          window.scrollTo({ top: alvoDaAncora(el), behavior: 'instant' })
          // avisa as animações de entrada (Reveal) que a página rolou
          window.dispatchEvent(new Event('scroll'))
        }
        ir()
        // imagens que terminam de carregar mudam a altura da página acima da
        // âncora: corrige a posição mais duas vezes
        // (canceladas se a pessoa já começou a rolar)
        const t1 = setTimeout(ir, 350)
        const t2 = setTimeout(ir, 1000)
        const parar = () => {
          clearTimeout(t1)
          clearTimeout(t2)
        }
        addEventListener('wheel', parar, { once: true, passive: true })
        addEventListener('touchstart', parar, { once: true, passive: true })
        return () => {
          parar()
          removeEventListener('wheel', parar)
          removeEventListener('touchstart', parar)
        }
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

// endereços antigos do blog levam à mesma notícia em /noticias
function BlogParaNoticia() {
  const { pathname } = useLocation()
  return <Navigate to={pathname.replace(/^\/blog/, '/noticias')} replace />
}

// página que só abre no modo prévia (lib/previa.ts); confere a chave a cada visita
function Privado({ children }: { children: React.ReactNode }) {
  useLocation()
  return previaAtiva() ? <>{children}</> : <NotFound />
}

function NotFound() {
  const t = useT()
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-alltak-black text-center">
      <p className="eyebrow text-alltak-blue">{t('notfound.eyebrow')}</p>
      <h1 className="mt-3 text-6xl text-white md:text-8xl">{t('notfound.titulo')}</h1>
      <Link to="/" className="btn-trapezoid btn-blue mt-8">{t('notfound.voltar')}</Link>
    </section>
  )
}

export default function App() {
  return (
    <LeadGateProvider>
      <Preloader />
      <ScrollProgress />
      <ScrollManager />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/downloads" element={<DownloadsInicio />} />
          <Route path="/downloads/:grupo" element={<DownloadsGrupo />} />
          <Route path="/catalogos" element={<Navigate to="/downloads/catalogos" replace />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produtos/revestfacil" element={<RevestFacil />} />
          <Route path="/linhas/:categoria" element={<Segmento />} />
          <Route path="/produtos/:categoria/:slug" element={<Linha />} />
          <Route path="/noticias" element={<Blog />} />
          <Route path="/noticias/:slug" element={<BlogPost />} />
          <Route path="/blog" element={<Navigate to="/noticias" replace />} />
          <Route path="/blog/:slug" element={<BlogParaNoticia />} />
          <Route path="/cores" element={<Cores />} />
          <Route path="/cor/:line/:code" element={<CorDetalhe />} />
          <Route path="/decoracao" element={<DecorStudio />} />
          {/* privados até a Alltak revisar as informações: só com o link de prévia */}
          <Route path="/simulador" element={<Privado><Simulador /></Privado>} />
          <Route path="/visualizador" element={<Privado><Visualizador /></Privado>} />
          <Route path="/onde-comprar" element={<OndeComprar />} />
          <Route path="/instaladores" element={<Instaladores />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/cursos/:slug" element={<CursoDetalhe />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/politica-de-privacidade" element={<Privacidade />} />
          <Route path="/transparencia-salarial" element={<Transparencia />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsApp />
    </LeadGateProvider>
  )
}

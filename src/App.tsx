import { useEffect } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalogos from './pages/Catalogos'
import Produtos from './pages/Produtos'
import Visualizador from './pages/Visualizador'
import OndeComprar from './pages/OndeComprar'
import Instaladores from './pages/Instaladores'
import Cursos from './pages/Cursos'
import Contato from './pages/Contato'
import Privacidade from './pages/Privacidade'

// Scroll to top on route change, or to the #anchor when a hash is present.
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-alltak-black text-center">
      <p className="eyebrow text-alltak-red">Erro 404</p>
      <h1 className="mt-3 text-6xl text-white md:text-8xl">Página não encontrada</h1>
      <Link to="/" className="btn-trapezoid btn-red mt-8">Voltar para a home</Link>
    </section>
  )
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogos" element={<Catalogos />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/visualizador" element={<Visualizador />} />
          <Route path="/onde-comprar" element={<OndeComprar />} />
          <Route path="/instaladores" element={<Instaladores />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/politica-de-privacidade" element={<Privacidade />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

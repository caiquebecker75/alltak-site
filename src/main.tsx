import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App'
import { I18nProvider } from './i18n'
import './index.css'

// Produção (www.alltak.com.br, Cloudflare Pages): BrowserRouter com URLs reais,
// build com VITE_ROUTER=browser. Staging (GitHub Pages): HashRouter, que dispensa
// rewrite no servidor.
const usarBrowser = import.meta.env.VITE_ROUTER === 'browser'
const Router = usarBrowser ? BrowserRouter : HashRouter

// Links antigos no formato /#/rota continuam funcionando no BrowserRouter.
if (usarBrowser && window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1))
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <I18nProvider>
        <App />
      </I18nProvider>
    </Router>
  </StrictMode>,
)

import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'

// Placeholder distribuidores — substituir pela base real da Alltak.
type Loja = { nome: string; cidade: string; uf: string; tel: string }
const LOJAS: Loja[] = [
  { nome: 'Distribuidor Exemplo SP', cidade: 'São Paulo', uf: 'SP', tel: '(11) 0000-0000' },
  { nome: 'Distribuidor Exemplo RJ', cidade: 'Rio de Janeiro', uf: 'RJ', tel: '(21) 0000-0000' },
  { nome: 'Distribuidor Exemplo MG', cidade: 'Belo Horizonte', uf: 'MG', tel: '(31) 0000-0000' },
  { nome: 'Distribuidor Exemplo PR', cidade: 'Curitiba', uf: 'PR', tel: '(41) 0000-0000' },
  { nome: 'Distribuidor Exemplo RS', cidade: 'Porto Alegre', uf: 'RS', tel: '(51) 0000-0000' },
  { nome: 'Distribuidor Exemplo SC', cidade: 'Florianópolis', uf: 'SC', tel: '(48) 0000-0000' },
]

export default function OndeComprar() {
  const [uf, setUf] = useState('todos')
  const ufs = ['todos', ...Array.from(new Set(LOJAS.map((l) => l.uf)))]
  const filtered = uf === 'todos' ? LOJAS : LOJAS.filter((l) => l.uf === uf)

  return (
    <>
      <PageHeader eyebrow="Rede de distribuição" title="Onde comprar">
        Encontre distribuidores Alltak perto de você. Selecione o estado para filtrar
        a lista.
      </PageHeader>

      <section className="bg-alltak-cream py-16 text-alltak-black md:py-24">
        <div className="container-x">
          <div className="mb-8 flex flex-wrap gap-2">
            {ufs.map((u) => (
              <button
                key={u}
                onClick={() => setUf(u)}
                className={`font-display text-sm font-bold uppercase tracking-wide px-4 py-2 transition ${
                  uf === u ? 'bg-alltak-blue text-white' : 'bg-white text-alltak-black hover:bg-black/5'
                }`}
              >
                {u === 'todos' ? 'Todos' : u}
              </button>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l, i) => (
              <Reveal key={l.nome + i} delay={i * 50}>
                <div className="border border-black/10 bg-white p-6">
                  <div className="mb-3 h-1.5 w-12 bg-alltak-blue clip-slant" />
                  <h3 className="text-2xl">{l.nome}</h3>
                  <p className="mt-1 text-sm text-alltak-black/60">
                    {l.cidade} · {l.uf}
                  </p>
                  <p className="mt-2 text-sm">{l.tel}</p>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(l.nome + ' ' + l.cidade)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-trapezoid btn-blue mt-5 !py-2 !text-xs"
                  >
                    Ver no mapa
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

import subWraps from '../brand/sub-wraps.png'
import subDecor from '../brand/sub-decor.png'
import subSigns from '../brand/sub-signs.png'
import subStore from '../brand/sub-store.png'
import subAcademy from '../brand/sub-academy.png'
import subPlay from '../brand/sub-play.png'
import subTools from '../brand/sub-tools.png'
import subWrapcare from '../brand/sub-wrapcare.png'
import caveira from '../brand/caveira-simbolo.png'

// The full Alltak sub-brand family (official lockups from AF-ALLTAK-SUBMARCAS)
// gliding in an infinite band, separated by the official skull symbol.
const FAMILY = [
  { img: subWraps, name: 'Alltak Wraps' },
  { img: subDecor, name: 'Alltak Decor' },
  { img: subSigns, name: 'Alltak Signs' },
  { img: subStore, name: 'Alltak Store' },
  { img: subAcademy, name: 'Alltak Academy' },
  { img: subWrapcare, name: 'Alltak Wrap Care' },
  { img: subPlay, name: 'Alltak Play' },
  { img: subTools, name: 'Alltak Tools' },
]

export default function BrandFamily() {
  const row = [...FAMILY, ...FAMILY]
  return (
    <section className="border-y border-white/10 bg-alltak-black py-12">
      <div className="container-x mb-8 flex items-end justify-between">
        <div>
          <span className="tag">Um só padrão</span>
          <h2 className="mt-4 text-4xl text-white md:text-5xl">A família Alltak</h2>
        </div>
        <img
          src={caveira}
          alt=""
          aria-hidden
          className="hidden h-12 w-auto opacity-40 md:block"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </div>

      <div className="marquee-mask overflow-hidden">
        <div className="flex w-max items-center animate-marquee">
          {row.map((f, i) => (
            <span key={i} className="flex items-center">
              <img
                src={f.img}
                alt={f.name}
                title={f.name}
                draggable={false}
                className="mx-10 h-10 w-auto select-none opacity-80 transition-opacity duration-300 hover:opacity-100 md:h-14"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <img
                src={caveira}
                alt=""
                aria-hidden
                draggable={false}
                className="h-5 w-auto opacity-30"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

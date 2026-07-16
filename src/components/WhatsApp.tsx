// Persistent floating WhatsApp button — always on screen, opens a chat with
// the Alltak sales number in a new tab.
import { useT } from '../i18n'

const PHONE = '5511968594983'
const MESSAGE = 'Olá! Vim pelo site da Alltak e gostaria de mais informações.'
const HREF = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`

export default function WhatsApp() {
  const t = useT()
  return (
    <a
      href={HREF}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed bottom-5 right-5 z-[85] flex items-center gap-3 md:bottom-7 md:right-7"
    >
      {/* tooltip */}
      <span className="pointer-events-none hidden translate-x-2 whitespace-nowrap bg-white px-3 py-2 font-display text-xs font-bold uppercase tracking-wide text-alltak-black opacity-0 shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
        {t('cta.falarConosco')}
      </span>

      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16">
        {/* pulse ring */}
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40" aria-hidden />
        <svg viewBox="0 0 32 32" className="relative h-8 w-8 md:h-9 md:w-9" fill="#fff" aria-hidden>
          <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.593 4.463 1.72 6.406L3.2 28.8l6.56-1.71a12.74 12.74 0 006.24 1.62h.005c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.332-6.635-3.752-9.055A12.72 12.72 0 0016.004 3.2zm0 23.36h-.004a10.55 10.55 0 01-5.377-1.472l-.386-.229-3.893 1.015 1.04-3.795-.251-.39a10.54 10.54 0 01-1.616-5.62c0-5.86 4.77-10.63 10.64-10.63 2.84 0 5.51 1.108 7.52 3.117a10.56 10.56 0 013.113 7.52c0 5.86-4.77 10.63-10.63 10.63zm5.83-7.96c-.32-.16-1.89-.933-2.183-1.04-.293-.107-.507-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.35-.498-2.57-1.586-.95-.847-1.59-1.893-1.777-2.213-.187-.32-.02-.493.14-.653.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.986-2.373-.26-.624-.523-.54-.72-.55l-.613-.01c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667 0 1.573 1.146 3.093 1.306 3.307.16.213 2.253 3.44 5.46 4.827.763.33 1.36.527 1.824.674.767.244 1.464.21 2.016.127.615-.092 1.89-.773 2.157-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z" />
        </svg>
      </span>
    </a>
  )
}

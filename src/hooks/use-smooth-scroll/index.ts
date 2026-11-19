import Lenis from 'lenis'
import { useEffect } from 'react'

/** Enables Lenis smooth scrolling, unless the user prefers reduced motion. */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ autoRaf: true })
    return () => lenis.destroy()
  }, [])
}

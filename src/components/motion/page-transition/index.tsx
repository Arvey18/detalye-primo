import { motion, useReducedMotion } from 'motion/react'
import { useEffect, type ReactNode } from 'react'

// The first page is server-rendered HTML: animating it from opacity 0 would hide
// content until JavaScript loads (bad for SEO and LCP). Only animate later navigations.
let hasHydrated = false

/** Wraps a page so it fades in on client-side route changes. */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()
  const animate = hasHydrated && !reduceMotion

  useEffect(() => {
    hasHydrated = true
  }, [])

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

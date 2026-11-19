import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * False during prerendering and the first hydration pass, true afterwards.
 * Use it for UI that depends on the visitor's clock or browser (e.g. a calendar
 * built around "today"), so the prerendered HTML and the client agree.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}

import { ref } from 'vue'

const queries = new Map()

// Reactive media-query match. One shared listener per query, for the life of the app.
// Falls back to `false` where matchMedia is unavailable (e.g. jsdom in tests).
export function useMediaQuery(query) {
  if (!queries.has(query)) {
    const matches = ref(false)
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const mq = window.matchMedia(query)
      matches.value = mq.matches
      mq.addEventListener('change', (event) => {
        matches.value = event.matches
      })
    }
    queries.set(query, matches)
  }
  return queries.get(query)
}

// Small screens: windows go fullscreen and can't be dragged.
export const useIsMobile = () => useMediaQuery('(max-width: 640px)')

// Touch-first devices: a single tap opens an icon.
export const useIsTouch = () => useMediaQuery('(pointer: coarse)')

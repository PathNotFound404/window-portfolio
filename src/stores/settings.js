import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { colorSchemes, defaultScheme } from '@/config/appearance'
import { backgrounds, defaultBackground } from '@/config/backgrounds'
import { site } from '@/config/site'

export const STORAGE_KEY = 'portfolio-settings'

const defaults = () => ({
  background: defaultBackground,
  scheme: defaultScheme,
  clock12h: site.taskbar.clock12h,
})

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

// Keep only saved values that are still valid, so a removed background or a hand-edited
// entry can never break the page.
function sanitize(saved) {
  const base = defaults()
  return {
    background: backgrounds.some((b) => b.id === saved.background)
      ? saved.background
      : base.background,
    scheme: colorSchemes.some((s) => s.id === saved.scheme) ? saved.scheme : base.scheme,
    clock12h: typeof saved.clock12h === 'boolean' ? saved.clock12h : base.clock12h,
  }
}

// Visitor preferences, changed from the Settings app and remembered in their browser.
export const useSettingsStore = defineStore('settings', () => {
  const initial = sanitize(readSaved())
  const background = ref(initial.background)
  const scheme = ref(initial.scheme)
  const clock12h = ref(initial.clock12h)

  const currentBackground = computed(
    () => backgrounds.find((b) => b.id === background.value) ?? backgrounds[0],
  )
  const currentScheme = computed(
    () => colorSchemes.find((s) => s.id === scheme.value) ?? colorSchemes[0],
  )

  watch([background, scheme, clock12h], () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          background: background.value,
          scheme: scheme.value,
          clock12h: clock12h.value,
        }),
      )
    } catch {
      // Storage can be blocked (private mode, disabled cookies); settings just won't persist.
    }
  })

  function reset() {
    const base = defaults()
    background.value = base.background
    scheme.value = base.scheme
    clock12h.value = base.clock12h
  }

  return { background, scheme, clock12h, currentBackground, currentScheme, reset }
})

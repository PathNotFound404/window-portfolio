import { watchEffect } from 'vue'
import { useSettingsStore } from '@/stores/settings'

// Pushes the chosen color scheme into the CSS variables defined in styles/theme.css.
export function useAppearance() {
  const settings = useSettingsStore()

  watchEffect(() => {
    const { titleStart, titleEnd } = settings.currentScheme
    const root = document.documentElement.style
    root.setProperty('--titlebar-active-start', titleStart)
    root.setProperty('--titlebar-active-end', titleEnd)
    root.setProperty('--selection-bg', titleStart)
  })
}

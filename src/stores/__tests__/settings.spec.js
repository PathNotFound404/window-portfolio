import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { defaultBackground } from '@/config/backgrounds'
import { STORAGE_KEY, useSettingsStore } from '../settings'

const freshStore = () => {
  setActivePinia(createPinia())
  return useSettingsStore()
}

describe('settings store', () => {
  beforeEach(() => localStorage.clear())

  it('defaults to the teal background, standard scheme, and 12-hour clock', () => {
    const settings = freshStore()
    expect(defaultBackground).toBe('teal')
    expect(settings.background).toBe('teal')
    expect(settings.currentBackground.image).toContain('98BG-Teal.jpg')
    expect(settings.scheme).toBe('standard')
    expect(settings.clock12h).toBe(true)
  })

  it('remembers changes across page loads', async () => {
    const settings = freshStore()
    settings.background = 'red'
    settings.scheme = 'rose'
    settings.clock12h = false
    await nextTick()

    const reloaded = freshStore()
    expect(reloaded.background).toBe('red')
    expect(reloaded.scheme).toBe('rose')
    expect(reloaded.clock12h).toBe(false)
  })

  it('ignores saved values that are no longer valid', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ background: 'deleted-file', scheme: 'nope', clock12h: 'yes' }),
    )
    const settings = freshStore()
    expect(settings.background).toBe('teal')
    expect(settings.scheme).toBe('standard')
    expect(settings.clock12h).toBe(true)
  })

  it('survives corrupt storage', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    expect(freshStore().background).toBe('teal')
  })

  it('reset restores the defaults', () => {
    const settings = freshStore()
    settings.background = 'green'
    settings.scheme = 'forest'
    settings.clock12h = false

    settings.reset()

    expect(settings.background).toBe('teal')
    expect(settings.scheme).toBe('standard')
    expect(settings.clock12h).toBe(true)
  })
})

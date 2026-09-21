import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { minWindowSize } from '@/config/windows'
import { useWindowsStore } from '../windows'

describe('windows store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useWindowsStore()
  })

  it('opens a window with the configured defaults', () => {
    store.open('projects')
    expect(store.windows).toHaveLength(1)
    expect(store.windows[0]).toMatchObject({
      id: 'projects',
      appId: 'projects',
      title: 'My Projects',
    })
  })

  it('focuses the existing window instead of opening a duplicate', () => {
    store.open('projects')
    store.open('about')
    const before = store.windows[0].z

    store.open('projects')

    expect(store.windows).toHaveLength(2)
    expect(store.windows[0].z).toBeGreaterThan(before)
    expect(store.activeId).toBe('projects')
  })

  it('raises the focused window above the others', () => {
    store.open('projects')
    store.open('about')
    expect(store.activeId).toBe('about')

    store.focus('projects')

    expect(store.activeId).toBe('projects')
  })

  it('minimizing hands activity to the next window; the taskbar restores it', () => {
    store.open('projects')
    store.open('about')

    store.minimize('about')
    expect(store.activeId).toBe('projects')

    store.taskbarClick('about')
    expect(store.windows.find((w) => w.id === 'about').minimized).toBe(false)
    expect(store.activeId).toBe('about')
  })

  it('taskbar click on the active window minimizes it', () => {
    store.open('about')
    store.taskbarClick('about')
    expect(store.windows[0].minimized).toBe(true)
    expect(store.activeId).toBeNull()
  })

  it('toggles maximize', () => {
    store.open('about')
    store.toggleMaximize('about')
    expect(store.windows[0].maximized).toBe(true)
    store.toggleMaximize('about')
    expect(store.windows[0].maximized).toBe(false)
  })

  it('closes a window', () => {
    store.open('about')
    store.close('about')
    expect(store.windows).toHaveLength(0)
  })

  it('moves windows and never resizes below the minimum', () => {
    store.open('about')
    store.move('about', 10, 20)
    store.resize('about', 1, 1)
    expect(store.windows[0]).toMatchObject({ x: 10, y: 20, w: minWindowSize.w, h: minWindowSize.h })
  })

  it('launches a url in a new tab and an app in a window', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)

    store.launch({ url: 'https://example.com' })
    expect(open).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer')
    expect(store.windows).toHaveLength(0)

    store.launch({ app: 'contact' })
    expect(store.windows.map((w) => w.id)).toEqual(['contact'])

    open.mockRestore()
  })
})

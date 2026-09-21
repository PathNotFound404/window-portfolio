import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { backgrounds } from '@/config/backgrounds'
import { desktopIcons } from '@/config/desktop'
import { projects } from '@/content'
import { useWindowsStore } from '@/stores/windows'

const mountApp = () => mount(App, { global: { plugins: [createPinia()] } })

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('renders one desktop icon per entry in config/desktop.js', () => {
    const wrapper = mountApp()
    const labels = wrapper.findAll('.desktop .icon-tile').map((tile) => tile.text())
    expect(labels).toEqual(desktopIcons.map((item) => item.label))
  })

  it('shows the Start button and no windows initially', () => {
    const wrapper = mountApp()
    expect(wrapper.find('.start-button').exists()).toBe(true)
    expect(wrapper.findAll('.app-window')).toHaveLength(0)
  })

  it('opens the projects window when the My Projects icon is double-clicked', async () => {
    const wrapper = mountApp()
    const tile = wrapper.findAll('.desktop .icon-tile').find((t) => t.text() === 'My Projects')

    await tile.trigger('dblclick')

    const win = wrapper.find('.app-window')
    expect(win.exists()).toBe(true)
    for (const project of projects) expect(win.text()).toContain(project.name)
    expect(wrapper.find('.task-button').exists()).toBe(true)
  })

  it('opens a focused desktop icon with the Enter key', async () => {
    const wrapper = mountApp()
    const tile = wrapper.findAll('.desktop .icon-tile').find((t) => t.text() === 'About Me')

    await tile.trigger('keydown', { key: 'Enter' })

    expect(wrapper.find('.app-window').exists()).toBe(true)
  })

  it('closes a window from its title bar button', async () => {
    const wrapper = mountApp()
    const store = useWindowsStore()
    store.open('about')
    await wrapper.vm.$nextTick()

    await wrapper.find('button[aria-label="Close"]').trigger('click')

    expect(wrapper.findAll('.app-window')).toHaveLength(0)
  })
})

describe('Settings app', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('style')
    setActivePinia(createPinia())
  })

  // Mounts the app and opens the Settings window via its desktop icon.
  async function openSettings() {
    const wrapper = mountApp()
    const tile = wrapper.findAll('.desktop .icon-tile').find((t) => t.text() === 'Settings')
    await tile.trigger('dblclick')
    return wrapper
  }

  it('starts on the teal background', () => {
    const wrapper = mountApp()
    expect(wrapper.find('.desktop').attributes('style')).toContain('98BG-Teal.jpg')
  })

  it('has a Settings desktop icon and Start menu entry', async () => {
    const wrapper = await openSettings()
    expect(wrapper.find('.app-window').text()).toContain('Wallpaper')

    await wrapper.find('.start-button').trigger('click')
    expect(wrapper.find('.start-menu').text()).toContain('Settings')
  })

  it('lists every configured background and changes the desktop when one is picked', async () => {
    const wrapper = await openSettings()
    const labels = wrapper.findAll('.choices label').map((l) => l.text())
    expect(labels).toEqual(backgrounds.map((b) => b.name))

    await wrapper.find('#bg-red').setValue()

    expect(wrapper.find('.desktop').attributes('style')).toContain('98BG-Red.jpg')
    expect(wrapper.find('.monitor-screen').attributes('style')).toContain('98BG-Red.jpg')
  })

  it('applies a color scheme to the whole UI', async () => {
    const wrapper = await openSettings()
    await wrapper.findAll('[role="tab"] a')[1].trigger('click')

    await wrapper.find('#scheme-rose').setValue()

    const root = document.documentElement.style
    expect(root.getPropertyValue('--titlebar-active-start')).toBe('#7a2848')
  })

  it('switches the taskbar clock between 12 and 24 hour', async () => {
    const wrapper = await openSettings()
    await wrapper.findAll('[role="tab"] a')[1].trigger('click')
    const twelve = wrapper.find('.tray').text()

    await wrapper.find('#clock-24').setValue()

    expect(wrapper.find('.tray').text()).not.toBe(twelve)
  })

  it('Reset to defaults puts everything back', async () => {
    const wrapper = await openSettings()
    await wrapper.find('#bg-green').setValue()

    await wrapper.find('.footer button').trigger('click')

    expect(wrapper.find('.desktop').attributes('style')).toContain('98BG-Teal.jpg')
  })
})

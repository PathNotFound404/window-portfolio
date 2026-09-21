import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { desktopIcons } from '@/config/desktop'
import { projects } from '@/content'
import { useWindowsStore } from '@/stores/windows'

const mountApp = () => mount(App, { global: { plugins: [createPinia()] } })

describe('App', () => {
  beforeEach(() => setActivePinia(createPinia()))

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

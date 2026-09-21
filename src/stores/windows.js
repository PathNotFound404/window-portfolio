import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fallbackWindow, minWindowSize, windowDefaults } from '@/config/windows'

const CASCADE_STEP = 24

export const useWindowsStore = defineStore('windows', () => {
  const windows = ref([])
  const topZ = ref(0)

  // The frontmost window that isn't minimized.
  const activeId = computed(() => {
    let top = null
    for (const win of windows.value) {
      if (!win.minimized && (!top || win.z > top.z)) top = win
    }
    return top?.id ?? null
  })

  const find = (id) => windows.value.find((win) => win.id === id)

  // Opens a window for `appId`. If one with the same id is already open, focuses it instead.
  function open(appId, { id = appId, title, props = {} } = {}) {
    const existing = find(id)
    if (existing) {
      focus(id)
      return existing
    }

    const defaults = windowDefaults[appId] ?? fallbackWindow
    const cascade = (windows.value.length % 8) * CASCADE_STEP
    windows.value.push({
      id,
      appId,
      title: title ?? defaults.title,
      x: defaults.x ?? 40 + cascade,
      y: defaults.y ?? 40 + cascade,
      w: defaults.w,
      h: defaults.h,
      z: ++topZ.value,
      minimized: false,
      maximized: false,
      props,
    })
    return find(id)
  }

  // Runs a desktop/Start-menu entry: opens a new tab for `url`, or a window for `app`.
  function launch(item) {
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer')
      return
    }
    open(item.app)
  }

  function close(id) {
    windows.value = windows.value.filter((win) => win.id !== id)
  }

  function focus(id) {
    const win = find(id)
    if (!win) return
    if (!win.minimized && activeId.value === id) return
    win.minimized = false
    win.z = ++topZ.value
  }

  function minimize(id) {
    const win = find(id)
    if (win) win.minimized = true
  }

  function toggleMaximize(id) {
    const win = find(id)
    if (!win) return
    win.maximized = !win.maximized
    focus(id)
  }

  function move(id, x, y) {
    const win = find(id)
    if (win) Object.assign(win, { x, y })
  }

  function resize(id, w, h) {
    const win = find(id)
    if (win)
      Object.assign(win, { w: Math.max(w, minWindowSize.w), h: Math.max(h, minWindowSize.h) })
  }

  // Taskbar button behavior: restore if minimized, minimize if active, otherwise raise.
  function taskbarClick(id) {
    const win = find(id)
    if (!win) return
    if (!win.minimized && activeId.value === id) minimize(id)
    else focus(id)
  }

  return {
    windows,
    activeId,
    open,
    launch,
    close,
    focus,
    minimize,
    toggleMaximize,
    move,
    resize,
    taskbarClick,
  }
})

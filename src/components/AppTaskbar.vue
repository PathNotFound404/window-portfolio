<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { desktopIcons } from '@/config/desktop'
import { site } from '@/config/site'
import { iconUrl } from '@/lib/icons'
import { useWindowsStore } from '@/stores/windows'
import StartMenu from './StartMenu.vue'

const store = useWindowsStore()
const menuOpen = ref(false)
const startArea = ref(null)

const iconFor = (win) => desktopIcons.find((item) => item.app === win.appId)?.icon ?? 'app'

const now = ref(new Date())
const time = () =>
  now.value.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: site.taskbar.clock12h,
  })

let timer
const closeOnOutsideClick = (event) => {
  if (menuOpen.value && !startArea.value.contains(event.target)) menuOpen.value = false
}
const closeOnEscape = (event) => {
  if (event.key === 'Escape') menuOpen.value = false
}

onMounted(() => {
  timer = setInterval(() => (now.value = new Date()), 10_000)
  document.addEventListener('pointerdown', closeOnOutsideClick)
  document.addEventListener('keydown', closeOnEscape)
})

onBeforeUnmount(() => {
  clearInterval(timer)
  document.removeEventListener('pointerdown', closeOnOutsideClick)
  document.removeEventListener('keydown', closeOnEscape)
})
</script>

<template>
  <footer class="taskbar">
    <div ref="startArea" class="start-area">
      <button
        type="button"
        class="start-button"
        :class="{ pressed: menuOpen }"
        @click="menuOpen = !menuOpen"
      >
        <img :src="iconUrl('start')" alt="" width="16" height="16" />
        <b>{{ site.taskbar.startLabel }}</b>
      </button>
      <StartMenu v-if="menuOpen" @close="menuOpen = false" />
    </div>

    <div class="tasks">
      <button
        v-for="win in store.windows"
        :key="win.id"
        type="button"
        class="task-button"
        :class="{ pressed: win.id === store.activeId }"
        @click="store.taskbarClick(win.id)"
      >
        <img :src="iconUrl(iconFor(win))" alt="" width="16" height="16" />
        <span>{{ win.title }}</span>
      </button>
    </div>

    <div class="tray">{{ time() }}</div>
  </footer>
</template>

<style scoped>
.taskbar {
  align-items: center;
  background: var(--surface);
  box-shadow: inset 0 1px #dfdfdf;
  display: flex;
  gap: 4px;
  padding: 2px 4px;
  position: relative;
}

.start-area {
  position: relative;
}

.start-button,
.task-button {
  align-items: center;
  display: flex;
  gap: 4px;
  height: 24px;
  min-width: 0;
  padding: 0 8px;
}

.tasks {
  display: flex;
  flex: 1;
  gap: 4px;
  min-width: 0;
}

.task-button {
  flex: 0 1 160px;
  justify-content: flex-start;
  min-width: 0;
}

.task-button span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 98.css's pressed-button look, applied for open menus and the active window. */
.pressed {
  background: repeating-conic-gradient(#c0c0c0 0% 25%, #fff 0% 50%) 0 0 / 2px 2px;
  box-shadow:
    inset -1px -1px #fff,
    inset 1px 1px #0a0a0a,
    inset -2px -2px #dfdfdf,
    inset 2px 2px grey;
  font-weight: bold;
}

.tray {
  align-items: center;
  box-shadow:
    inset -1px -1px #fff,
    inset 1px 1px grey;
  display: flex;
  height: 22px;
  padding: 0 10px;
}
</style>

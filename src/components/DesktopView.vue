<script setup>
import { computed, ref } from 'vue'
import { desktopIcons } from '@/config/desktop'
import { wallpaperStyle } from '@/lib/wallpaper'
import { useSettingsStore } from '@/stores/settings'
import { useWindowsStore } from '@/stores/windows'
import AppWindow from './AppWindow.vue'
import IconTile from './IconTile.vue'

const store = useWindowsStore()
const settings = useSettingsStore()
const selected = ref(null)

const style = computed(() => wallpaperStyle(settings.currentBackground))
</script>

<template>
  <main class="desktop" :style="style" @pointerdown.self="selected = null">
    <ul class="icon-grid">
      <li v-for="item in desktopIcons" :key="item.label">
        <IconTile
          on-dark
          :icon="item.icon"
          :label="item.label"
          :selected="selected === item.label"
          @select="selected = item.label"
          @open="store.launch(item)"
        />
      </li>
    </ul>

    <AppWindow
      v-for="win in store.windows"
      :key="win.id"
      :win="win"
      :active="win.id === store.activeId"
    />
  </main>
</template>

<style scoped>
.desktop {
  isolation: isolate;
  overflow: hidden;
  position: relative;
}

.icon-grid {
  align-content: flex-start;
  bottom: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 8px;
  left: 0;
  list-style: none;
  margin: 0;
  padding: 8px;
  pointer-events: none;
  position: absolute;
  top: 0;
}

.icon-grid li {
  pointer-events: auto;
}
</style>

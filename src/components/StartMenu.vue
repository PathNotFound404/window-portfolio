<script setup>
import { desktopIcons } from '@/config/desktop'
import { iconUrl } from '@/lib/icons'
import { useWindowsStore } from '@/stores/windows'

const emit = defineEmits(['close'])
const store = useWindowsStore()

const items = desktopIcons.filter((item) => item.startMenu !== false)

function run(item) {
  store.launch(item)
  emit('close')
}
</script>

<template>
  <ul class="window start-menu" role="menu">
    <li v-for="item in items" :key="item.label" role="none">
      <button type="button" class="plain-button menu-item" role="menuitem" @click="run(item)">
        <img :src="iconUrl(item.icon)" alt="" width="24" height="24" />
        <span>{{ item.label }}</span>
      </button>
    </li>
  </ul>
</template>

<style scoped>
.start-menu {
  bottom: 100%;
  left: 0;
  list-style: none;
  margin: 0;
  min-width: 180px;
  padding: 4px;
  position: absolute;
}

.menu-item {
  align-items: center;
  cursor: default;
  display: flex;
  gap: 10px;
  padding: 6px 10px;
  text-align: left;
  width: 100%;
}

.menu-item:hover,
.menu-item:focus-visible {
  background: var(--selection-bg);
  color: var(--selection-text);
  outline: none;
}
</style>

<script setup>
import { iconUrl } from '@/lib/icons'
import { useIsTouch } from '@/composables/useMediaQuery'

// An icon with a label underneath. Click selects; double-click (or a tap on touch devices) opens.
defineProps({
  icon: { type: String, default: 'app' },
  label: { type: String, required: true },
  selected: Boolean,
  onDark: Boolean,
})
const emit = defineEmits(['select', 'open'])

const isTouch = useIsTouch()

function onClick() {
  emit('select')
  if (isTouch.value) emit('open')
}
</script>

<template>
  <button
    type="button"
    class="plain-button icon-tile"
    :class="{ selected, 'on-dark': onDark }"
    @click="onClick"
    @dblclick="emit('open')"
    @keydown.enter.prevent="emit('open')"
  >
    <img :src="iconUrl(icon)" alt="" width="32" height="32" draggable="false" />
    <span class="label">{{ label }}</span>
  </button>
</template>

<style scoped>
.icon-tile {
  align-items: center;
  color: var(--text);
  cursor: default;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px;
  text-align: center;
  width: 76px;
}

.icon-tile.on-dark {
  color: var(--icon-label-color);
}

.label {
  overflow-wrap: anywhere;
  padding: 1px 2px;
}

.icon-tile.selected .label {
  background: var(--selection-bg);
  color: var(--selection-text);
  outline: 1px dotted #ff0;
}

.icon-tile.selected img {
  opacity: 0.75;
}
</style>

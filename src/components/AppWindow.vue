<script setup>
import { computed, ref } from 'vue'
import { apps } from '@/apps'
import { minWindowSize } from '@/config/windows'
import { useDrag } from '@/composables/useDrag'
import { useIsMobile } from '@/composables/useMediaQuery'
import { useWindowsStore } from '@/stores/windows'

const props = defineProps({
  win: { type: Object, required: true },
  active: Boolean,
})

const store = useWindowsStore()
const isMobile = useIsMobile()
const el = ref(null)

// Keep at least this much of a window on screen so its title bar can always be grabbed.
const MIN_VISIBLE = 80
const TITLE_BAR_HEIGHT = 24

const fullscreen = computed(() => isMobile.value || props.win.maximized)
const component = computed(() => apps[props.win.appId])
const style = computed(() =>
  fullscreen.value
    ? { zIndex: props.win.z }
    : {
        zIndex: props.win.z,
        left: `${props.win.x}px`,
        top: `${props.win.y}px`,
        width: `${props.win.w}px`,
        height: `${props.win.h}px`,
      },
)

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const desktopSize = () => ({
  w: el.value.parentElement.clientWidth,
  h: el.value.parentElement.clientHeight,
})

const mover = useDrag({
  onStart: () => ({ x: props.win.x, y: props.win.y }),
  onMove(dx, dy, origin) {
    const bounds = desktopSize()
    store.move(
      props.win.id,
      clamp(origin.x + dx, MIN_VISIBLE - props.win.w, bounds.w - MIN_VISIBLE),
      clamp(origin.y + dy, 0, bounds.h - TITLE_BAR_HEIGHT),
    )
  },
})

const resizer = useDrag({
  onStart: () => ({ w: props.win.w, h: props.win.h }),
  onMove(dx, dy, origin) {
    const bounds = desktopSize()
    store.resize(
      props.win.id,
      Math.min(origin.w + dx, Math.max(bounds.w - props.win.x, minWindowSize.w)),
      Math.min(origin.h + dy, Math.max(bounds.h - props.win.y, minWindowSize.h)),
    )
  },
})

function startMove(event) {
  if (fullscreen.value || event.target.closest('.title-bar-controls')) return
  mover.begin(event)
}

function onTitleDoubleClick(event) {
  if (isMobile.value || event.target.closest('.title-bar-controls')) return
  store.toggleMaximize(props.win.id)
}
</script>

<template>
  <section
    v-show="!win.minimized"
    ref="el"
    class="window app-window"
    :class="{ fullscreen }"
    :style="style"
    :aria-label="win.title"
    @pointerdown="store.focus(win.id)"
  >
    <div
      class="title-bar"
      :class="{ inactive: !active }"
      @pointerdown="startMove"
      @dblclick="onTitleDoubleClick"
    >
      <div class="title-bar-text">{{ win.title }}</div>
      <div class="title-bar-controls">
        <button aria-label="Minimize" @click="store.minimize(win.id)"></button>
        <button
          v-if="!isMobile"
          :aria-label="win.maximized ? 'Restore' : 'Maximize'"
          @click="store.toggleMaximize(win.id)"
        ></button>
        <button aria-label="Close" @click="store.close(win.id)"></button>
      </div>
    </div>

    <div class="window-body app-body">
      <component :is="component" v-if="component" v-bind="win.props" />
      <p v-else>App "{{ win.appId }}" is not registered in src/apps/index.js.</p>
    </div>

    <div v-if="!fullscreen" class="resize-grip" @pointerdown.prevent="resizer.begin"></div>
  </section>
</template>

<style scoped>
.app-window {
  display: flex;
  flex-direction: column;
  position: absolute;
}

.app-window.fullscreen {
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
}

.title-bar {
  flex: none;
  touch-action: none;
  user-select: none;
}

.title-bar-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-body {
  flex: 1;
  margin: 3px 0 0;
  min-height: 0;
  overflow: auto;
}

.resize-grip {
  bottom: 0;
  cursor: nwse-resize;
  height: 16px;
  position: absolute;
  right: 0;
  touch-action: none;
  width: 16px;
}
</style>

<script setup>
import { computed, ref } from 'vue'
import { colorSchemes } from '@/config/appearance'
import { backgrounds } from '@/config/backgrounds'
import { wallpaperStyle } from '@/lib/wallpaper'
import { useSettingsStore } from '@/stores/settings'

// A "Display Properties"-style window. Every change applies immediately and is remembered.
const settings = useSettingsStore()

const tabs = [
  { id: 'background', label: 'Background' },
  { id: 'appearance', label: 'Appearance' },
]
const tab = ref('background')

const previewStyle = computed(() => wallpaperStyle(settings.currentBackground))
const swatchStyle = (scheme) => ({
  background: `linear-gradient(90deg, ${scheme.titleStart}, ${scheme.titleEnd})`,
})
</script>

<template>
  <div class="settings">
    <menu role="tablist">
      <li v-for="t in tabs" :key="t.id" role="tab" :aria-selected="tab === t.id">
        <a href="#" @click.prevent="tab = t.id">{{ t.label }}</a>
      </li>
    </menu>

    <div class="window tab-panel" role="tabpanel">
      <div class="window-body">
        <template v-if="tab === 'background'">
          <div class="monitor" aria-hidden="true">
            <div class="monitor-screen" :style="previewStyle"></div>
          </div>

          <fieldset>
            <legend>Wallpaper</legend>
            <ul class="choices sunken-panel">
              <li v-for="bg in backgrounds" :key="bg.id">
                <input
                  :id="`bg-${bg.id}`"
                  v-model="settings.background"
                  type="radio"
                  name="background"
                  :value="bg.id"
                />
                <label :for="`bg-${bg.id}`">{{ bg.name }}</label>
              </li>
            </ul>
          </fieldset>
        </template>

        <template v-else>
          <fieldset>
            <legend>Window color scheme</legend>
            <ul class="choices sunken-panel">
              <li v-for="scheme in colorSchemes" :key="scheme.id">
                <input
                  :id="`scheme-${scheme.id}`"
                  v-model="settings.scheme"
                  type="radio"
                  name="scheme"
                  :value="scheme.id"
                />
                <label :for="`scheme-${scheme.id}`">
                  <span class="swatch" :style="swatchStyle(scheme)"></span>
                  {{ scheme.name }}
                </label>
              </li>
            </ul>
          </fieldset>

          <fieldset>
            <legend>Taskbar clock</legend>
            <div class="field-row">
              <input
                id="clock-12"
                v-model="settings.clock12h"
                type="radio"
                name="clock"
                :value="true"
              />
              <label for="clock-12">12-hour</label>
            </div>
            <div class="field-row">
              <input
                id="clock-24"
                v-model="settings.clock12h"
                type="radio"
                name="clock"
                :value="false"
              />
              <label for="clock-24">24-hour</label>
            </div>
          </fieldset>
        </template>
      </div>
    </div>

    <div class="footer">
      <button type="button" @click="settings.reset()">Reset to defaults</button>
    </div>
  </div>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 2px;
}

.tab-panel .window-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

fieldset {
  margin: 0;
}

.monitor {
  background: var(--surface);
  box-shadow:
    inset -1px -1px #0a0a0a,
    inset 1px 1px #dfdfdf,
    inset -2px -2px grey,
    inset 2px 2px #fff;
  margin: 4px auto 0;
  padding: 10px 10px 16px;
  width: 176px;
}

.monitor-screen {
  box-shadow:
    inset 1px 1px grey,
    1px 1px #fff;
  height: 100px;
  width: 100%;
}

.choices {
  list-style: none;
  margin: 0;
  max-height: 140px;
  padding: 6px 6px 6px 8px;
}

.choices li + li {
  margin-top: 6px;
}

.swatch {
  border: 1px solid #000;
  display: inline-block;
  height: 10px;
  margin-right: 6px;
  width: 36px;
}

.footer {
  display: flex;
  justify-content: flex-end;
}
</style>

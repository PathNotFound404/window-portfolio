<script setup>
import { computed, ref } from 'vue'
import { projects } from '@/content'
import { publicUrl } from '@/lib/publicUrl'
import IconTile from '../IconTile.vue'

// An Explorer-style folder of projects. Opening one shows its detail page; Back returns.
const selectedSlug = ref(null)
const current = ref(null)

const address = computed(() =>
  current.value ? `C:\\Projects\\${current.value.slug}` : 'C:\\Projects',
)
const status = computed(() =>
  current.value ? current.value.summary : `${projects.length} object(s)`,
)
</script>

<template>
  <div class="explorer">
    <div class="toolbar">
      <button type="button" :disabled="!current" @click="current = null">Back</button>
      <label class="address">
        <span>Address</span>
        <input type="text" readonly :value="address" />
      </label>
    </div>

    <div class="sunken-panel pane">
      <ul v-if="!current" class="file-grid">
        <li v-for="project in projects" :key="project.slug">
          <IconTile
            :icon="project.icon ?? 'app'"
            :label="project.name"
            :selected="selectedSlug === project.slug"
            @select="selectedSlug = project.slug"
            @open="current = project"
          />
        </li>
      </ul>

      <article v-else class="detail">
        <h2>{{ current.name }}</h2>
        <img
          v-if="current.screenshot"
          class="shot"
          :src="publicUrl(current.screenshot)"
          :alt="`${current.name} screenshot`"
        />
        <p>{{ current.description ?? current.summary }}</p>
        <p>
          <b>Built with:</b>
          {{ current.tech.join(', ') }}
        </p>
        <p class="links">
          <a :href="current.repoUrl" target="_blank" rel="noopener noreferrer">Source code</a>
          <a
            v-if="current.liveUrl"
            :href="current.liveUrl"
            target="_blank"
            rel="noopener noreferrer"
            >Live demo</a
          >
        </p>
      </article>
    </div>

    <div class="status-bar">
      <p class="status-bar-field">{{ status }}</p>
    </div>
  </div>
</template>

<style scoped>
.explorer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
}

.toolbar {
  align-items: center;
  display: flex;
  gap: 8px;
}

.toolbar button {
  min-width: 60px;
}

.address {
  align-items: center;
  display: flex;
  flex: 1;
  gap: 6px;
}

.address input {
  flex: 1;
  min-width: 0;
}

.pane {
  flex: 1;
  min-height: 0;
}

.file-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 8px;
}

.detail {
  padding: 12px;
}

.detail h2 {
  font-size: 14px;
  margin: 0 0 10px;
}

.shot {
  border: 1px solid #808080;
  display: block;
  margin-bottom: 10px;
  max-width: 100%;
}

.links {
  display: flex;
  gap: 16px;
}
</style>

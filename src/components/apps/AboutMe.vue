<script setup>
import { about } from '@/content'
import { site } from '@/config/site'
</script>

<template>
  <div class="sunken-panel notepad">
    <p class="heading">{{ site.owner.name }} - {{ site.owner.tagline }}</p>
    <p v-for="(paragraph, index) in about" :key="index">{{ paragraph }}</p>
  </div>
</template>

<style scoped>
.notepad {
  font-family: var(--font-doc);
  font-size: 13px;
  height: 100%;
  line-height: 1.4;
  padding: 8px 10px;
}

.notepad p {
  margin: 0 0 1em;
}

.heading {
  font-weight: bold;
}
</style>

<script setup>
import AppTaskbar from '@/components/AppTaskbar.vue'
import DesktopView from '@/components/DesktopView.vue'
</script>

<template>
  <div class="screen">
    <DesktopView />
    <AppTaskbar />
  </div>
</template>

<style scoped>
.screen {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) var(--taskbar-height);
  height: 100%;
}
</style>

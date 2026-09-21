<script setup>
import { site } from '@/config/site'

const { owner, links } = site
</script>

<template>
  <div class="card">
    <p class="name">{{ owner.name }}</p>
    <p>{{ owner.tagline }}</p>

    <fieldset>
      <legend>Get in touch</legend>
      <dl>
        <dt>Email</dt>
        <dd>
          <a :href="`mailto:${owner.email}`">{{ owner.email }}</a>
        </dd>
        <dt>GitHub</dt>
        <dd>
          <a :href="links.github" target="_blank" rel="noopener noreferrer">{{ links.github }}</a>
        </dd>
        <dt>LinkedIn</dt>
        <dd>
          <a :href="links.linkedin" target="_blank" rel="noopener noreferrer">{{
            links.linkedin
          }}</a>
        </dd>
      </dl>
    </fieldset>
  </div>
</template>

<style scoped>
.card {
  padding: 4px;
}

.card p {
  margin: 0 0 6px;
}

.name {
  font-size: 14px;
  font-weight: bold;
}

dl {
  margin: 0;
}

dt {
  font-weight: bold;
}

dd {
  margin: 0 0 8px;
  overflow-wrap: anywhere;
}
</style>

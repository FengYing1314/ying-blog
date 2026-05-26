<template>
  <SiteShell>
    <RouterView v-slot="{ Component, route }">
      <Transition name="page-fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </SiteShell>
</template>

<script setup lang="ts">
import SiteShell from "./layouts/SiteShell.vue";
</script>

<script setup lang="ts">
import ChatApp from './components/ChatApp.vue';
</script>

<template>
  <Suspense>
    <ChatApp />
    <template #fallback> Loading... </template>
  </Suspense>
</template>

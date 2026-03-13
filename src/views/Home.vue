<template>
  <div class="home-page"></div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

onMounted(() => {
  document.documentElement.style.overflowY = 'hidden'
  document.body.style.overflowY = 'hidden'
})

onBeforeUnmount(() => {
  document.documentElement.style.overflowY = ''
  document.body.style.overflowY = ''
})
</script>

<style scoped>
.home-page {
  min-height: 100svh;
}
</style>

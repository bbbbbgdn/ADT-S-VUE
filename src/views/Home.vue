<template>
  <div class="home" :class="{ 'image-loaded': isLoaded }">
    <div class="title-text">Atelier Dasha Tsapenko</div>
    <iframe
      class="video-background"
      src="/homepage_video/index.html"
      frameborder="0"
      allowfullscreen
      @load="onIframeLoad"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'

// Reactive data
const isLoaded = ref(false)

// Methods
const onIframeLoad = () => {
  isLoaded.value = true
}

// Lifecycle
onBeforeUnmount(() => {
  isLoaded.value = false
  const homeElement = document.querySelector('.home')
  if (homeElement) {
    homeElement.style.display = 'none'
  }
})
</script>

<style scoped>
.home {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.home:not(.image-loaded) {
  display: none;
}

.image-loaded {
  opacity: 1;
}

.content {
  text-align: center;
  color: white;
  padding: var(--space-md);
  border-radius: 8px;
}

h1 {
  font-size: var(--text-3xl);
  margin: 0;
}

.title-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--text-4xl);
  font-weight: 670;
  color: rgba(0, 0, 0, 1);
  z-index: 0;
  white-space: nowrap;
  font-weight: bold;
  pointer-events: none;
}
</style> 
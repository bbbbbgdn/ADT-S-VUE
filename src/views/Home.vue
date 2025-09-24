<template>
  <div class="home" :class="{ 'image-loaded': isLoaded }">
    <div class="title-text" :class="{ 'title-fade-in': isLoaded }">{{ homepageTitle }}</div>
    <iframe
      class="video-background"
      src="/home_video/index.html"
      frameborder="0"
      allowfullscreen
      @load="onIframeLoad"
      @error="onIframeError"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue'
import useGlobalSettings from '../utils/useGlobalSettings'

// Global settings
const { homepageTitle } = useGlobalSettings()

// Reactive data
const isLoaded = ref(false)

// Methods
const onIframeLoad = () => {
  console.log('Iframe loaded, triggering fade-in')
  isLoaded.value = true
}

const onIframeError = () => {
  console.error('Iframe error, showing content anyway')
  isLoaded.value = true
}

// Lifecycle
onMounted(() => {
  // Fallback: if iframe doesn't load within 3 seconds, still show the content
  setTimeout(() => {
    if (!isLoaded.value) {
      console.log('Iframe load timeout, showing content anyway')
      isLoaded.value = true
    }
  }, 3000)
})

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
  height: 100svh;
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
  opacity: 0;
  pointer-events: none;
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
  opacity: 0;
  transition: opacity 0.8s ease-in-out 0.1s;
}

.title-fade-in {
  opacity: 1;
}
</style> 
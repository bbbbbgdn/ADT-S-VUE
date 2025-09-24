<template>
  <div class="not-found-page" :class="{ 'background-loaded': isLoaded }">
    <iframe
      class="page-background"
      :src="`/404Page/index.html?text=${encodeURIComponent(message404)}`"
      frameborder="0"
      allowfullscreen
      @load="onIframeLoad"
      @error="onIframeError"
    ></iframe>
    <!-- <div class="not-found-content" :class="{ 'content-fade-in': isLoaded }">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Page Not Found</h2>
      <p class="error-description">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="action-buttons">
        <BaseButton to="/">Go Home</BaseButton>
        <BaseButton @click="goBack">Go Back</BaseButton>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../components/BaseButton.vue'
import useGlobalSettings from '../utils/useGlobalSettings'

const router = useRouter()

// Global settings
const { message404 } = useGlobalSettings()

// Reactive data
const isLoaded = ref(false)

// Methods
const onIframeLoad = () => {
  console.log('404 background loaded, triggering fade-in')
  isLoaded.value = true
}

const onIframeError = () => {
  console.error('404 background error, showing content anyway')
  isLoaded.value = true
}

const goBack = () => {
  router.go(-1)
}

// Lifecycle
onMounted(() => {
  // Fallback: if iframe doesn't load within 3 seconds, still show the content
  setTimeout(() => {
    if (!isLoaded.value) {
      console.log('404 background load timeout, showing content anyway')
      isLoaded.value = true
    }
  }, 3000)
})

onBeforeUnmount(() => {
  isLoaded.value = false
})
</script>

<style scoped>
.not-found-page {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  transform: translateX(-50%);
  left: 50%;
  height: 100svh;
  width: 60vw;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.page-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  opacity: 0;
  transition: opacity 0.4s ease-in-out 0.3s;
}

.not-found-page:not(.background-loaded) {
  opacity: 0;
  pointer-events: none;
}

.background-loaded {
  opacity: 1;
}

.background-loaded .page-background {
  opacity: 1;
}

.not-found-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  opacity: 0;
  transition: opacity 0.8s ease-in-out 0.1s;
}

.content-fade-in {
  opacity: 1;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  margin: 0 0 20px 0;
  line-height: 1;
}

.error-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.error-description {
  font-size: 18px;
  margin: 0 0 40px 0;
  line-height: 1.5;
}

.action-buttons {
  display: inline-flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .not-found-page {
    width: 100vw;
    transform: none;
    left: 0;
  }
}
</style>

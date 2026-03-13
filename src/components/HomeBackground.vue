<template>
  <div
    ref="homeContainer"
    class="home"
    :class="{ active: isHome, loaded: isLoaded }"
  >
    <div class="title-text" :class="{ visible: isHome && isLoaded }">
      {{ homepageTitle }}
    </div>
    <canvas
      ref="canvasElement"
      id="home-glcanvas"
      class="video-background"
      tabindex="1"
    ></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import useGlobalSettings from '../utils/useGlobalSettings'

const route = useRoute()
const { homepageTitle, homepageVideo, homepageFallbackImage, isLoading: settingsLoading } = useGlobalSettings()

const isLoaded = ref(false)
const cablesPatch = ref(null)
const cablesEventListener = ref(null)
const homeContainer = ref(null)
const canvasElement = ref(null)

const isHome = computed(() => route.name === 'Home')

watch(isHome, (active) => {
  const mainContent = document.querySelector('.main-content')
  if (active) {
    if (cablesPatch.value) isLoaded.value = true
    if (window.CABLES?.patch?.resume) window.CABLES.patch.resume()
    if (mainContent) mainContent.style.pointerEvents = 'none'
  } else {
    isLoaded.value = false
    if (window.CABLES?.patch?.pause) window.CABLES.patch.pause()
    if (mainContent) mainContent.style.pointerEvents = ''
  }
})

const sendVideoConfig = () => {
  if (window.CABLES?.patch) {
    if (homepageVideo.value) window.CABLES.patch.setVariable('mainVideo', homepageVideo.value)
    if (homepageFallbackImage.value) window.CABLES.patch.setVariable('mainVideoFallbackImage', homepageFallbackImage.value)
  }
}

const createPatch = () => {
  if (!window.CABLES?.exportedPatch) {
    isLoaded.value = true
    return
  }

  try {
    const patch = new window.CABLES.Patch({
      patch: window.CABLES.exportedPatch,
      prefixAssetPath: '',
      assetPath: '/home_video/assets/',
      jsPath: '/home_video/js/',
      glCanvasId: 'home-glcanvas',
      glCanvasResizeToWindow: true,
      onError: () => { isLoaded.value = true },
      onPatchLoaded: () => {},
      onFinishedLoading: () => { isLoaded.value = true },
      canvas: { alpha: true, premultipliedAlpha: true },
      variables: {
        mainVideo: homepageVideo.value || '',
        mainVideoFallbackImage: homepageFallbackImage.value || ''
      }
    })

    cablesPatch.value = patch
    window.CABLES.patch = patch

    canvasElement.value?.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false })
  } catch (error) {
    console.error('Error initializing Cables patch', error)
    isLoaded.value = true
  }
}

const initCablesPatch = () => {
  if (window.CABLES?.patch && cablesPatch.value) {
    window.CABLES.patch.resume?.()
    sendVideoConfig()
    isLoaded.value = true
    return
  }

  if (window.CABLES?.exportedPatch) {
    createPatch()
    return
  }

  const handleCablesLoaded = () => createPatch()
  cablesEventListener.value = handleCablesLoaded
  document.addEventListener('CABLES.jsLoaded', handleCablesLoaded)

  if (document.querySelector('script[data-cables-home]')) {
    if (window.CABLES?.exportedPatch) createPatch()
    return
  }

  const script = document.createElement('script')
  script.src = '/home_video/js/patch.js'
  script.async = true
  script.dataset.cablesHome = 'true'
  script.onerror = () => { isLoaded.value = true }
  document.body.appendChild(script)
}

watch([settingsLoading, homepageVideo, homepageFallbackImage], ([loading, video, fallback]) => {
  if (!loading && (video || fallback) && isLoaded.value) sendVideoConfig()
})

onMounted(() => {
  initCablesPatch()

  if (!isHome.value && window.CABLES?.patch?.pause) {
    window.CABLES.patch.pause()
  }

  setTimeout(() => {
    if (!isLoaded.value) isLoaded.value = true
  }, 3000)
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
  pointer-events: none;
  transition: opacity 0.5s ease-in-out;
}

.home.active.loaded {
  opacity: 1;
  z-index: 0;
  pointer-events: auto;
}

.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
}

.video-background:focus {
  outline: none;
  box-shadow: none;
}

.title-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--text-4xl);
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
  z-index: 0;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.8s ease-in-out 0.1s;
}

.title-text.visible {
  opacity: 1;
}
</style>

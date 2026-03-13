<template>
  <div
    ref="homeContainer"
    class="home"
    :class="{ 'image-loaded': isLoaded }"
  >
    <div class="title-text" :class="{ 'title-fade-in': isLoaded }">
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
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import useGlobalSettings from '../utils/useGlobalSettings'

const route = useRoute()

const { homepageTitle, homepageVideo, homepageFallbackImage, isLoading: settingsLoading } = useGlobalSettings()

const isLoaded = ref(false)
const cablesPatch = ref(null)
const cablesEventListener = ref(null)
const homeContainer = ref(null)
const canvasElement = ref(null)

const setVisibility = (visible) => {
  if (!homeContainer.value || !canvasElement.value) return

  const mainContent = document.querySelector('.main-content')

  if (visible) {
    homeContainer.value.style.display = 'flex'
    homeContainer.value.style.visibility = 'visible'
    homeContainer.value.style.opacity = '1'
    homeContainer.value.style.zIndex = '0'
    homeContainer.value.style.pointerEvents = 'auto'

    canvasElement.value.style.display = 'block'
    canvasElement.value.style.visibility = 'visible'

    if (mainContent) {
      mainContent.style.pointerEvents = 'none'
    }
  } else {
    homeContainer.value.style.opacity = '0'
    homeContainer.value.style.pointerEvents = 'none'
    homeContainer.value.style.zIndex = '-1'

    if (mainContent) {
      mainContent.style.pointerEvents = 'auto'
    }
  }
}

const sendVideoConfig = () => {
  if (window.CABLES && window.CABLES.patch) {
    if (homepageVideo.value) {
      window.CABLES.patch.setVariable('mainVideo', homepageVideo.value)
    }
    if (homepageFallbackImage.value) {
      window.CABLES.patch.setVariable('mainVideoFallbackImage', homepageFallbackImage.value)
    }
  }
}

const createPatch = () => {
  if (!window.CABLES || !window.CABLES.exportedPatch) {
    console.error('Cables is loaded but exported patch is missing')
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
      onError: function () {
        console.error('Cables patch error', arguments)
        isLoaded.value = true
      },
      onPatchLoaded: function () {},
      onFinishedLoading: function () {
        isLoaded.value = true
      },
      canvas: { alpha: true, premultipliedAlpha: true },
      variables: {
        mainVideo: homepageVideo.value || '',
        mainVideoFallbackImage: homepageFallbackImage.value || ''
      }
    })

    cablesPatch.value = patch
    window.CABLES.patch = patch

    if (canvasElement.value) {
      canvasElement.value.addEventListener(
        'touchmove',
        (e) => {
          e.preventDefault()
        },
        { passive: false }
      )
    }
  } catch (error) {
    console.error('Error while initializing Cables patch', error)
    isLoaded.value = true
  }
}

const initCablesPatch = () => {
  if (typeof window === 'undefined') {
    return
  }

  if (window.CABLES && window.CABLES.patch && cablesPatch.value) {
    if (canvasElement.value && window.CABLES.patch.glCanvas) {
      if (typeof window.CABLES.patch.resume === 'function') {
        window.CABLES.patch.resume()
      }
      sendVideoConfig()
      isLoaded.value = true
      return
    }
  }

  if (window.CABLES && window.CABLES.exportedPatch) {
    createPatch()
    return
  }

  const handleCablesLoaded = () => {
    createPatch()
  }

  cablesEventListener.value = handleCablesLoaded
  document.addEventListener('CABLES.jsLoaded', handleCablesLoaded)

  const existingScript = document.querySelector('script[data-cables-home]')
  if (existingScript) {
    if (window.CABLES && window.CABLES.exportedPatch) {
      createPatch()
    }
    return
  }

  const script = document.createElement('script')
  script.src = '/home_video/js/patch.js'
  script.async = true
  script.dataset.cablesHome = 'true'
  script.onerror = () => {
    console.error('Failed to load Cables patch script')
    isLoaded.value = true
  }
  document.body.appendChild(script)
}

const handleRouteChange = (currentRouteName) => {
  const isHome = currentRouteName === 'Home'

  if (isHome) {
    isLoaded.value = true
    setVisibility(true)
    if (window.CABLES && window.CABLES.patch && typeof window.CABLES.patch.resume === 'function') {
      window.CABLES.patch.resume()
    }
  } else {
    isLoaded.value = false
    if (window.CABLES && window.CABLES.patch && typeof window.CABLES.patch.pause === 'function') {
      window.CABLES.patch.pause()
    }
    setVisibility(false)
  }
}

watch(
  () => route.name,
  (newName) => {
    handleRouteChange(newName)
  }
)

watch([settingsLoading, homepageVideo, homepageFallbackImage], ([loading, video, fallback]) => {
  if (!loading && (video || fallback) && isLoaded.value) {
    sendVideoConfig()
  }
})

onMounted(() => {
  isLoaded.value = false

  initCablesPatch()

  handleRouteChange(route.name)

  setTimeout(() => {
    if (!isLoaded.value) {
      console.log('Cables load timeout, showing content anyway')
      isLoaded.value = true
    }
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
  transition: opacity 0.5s ease-in-out;
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

.home:not(.image-loaded) {
  opacity: 0;
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


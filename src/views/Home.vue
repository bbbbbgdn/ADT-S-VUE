<template>
  <div class="home-page" ref="homeContainer"></div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, watch } from 'vue'
import useGlobalSettings from '../utils/useGlobalSettings'

const { homepageTitle, homepageVideo, homepageFallbackImage, isLoading: settingsLoading } = useGlobalSettings()

const isLoaded = ref(false)
const cablesEventListener = ref(null)
const homeContainer = ref(null)
const canvasElement = ref(null)

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

const initCablesPatch = () => {
  if (typeof window === 'undefined') {
    return
  }

  // If a patch already exists, just resume it and update variables
  if (window.CABLES && window.CABLES.patch && window.CABLES.patch.glCanvas) {
    if (typeof window.CABLES.patch.resume === 'function') {
      window.CABLES.patch.resume()
    }
    sendVideoConfig()
    // Wait for the patch to draw at least one frame, then fade in (same as first load)
    let faded = false
    const doFadeIn = () => {
      if (faded) return
      faded = true
      isLoaded.value = true
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(doFadeIn)
    })
    // If Cables is slow to draw, still fade in after a short delay
    setTimeout(doFadeIn, 400)
    return
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

watch([settingsLoading, homepageVideo, homepageFallbackImage], ([loading, video, fallback]) => {
  if (!loading && (video || fallback) && isLoaded.value) {
    sendVideoConfig()
  }
})

onMounted(() => {
  document.documentElement.style.overflowY = 'hidden'
  document.body.style.overflowY = 'hidden'

  initCablesPatch()

  if (typeof window !== 'undefined') {
    canvasElement.value = document.getElementById('home-glcanvas')
  }
})

onBeforeUnmount(() => {
  document.documentElement.style.overflowY = ''
  document.body.style.overflowY = ''

  if (typeof window !== 'undefined') {
    if (cablesEventListener.value) {
      document.removeEventListener('CABLES.jsLoaded', cablesEventListener.value)
      cablesEventListener.value = null
    }

    if (window.CABLES && window.CABLES.patch && typeof window.CABLES.patch.pause === 'function') {
      window.CABLES.patch.pause()
    }
  }
})
</script>

<style scoped>
.home-page {
  min-height: 100svh;
}
</style>

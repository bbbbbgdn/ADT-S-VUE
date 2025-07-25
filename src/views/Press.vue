<template>
  <div class="press-container" :class="{ 'has-active-item': activePressId }">
    <!-- Preload all images with opacity 0 -->
    <div 
      v-for="(yearGroup, year) in groupedPress" 
      :key="year"
      class="year-group"
    >
      <div 
        v-for="press in yearGroup" 
        :key="press.id"
        class="background-image"
        :style="{ 
          backgroundImage: `url(${press.content.Media?.filename})`,
          opacity: currentActiveImage === press.id ? 1 : 0
        }"
      ></div>
    </div>

    <div v-for="(yearGroup, year) in groupedPress" :key="year" class="year-group">
      <BaseButton 
        class="year-button" 
        :disabled="true"
        variant="grey"
      >
        {{ year === 'No Year' ? '' : year }}
      </BaseButton>
      
      <div class="press-items">
        <div 
          v-for="press in yearGroup" 
          :key="press.id" 
          class="press-item"
          :class="{ 'press-item--active': activePressId === press.id }"
        >
          <BaseButton 
            class="media-outlet"
            variant="black"
            @mouseenter="showImage(press.id)"
            @mouseleave="hideImage"
            @click="handlePressItemClick(press.id, press.content.URL.url)"
            :class="{ 'media-outlet--active': activePressId === press.id }"
          >
            {{ press.content.media_outlet }}
          </BaseButton>
          <div 
            class="press-title-scroll"
            :ref="`pressDivider_${press.id}`"
            @mouseenter="handlePressTitleInteract(press.id)"
            @mouseleave="handlePressTitleEnd"
            @scroll="handlePressTitleScroll(press.id)"
            @touchstart="handlePressTitleTouchStart(press.id)"
            @touchend="handlePressTitleTouchEnd(press.id)"
          >
                      <BaseButton 
            class="press-title" 
            :class="{ 'press-title--active': activePressId === press.id }"
            variant="grey"
            @mouseenter="handlePressTitleHover(press.id)"
            @mouseleave="handlePressTitleHoverEnd"
            style="display: inline-block;"
          >
            {{ press.content.press_title }}
          </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed, nextTick, onBeforeUnmount, getCurrentInstance } from 'vue'
import { useStoryblokApi } from '@storyblok/vue'
import BaseButton from '../components/BaseButton.vue'

export default {
  name: 'Press',
  components: {
    BaseButton
  },
  setup() {
    let storyblokApi = null;
    const pressItems = ref([])
    const activeImageId = ref(null)
    const dividerScrollTimeouts = ref({})
    const dividerSpringAnimationIds = ref({})
    const { proxy } = getCurrentInstance();

    // Try to get Storyblok API only if it's available
    try {
      storyblokApi = useStoryblokApi();
    } catch (error) {
      console.warn('Storyblok API is not available:', error);
    }

    const groupedPress = computed(() => {
      const groups = {}
      pressItems.value.forEach(item => {
        const year = item.content.year || 'No Year'
        if (!groups[year]) {
          groups[year] = []
        }
        groups[year].push(item)
      })
      // Сортируем года по убыванию
      return Object.fromEntries(
        Object.entries(groups).sort((a, b) => b[0] - a[0])
      )
    })

    const openPressUrl = (url) => {
      if (url) {
        window.open(url, '_blank')
      }
    }

    const handlePressItemClick = (pressId, url) => {
      // On mobile, just open URL without showing image
      if (isMobile()) {
        openPressUrl(url)
      } else {
        // On desktop, just open URL
        openPressUrl(url)
      }
    }



    // Modified functions to manage image opacity instead of DOM manipulation
    const showImage = (pressId) => {
      // Immediate state update without delays
      activeImageId.value = pressId
      activePressId.value = pressId
      // Only freeze scroll on desktop, not on mobile
      if (!isMobile()) {
        document.body.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.width = '100%'
      }
    }

    const hideImage = () => {
      // Immediate state update without delays
      activeImageId.value = null
      activePressId.value = null
      // Restore scroll
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    const handleTouchStart = (pressId) => {
      showImage(pressId)
    }

    const handleTouchEnd = () => {
      hideImage()
    }

    // --- Scrollback methods for press-item-divider ---
    function getDividerElement(pressId) {
      // Use Vue refs only
      const ref = proxy?.$refs?.[`pressDivider_${pressId}`];
      if (Array.isArray(ref)) return ref[0];
      return ref || null;
    }

    function isMobile() {
      return typeof window !== 'undefined' && window.innerWidth <= 768;
    }

    // Utility to attach scroll handlers only on mobile
    function mobileScrollHandlers(pressId) {
      return {};
    }

    const activePressId = ref(null)
    let springAnimationIds = {}
    let touchActive = ref(false)

    // Computed property to determine which image should be shown
    const currentActiveImage = computed(() => {
      return activePressId.value || activeImageId.value
    })

    function handlePressTitleHover(pressId) {
      // Only handle hover on desktop
      if (!isMobile()) {
        showImage(pressId)
        activePressId.value = pressId
      }
    }
    
    function handlePressTitleHoverEnd() {
      // Only handle hover end on desktop
      if (!isMobile()) {
        hideImage()
      }
    }
    
    function handlePressTitleInteract(pressId) {
      // Only set active press ID on desktop (mouse hover)
      if (!isMobile()) {
        activePressId.value = pressId
      }
    }
    function handlePressTitleEnd() {
      // Only clear if no image is being shown and not on mobile
      if (!activeImageId.value && !isMobile()) {
        activePressId.value = null
      }
    }
    function handlePressTitleScroll(pressId) {
      // Clear any existing timeout for this specific press item
      if (dividerScrollTimeouts.value[pressId]) {
        clearTimeout(dividerScrollTimeouts.value[pressId])
        dividerScrollTimeouts.value[pressId] = null
      }
      
      // Only set active press ID on desktop, not on mobile
      if (!isMobile()) {
        activePressId.value = pressId
      }
      // Reset all other scrollable elements
      resetAllOtherScrollElements(pressId)
      
      // Set timeout for spring return (like in ImageGallery)
      dividerScrollTimeouts.value[pressId] = setTimeout(() => {
        // Only proceed if this is still the active press item
        if (activePressId.value === pressId) {
          animatePressTitleSpringReturn(pressId)
        }
        // Clean up the timeout reference
        dividerScrollTimeouts.value[pressId] = null
      }, 1000) // 1 second delay like in ImageGallery
    }

    function handlePressTitleTouchStart(pressId) {
      // Immediately show image without delays
      touchActive.value = true
      activePressId.value = pressId
      showImage(pressId)
      
      // Clear any existing timeout for this specific press item when touch starts
      if (dividerScrollTimeouts.value[pressId]) {
        clearTimeout(dividerScrollTimeouts.value[pressId])
        dividerScrollTimeouts.value[pressId] = null
      }
      
      // Reset all other scrollable elements
      resetAllOtherScrollElements(pressId)
    }

    function handlePressTitleTouchEnd(pressId) {
      // Immediately hide image and mark touch as inactive
      touchActive.value = false
      hideImage()
      
      // Clear any existing timeout for this specific press item
      if (dividerScrollTimeouts.value[pressId]) {
        clearTimeout(dividerScrollTimeouts.value[pressId])
        dividerScrollTimeouts.value[pressId] = null
      }
      
      // Start spring return immediately on touch end
      if (activePressId.value === pressId) {
        animatePressTitleSpringReturn(pressId)
      }
    }

    function getPressTitleScrollElement(pressId) {
      const ref = proxy?.$refs?.[`pressDivider_${pressId}`]
      if (Array.isArray(ref)) return ref[0]
      return ref || null
    }

    function animatePressTitleSpringReturn(pressId) {
      const el = getPressTitleScrollElement(pressId)
      if (!el) return
      const currentScrollLeft = el.scrollLeft
      if (currentScrollLeft === 0) {
        // If already at position 0, hide image immediately
        hideImage()
        return
      }
      // Use shorter animation duration for quicker response
      startPressTitleSpringAnimation(pressId, currentScrollLeft, 0)
    }

    function startPressTitleSpringAnimation(pressId, startPosition, targetPosition) {
      if (springAnimationIds[pressId]) {
        cancelAnimationFrame(springAnimationIds[pressId])
      }
      const el = getPressTitleScrollElement(pressId)
      if (!el) return
      const startTime = performance.now()
      const duration = 300 // Reduced from 600ms for faster response
      const distance = targetPosition - startPosition
      const easeOutCubic = t => 1 - Math.pow(1 - t, 3)
      const animate = currentTime => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeOutCubic(progress)
        const currentPosition = startPosition + (distance * easedProgress)
        el.scrollLeft = currentPosition
        if (progress < 1) {
          springAnimationIds[pressId] = requestAnimationFrame(animate)
        } else {
          springAnimationIds[pressId] = null
        }
      }
      springAnimationIds[pressId] = requestAnimationFrame(animate)
    }

    function resetAllOtherScrollElements(activePressId) {
      // Get all press items and reset their scroll positions
      pressItems.value.forEach(press => {
        if (press.id !== activePressId) {
          const element = getPressTitleScrollElement(press.id)
          if (element && element.scrollLeft !== 0) {
            // Clear any existing timeout for this press item
            if (dividerScrollTimeouts.value[press.id]) {
              clearTimeout(dividerScrollTimeouts.value[press.id])
              dividerScrollTimeouts.value[press.id] = null
            }
            // Use spring animation to reset to position 0
            startPressTitleSpringAnimation(press.id, element.scrollLeft, 0)
          }
        }
      })
    }


    onMounted(async () => {
      // Check if Storyblok is available
      if (!import.meta.env.VITE_STORYBLOK_PREVIEW_TOKEN || !storyblokApi) {
        console.warn('Storyblok is not available. Press page will be empty.');
        return;
      }
      try {
        const response = await storyblokApi.get('cdn/stories', {
          starts_with: 'press/',
          version: 'draft',
          resolve_links: 'url'
        })
        if (response?.data?.stories) {
          pressItems.value = response.data.stories
        }
      } catch (error) {
        console.error('Error fetching press items:', error)
      }

      // Add global touch end listener as a safety net with immediate response
      const handleGlobalTouchEnd = (event) => {
        // Only handle touch events if they originated from press-title elements
        const target = event.target
        const isPressTitleElement = target.closest('.press-title-scroll') || 
                                   target.closest('.press-title') ||
                                   target.classList.contains('press-title') ||
                                   target.classList.contains('press-title-scroll')
        
        // If not a press-title element, don't interfere
        if (!isPressTitleElement) {
          return
        }
        
        // Don't interfere with button clicks (media-outlet buttons)
        const isButton = target.closest('button') || 
                        target.classList.contains('base-button') ||
                        target.classList.contains('media-outlet')
        
        if (isButton) {
          return
        }
        
        // Additional check: only handle if we're actually in a touch state
        if (!touchActive.value) {
          return
        }
        
        // Prevent default only for press-title elements to avoid any delays
        event.preventDefault()
        
        touchActive.value = false
        hideImage()
      }

      document.addEventListener('touchend', handleGlobalTouchEnd, { passive: false })
      document.addEventListener('touchcancel', handleGlobalTouchEnd, { passive: false })

      // Store cleanup function
      const cleanup = () => {
        document.removeEventListener('touchend', handleGlobalTouchEnd)
        document.removeEventListener('touchcancel', handleGlobalTouchEnd)
      }

      // Add cleanup to component unmount
      onBeforeUnmount(() => {
        cleanup()
      })
    })

    onBeforeUnmount(() => {
      // Clean up all timeouts and animation frames
      Object.values(dividerScrollTimeouts.value).forEach(timeout => timeout && clearTimeout(timeout));
      Object.values(dividerSpringAnimationIds.value).forEach(id => id && cancelAnimationFrame(id));
      
      // Clean up press title scroll timeouts and animations
      Object.values(springAnimationIds).forEach(id => id && cancelAnimationFrame(id))

      // Ensure image is hidden when component unmounts
      hideImage()
    });

    return {
      groupedPress,
      openPressUrl,
      activeImageId,
      currentActiveImage,
      showImage,
      hideImage,
      handleTouchStart,
      handleTouchEnd,
      handlePressItemClick,
      mobileScrollHandlers,
      activePressId,
      touchActive,
      handlePressTitleHover,
      handlePressTitleHoverEnd,
      handlePressTitleInteract,
      handlePressTitleEnd,
      handlePressTitleScroll,
      handlePressTitleTouchStart,
      handlePressTitleTouchEnd
    }
  }
}
</script>

<style scoped>
.press-container {
  margin: 0rem var(--space-md);
  position: relative;
  z-index: 10;
  /* mix-blend-mode: difference; */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-md); /* Add gap between year groups */
}

/* Modified styles for background images */
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  z-index: 1;
  transition: opacity .3s ease-out;
  /* Add padding to avoid covering year buttons */
  padding-left: calc(var(--space-md) + 120px); /* Adjust based on year button width */
}


/* .fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
} */

.year-group {
  display: grid;
  grid-template-columns: auto 1fr; 
  gap: var(--space-md);
}

.year-button {
  align-self: flex-start; 
  z-index: 20; /* Ensure year buttons stay above background images */
  pointer-events: none;
  position: relative; /* Ensure z-index works properly */
}

.press-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.press-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.press-item:hover .press-title {
  background-color: black !important;
  color: white !important;
  cursor: pointer !important;
}

.press-item:hover .button-black {
  background-color: var(--color-pink-primary);
  color: black;
}

.media-outlet {
  min-width: fit-content !important;
}

/* Add CSS for .press-title-scroll to match .gallery-tags */
.press-title-scroll {
  overflow-x: auto;
  white-space: nowrap;
  max-width: 100vw;
  flex: 1;
}
.press-title-scroll::-webkit-scrollbar {
  display: none;
}
.press-title {
  display: inline-block;
  white-space: nowrap;
  font-size: 1rem;
  font-family: inherit;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

.press-item-divider {
  flex: 1;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  touch-action: pan-x;
}
.press-item-divider::-webkit-scrollbar {
  display: none;
}
@media screen and (max-width: 768px) {
  .press-item {
    flex-direction: row;
    align-items: stretch;
  }
  .press-item-divider {
    padding: 0 var(--space-lg) 0 0;
  }

  .base-button {
    margin: 0 var(--space-md);
  }

  .press-container {
    padding:0;
    margin: 0px;
    /* padding-left: var(--space-md); */
    /* overflow: visible; */
    /* margin-right: var(--space-md); */
  }

  /* Mobile-specific background image styles to prevent scroll interference */
  .background-image {
    /* z-index: 1; */
    pointer-events: none;
    touch-action: none;
    background-size: cover;
    /* z-index: -1; */
    /* On mobile, add top padding to avoid covering year buttons */
    padding-left: 0;
    padding-top: calc(var(--space-md) + 60px); /* Adjust based on year button height */
  }

  .year-group {
    display: flex;
    flex-direction: column;
    grid-template-columns: none; /* Remove grid on mobile */
  }

  .year-button {
    z-index: 20; /* Ensure year buttons stay above background images on mobile */
    position: relative;
  }

  .press-items {
    display: flex;
    flex-direction: column;
    /* margin-left: var(--space-md); */
    overflow: visible;
  }

  .press-item {
    flex-direction: column;
    align-items: flex-start;
    /* width: 100%; */
  }

  .press-title-scroll {
    touch-action: pan-x;
    -webkit-overflow-scrolling: touch;
  }

  .media-outlet,
  .press-title {
    margin-right: var(--space-sm);
    /* width: 100%; */
    /* max-width: 100%; */
  }
}

.media-outlet--active {
  outline-offset: 2px;
  background: var(--color-pink-primary) !important;
  color: black !important;
  position: relative;
  z-index: 20;
}

/* Active press title - remove backdrop filter to prevent flashing */
.press-title--active {
  /* background: var(--color-pink-primary); */
  transition: all 0.3s ease-out;
  opacity: 1;
  background-color: rgb(0, 0, 0) !important;
  color: #fff;
  position: relative;
  z-index: 20;
}

/* Active press title scroll container - above image */
.press-title-scroll {
  position: relative;
  z-index: 15;
}

/* Non-active press items fall to background */
.press-item {
  position: relative;
  z-index: 5;
}

/* Active press item - above image */
.press-item--active {
  z-index: 15;
}

/* Mobile: Hide non-active press items when any item is active */
@media screen and (max-width: 768px) {
  .press-container.has-active-item .press-item:not(.press-item--active) {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease-out;
  }
  
  .press-container.has-active-item .year-button {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease-out;
  }
}

/* Ensure all grey buttons in press component have backdrop filter */
.press-container .button-grey {
  backdrop-filter: blur(50px) !important;
  -webkit-backdrop-filter: blur(50px) !important;
  background-color: rgba(195, 195, 195, 0.8) !important; /* Fallback for browsers without backdrop-filter */
  color: rgb(0, 0, 0) !important;
}

/* Fallback for browsers that don't support backdrop-filter */
@supports not (backdrop-filter: blur(50px)) {
  .press-container .button-grey {
    background-color: rgba(195, 195, 195, 0.9) !important;
  }
}
</style>

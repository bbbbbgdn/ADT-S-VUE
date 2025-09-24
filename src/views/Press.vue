<template>
  <div class="press-container" :class="{ 'has-active-item': activePressId }">
    <!-- Preload all images with opacity 0 -->
    <div 
      v-for="entry in groupedPress" 
      :key="entry.year"
      class="year-group"
    >
      <div 
        v-for="press in entry.items" 
        :key="press.id"
        class="background-image"
        :style="{ 
          backgroundImage: `url(${press.content.Media?.filename})`,
          opacity: currentActiveImage === press.id ? 1 : 0
        }"
      ></div>
    </div>

    <div v-for="entry in groupedPress" :key="entry.year" class="year-group">
      <BaseButton 
        class="year-button" 
        :disabled="true"
        variant="grey"
      >
        {{ entry.year === 'No Year' ? '' : entry.year }}
      </BaseButton>
      
      <div class="press-items">
        <div
          v-for="press in entry.items"
          :key="press.id"
          class="press-item"
          :class="{ 'press-item--active': activePressId === press.id }"
          v-on="{ click: !isMobile() ? () => handlePressItemRowClick(press) : null }"
        >
          <BaseButton
            class="media-outlet"
            variant="black"
            v-on="{ mouseenter: !isMobile() ? () => showImage(press.id) : null, mouseleave: !isMobile() ? hideImage : null }"
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
import { fetchAllStories } from '../utils/storyblokPagination'
import BaseButton from '../components/BaseButton.vue'

export default {
  name: 'Press',
  components: {
    BaseButton
  },
  setup() {
    const pressItems = ref([])
    const activeImageId = ref(null)
    const dividerScrollTimeouts = ref({})
    const dividerSpringAnimationIds = ref({})
    const { proxy } = getCurrentInstance();

    // We'll use the pagination utility instead of the service

    const groupedPress = computed(() => {
      // Force reactivity by accessing pressItems.value
      const items = [...pressItems.value]

      const yearToItemsMap = {}
      items.forEach(item => {
        const year = item.content.year || 'No Year'
        if (!yearToItemsMap[year]) {
          yearToItemsMap[year] = []
        }
        yearToItemsMap[year].push(item)
      })

      // Build ordered array of { year, items }
      const entries = Object.entries(yearToItemsMap).map(([year, groupItems]) => ({
        year,
        items: groupItems
      }))

      // Sort years explicitly as numbers where possible, keeping 'No Year' first
      entries.sort((a, b) => {
        if (a.year === 'No Year') return -1
        if (b.year === 'No Year') return 1
        return parseInt(b.year) - parseInt(a.year) // descending: newest → oldest
      })

      // Sort items within each year by first published date (newest first)
      entries.forEach(entry => {
        // Log items before sorting for debugging
        console.log(`Press items for year ${entry.year}:`, entry.items.map(item => ({
          id: item.id,
          title: item.content.press_title,
          first_published_at: item.first_published_at,
          created_at: item.created_at
        })))

        entry.items.sort((x, y) => {
          // Use first_published_at for sorting by first published date, fallback to created_at
          const dateX = new Date(x.first_published_at || x.created_at || x.published_at || '1970-01-01')
          const dateY = new Date(y.first_published_at || y.created_at || y.published_at || '1970-01-01')

          // Sort by first published date (newest first within each year)
          const dateDiff = dateY.getTime() - dateX.getTime()
          if (dateDiff !== 0) return dateDiff

          // Fallback to ID for stability if dates are identical
          return String(y.id).localeCompare(String(x.id))
        })

        // Log items after sorting for debugging
        console.log(`Sorted press items for year ${entry.year}:`, entry.items.map(item => ({
          id: item.id,
          title: item.content.press_title,
          first_published_at: item.first_published_at,
          created_at: item.created_at
        })))
      })

      return entries
    })

    const openPressUrl = (url) => {
      if (url) {
        window.open(url, '_blank')
      }
    }

    const handlePressItemClick = (pressId, url) => {
      console.log('handlePressItemClick called', { pressId, url, isMobile: isMobile() })

      // Always open URL regardless of device type
      if (url) {
        console.log('Opening URL:', url)
        try {
          window.open(url, '_blank')
        } catch (error) {
          console.error('Error opening URL:', error)
          // Fallback: try opening in same window
          window.location.href = url
        }
      } else {
        console.warn('No URL provided for press item:', pressId)
      }
    }

    const handlePressItemRowClick = (press) => {
      if (isMobile()) return
      if (activePressId.value !== press.id) return
      const url = press?.content?.URL?.url
      if (url) {
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
      console.log('handlePressTitleScroll called for pressId:', pressId, 'isMobile:', isMobile())

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
      
      // Set timeout for spring return (same as ImageGallery)
      // Use 1000ms delay consistently like in Shows.vue
      dividerScrollTimeouts.value[pressId] = setTimeout(() => {
        // On mobile, always animate since we don't use active states
        // On desktop, only proceed if this is still the active press item
        if (isMobile() || activePressId.value === pressId) {
          animatePressTitleSpringReturn(pressId)
        }
        // Clean up the timeout reference
        dividerScrollTimeouts.value[pressId] = null
      }, 1000) // Same 1000ms delay as ImageGallery
    }

    function handlePressTitleTouchStart(pressId) {
      // On mobile, don't show image - just handle scrolling
      if (!isMobile()) {
        // Immediately show image without delays
        touchActive.value = true
        activePressId.value = pressId
        showImage(pressId)
      }

      // Clear any existing timeout for this specific press item when touch starts
      if (dividerScrollTimeouts.value[pressId]) {
        clearTimeout(dividerScrollTimeouts.value[pressId])
        dividerScrollTimeouts.value[pressId] = null
      }

      // Reset all other scrollable elements
      resetAllOtherScrollElements(pressId)
    }

    function handlePressTitleTouchEnd(pressId) {
      // On mobile, don't hide image since we don't show it
      if (!isMobile()) {
        // Immediately hide image and mark touch as inactive
        touchActive.value = false
        hideImage()
      }

      // Clear any existing timeout for this specific press item
      if (dividerScrollTimeouts.value[pressId]) {
        clearTimeout(dividerScrollTimeouts.value[pressId])
        dividerScrollTimeouts.value[pressId] = null
      }

      // Start spring return after delay (same as ImageGallery)
      setTimeout(() => {
        // On mobile, always animate since we don't use active states
        // On desktop, only proceed if this is still the active press item
        if (isMobile() || activePressId.value === pressId) {
          animatePressTitleSpringReturn(pressId)
        }
      }, 1000) // Same 1000ms delay as ImageGallery touch end
    }

    function getPressTitleScrollElement(pressId) {
      const ref = proxy?.$refs?.[`pressDivider_${pressId}`]
      if (Array.isArray(ref)) return ref[0]
      return ref || null
    }

    function animatePressTitleSpringReturn(pressId) {
      console.log('animatePressTitleSpringReturn called for pressId:', pressId, 'isMobile:', isMobile())

      const el = getPressTitleScrollElement(pressId)
      if (!el) {
        console.log('No element found for pressId:', pressId)
        return
      }
      const currentScrollLeft = el.scrollLeft
      console.log('Current scroll position:', currentScrollLeft)

      if (currentScrollLeft === 0) {
        // If already at position 0, hide image immediately (only on desktop)
        if (!isMobile()) {
          hideImage()
        }
        return
      }

      // On mobile, don't animate - just reset immediately to avoid scroll interference
      if (isMobile()) {
        el.scrollLeft = 0
        return
      }

      // Use shorter animation duration for quicker response on desktop
      startPressTitleSpringAnimation(pressId, currentScrollLeft, 0)
    }

    function startPressTitleSpringAnimation(pressId, startPosition, targetPosition) {
      if (springAnimationIds[pressId]) {
        cancelAnimationFrame(springAnimationIds[pressId])
      }
      const el = getPressTitleScrollElement(pressId)
      if (!el) return
      const startTime = performance.now()
      const duration = 600 // Same 600ms duration as ImageGallery
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
      // On mobile, don't reset other elements to avoid scroll interference
      if (isMobile()) {
        return
      }

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
      try {
        // Fetch all press items using pagination
        const allPressItems = await fetchAllStories({
          starts_with: 'press/',
          version: 'published',
          extraParams: { resolve_links: 'url' }
        });
        
        pressItems.value = allPressItems;
        console.log(`✅ Loaded ${allPressItems.length} press items in total`);
        
        // Debug: log the loaded data with creation dates
        console.log('Press items by first published date:', pressItems.value.map(item => ({
          id: item.id,
          year: item.content.year,
          title: item.content.press_title,
          url: item.content.URL?.url,
          first_published_at: item.first_published_at,
          created_at: item.created_at,
          published_at: item.published_at
        })))
      } catch (error) {
        console.error('Error fetching all press items:', error);
      }

      // Add global touch end listener as a safety net with immediate response
      const handleGlobalTouchEnd = (event) => {
        // On mobile, don't interfere with scrolling - let natural touch behavior work
        if (isMobile()) {
          return
        }

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
        // Use same timing as ImageGallery for consistency
        setTimeout(() => {
          hideImage()
        }, 1000) // Same 1000ms delay as ImageGallery
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
      handlePressTitleTouchEnd,
      handlePressItemRowClick,
      isMobile
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
  margin-bottom: var(--space-md);
}

.press-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  cursor: default;
}

@media screen and (min-width: 769px) {
  .press-item {
    cursor: pointer;
  }
}

@media screen and (min-width: 769px) {
  .press-item:hover .press-title {
    background-color: black !important;
    color: white !important;
    cursor: pointer !important;
  }
}

@media screen and (min-width: 769px) {
  .press-item:hover .button-black {
    background-color: var(--color-pink-primary);
    color: black;
  }
}

.media-outlet {
  min-width: fit-content !important;
  pointer-events: auto !important;
  cursor: pointer !important;
}

/* Add CSS for .press-title-scroll to match .gallery-tags behavior */
.press-title-scroll {
  overflow-X: scroll;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  /* Hide scrollbars for all browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  overflow: -moz-scrollbars-none; /* Firefox (older versions) */
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


@media screen and (max-width: 768px) {
  .press-item {
    flex-direction: row;
    align-items: stretch;
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
    pointer-events: none;
    touch-action: none;
    background-size: cover;
    /* Ensure background doesn't interfere with scrolling */
    z-index: -1;
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
    /* Ensure scrolling works properly on mobile */
    position: relative;
    z-index: 10;
    /* Make sure touch events are not blocked */
    pointer-events: auto;
  }

  .media-outlet,
  .press-title {
    margin-right: var(--space-sm);
    /* width: 100%; */
    /* max-width: 100%; */
  }

  .media-outlet {
    pointer-events: auto !important;
    cursor: pointer !important;
    touch-action: manipulation !important;
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
  cursor: pointer;
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

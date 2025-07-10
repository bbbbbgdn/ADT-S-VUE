<template>
  <div class="press-container">
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
          opacity: activeImageId === press.id ? 1 : 0
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
          class="press-item-divider"
          :ref="`pressDivider_${press.id}`"
          v-bind="mobileScrollHandlers(press.id)"
        >
          <div 
            class="press-item"
            @mouseenter="showImage(press.id)"
            @mouseleave="hideImage"
            @touchstart="handleTouchStart(press.id)"
            @touchend="handleTouchEnd"
            @touchcancel="hideImage"
            @click="openPressUrl(press.content.URL.url)"
          >
            <BaseButton 
              class="media-outlet"
              variant="black"
            >
              {{ press.content.media_outlet }}
            </BaseButton>
            
            <BaseButton 
              class="press-title" 
              variant="grey"
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

    // Modified functions to manage image opacity instead of DOM manipulation
    const showImage = (pressId) => {
      activeImageId.value = pressId
      // Freeze scroll
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    }

    const hideImage = () => {
      activeImageId.value = null
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
    function handleDividerScroll(pressId) {
      if (!isMobile()) return;
      clearTimeout(dividerScrollTimeouts.value[pressId]);
      dividerScrollTimeouts.value[pressId] = setTimeout(() => {
        animateDividerSpringReturn(pressId);
      }, 1000); // 1 second timeout
    }

    function handleDividerTouchStart(pressId) {
      if (!isMobile()) return;
      clearTimeout(dividerScrollTimeouts.value[pressId]);
    }

    function handleDividerTouchEnd(pressId) {
      if (!isMobile()) return;
      clearTimeout(dividerScrollTimeouts.value[pressId]);
      dividerScrollTimeouts.value[pressId] = setTimeout(() => {
        animateDividerSpringReturn(pressId);
      }, 1000); // 1 second timeout
    }

    function animateDividerSpringReturn(pressId) {
      const dividerElement = getDividerElement(pressId);
      if (!dividerElement) return;
      const currentScrollLeft = dividerElement.scrollLeft;
      if (currentScrollLeft === 0) return;
      startDividerSpringAnimation(pressId, currentScrollLeft, 0);
    }

    function startDividerSpringAnimation(pressId, startPosition, targetPosition) {
      if (dividerSpringAnimationIds.value[pressId]) {
        cancelAnimationFrame(dividerSpringAnimationIds.value[pressId]);
      }
      const dividerElement = getDividerElement(pressId);
      if (!dividerElement) return;
      const startTime = performance.now();
      const duration = 600;
      const distance = targetPosition - startPosition;
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentPosition = startPosition + (distance * easedProgress);
        dividerElement.scrollLeft = currentPosition;
        if (progress < 1) {
          dividerSpringAnimationIds.value[pressId] = requestAnimationFrame(animate);
        } else {
          dividerSpringAnimationIds.value[pressId] = null;
        }
      };
      dividerSpringAnimationIds.value[pressId] = requestAnimationFrame(animate);
    }

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
      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        return {
          onScroll: () => handleDividerScroll(pressId),
          onTouchstart: () => handleDividerTouchStart(pressId),
          onTouchend: () => handleDividerTouchEnd(pressId)
        };
      }
      return {};
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
    })

    onBeforeUnmount(() => {
      // Clean up all timeouts and animation frames
      Object.values(dividerScrollTimeouts.value).forEach(timeout => timeout && clearTimeout(timeout));
      Object.values(dividerSpringAnimationIds.value).forEach(id => id && cancelAnimationFrame(id));
    });

    return {
      groupedPress,
      openPressUrl,
      activeImageId,
      showImage,
      hideImage,
      handleTouchStart,
      handleTouchEnd,
      mobileScrollHandlers
    }
  }
}
</script>

<style scoped>
.press-container {
  margin: 0rem var(--space-md);
  position: relative;
  /* mix-blend-mode: difference; */
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
  z-index: -1;
  transition: opacity .3s ease-out;
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
}

.press-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.press-item {
  display: flex;
  gap: var(--space-md);
  width: fit-content;
  align-items: center;
  cursor: pointer;
  /* transition: all 0.3s ease; */
  position: relative;
  z-index: 1;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: manipulation;
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

.press-title {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: auto;
  color: black !important;
  border: none !important;
  justify-content: flex-start !important;
  cursor: pointer !important;

  /* margin-left: -81rem; */

  /* max-width: 98.5vw; */
  /* max-width: 81.5vw; */
  /* transition: all 0.3s ease; */
 
}

.press-item-divider {
  width: 100vw;
  /* padding: 0 var(--space-lg) 0 0; */
}
@media screen and (max-width: 768px) {
  .press-item-divider {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    padding: 0 var(--space-lg) 0 0;
  }
  .press-item-divider::-webkit-scrollbar {
    display: none;
  }
}

@media screen and (max-width: 768px) {

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

  .background-image {
    display: none;
  }

  .year-group {
    display: flex;
    flex-direction: column;
    grid-template-columns: none; /* Remove grid on mobile */
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

  .media-outlet,
  .press-title {
    margin-right: var(--space-sm);
    /* width: 100%; */
    /* max-width: 100%; */
  }
}
</style>

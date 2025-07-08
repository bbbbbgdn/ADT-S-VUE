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
</template>

<script>
import { onMounted, ref, computed } from 'vue'
import { useStoryblokApi } from '@storyblok/vue'
import BaseButton from '../components/BaseButton.vue'

export default {
  name: 'Press',
  components: {
    BaseButton
  },
  setup() {
    const storyblokApi = useStoryblokApi()
    const pressItems = ref([])
    const activeImageId = ref(null)

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

    onMounted(async () => {
      // Check if Storyblok is available
      if (!import.meta.env.VITE_STORYBLOK_PREVIEW_TOKEN) {
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

    return {
      groupedPress,
      openPressUrl,
      activeImageId,
      showImage,
      hideImage,
      handleTouchStart,
      handleTouchEnd
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
  max-width: 81.5vw;
  /* transition: all 0.3s ease; */
}

@media screen and (max-width: 768px) {
  .background-image {
    display: none;
  }
  .press-container {
    /* padding: var(--space-sm); */
  }

  .year-group {
    display: flex;
    flex-direction: column;
    grid-template-columns: none; /* Remove grid on mobile */
  }

  .press-items {
    display: flex;
    flex-direction: column;
  }

  .press-item {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .media-outlet,
  .press-title {
    /* width: 100%; */
    max-width: 100%;
  }
}
</style>

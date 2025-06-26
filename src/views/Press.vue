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
      console.log('Show image called with press ID:', pressId)
      activeImageId.value = pressId
    }

    const hideImage = () => {
      console.log('Hide image called')
      activeImageId.value = null
    }

    onMounted(async () => {
      try {
        const response = await storyblokApi.get('cdn/stories', {
          starts_with: 'press/',
          version: 'draft',
          resolve_links: 'url'
        })
        
        if (response?.data?.stories) {
          pressItems.value = response.data.stories
          // Добавляем подробный лог первого элемента
          console.log('First press item full content:', pressItems.value[0]?.content)
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
      hideImage
    }
  }
}
</script>

<style scoped>
.press-container {
  margin: 0rem var(--space-md);
  position: relative;
  mix-blend-mode: difference;
}

/* Modified styles for background images */
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
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
  /* transition: all 0.3s ease; */
}

/* @media (max-width: 768px) {
  .press-container {
    padding: var(--space-sm);
  }
  
  .year-group {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }

  .press-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .media-outlet,
  .press-title {
    width: 100%;
  }
} */
</style>

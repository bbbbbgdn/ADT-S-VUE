<script setup>
import { useStoryblokApi } from '@storyblok/vue';
import { ref, onMounted, computed, nextTick } from 'vue';
import ImageGallery from '../components/ImageGallery.vue';
import { useRouter } from 'vue-router';
import { formatImages as storyblokFormatImages } from '../utils/storyblok';
import { createImageSettings } from '../utils/imageSettings';

let storyblokApi = null;
const stories = ref([]);
const router = useRouter();
const visibleStories = ref(new Set());
const loadingStories = ref(new Set());

// Try to get Storyblok API only if it's available
try {
  storyblokApi = useStoryblokApi();
} catch (error) {
  console.warn('Storyblok API is not available:', error);
}

// Create image settings using our utility with the thumbnail preset for gallery
const imageSettings = createImageSettings('thumbnail');

  // Function to format date range
  const formatDateRange = (show) => {
    const startDate = show.content?.start_date;
    const endDate = show.content?.end_date;

    if (!startDate || !endDate) {
      return show.content?.date_tag || '';
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}.${month}.${year}`;
    };

    return `${formatDate(start)}-${formatDate(end)}`;
  };

  // Function to check if a show is currently ongoing
  const isShowOngoing = (show) => {
    const now = new Date();
    const startDate = new Date(show.content?.start_date || '1970-01-01');
    const endDate = new Date(show.content?.end_date || '2099-12-31');

    // Show is ongoing if current date is between start and end dates
    return now >= startDate && now <= endDate;
  };

// Computed property to get the actual height in pixels for the container
const containerHeight = computed(() => {
  // Make galleries 2x smaller vertically
  const smallerHeight = imageSettings.height / 2;
  return `${smallerHeight}rem`;
});

onMounted(async () => {
  // Check if Storyblok is available
  if (!import.meta.env.VITE_STORYBLOK_PREVIEW_TOKEN || !storyblokApi) {
    console.warn('Storyblok is not available. Shows page will be empty.');
    return;
  }
  
  try {
    const response = await storyblokApi.get('cdn/stories', {
      starts_with: 'shows/',
      version: 'published'
    });
    if (response?.data?.stories) {
      stories.value = response.data.stories;
      // Set up intersection observer for lazy loading galleries after DOM is ready
      await nextTick();
      setupGalleryObserver();
    }
  } catch (error) {
    console.error('Error fetching stories:', error);
  }
});

// Simplified intersection observer setup
const setupGalleryObserver = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const storyId = entry.target.dataset.storyId;
        if (entry.isIntersecting) {
          // Gallery is visible, add to visible stories
          console.debug(`[Shows] Story ${storyId} is now visible`);
          visibleStories.value.add(storyId);
          loadingStories.value.add(storyId);
          
          // Remove from loading after a timeout to prevent stuck states
          setTimeout(() => {
            loadingStories.value.delete(storyId);
          }, 10000); // 10 second timeout
        } else {
          console.debug(`[Shows] Story ${storyId} is no longer visible`);
          // Don't remove from visibleStories immediately to prevent flickering
        }
      });
    },
    {
      rootMargin: '200px', // Reduced margin for better performance
      threshold: 0.1
    }
  );

  // Observe all story placeholders
  const placeholders = document.querySelectorAll('.story-placeholder');
  console.debug(`[Shows] Setting up observer for ${placeholders.length} story placeholders`);
  placeholders.forEach(placeholder => {
    observer.observe(placeholder);
  });
};

// Use the utility function from storyblok.js with our settings
const formatImages = (visuals, customOptions = {}) => {
  // Merge default settings with any custom options
  const options = {
    ...imageSettings,
    ...customOptions
  };
  
  return storyblokFormatImages(visuals, options);
};

// Handle gallery loading errors
const handleGalleryError = (storyId) => {
  console.warn(`[Shows] Gallery ${storyId} encountered an error, will retry`);
  // Remove from loading to allow retry
  loadingStories.value.delete(storyId);
  // Remove from visible to trigger re-render
  visibleStories.value.delete(storyId);
  
  // Retry after a short delay
  setTimeout(() => {
    visibleStories.value.add(storyId);
  }, 1000);
};

// Handle gallery loading success
const handleGallerySuccess = (storyId) => {
  console.debug(`[Shows] Gallery ${storyId} loaded successfully`);
  loadingStories.value.delete(storyId);
};

</script>

<template>
  <div class="shows">
    <div 
      v-for="story in stories" 
      :key="story.uuid"
      class="story-placeholder"
      :data-story-id="story.uuid"
    >
      <!-- Show loading indicator while gallery is loading -->
      <div 
        v-if="loadingStories.has(story.uuid) && !visibleStories.has(story.uuid)"
        class="gallery-loading"
        :style="{ height: containerHeight }"
      >
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading gallery...</div>
      </div>
      
      <!-- Only render ImageGallery when story is visible -->
      <ImageGallery
        v-else-if="visibleStories.has(story.uuid)"
        :images="formatImages(story.content?.visuals)"
        :name="story.content?.title_tag"
        :location="story.content?.location_tag"
        :date="formatDateRange(story)"
        :slug="story.slug"
        :isOngoing="isShowOngoing(story)"
        :repeatCount="1"
        :imageHeight="containerHeight"
        :imageWidth="'auto'"
        :imageQuality="imageSettings.quality"
        :imageFormat="imageSettings.format"
        :resolutionRatio="imageSettings.resolutionRatio"
        :enableAutoScroll="true"
        :speedRandomness="0.3"
        :style="{ '--mobile-gallery-height': '22svh' }"
        @gallery-error="handleGalleryError(story.uuid)"
        @gallery-success="handleGallerySuccess(story.uuid)"
      />
      
      <!-- Placeholder while gallery is not visible -->
      <div 
        v-else 
        class="gallery-placeholder"
        :style="{ height: containerHeight }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.shows {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.story-placeholder {
  width: 100%;
}

.gallery-placeholder {
  width: 100%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.9rem;
}

.gallery-loading {
  width: 100%;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.9rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}

.loading-text {
  font-size: 0.8rem;
  color: #999;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

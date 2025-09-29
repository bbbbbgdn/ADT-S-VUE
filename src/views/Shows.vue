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
    const startDate = show.content?.start_date;
    const endDate = show.content?.end_date;

    // Only consider shows with both start and end dates as potentially ongoing
    // Year-only shows (old shows) should never be marked as ongoing
    if (!startDate || !endDate) {
      return false;
    }

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Show is ongoing if current date is between start and end dates
    return now >= start && now <= end;
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


</script>

<template>
  <div class="shows">
    <div 
      v-for="story in stories" 
      :key="story.uuid"
      class="story-placeholder"
      :data-story-id="story.uuid"
    >
      <!-- Only render ImageGallery when story is visible -->
      <ImageGallery
        v-if="visibleStories.has(story.uuid)"
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

</style>

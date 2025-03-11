<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ImageGallery from '../components/ImageGallery.vue';
import useStoryblok from '../utils/useStoryblok';
import { isPreviewMode } from '../utils/storyblok';

const router = useRouter();

// Use our Storyblok composable for shows
const {
  stories,
  isLoading,
  contentReady,
  errorMessage,
  formatImages,
  isPreview
} = useStoryblok({
  type: 'show',
  preload: true,
  watchRoute: false
});

// Format images for the gallery
const formatGalleryImages = (visuals, width = 800, height = 600) => {
  if (!visuals || !Array.isArray(visuals)) return [];
  
  return formatImages(visuals, { 
    width: 0, 
    height: 230, 
    quality: 70 
  });
};
</script>

<template>
  <div class="shows">
    <!-- Preview mode indicator -->
    <div v-if="isPreview" class="preview-mode-indicator">
      <span>Preview Mode</span>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="loading">
      Loading shows...
    </div>
    
    <!-- Error message -->
    <div v-if="errorMessage && !isLoading" class="error-message">
      {{ errorMessage }}
    </div>
    
    <!-- Shows content -->
    <div v-if="contentReady && stories.length > 0" class="shows-content">
      <div v-for="story in stories" :key="story.uuid">
        <ImageGallery 
          :images="formatGalleryImages(story.content.visuals)"
          :name="story.content?.title_tag"
          :location="story.content?.location_tag"
          :date="story.content?.date_tag"
          :slug="story.slug"
          :repeatCount="5"
        />
      </div>
    </div>
    
    <!-- No shows message -->
    <div v-if="contentReady && stories.length === 0" class="no-shows-message">
      No shows available
    </div>
  </div>
</template>

<style scoped>
.shows {
  position: relative;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-style: italic;
}

.error-message {
  text-align: center;
  padding: 1rem;
  margin: 1rem auto;
  max-width: 800px;
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 4px;
  color: #856404;
}

.no-shows-message {
  text-align: center;
  padding: 2rem;
  margin: 2rem auto;
  background-color: #f8f8f8;
  border-radius: 8px;
}

/* Preview mode indicator */
.preview-mode-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ff6b6b;
  color: white;
  text-align: center;
  padding: 0.5rem;
  font-weight: bold;
  z-index: 1000;
}
</style>

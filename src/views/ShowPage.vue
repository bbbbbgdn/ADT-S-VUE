<script setup>
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '../components/BaseButton.vue';
import ImageGallery from '../components/ImageGallery.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import { renderRichText } from "@storyblok/vue";
import useStoryblok from '../utils/useStoryblok';

// Use our Storyblok composable with 'show' type
const {
  story,
  stories: otherShows,
  isLoading,
  contentReady,
  errorMessage,
  formatImage,
  formatImages,
  navigateTo
} = useStoryblok({
  type: 'show',
  preload: true,
  watchRoute: true
});

// Handle navigation to another show
const navigateToShow = (slug) => {
  navigateTo(slug);
};
</script>

<template>
  <div class="show-page">
    <!-- Content area with loading state -->
    <div class="content-area">
      <LoadingIndicator :isLoading="isLoading" />
      
      <!-- Error message display for complete failure -->
      <div v-if="errorMessage && !story && !isLoading" class="error-message">
        <p>{{ errorMessage }}</p>
        <p>Redirecting to shows page...</p>
        <BaseButton to="/shows">Go to Shows</BaseButton>
      </div>
      
      <div v-if="story && contentReady" class="content-container" :class="{ 'content-visible': !isLoading }">
        <!-- Show warning message if using fallback -->
        <div v-if="errorMessage" class="warning-message">
          <p>{{ errorMessage }}</p>
        </div>
        
        <ImageGallery
          v-if="story.content?.visuals && story.content.visuals.length > 0"
          :name="story.content?.title_tag || ''"
          :location="story.content?.location_tag || ''"
          :date="story.content?.date_tag || ''"
          :slug="story.slug"
          :images="formatImages(story.content.visuals, { width: 0, height: 230, quality: 70 })"
          :repeatCount="1"
          :isActive="true"
        />
        
        <!-- Fallback message if no visuals -->
        <div v-else class="no-images-message">
          <p>No images available for this show</p>
        </div>
        
        <div class="description" >
          {{ story.content?.main_text || 'No Description Available' }}
        </div>
        <div class="credits-container">
          <div class="credits" v-html="renderRichText(story.content?.info_text || '')">
          </div>
        </div>
        <div class="button-container">
          <BaseButton to="/shows">Other Shows</BaseButton>
        </div>
        
        <h2 class="other-shows-title">Other Shows</h2>
        
        <div v-if="otherShows && otherShows.length > 0" class="other-shows-container">
          <div v-for="show in otherShows" :key="show.id">
            <ImageGallery
              :name="show.content?.title_tag || 'Untitled Show'"
              :location="show.content?.location_tag || ''"
              :date="show.content?.date_tag || ''"
              :slug="show.slug"
              :images="formatImages(show.content.visuals, { width: 0, height: 230, quality: 70 })"
              :repeatCount="1"
            />
          </div>
        </div>
        
        <div v-else class="no-shows-message">
          <p>No other shows available</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Content area that contains both loading and content */
.content-area {
  position: relative;
  min-height: 80vh;
}

/* Content visibility transition */
.content-container {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.content-visible {
  opacity: 1;
}

h1 {
  font-size: 2rem;
  margin: 20px 0;
}

.description {
  width: 100%;
  padding: 20px;
  margin: 30px;
  box-sizing: border-box;
  overflow-y: auto;
  font-size: 30px;
}

.credits-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.credits {
  column-count: 2;
  column-gap: 20px;
  width: 80%;
  text-align: left;
  margin: 0 10px;
}

p {
  font-size: 22rem;
  margin: 5px 0;
  text-align: justify;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-container img {
  width: 200px;
  height: 600px;
  object-fit: cover;
  border-radius: 5px;
}

.gallery-item img{
  height: 55vh;
}

.button-container {
  margin: 2rem;
}

.other-shows-title {
  margin: 4rem 0 2rem 0;
  text-align: center;
  font-size: 1.8rem;
}

.other-shows-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 100%;
}

/* Error message styling */
.error-message {
  text-align: center;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-message p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

/* Warning message styling */
.warning-message {
  text-align: center;
  padding: 1rem;
  margin: 1rem auto;
  max-width: 800px;
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 4px;
}

.warning-message p {
  font-size: 1rem;
  margin: 0;
  color: #856404;
}

/* No images message */
.no-images-message, .no-shows-message {
  text-align: center;
  padding: 2rem;
  margin: 2rem auto;
  background-color: #f8f8f8;
  border-radius: 8px;
}
</style>

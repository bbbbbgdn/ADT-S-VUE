<script setup>
import { useRouter } from 'vue-router';
import BaseButton from '../components/BaseButton.vue';
import ImageGallery from '../components/ImageGallery.vue';
import ShowCard from '../components/ShowCard.vue';
import MainText from '../components/MainText.vue';
import { renderRichText } from "@storyblok/vue";
import useStoryblok from '../utils/useStoryblok';
import { createImageSettings } from '../utils/imageSettings';
import { computed } from 'vue';
// Local helpers for main gallery date/ongoing
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

const isShowOngoing = (show) => {
  const startDate = show.content?.start_date;
  const endDate = show.content?.end_date;
  if (!startDate || !endDate) return false;
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return now >= start && now <= end;
};

// Create image settings using our utility - high quality for main show, thumbnail for others
const mainShowImageSettings = createImageSettings('high');
const otherShowsImageSettings = createImageSettings('thumbnail');

// Use our Storyblok composable with 'show' type
const router = useRouter();
const {
  story,
  stories: otherShows,
  isLoading,
  contentReady,
  errorMessage,
  formatImages
} = useStoryblok({
  type: 'show',
  preload: true,
  watchRoute: true,
  onError: (error, slug) => {
    console.error(`Custom error handler for show ${slug}:`, error);
    // Redirect to 404 page immediately if show not found
    router.replace({ name: 'NotFound' });
  }
});

const randomOtherShows = computed(() => {
  if (!otherShows.value || otherShows.value.length === 0) return [];
  return otherShows.value
    .slice() // клон
    .sort(() => 0.5 - Math.random()) // перемішати
    .slice(0, 4); // взяти перші 4
});

// Handle gallery loading errors (simplified for ShowPage)
const handleGalleryError = (storyId) => {
  console.warn(`[ShowPage] Gallery ${storyId} encountered an error`);
};

// Handle gallery loading success (simplified for ShowPage)
const handleGallerySuccess = (storyId) => {
  console.debug(`[ShowPage] Gallery ${storyId} loaded successfully`);
};

// Format images with preset settings
const formatMainShowImages = (visuals) => {
  return formatImages(visuals, mainShowImageSettings);
};



// Computed properties for cleaner gallery configuration
const mainShowGalleryProps = computed(() => ({
  name: story.value?.content?.title_tag || '',
  location: story.value?.content?.location_tag || '',
  date: story.value ? formatDateRange(story.value) : '',
  slug: story.value?.slug,
  isOngoing: story.value ? isShowOngoing(story.value) : false,
  images: story.value?.content?.visuals ? formatMainShowImages(story.value.content.visuals) : [],
  repeatCount: 1,
  imageHeight: 'calc(100vh - 96rem)',
  imageQuality: mainShowImageSettings.quality,
  imageFormat: mainShowImageSettings.format,
  resolutionRatio: mainShowImageSettings.resolutionRatio,
  isActive: true,
  repeatToFill: false,
  enableNavigation: false,
  // Enable manual click-and-drag for big galleries
  allowDrag: true,
  // Enable photo navigation for main show gallery
  enablePhotoNavigation: true
}));

// helper no longer needed for ShowCard usage
</script>

<template>
  <div class="show-page">
    <!-- Content area with loading state -->
    <div class="content-area">
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
        
        <!-- Main Show Gallery -->
        <ImageGallery
          v-if="story.content?.visuals && story.content.visuals.length > 0"
          v-bind="mainShowGalleryProps"
          :style="{ '--mobile-gallery-height': '70svh' }"
        />
        
        <!-- Fallback message if no visuals -->
        <div v-else class="no-images-message">
          <p>No images available for this show</p>
        </div>
        <!-- Using consolidated MainText component -->
        <MainText
          :infoText="renderRichText(story.content?.info_text || '')"
        >
          {{ story.content?.main_text || 'No Description Available' }}
        </MainText>
        <div id="extra-section">
          <div class="button-container">
            <BaseButton to="/shows">Other shows</BaseButton>
          </div>
          
          <!-- Other Shows Galleries -->
          <div v-if="randomOtherShows.length > 0" class="other-shows-container">
            <div
              v-for="show in randomOtherShows"
              :key="show.id"
              class="story-placeholder"
              :data-story-id="show.uuid"
            >
              <ShowCard
                :name="show.content?.title_tag || 'Untitled Show'"
                :location="show.content?.location_tag || ''"
                :slug="show.slug"
                :images="formatImages(show.content?.visuals)"
                :startDate="show.content?.start_date"
                :endDate="show.content?.end_date"
                :dateTag="show.content?.date_tag"
                :imageHeight="`${otherShowsImageSettings.height / 2}rem`"
                :imageWidth="'auto'"
                :imageQuality="otherShowsImageSettings.quality"
                :imageFormat="otherShowsImageSettings.format"
                :resolutionRatio="otherShowsImageSettings.resolutionRatio"
                :enableAutoScroll="true"
                :speedRandomness="0.3"
                :mobileGalleryHeight="'22svh'"
                @gallery-error="handleGalleryError(show.uuid)"
                @gallery-success="handleGallerySuccess(show.uuid)"
              />
            </div>
          </div>
          
          <div v-else class="no-shows-message">
            <p>No other shows available</p>
          </div>
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







.button-container {
  margin: var(--space-md);
}

.other-shows-container {
  display: flex;
  flex-direction: column;
  /* gap: 3rem; */
  width: 100%;
}

/* Error message styling */
.error-message {
  text-align: center;
  padding: var(--space-sm);
  margin: var(--space-sm) auto;
  max-width: 600px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-message p {
  font-size: var(--text-lg);
  /* margin-bottom: 1rem; */
}

/* Warning message styling */
.warning-message {
  text-align: center;
  padding: var(--space-xs);
  margin: var(--space-xs) auto;
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
  padding: var(--space-sm);
  margin: var(--space-sm) auto;
  background-color: #f8f8f8;
  border-radius: 8px;
}

.story-placeholder {
  width: 100%;
}


</style>

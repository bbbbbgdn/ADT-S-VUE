<script setup>
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '../components/BaseButton.vue';
import ObjectCard from '../components/ObjectCard.vue';
import { computed } from 'vue';
import useStoryblok from '../utils/useStoryblok';
import { createImageSettings } from '../utils/imageSettings';

// Create image settings for object photos (high quality for main images, thumbnail for suggestions)
const mainObjectImageSettings = createImageSettings('high');
const otherObjectsImageSettings = createImageSettings('thumbnail');

// Use our Storyblok composable with 'object' type
const {
  story,
  stories: otherObjects,
  isLoading,
  contentReady,
  errorMessage,
  formatImage,
  formatImages,
  navigateTo
} = useStoryblok({
  type: 'object',
  preload: true,
  watchRoute: true
});

// Get random other objects for suggestions (excluding current object)
const randomOtherObjects = computed(() => {
  if (!otherObjects.value || otherObjects.value.length === 0) return [];
  return otherObjects.value
    .slice() // clone
    .sort(() => 0.5 - Math.random()) // shuffle
    .slice(0, 4); // take first 4
});

// Format images for main object photos (skip first image as it's for the card)
const formatMainObjectImages = (visuals) => {
  if (!visuals || !Array.isArray(visuals) || visuals.length <= 1) return [];
  // Skip the first image and format the rest
  const photosForDisplay = visuals.slice(1);
  return formatImages(photosForDisplay, mainObjectImageSettings);
};

// Format image for other object suggestions
const formatOtherObjectImage = (object) => {
  return formatImage(object, otherObjectsImageSettings);
};

// Convert availability enum to text
const getAvailabilityText = (availability) => {
  switch (String(availability)) {
    case '0': return 'Sold';
    case '1': return 'Pre-order';
    case '2': return 'Available';
    default: return '';
  }
};
</script>

<template>
  <div class="object-page">
    <div class="content-area">
      <!-- Error message display for complete failure -->
      <div v-if="errorMessage && !story && !isLoading" class="error-message">
        <p>{{ errorMessage }}</p>
        <p>Redirecting to objects page...</p>
        <BaseButton to="/objects">Go to Objects</BaseButton>
      </div>
      
      <div v-if="story && contentReady" class="content-container" :class="{ 'content-visible': !isLoading }">
        <!-- Show warning message if using fallback -->
        <div v-if="errorMessage" class="warning-message">
          <p>{{ errorMessage }}</p>
        </div>
        
        <!-- Main two-column layout -->
        <div class="object-content">
          <!-- Left column: Object info -->
          <div class="object-info">
            <!-- Object name (pink) button at top -->
            <div class="object-tags">
              <BaseButton variant="active">{{ story.content?.title_tag || 'Untitled Object' }}</BaseButton>
            </div>
            
            <!-- Object description -->
            <div class="object-description">
              <p v-if="story.content?.info_text">{{ story.content.info_text }}</p>
              <p v-else-if="story.content?.main_text">{{ story.content.main_text }}</p>
              <p v-else>No description available</p>
            </div>
            
            <!-- Price and availability info -->
            <div class="order-section">
              <BaseButton 
                v-if="story.content?.display_price && story.content?.price_tag" 
                variant="black"
              >
                {{ story.content.price_tag }}
              </BaseButton>
              <BaseButton 
                v-if="story.content?.availability" 
                variant="grey"
              >
                {{ getAvailabilityText(story.content.availability) }}
              </BaseButton>
            </div>
            
            <!-- Purchase/shipping info -->
            <div v-if="story.content?.purchase_text" class="purchase-info">
              {{ story.content.purchase_text }}
            </div>
          </div>
          
          <!-- Right column: Object photos (vertical stack, skipping first image) -->
          <div class="object-photos">
            <div v-if="formatMainObjectImages(story.content?.visuals).length > 0" class="photos-stack">
              <img 
                v-for="(image, index) in formatMainObjectImages(story.content?.visuals)" 
                :key="index"
                :src="image.url" 
                :alt="image.alt || `Object photo ${index + 1}`"
                class="object-photo"
              />
            </div>
            <div v-else class="no-photos-message">
              <p>No additional photos available</p>
            </div>
          </div>
        </div>
        
        <!-- Back to objects button -->
        <div class="button-container">
          <BaseButton to="/objects">Other objects</BaseButton>
        </div>
        
        <!-- Other Objects suggestions -->
        <div v-if="randomOtherObjects.length > 0" class="other-objects-container">
          <div class="other-objects-grid">
            <ObjectCard
              v-for="object in randomOtherObjects"
              :key="object.id"
              :image="formatOtherObjectImage(object)"
              :objectName="object.content?.title_tag || 'Untitled Object'"
              :price="object.content?.price_tag || ''"
              :showPrice="object.content?.display_price || false"
              :slug="object.slug"
            />
          </div>
        </div>
        
        <div v-else class="no-objects-message">
          <p>No other objects available</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.object-page {
  width: 100%;
}

.content-area {
  position: relative;
  min-height: 80vh;
}

.content-container {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.content-visible {
  opacity: 1;
}

/* Main two-column layout */
.object-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4xl);
  padding: var(--space-md);
  min-height: 80vh;
}

/* Left column: Object info */
.object-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  padding-right: var(--space-xl);
}

.object-tags {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
  align-items: center;
}

.object-description {
  font-size: var(--text-lg);
  line-height: 1.6;
}

.material-section,
.dimensions-section {
  margin-bottom: var(--space-lg);
}

.section-title {
  font-weight: bold;
  margin-bottom: var(--space-sm);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.order-section {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
  align-items: center;
  margin: var(--space-xl) 0;
}

.purchase-info {
  font-size: var(--text-sm);
  color: #666;
  line-height: 1.5;
}

/* Right column: Object photos */
.object-photos {
  display: flex;
  flex-direction: column;
}

.photos-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.object-photo {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 0;
}

.no-photos-message {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: #f5f5f5;
  color: #999;
}

/* Button container */
.button-container {
  margin: var(--space-4xl) var(--space-md) var(--space-xl) var(--space-md);
}

/* Other objects suggestions */
.other-objects-container {
  margin-top: var(--space-4xl);
}

.other-objects-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  padding: var(--space-md);
}

/* Error and warning messages */
.error-message {
  text-align: center;
  padding: var(--space-sm);
  margin: var(--space-sm) auto;
  max-width: 600px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

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

.no-objects-message {
  text-align: center;
  padding: var(--space-sm);
  margin: var(--space-sm) auto;
  background-color: #f8f8f8;
  border-radius: 8px;
}

/* Mobile responsive */
@media screen and (max-width: 768px) {
  .object-content {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
    padding: var(--space-sm);
  }
  
  .object-info {
    padding-right: 0;
    order: 2;
  }
  
  .object-photos {
    order: 1;
  }
  
  .other-objects-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: var(--space-sm);
  }
  
  .object-tags {
    justify-content: center;
  }
}

@media screen and (max-width: 480px) {
  .other-objects-grid {
    grid-template-columns: 1fr;
  }
  
  .order-section {
    justify-content: center;
  }
}
</style>

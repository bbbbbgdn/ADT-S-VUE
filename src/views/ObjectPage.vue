<script setup>
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '../components/BaseButton.vue';
import ObjectCard from '../components/ObjectCard.vue';
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue';
import useStoryblok from '../utils/useStoryblok';
import useGlobalSettings from '../utils/useGlobalSettings';
import { createImageSettings } from '../utils/imageSettings';
import { extractImageDimensions, calculatePlaceholderDimensions } from '../utils/imageDimensions';

// Create image settings for object photos (window-based for main images, thumbnail for suggestions)
const mainObjectImageSettings = createImageSettings('windowBased');
const otherObjectsImageSettings = createImageSettings('thumbnail');

// Use our Storyblok composable with 'object' type
const router = useRouter();

// Global settings for delivery info
const { deliveryInfo } = useGlobalSettings();
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
  watchRoute: true,
  onError: (error, slug) => {
    console.error(`Custom error handler for object ${slug}:`, error);
    // Redirect to 404 page immediately if object not found
    router.replace({ name: 'NotFound' });
  }
});

// Get random other objects for suggestions (excluding current object)
const randomOtherObjects = computed(() => {
  if (!otherObjects.value || otherObjects.value.length === 0) return [];
  return otherObjects.value
    .slice() // clone
    .sort(() => 0.5 - Math.random()) // shuffle
    .slice(0, 4); // take first 4
});

// Process main object images with dimensions for placeholders
const mainObjectImagesWithDimensions = computed(() => {
  const images = formatMainObjectImages(story.value?.content?.visuals || []);
  return images.map(image => {
    const dimensions = extractImageDimensions(image.url);
    const placeholderDimensions = dimensions ?
      calculatePlaceholderDimensions(dimensions, 'auto', '100%') :
      { width: '100%', height: 'auto' };

    return {
      ...image,
      dimensions,
      placeholderDimensions
    };
  });
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

// Open mail client to contact Dasha with object title in subject
const contactDasha = () => {
  const title = story.value?.content?.title_tag || 'Inquiry';
  const subject = encodeURIComponent(`Object inquiry for ${title}`);
  window.location.href = `mailto:tsapenkodash@gmail.com?subject=${subject}`;
};

// Convert line breaks to HTML breaks
const formatTextWithLineBreaks = (text) => {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
};

// Simplified image loading methods - reveal images as they load
const onImageLoad = (index) => {
  console.debug(`[ObjectPage] Image ${index} loaded successfully`);

  // Mark image as loaded
  loadedImages.value.add(index);

  // Reveal this specific image immediately
  revealImage(index);

  // Check if we should exit batch loading mode
  if (loadedImages.value.size >= mainObjectImagesWithDimensions.value.length) {
    console.debug(`[ObjectPage] All images loaded`);
    isBatchLoading.value = false;
  }
};

const onImageError = (index) => {
  console.error(`[ObjectPage] Image ${index} failed to load`);

  // Still mark as loaded to prevent blocking other images
  loadedImages.value.add(index);

  // Reveal this image (it will show as error state)
  revealImage(index);

  // Check if we should exit batch loading mode
  if (loadedImages.value.size >= mainObjectImagesWithDimensions.value.length) {
    isBatchLoading.value = false;
  }
};

const revealImage = (index) => {
  // Use nextTick to ensure DOM is updated
  nextTick(() => {
    const img = document.querySelector(`.object-photo[data-index="${index}"]`);
    if (img && !img.classList.contains('image-revealed')) {
      img.classList.remove('image-loading');
      img.classList.add('image-loaded', 'image-revealed');
      console.debug(`[ObjectPage] Revealed image at index ${index}`);
    }
  });
};

// Simple sticky order section functionality
const orderSectionRef = ref(null);
const objectInfoRef = ref(null);
const OtherRef = ref(null);
const isSticky = ref(false); // Sticks to bottom of object-info container
const isFixed = ref(false); // Fixed at bottom of window

// Image loading state data for batch loading
const loadedImages = ref(new Set()); // Track which images have loaded
const isBatchLoading = ref(false); // Whether we're in batch loading mode

const handleScroll = () => {
  if (!orderSectionRef.value || !objectInfoRef.value || !OtherRef.value) return;
  
  // Disable sticky behavior on mobile devices
  if (window.innerWidth <= 768) {
    isSticky.value = false;
    isFixed.value = false;
    return;
  }
  
  const windowHeight = window.innerHeight;
  
  // Get object-info container bounds
  const objectInfoRect = objectInfoRef.value.getBoundingClientRect();
  const objectInfoBottom = objectInfoRect.bottom; // Relative to viewport
  
  // If object-info container bottom is at or above viewport bottom, stick to container
  // Otherwise, fix at window bottom
  if (objectInfoBottom <= windowHeight) {
    // Object-info container bottom is in view or above - stick to container bottom
    isSticky.value = true;
    isFixed.value = false;
  } else {
    // Object-info container bottom is below viewport - fix at window bottom
    isSticky.value = false;
    isFixed.value = true;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleScroll);

  // Get initial position after mount
  setTimeout(() => {
    handleScroll();
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleScroll);
});
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
        

        <div class="object-content">
          <!-- Left column: Object info -->
          <div class="object-info" ref="objectInfoRef">
            <!-- Object name (pink) button at top -->
        <!-- Main two-column layout -->
        <div class="object-tags">
              <BaseButton variant="active">{{ story.content?.title_tag || 'Untitled Object' }}</BaseButton>
            </div>
            
            <!-- Object description -->
            <div class="object-description">
              <p v-if="story.content?.info_text" v-html="formatTextWithLineBreaks(story.content.info_text)"></p>
              <p v-else-if="story.content?.main_text" v-html="formatTextWithLineBreaks(story.content.main_text)"></p>
              <p v-else class="no-description">Object description in progress,<br>meanwhile feel free to contact for details!</p>
            </div>

            <!-- Price and availability info -->
            <div 
              class="order-section" 
              ref="orderSectionRef" 
              :class="{ 'sticky': isSticky, 'fixed': isFixed }"
            >
              <BaseButton
                variant="black"
                @click="contactDasha"
              >
                Contact Dasha
              </BaseButton>
              
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

                          
            <!-- Purchase/shipping info -->
            <div v-if="deliveryInfo" class="purchase-info" v-html="formatTextWithLineBreaks(deliveryInfo)">
            </div>

            </div>

          </div>
          
          <!-- Right column: Object photos (vertical stack, skipping first image) -->
          <div class="object-photos">
            <div v-if="mainObjectImagesWithDimensions.length > 0" class="photos-stack">
              <div
                v-for="(image, index) in mainObjectImagesWithDimensions"
                :key="index"
                class="photo-item"
              >
                <!-- Placeholder div to maintain aspect ratio and prevent layout jumps -->
                <div
                  v-if="image.dimensions"
                  class="image-placeholder"
                  :style="{
                    width: image.placeholderDimensions.width,
                    height: image.placeholderDimensions.height,
                    'aspect-ratio': image.dimensions.aspectRatio,
                    '--aspect-ratio': image.dimensions.aspectRatio
                  }"
                ></div>

                <!-- Fallback placeholder when dimensions aren't available -->
                <div
                  v-else
                  class="image-placeholder image-placeholder-fallback"
                  :style="{
                    width: '100%',
                    height: '300px' // Default height for fallback
                  }"
                ></div>

                <img
                  v-lazy-load="{
                    url: image.url,
                    index: index,
                    galleryId: 'object-photos-stack',
                    threshold: 0.1,
                    rootMargin: '300px',
                    preloadCount: 2,
                    isBigGallery: mainObjectImagesWithDimensions.length > 3,
                    resetQueue: index === 0
                  }"
                  :alt="image.alt || `Object photo ${index + 1}`"
                  :data-index="index"
                  class="object-photo"
                  @load="onImageLoad(index)"
                  @error="onImageError(index)"
                />
              </div>
            </div>
            <div v-else class="no-photos-message">
              <p>No additional photos available</p>
            </div>
          </div>
        </div>
        
        <!-- Back to objects button -->
        <div class="button-container" ref="OtherRef">
          <BaseButton to="/objects">Other objects</BaseButton>
        </div>
        
        <!-- Other Objects suggestions -->
        <div v-if="randomOtherObjects.length > 0" class="other-objects-container">
          <div class="other-objects-grid">
            <ObjectCard
              v-for="(object, index) in randomOtherObjects"
              :key="object.id"
              :image="formatOtherObjectImage(object)"
              :objectName="object.content?.title_tag || 'Untitled Object'"
              :price="object.content?.price_tag || ''"
              :showPrice="object.content?.display_price || false"
              :slug="object.slug"
              :gallery-index="index"
              :gallery-id="'object-suggestions'"
              :total-items="randomOtherObjects.length"
              :preload-count="4"
              :is-big-gallery="false"
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
  position: relative;
  min-height: 100vh;
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
  /* gap: var(--space-4xl); */
  padding: 0 0 0 var(--space-md);
  min-height: 80vh;
 
}

/* Left column: Object info */
.object-info {
  display: flex;
  flex-direction: column;
  position: relative;
  /* gap: var(--space-xl); */
  /* padding-right: var(--space-xl); */
  
}

.object-info > *:not(:first-child) {
  margin-left: var(--space-3xl);
}

.object-tags {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
  align-items: center;

  margin-bottom: var(--space-xl);
}

.object-description {
  font-size: var(--text-lg);
  /* line-height: 1.6; */
  margin-bottom: var(--space-4xl);
  margin-left: var(--space-3xl);
  /* margin-bottom: 20svh; */
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
  /* display: flex; */
  /* gap: var(--space-md); */
  /* flex-wrap: wrap; */
  /* align-items: center; */
  margin: var(--space-xl) var(--space-3xl) var(--space-3xl) var(--space-3xl);
  margin-top: auto;
  /* transition: all 0.3s ease; */
}

.order-section>button{
  margin-right: var(--space-md);
}

.order-section.sticky {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  /* padding: var(--space-md); */
  /* margin: 0 var(--space-3xl) ; */
  z-index: 100;
}

.order-section.fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 50%;
  background-color: white;
  padding: var(--space-md);
  /* margin: var(--space-3xl) var(--space-3xl); */
  z-index: 100;
}

.purchase-info {
  /* font-size: var(--text-sm); */
  /* color: #666; */
  /* line-height: 1.5; */
  margin-top: var(--space-xl);
}

/* Right column: Object photos */
.object-photos {
  display: flex;
  flex-direction: column;
  margin-top: -48.5rem;
}

.photos-stack {
  display: flex;
  flex-direction: column;
  margin-left: calc(var(--space-md) * -1);
  /* gap: var(--space-md); */
}

.photo-item {
  position: relative;
  /* margin-bottom: var(--space-md); */
}

.image-placeholder {
  position: relative;
  width: 100%;
  background-color: rgba(248, 248, 248, 0.1); /* Subtle background to indicate loading */
  /* Use aspect-ratio property for modern browsers */
  aspect-ratio: var(--aspect-ratio, auto);
  /* Ensure the placeholder maintains space even when image is loading */
  opacity: 1;
  z-index: 0;
  /* Prevent any layout shifts */
  box-sizing: border-box;
}

.image-placeholder-fallback {
  background-color: rgba(248, 248, 248, 0.2); /* Slightly more visible for fallback */
}

.object-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
  position: absolute;
  top: 0;
  left: 0;
  /* Initially hide all images completely to prevent any layout shifts */
  opacity: 0;
  visibility: hidden;
  /* Smooth transition when revealing */
  transition: opacity 0.3s ease-in-out;
  /* Prevent image dragging */
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}

/* Loading states for photos stack */
.object-photo.image-loading {
  opacity: 0;
  visibility: hidden;
}

.object-photo.image-loaded {
  opacity: 1 !important;
  visibility: visible !important;
}

.object-photo.image-error {
  opacity: 0.5;
  visibility: visible; /* Error images should be visible */
}

/* Revealed state - highest priority */
.object-photo.image-revealed {
  opacity: 1 !important;
  visibility: visible !important;
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
  margin: 0 var(--space-md);
  display: block;
  background: white;
  z-index: 2;
}

/* Other objects suggestions - margin-top: var(--space-4xl); */

.other-objects-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* gap: var(--space-md); */
  /* padding: var(--space-md); */
} 

.other-objects-grid > .object-card{
  aspect-ratio: 3 / 4;
  background: white;
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

  .object-info > *:not(:first-child) {
    margin: 0 var(--space-xl) var(--space-2xl) 0;
  }

  .object-content {
    grid-template-columns: 1fr;
    /* gap: var(--space-xl); */
    /* padding: var(--space-sm); */
  }
  
  .object-info {
    padding-right: 0;
    order: 1;
  }
  
  .object-photos {
    order: 1;
    margin-top: 49rem;
    padding-bottom: var(--space-4xl);
  }
  
  .other-objects-grid {
    grid-template-columns: repeat(2, 1fr);
    /* padding: var(--space-sm); */
  }
  
  /* .object-tags justify-content: center; */
  
  /* Disable sticky behavior on mobile */
  .order-section.sticky,
  .order-section.fixed {
    position: static;
    top: auto;
    left: auto;
    right: auto;
    background-color: transparent;
    padding: 0;
    box-shadow: none;
    margin: var(--space-xl) 0;
    z-index: auto;
    transform: none !important;
    transition: none !important;
  }
}

/* @media screen and (max-width: 480px) .other-objects-grid grid-template-columns: 1fr; */
</style>

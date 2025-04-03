<template>
  <div class="gallery-container" :class="{ 'clickable': !isActive }">
    <div class="gallery" ref="gallery" :style="galleryContainerStyle" @click="navigateToShow" @mouseenter="isHovering = !isActive" @mouseleave="isHovering = false">
      <div 
        v-for="(image, index) in processedImages" 
        :key="index" 
        class="gallery-item"
        :style="galleryItemStyle"
      >
        <img 
          v-lazy-load="{
            url: image.url,
            threshold: 0.1,
            rootMargin: '100px'
          }"
          :alt="image.alt"
          :style="imageStyle"
          :data-index="index"
          class="gallery-image">
      </div>
    </div>
    <div v-if="shouldShowTags" class="gallery-tags" @click.stop>
      <ButtonBase 
        v-if="name && name.trim().length > 0" 
        :to="`/shows/${slug}`" 
        :variant="isActive ? 'active' : 'black'"
        :class="{ 'button-hover': isHovering }"
      >
        {{ name }}
      </ButtonBase>
      <ButtonBase v-if="location && location.trim().length > 0" variant="grey">{{ location }}</ButtonBase>
      <ButtonBase v-if="date && date.trim().length > 0" variant="grey">{{ date }}</ButtonBase>
    </div>
  </div>
</template>

<script>
import ButtonBase from './BaseButton.vue';
import { createImageUrl, getOptimalImageDimensions } from '../utils/storyblok';
import { useRouter, useRoute } from 'vue-router';
import navigationManager from '../utils/navigationManager';

export default {
  name: 'ImageGallery',
  components: {
    ButtonBase
  },
  props: {
    name: {
      type: String,
      required: false,
      default: ''
    },
    slug: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: false,
      default: ''
    },
    date: {
      type: String,
      required: false,
      default: ''
    },
    images: {
      type: Array,
      required: true
    },
    repeatCount: {
      type: Number,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    imageHeight: {
      type: String,
      default: '230rem',
      required: false
    },
    imageWidth: {
      type: String,
      default: 'auto',
      required: false
    },
    imageQuality: {
      type: Number,
      default: 85,
      required: false
    },
    imageFormat: {
      type: String,
      default: null,
      required: false
    },
    resolutionRatio: {
      type: Number,
      default: 1,
      required: false,
      validator: (value) => value > 0
    }
  },

  data() {
    return {
      isScrolling: false,
      scrollTimeout: null,
      scrollStartX: 0,
      isHovering: false
    };
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    return { router, route };
  },

  methods: {
    navigateToShow(event) {
      // Don't navigate if we're already on this show page (isActive is true)
      if (this.isActive) return;
      
      // Don't navigate if the user was scrolling
      if (this.isScrolling) return;
      
      // Use our navigation manager to ensure consistent transitions
      navigationManager.navigateTo(this.router, `/shows/${this.slug}`);
    },
    
    handleScrollStart(event) {
      if (this.isActive) return;
      this.scrollStartX = event.touches ? event.touches[0].clientX : event.clientX;
      this.isScrolling = false;
    },
    
    handleScrollMove(event) {
      if (this.isActive) return;
      if (!this.scrollStartX) return;
      
      const currentX = event.touches ? event.touches[0].clientX : event.clientX;
      const diffX = Math.abs(currentX - this.scrollStartX);
      
      // If the user has moved more than 5px horizontally, consider it a scroll
      if (diffX > 5) {
        this.isScrolling = true;
      }
    },
    
    handleScrollEnd() {
      if (this.isActive) return;
      
      // Reset the scroll state after a short delay
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.isScrolling = false;
        this.scrollStartX = 0;
      }, 100);
    },
    
    /**
     * Customize image parameters for different use cases
     * @param {Object} options - Base options to customize
     * @returns {Object} - Customized image options
     */
    customizeImageParams(options = {}) {
      // Parse height value from the prop
      let parsedHeight;
      if (this.imageHeight.includes('vh')) {
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const vhValue = parseFloat(this.imageHeight);
        parsedHeight = Math.round((vhValue / 100) * viewportHeight);
      } else if (this.imageHeight.includes('rem')) {
        const baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        parsedHeight = parseFloat(this.imageHeight) * baseFontSize;
      } else {
        parsedHeight = parseInt(this.imageHeight) || 100;
      }
      
      // Parse width if it's not auto
      let parsedWidth = 0; // Default to auto width
      if (this.imageWidth !== 'auto') {
        parsedWidth = parseInt(this.imageWidth) || 0;
      }
      
      // Apply resolution ratio to dimensions
      const scaledHeight = Math.round(parsedHeight * this.resolutionRatio);
      const scaledWidth = parsedWidth ? Math.round(parsedWidth * this.resolutionRatio) : 0;
      
      // Get optimal dimensions based on device and resolution ratio
      const optimalDimensions = getOptimalImageDimensions({
        width: scaledWidth,
        height: scaledHeight,
        quality: this.imageQuality,
        resolutionRatio: this.resolutionRatio
      });
      
      // Start with optimal dimensions
      const customOptions = {
        width: optimalDimensions.width,
        height: optimalDimensions.height,
        quality: optimalDimensions.quality,
        format: this.imageFormat,
        ...options // Override with any passed options
      };
      
      return customOptions;
    }
  },

  computed: {
    processedImages() {
      // Process images with the requested transformations
      if (!this.images || !Array.isArray(this.images) || this.images.length === 0) {
        console.warn('No images provided to ImageGallery component');
        return [];
      }
      
      const processed = this.images.map((image, index) => {
        // Make sure we have a valid URL
        if (!image || !image.url) {
          console.warn(`Image at index ${index} has no URL:`, image);
          return {
            url: '',
            alt: 'Missing image'
          };
        }
        
        // Get customized image parameters
        const imageParams = this.customizeImageParams();
        
        // Request optimized image from Storyblok
        const transformedUrl = createImageUrl(image.url, imageParams);
        
        return {
          url: transformedUrl,
          alt: image.alt || 'Image'
        };
      });
      
      // Repeat the processed images
      const repeated = [];
      for (let i = 0; i < this.repeatCount; i++) {
        repeated.push(...processed);
      }
      
      return repeated;
    },
    repeatedImages() {
      const repeated = [];
      for (let i = 0; i < this.repeatCount; i++) {
        repeated.push(...this.images);
      }
      return repeated;
    },
    imageStyle() {
      return {
        height: this.imageHeight,
        width: this.imageWidth !== 'auto' ? this.imageWidth : 'auto'
      }
    },
    galleryContainerStyle() {
      return {
        height: this.imageHeight,
        minHeight: this.imageHeight
      }
    },
    galleryItemStyle() {
      // If imageWidth is set, use it for consistent width during loading
      if (this.imageWidth !== 'auto') {
        return {
          width: this.imageWidth
        }
      }
      return {}
    },
    shouldShowTags() {
      return (this.name && this.name.trim().length > 0) || 
             (this.location && this.location.trim().length > 0) || 
             (this.date && this.date.trim().length > 0);
    }
  },

  mounted() {
    // Add event listeners for scroll detection
    const gallery = this.$refs.gallery;
    if (gallery) {
      gallery.addEventListener('mousedown', this.handleScrollStart);
      gallery.addEventListener('mousemove', this.handleScrollMove);
      gallery.addEventListener('mouseup', this.handleScrollEnd);
      gallery.addEventListener('mouseleave', this.handleScrollEnd);
      
      gallery.addEventListener('touchstart', this.handleScrollStart);
      gallery.addEventListener('touchmove', this.handleScrollMove);
      gallery.addEventListener('touchend', this.handleScrollEnd);
    }
    
    // Only log warnings if tags are expected to be shown
    if (this.shouldShowTags) {
      // Check for empty tags and log warnings
      if (!this.name || this.name.trim().length === 0) {
        console.warn(`Empty name tag detected for gallery with slug: ${this.slug}`);
      }
      if (!this.location || this.location.trim().length === 0) {
        console.warn(`Empty location tag detected for gallery with slug: ${this.slug}`);
      }
      if (!this.date || this.date.trim().length === 0) {
        console.warn(`Empty date tag detected for gallery with slug: ${this.slug}`);
      }
    }
  },
  
  beforeUnmount() {
    // Remove event listeners
    const gallery = this.$refs.gallery;
    if (gallery) {
      gallery.removeEventListener('mousedown', this.handleScrollStart);
      gallery.removeEventListener('mousemove', this.handleScrollMove);
      gallery.removeEventListener('mouseup', this.handleScrollEnd);
      gallery.removeEventListener('mouseleave', this.handleScrollEnd);
      
      gallery.removeEventListener('touchstart', this.handleScrollStart);
      gallery.removeEventListener('touchmove', this.handleScrollMove);
      gallery.removeEventListener('touchend', this.handleScrollEnd);
    }
    
    // Clear any pending timeouts
    clearTimeout(this.scrollTimeout);
  }
}
</script>

<style>
.gallery-container {
  width: 100%;
  overflow: hidden;
  line-height: 0;
  position: relative;
}


/* Add cursor pointer only to the gallery (image area) */
.gallery-container.clickable .gallery {
  cursor: pointer;
}

/* Make sure the gallery items also have pointer cursor */
.gallery-container.clickable .gallery-item {
  cursor: pointer;
}

.gallery {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

}

.gallery::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.gallery-item {
  flex: 0 0 auto;
  scroll-snap-align: start;
  position: relative;
  min-width: 50px; /* Minimum width to prevent collapse during loading */
  display: flex;
  justify-content: center;
  align-items: center;
}

.gallery-item:first-of-type {
  padding-left: 3rem;
}

.gallery-tags {
  display: flex;
  gap: 3rem;
  padding: 3rem 3rem 3rem 3rem;
}

/* Ensure the tags area doesn't have a pointer cursor */
.gallery-container.clickable .gallery-tags {
  cursor: default;
}

/* But make sure the buttons inside the tags area have the appropriate cursor */
.gallery-container.clickable .gallery-tags .base-button {
  cursor: pointer;
}

/* Style for the button hover effect */
.button-hover {
  background: var(--color-pink-primary) !important;
  color: black !important;
}

.gallery-image {
  width: auto;
  object-fit: cover;
  transition: opacity 1s ease-out;
  position: relative;
  height: 100%;
}

.gallery-image.image-loading {
  opacity: 0;
}

.gallery-image.image-loaded {
  opacity: 1;
}

.gallery-image.image-error {
  /* Add a subtle indication for failed images */
  opacity: 0.5;
  background-color: #f8f8f8;
  border: 1px dashed #ccc;
}


@media (max-width: 768px) {
  .gallery {
    min-height: auto !important;
    height: auto !important;
  }
  .gallery-image {
    /* Use vh units for mobile too */
    height: 40vh !important;
    /* aspect-ratio: 1/1 !important; */
     
  }
}
</style> 
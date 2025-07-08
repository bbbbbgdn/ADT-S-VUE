<template>
  <div 
    class="gallery-container" 
    :class="{ 'clickable': !isActive }"
    ref="galleryContainer"
  >
    <div 
      class="gallery" 
      ref="gallery" 
      :style="[galleryContainerStyle, galleryStyle]" 
      @mouseenter="isHovering = true" 
      @mouseleave="isHovering = false"
      :class="[{ 'manual-scroll': !enableHoverScroll }, { 'auto-scrolling': isHovering && enableHoverScroll }]"
      @click="handleGalleryClick"
    >
      <div 
        v-for="(image, index) in processedImages" 
        :key="`${image.url}-${index}`" 
        class="gallery-item"
        :style="galleryItemStyle"
      >
        <img 
          v-lazy-load="{
            url: image.url,
            index: index,
            resetQueue: index === 0,
            threshold: 0.1,
            rootMargin: '750px',
            galleryId: internalGalleryId
          }"
          :alt="image.alt || 'Image'"
          :style="imageStyle"
          :data-index="index"
          :data-gallery-id="internalGalleryId"
          class="gallery-image"
        />
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

export default {
  name: 'ImageGallery',
  components: { ButtonBase },
  props: {
    name: String,
    slug: { type: String, required: true },
    location: String,
    date: String,
    images: { type: Array, required: true },
    repeatCount: { type: Number, required: true },
    isActive: { type: Boolean, default: false },
    imageHeight: { 
      type: String, 
      default: '230rem'
    },
    imageWidth: { 
      type: String, 
      default: 'auto',
      validator: value => value === 'auto' || /^\d+(rem|vh|px)$/.test(value)
    },
    imageQuality: { type: Number, default: 85 },
    imageFormat: { type: String, default: null },
    resolutionRatio: { type: Number, default: 2, validator: value => value > 0 },
    repeatToFill: { type: Boolean, default: true },
    galleryId: { type: String, default: null },
  },
  data() {
    return {
      isScrolling: false,
      scrollTimeout: null,
      scrollStartX: 0,
      isHovering: false,
      currentPosition: 0,
      isManualScrolling: false,
      galleryWidth: 0,
      lastTimestamp: 0,
      screenWidth: 0,
      observer: null,
      isGalleryVisible: false,
      internalGalleryId: this.galleryId || `gallery-${Math.random().toString(36).substr(2, 9)}`,
    };
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    return { router, route };
  },
  methods: {
    handleGalleryClick() {
      if (!this.isActive) {
        this.router.push(`/shows/${this.slug}`);
      }
    },
    customizeImageParams(options = {}) {
      let parsedHeight;
      if (this.imageHeight.includes('vh')) {
        const vhValue = parseFloat(this.imageHeight);
        parsedHeight = Math.round((vhValue / 100) * window.innerHeight);
      } else if (this.imageHeight.includes('rem')) {
        const baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        parsedHeight = parseFloat(this.imageHeight) * baseFontSize;
      } else {
        parsedHeight = parseInt(this.imageHeight) || 100;
      }
      let parsedWidth = this.imageWidth !== 'auto' ? parseInt(this.imageWidth) || 0 : 0;
      const scaledHeight = Math.round(parsedHeight * this.resolutionRatio);
      const scaledWidth = parsedWidth ? Math.round(parsedWidth * this.resolutionRatio) : 0;
      const optimalDimensions = getOptimalImageDimensions({
        width: scaledWidth,
        height: scaledHeight,
        quality: this.imageQuality,
        resolutionRatio: this.resolutionRatio
      });
      return {
        width: optimalDimensions.width,
        height: optimalDimensions.height,
        quality: optimalDimensions.quality,
        format: this.imageFormat,
        ...options
      };
    },
    updateDimensions() {
      this.screenWidth = window.innerWidth;
      const gallery = this.$refs.gallery;
      if (gallery) {
        this.galleryWidth = gallery.scrollWidth;
      }
    },
    setupIntersectionObserver() {
      if (!this.$refs.galleryContainer) return;
      
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Gallery is visible, trigger image loading
              this.isGalleryVisible = true;
              this.startImageLoading();
              this.showImagesInSequence();
            } else {
              this.isGalleryVisible = false;
            }
          });
        },
        {
          rootMargin: '100px', // Start loading 100px before gallery comes into view
          threshold: 0.1
        }
      );
      
      this.observer.observe(this.$refs.galleryContainer);
    },
    startImageLoading() {
      // Trigger the lazy loading directive to start loading images
      // by forcing a reactive update
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    showImagesInSequence() {
      // This method ensures images are shown in order as they load
      const images = this.$refs.gallery?.querySelectorAll('img.gallery-image');
      if (!images) return;
      
      // The lazy loading directive will handle the sequential display
      // We just need to ensure the queue is properly managed
      this.$nextTick(() => {
        // Force a re-render to trigger the lazy loading directive
        this.$forceUpdate();
      });
    }
  },
  computed: {
    processedImages() {
      if (!this.images || !Array.isArray(this.images) || this.images.length === 0) return [];
      const processed = this.images.map((image) => {
        if (!image || !image.url) return { url: '', alt: 'Missing image' };
        const imageParams = this.customizeImageParams();
        return {
          url: createImageUrl(image.url, imageParams),
          alt: image.alt || 'Image'
        };
      });

      if (!this.repeatToFill) {
        return processed;
      }
      // Calculate the width of each image
      let imageWidthPx;
      if (this.imageWidth !== 'auto') {
        if (this.imageWidth.endsWith('px')) {
          imageWidthPx = parseInt(this.imageWidth);
        } else if (this.imageWidth.endsWith('rem')) {
          const baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
          imageWidthPx = parseFloat(this.imageWidth) * baseFontSize;
        } else if (this.imageWidth.endsWith('vh')) {
          imageWidthPx = (parseFloat(this.imageWidth) / 100) * window.innerHeight;
        } else {
          imageWidthPx = parseInt(this.imageWidth) || 200;
        }
      } else {
        // Fallback estimate for 'auto' (use 200px per image as a guess)
        imageWidthPx = 200;
      }
      const totalWidth = processed.length * imageWidthPx;
      const minWidth = 2 * window.innerWidth;
      if (totalWidth >= minWidth) {
        return processed;
      }
      // Repeat images until at least 2x window width
      const repeatCount = Math.ceil(minWidth / totalWidth);
      let repeated = [];
      for (let i = 0; i < repeatCount; i++) {
        repeated = repeated.concat(processed);
      }
      return repeated;
    },
    imageStyle() {
      return {
        height: this.imageHeight,
        width: this.imageWidth !== 'auto' ? this.imageWidth : 'auto'
      };
    },
    galleryContainerStyle() {
      return {
        height: this.imageHeight,
        minHeight: this.imageHeight,
        transform: this.isHovering ? `translateX(calc(-1 * var(--gallery-hover-shift-amount)))` : 'translateX(0rem)'
      };
    },
    galleryItemStyle() {
      return this.imageWidth !== 'auto' ? { width: this.imageWidth } : {};
    },
    shouldShowTags() {
      return (this.name && this.name.trim()) || (this.location && this.location.trim()) || (this.date && this.date.trim());
    },
    galleryStyle() {
      return {};
    },
    enableHoverScroll() {
      return false;
    }
  },
  mounted() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
    
    // Setup intersection observer
    this.$nextTick(() => {
      this.setupIntersectionObserver();
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
    
    // Clean up observer
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  watch: {
    isHovering() {
      // No-op for now
    },
    images: {
      handler() {
        this.updateDimensions();
      },
      deep: true
    },
    isGalleryVisible(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.showImagesInSequence();
        });
      }
    }
  }
};
</script>


<style>
.gallery-container {
  width: 100%;
  overflow: hidden;
  line-height: 0;
  position: relative;
  --gallery-hover-shift-amount: 0px;
  /* Hide scrollbars for all browsers */
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

/* .gallery-container::before{
  height: calc(100% - var(--gallery-item-margin) * 2 - var(--button-min-height));
  margin-left: var(--gallery-item-margin);
  margin-right: var(--gallery-item-margin);
  background: linear-gradient(90deg, #ffffff, rgba(195, 195, 195, 0.6), #ffffff);
  pointer-events: none;
  background-size: 50% 100%;
  animation: move-gradient 5s linear infinite;
} */

.gallery-container.clickable .gallery,
.gallery-container.clickable .gallery-item {
  cursor: pointer;
}

.gallery {
  display: flex;
  width: 100%;
  will-change: transform;
  /* Hide scrollbars for all browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  overflow: -moz-scrollbars-none; /* Firefox (older versions) */
}

.gallery.auto-scrolling {
  transition: transform 0.35s ease-in-out;
}

.gallery.manual-scroll {
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

.gallery.manual-scroll::-webkit-scrollbar {
  display: none;
}



/* @keyframes move-gradient {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: -100% 0;
  }
} */

.gallery-item {
  flex: 0 0 auto;
  position: relative;
  min-width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  margin-right: -1px;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.gallery-item:first-of-type {
  padding-left: var(--gallery-item-margin);
}

.gallery-item:last-of-type {
  padding-right: var(--gallery-item-margin);
}

.gallery-tags {
  display: flex;
  gap: var(--gallery-tags-gap);
  padding: var(--gallery-tags-padding);
  
}

.gallery-container.clickable .gallery-tags {
  cursor: default;
}

.gallery-container.clickable .gallery-tags .base-button {
  cursor: pointer;
}

.button-hover {
  background: var(--color-pink-primary) !important;
  color: black !important;
}

.gallery-image {
  width: auto;
  object-fit: cover;
  position: relative;
  height: 100%;
  border-radius: 0;
  margin: 0;
  z-index: 1;
  backface-visibility: hidden;
  transform: translateZ(0);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.gallery-image.image-loading {
  opacity: 0;
}

.gallery-image.image-loaded {
  opacity: 1;
}

.gallery-image.image-error {
  opacity: 0.5;
  background-color: #f8f8f8;
  border: 1px dashed #ccc;
}

@media screen and (max-width: 768px) {
  .gallery {
    min-height: auto !important;
    height: auto !important;
  }
  .gallery-image {
    height: 40vh !important;
  }
}

/* Also hide scrollbars on the gallery container */
.gallery-container::-webkit-scrollbar {
  display: none;
}
</style>

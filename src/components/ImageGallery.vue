<template>
  <div 
    class="gallery-container" 
    :class="{ 'clickable': !isActive }"
  >
    <div 
      class="gallery" 
      ref="gallery" 
      :style="galleryContainerStyle" 
      @click="handleGalleryClick"
      @mouseenter="isHovering = true" 
      @mouseleave="isHovering = false"
    >
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
import navigationManager from '../utils/navigationManager';

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
    imageHeight: { type: String, default: '230rem' },
    imageWidth: { type: String, default: 'auto' },
    imageQuality: { type: Number, default: 85 },
    imageFormat: { type: String, default: null },
    resolutionRatio: { type: Number, default: 1, validator: value => value > 0 }
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
    navigateToShow() {
      if (!this.isActive && !this.isScrolling) {
        navigationManager.navigateTo(this.router, `/shows/${this.slug}`);
      }
    },
    handleGalleryClick() {
      this.navigateToShow();
    },
    handleScrollStart(event) {
      if (this.isActive) return;
      this.scrollStartX = event.touches ? event.touches[0].clientX : event.clientX;
      this.isScrolling = false;
    },
    handleScrollMove(event) {
      if (this.isActive || !this.scrollStartX) return;
      const currentX = event.touches ? event.touches[0].clientX : event.clientX;
      const diffX = Math.abs(currentX - this.scrollStartX);
      if (diffX > 5) this.isScrolling = true;
    },
    handleScrollEnd() {
      if (this.isActive) return;
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.isScrolling = false;
        this.scrollStartX = 0;
      }, 100);
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
    preloadNextImages() {
      const gallery = this.$refs.gallery;
      if (!gallery) return;

      const images = gallery.querySelectorAll('img.gallery-image');

      images.forEach((img, index) => {
        const rect = img.getBoundingClientRect();
        const preloadDistance = 300;

        if (
          rect.left > window.innerWidth &&
          rect.left - window.innerWidth < preloadDistance &&
          !img.dataset.preloaded
        ) {
          const src = img.getAttribute('src');
          if (src) {
            const preloadImg = new Image();
            preloadImg.src = src;
            img.dataset.preloaded = 'true';
          }
        }
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
          alt: image.alt || 'Image',
          preload: false
        };
      });
      const repeated = [];
      for (let i = 0; i < this.repeatCount; i++) repeated.push(...processed);
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
    }
  },
  mounted() {
    const gallery = this.$refs.gallery;
    if (gallery) {
      gallery.addEventListener('mousedown', this.handleScrollStart);
      gallery.addEventListener('mousemove', this.handleScrollMove);
      gallery.addEventListener('mouseup', this.handleScrollEnd);
      gallery.addEventListener('mouseleave', this.handleScrollEnd);
      gallery.addEventListener('touchstart', this.handleScrollStart);
      gallery.addEventListener('touchmove', this.handleScrollMove);
      gallery.addEventListener('touchend', this.handleScrollEnd);
      gallery.addEventListener('scroll', this.preloadNextImages);
    }

    this.$nextTick(() => {
      setTimeout(() => this.preloadNextImages(), 300);
    });
  },
  beforeUnmount() {
    const gallery = this.$refs.gallery;
    if (gallery) {
      gallery.removeEventListener('mousedown', this.handleScrollStart);
      gallery.removeEventListener('mousemove', this.handleScrollMove);
      gallery.removeEventListener('mouseup', this.handleScrollEnd);
      gallery.removeEventListener('mouseleave', this.handleScrollEnd);
      gallery.removeEventListener('touchstart', this.handleScrollStart);
      gallery.removeEventListener('touchmove', this.handleScrollMove);
      gallery.removeEventListener('touchend', this.handleScrollEnd);
      gallery.removeEventListener('scroll', this.preloadNextImages);
    }
    clearTimeout(this.scrollTimeout);
  }
};
</script>


<style>
.gallery-container {
  width: 100%;
  overflow: visible;
  line-height: 0;
  position: relative;
  --gallery-hover-shift-amount: 10px;
}

.gallery-container.clickable .gallery,
.gallery-container.clickable .gallery-item {
  cursor: pointer;
}

.gallery {
  display: flex;
  overflow-x: auto;
  width: calc(100% + var(--gallery-hover-shift-amount));
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  transition: transform .8s ease;
  
}

.gallery::-webkit-scrollbar {
  display: none;
}

.gallery-item {
  flex: 0 0 auto;
  scroll-snap-align: start;
  position: relative;
  min-width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  margin-right: -1px; /* -1px to prevent gap between images */
}

.gallery-item:first-of-type {
  padding-left: 3rem; /* indicate first image */
}

.gallery-tags {
  display: flex;
  gap: 3rem;
  padding: 3rem 3rem 3rem 3rem;
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
}

.gallery-image.image-loading {
  opacity: 0;
}

.gallery-image.image-loaded {
  opacity: 1;
  transition: none;
}

.gallery-image.image-error {
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
    height: 40vh !important;
  }
}
</style>

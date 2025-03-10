<template>
  <div class="gallery-container">
    <div class="gallery" ref="gallery" :style="galleryContainerStyle">
      <div 
        v-for="(image, index) in processedImages" 
        :key="index" 
        class="gallery-item"
        :style="galleryItemStyle"
      >
        <img 
          v-lazy-load="{ url: image.url, index: index, resetQueue: true }"
          :alt="image.alt"
          :style="imageStyle"
          :data-index="index"
          class="gallery-image">
      </div>
    </div>
    <div class="gallery-tags">
      <ButtonBase v-if="name" :to="`/shows/${slug}`" :variant="isActive ? 'active' : 'black'">{{ name }}</ButtonBase>
      <ButtonBase v-if="location" variant="grey">{{ location }}</ButtonBase>
      <ButtonBase v-if="date" variant="grey">{{ date }}</ButtonBase>
    </div>
  </div>
</template>

<script>
import ButtonBase from './BaseButton.vue';
import lazyLoad from '../directives/lazyLoad';
import { createImageUrl } from '../utils/storyblok';

export default {
  name: 'ImageGallery',
  components: {
    ButtonBase
  },
  directives: {
    lazyLoad
  },
  props: {
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
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
    }
  },

  computed: {
    processedImages() {
      // Process images with the requested transformations
      if (!this.images || !Array.isArray(this.images) || this.images.length === 0) {
        console.warn('No images provided to ImageGallery component');
        return [];
      }
      
      console.log('Processing images:', this.images);
      
      const processed = this.images.map((image, index) => {
        // Extract numeric height value (remove 'rem' or 'px')
        const heightValue = parseInt(this.imageHeight, 10) || 230;
        
        // Make sure we have a valid URL
        if (!image || !image.url) {
          console.warn(`Image at index ${index} has no URL:`, image);
          return {
            url: '',
            alt: 'Missing image'
          };
        }
        
        // Request 2x resolution from Storyblok
        const transformedUrl = createImageUrl(image.url, {
          width: 0, // Auto width
          height: heightValue * 2, // x height for high-DPI displays
          quality: this.imageQuality,
          format: this.imageFormat
        });
        
        // console.log(`Transformed URL for image ${index}:`, transformedUrl);
        
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
    }
  }
}
</script>

<style>
.gallery-container {
  width: 100%;
  overflow: hidden;
  line-height: 0;
}

.gallery {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  background-color: #f0f0f0; /* Placeholder background color */
}

.gallery::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.gallery-item {
  flex: 0 0 auto;
  scroll-snap-align: start;
  position: relative;
  min-width: 100px; /* Minimum width to prevent collapse during loading */
  display: flex;
  justify-content: center;
  align-items: center;
}

.gallery-item:first-of-type {
  padding-left: 1rem;
}

.gallery-tags {
  display: flex;
  gap: 3rem;
  margin: 3rem;
}

.gallery-image {
  width: auto;
  object-fit: cover;
  transition: opacity 0.8s ease-out;
  position: relative;
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
</style> 
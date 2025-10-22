<template>
  <div 
    class="carousel" 
    :style="carouselStyle"
    ref="carousel"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @click="handleClick"
  >
    <div
      v-for="(image, index) in processedImages"
      :key="`carousel-${index}-${image.url}`"
      class="item"
      :style="getItemStyle(image)"
    >
      <AppearingImage
        :lazy-src="image.url"
        :alt="image.alt || `Image ${index + 1}`"
      />
    </div>
  </div>
</template>

<script>
import AppearingImage from './AppearingImage.vue';

export default {
  name: 'LazyCarousel',
  components: { AppearingImage },
  props: {
    // Array of image objects: [{ url: string, alt?: string }]
    images: {
      type: Array,
      required: true,
      default: () => []
    },
    // Carousel height (supports vh, rem, px, or calc expressions)
    height: {
      type: String,
      default: '80vh'
    }
  },
  data() {
    return {
      isDragging: false,
      dragStartX: 0,
      dragStartScrollLeft: 0,
      hasDragged: false,
      dragThreshold: 5
    };
  },
  computed: {
    carouselStyle() {
      return {
        height: this.height
      };
    },
    processedImages() {
      if (!this.images || !Array.isArray(this.images)) return [];
      
      return this.images.map((image, index) => {
        // Support both string URLs and image objects
        if (typeof image === 'string') {
          return {
            url: image,
            alt: `Image ${index + 1}`,
            aspectRatio: this.extractAspectRatio(image)
          };
        }
        
        return {
          url: image.url || '',
          alt: image.alt || `Image ${index + 1}`,
          aspectRatio: this.extractAspectRatio(image.url)
        };
      });
    }
  },
  methods: {
    extractAspectRatio(url) {
      if (!url) return '4 / 5';
      
      // Extract width/height ratio from Storyblok URLs
      const match = url.match(/\/(\d+)x(\d+)\//);
      if (!match) return '4 / 5';
      
      const [, width, height] = match;
      return `${width} / ${height}`;
    },
    
    getItemStyle(image) {
      return {
        aspectRatio: image.aspectRatio
      };
    },
    
    // Drag handling methods
    handleMouseDown(event) {
      if (event.button !== 0) return;
      
      this.isDragging = true;
      this.hasDragged = false;
      this.dragStartX = event.clientX;
      this.dragStartScrollLeft = this.$refs.carousel.scrollLeft;
      
      this.$refs.carousel.style.scrollBehavior = 'auto';
      this.$refs.carousel.style.cursor = 'grabbing';
      event.preventDefault();
    },
    
    handleMouseMove(event) {
      if (!this.isDragging) return;
      
      const dragDistance = Math.abs(event.clientX - this.dragStartX);
      if (dragDistance > this.dragThreshold) {
        this.hasDragged = true;
      }
      
      const scrollDelta = this.dragStartX - event.clientX;
      this.$refs.carousel.scrollLeft = this.dragStartScrollLeft + scrollDelta;
    },
    
    handleMouseUp() {
      if (!this.isDragging) return;
      
      this.isDragging = false;
      this.$refs.carousel.style.scrollBehavior = '';
      this.$refs.carousel.style.cursor = '';
    },
    
    handleMouseLeave() {
      if (this.isDragging) {
        this.handleMouseUp();
      }
    },
    
    // Touch handling methods
    handleTouchStart(event) {
      this.isDragging = true;
      this.hasDragged = false;
      this.dragStartX = event.touches[0].clientX;
      this.dragStartScrollLeft = this.$refs.carousel.scrollLeft;
    },
    
    handleTouchMove(event) {
      if (!this.isDragging) return;
      
      const dragDistance = Math.abs(event.touches[0].clientX - this.dragStartX);
      if (dragDistance > this.dragThreshold) {
        this.hasDragged = true;
      }
    },
    
    handleTouchEnd() {
      this.isDragging = false;
    },
    
    // Click navigation - always advance to next image
    handleClick(event) {
      // Prevent navigation if user just dragged
      if (this.hasDragged) {
        event.preventDefault();
        event.stopPropagation();
        this.hasDragged = false;
        return;
      }
      
      this.navigateToNext();
    },
    
    navigateToNext() {
      const carousel = this.$refs.carousel;
      if (!carousel || !this.processedImages.length) return;
      
      const items = carousel.querySelectorAll('.item');
      if (!items.length) return;
      
      const currentScrollLeft = carousel.scrollLeft;
      const viewportLeft = currentScrollLeft;
      
      // Find the currently visible item
      let currentItemIndex = 0;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemLeft = item.offsetLeft;
        const itemRight = itemLeft + item.offsetWidth;
        
        if (itemLeft <= viewportLeft && itemRight > viewportLeft) {
          currentItemIndex = i;
          break;
        }
      }
      
      // Navigate to next item (with wrapping)
      const nextIndex = (currentItemIndex + 1) % items.length;
      const targetItem = items[nextIndex];
      
      if (targetItem) {
        carousel.scrollTo({
          left: targetItem.offsetLeft,
          behavior: 'smooth'
        });
      }
    }
  }
};
</script>

<style scoped>
.carousel {
  display: flex;
  overflow-x: auto;
  width: 100%;
  gap: 0;
  padding: 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  cursor: grab;
}

.carousel::-webkit-scrollbar {
  display: none;
}

.carousel:active {
  cursor: grabbing;
}

.item {
  flex: 0 0 auto;
  height: 100%;
  position: relative;
  background: #ffffff;
  overflow: hidden;
  border-radius: 0;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.appearing-image-container {
  width: 100%;
  height: 100%;
  display: block;
}

@media screen and (max-width: 768px) {
  .carousel {
    cursor: default;
  }
  
  .carousel:active {
    cursor: default;
  }
}
</style>
<template>
  <div class="image-reveal-wrapper" :class="{ reveal: isRevealed }" :style="transitionStyle">
    <img :src="src" class="image base" :alt="alt" :style="imageStyle" />
    <img
      :src="src"
      class="image overlay"
      :class="{ reveal: isRevealed }"
      @load="handleImageLoad"
      loading="lazy"
      :style="imageStyle"
    />
  </div>
</template>

<script>
// Create a singleton to track revealed images across component instances
const revealedImages = new Set();

export default {
  name: 'ImageReveal',
  props: {
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    duration: { type: Number, default: 4000 },
    easing: { type: String, default: 'cubic-bezier(0, 0, .001, 1)' },
    imageStyle: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      isRevealed: false
    };
  },
  computed: {
    transitionStyle() {
      return {
        '--duration': `${this.duration}ms`,
        '--easing': this.easing
      };
    }
  },
  methods: {
    handleImageLoad() {
      console.log('Image loaded:', this.src);
      console.log('Current reveal state:', this.isRevealed);
      console.log('Is image in revealed set:', revealedImages.has(this.src));
      
      if (revealedImages.has(this.src)) {
        console.log('Image was revealed before, setting to revealed state immediately');
        this.isRevealed = true;
      } else {
        console.log('First time seeing this image, triggering reveal animation');
        this.startReveal();
        // Add to the set of revealed images
        revealedImages.add(this.src);
      }
      
      this.$emit('load');
    },
    startReveal() {
      console.log('Starting reveal animation');
      this.isRevealed = true;
    }
  },
  mounted() {
    console.log('Component mounted for image:', this.src);
    console.log('Is image in revealed set:', revealedImages.has(this.src));
    
    if (revealedImages.has(this.src)) {
      console.log('Setting to revealed state on mount');
      this.isRevealed = true;
    }
  },
  beforeUnmount() {
    console.log('Component unmounting for image:', this.src);
  }
};
</script>

<style scoped>
.image-reveal-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.8s ease-in;
}

.image-reveal-wrapper.reveal {
  opacity: 1;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
}

.image.base {
  z-index: 0;
  filter: none;
}

.image.overlay {
  z-index: 1;
  filter: brightness(400%) grayscale(100%) contrast(2000%);
  mix-blend-mode: screen;
  transition: filter var(--duration) var(--easing);
}

.image.overlay.reveal {
  filter: brightness(0%) grayscale(100%) contrast(2000%);
}
</style> 
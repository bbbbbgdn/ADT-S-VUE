<template>
  <div class="appearing-image-container">
    <!-- Hidden image for loading - this handles the actual image load -->
    <img
      ref="loaderImage"
      :src="actualSrc"
      :alt="alt"
      class="loader-image"
      @load="onImageLoad"
      @error="onImageError"
    >

    <!-- Original image (background layer) - uses loaded src via inline style -->
    <div
      ref="originalImage"
      class="image original-image"
      :style="{ backgroundImage: imageSrc ? `url('${imageSrc}')` : 'none' }"
    ></div>

    <!-- Filtered image (foreground layer with animation) -->
    <div
      ref="filteredImage"
      class="image filtered-image"
      :style="{ 
        backgroundImage: imageSrc ? `url('${imageSrc}')` : 'none',
        filter: imageFilter 
      }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'AppearingImage',
  props: {
    src: {
      type: String,
      required: false,
      default: ''
    },
    lazySrc: {
      type: String,
      required: false,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isAnimating: false,
      animationStartTime: null,
      animationStartValue: 0,
      animationTargetValue: 0,
      currentBrightness: 2000, // Start hidden (brightnessMax)
      imageLoaded: false,
      imageSrc: null, // Will be set after image loads
      actualSrc: '', // The actual source to load (either from src or lazySrc after intersection)
      observer: null,
      // Hardcoded animation settings
      animationDuration: 1500,
      easingFunction: 'ease-out',
      brightnessMin: 0,
      brightnessMax: 1500,
      grayscaleValue: 100,
      contrastValue: 50000,
      // Debug info
      componentId: Math.random().toString(36).substr(2, 9)
    }
  },
  computed: {
    imageFilter() {
      return `brightness(${this.currentBrightness}%) grayscale(${this.grayscaleValue}%) contrast(${this.contrastValue}%)`;
    }
  },
  methods: {
    onImageLoad() {
      console.log(`[${this.componentId}] onImageLoad fired`, {
        imageLoaded: this.imageLoaded,
        imageSrc: this.imageSrc,
        actualSrc: this.actualSrc,
        loaderImageComplete: this.$refs.loaderImage?.complete,
        loaderImageNaturalHeight: this.$refs.loaderImage?.naturalHeight
      });
      
      // Prevent double animation if already loaded
      if (this.imageLoaded) {
        console.log(`[${this.componentId}] AppearingImage: Image already loaded, skipping animation`);
        return;
      }
      
      console.log(`[${this.componentId}] AppearingImage: Image loaded, setting src and starting animation`);
      this.imageLoaded = true;
      // Set the image source after it's fully loaded
      this.imageSrc = this.actualSrc;
      
      console.log(`[${this.componentId}] imageSrc set to:`, this.imageSrc);
      
      // Start animation immediately after setting the src
      this.$nextTick(() => {
        console.log(`[${this.componentId}] $nextTick - about to start animation, imageSrc:`, this.imageSrc);
        this.startAppearingAnimation();
      });
    },

    onImageError() {
      console.warn('AppearingImage: Failed to load image', this.actualSrc);
      // Emit error event for parent to handle
      this.$emit('error', new Error(`Failed to load image: ${this.actualSrc}`));
    },

    startAppearingAnimation() {
      console.log(`[${this.componentId}] startAppearingAnimation called`, {
        isAnimating: this.isAnimating,
        imageSrc: this.imageSrc,
        currentBrightness: this.currentBrightness
      });
      
      if (this.isAnimating) {
        console.log(`[${this.componentId}] Already animating, returning`);
        return;
      }

      this.isAnimating = true;

      // Instantly hide the image first
      this.animationStartValue = this.brightnessMax;
      this.currentBrightness = this.brightnessMax;

      // Then start the appearing animation
      this.animationTargetValue = this.brightnessMin;
      this.animationStartTime = null;

      console.log(`[${this.componentId}] Animation started`, {
        startValue: this.animationStartValue,
        targetValue: this.animationTargetValue,
        imageSrc: this.imageSrc
      });

      this.animateValues();
    },

    animateValues() {
      if (!this.isAnimating) return;

      const currentTime = performance.now();

      if (this.animationStartTime === null) {
        this.animationStartTime = currentTime;
      }

      const elapsed = currentTime - this.animationStartTime;
      const progress = Math.min(elapsed / this.animationDuration, 1);

      const easedProgress = this.easingFunctions[this.easingFunction](progress);

      // Interpolate between start and target values
      this.currentBrightness = this.animationStartValue + (this.animationTargetValue - this.animationStartValue) * easedProgress;

      if (progress < 1) {
        // Animation not complete, continue
        requestAnimationFrame(this.animateValues);
      } else {
        // Animation complete
        console.log(`[${this.componentId}] Animation complete`, {
          finalBrightness: this.currentBrightness,
          imageSrc: this.imageSrc
        });
        this.isAnimating = false;
        this.animationStartTime = null;
        
        // Debug: Check actual DOM state after animation
        this.$nextTick(() => {
          setTimeout(() => {
            console.log(`[${this.componentId}] POST-ANIMATION DOM CHECK:`, {
              imageSrc: this.imageSrc,
              originalImageStyle: this.$refs.originalImage?.style.backgroundImage,
              filteredImageStyle: this.$refs.filteredImage?.style.backgroundImage,
              computedOriginalStyle: window.getComputedStyle(this.$refs.originalImage).backgroundImage,
              computedFilteredStyle: window.getComputedStyle(this.$refs.filteredImage).backgroundImage
            });
          }, 100);
        });
        
        // Emit completion event
        this.$emit('animation-complete');
      }
    },

    // Public method to restart animation (for parent components)
    restartAnimation() {
      if (this.imageLoaded) {
        this.startAppearingAnimation();
      }
    },

    setupLazyLoading() {
      console.log(`[${this.componentId}] Setting up lazy loading for:`, this.lazySrc);
      
      const loadImage = () => {
        console.log(`[${this.componentId}] Lazy load triggered, setting actualSrc to:`, this.lazySrc);
        this.actualSrc = this.lazySrc;
        if (this.observer) {
          this.observer.disconnect();
        }
      };

      this.observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              loadImage();
            }
          });
        },
        { rootMargin: '100px' }
      );

      this.observer.observe(this.$el);
    }
  },
  created() {
    console.log(`[${this.componentId}] Component created`, {
      src: this.src,
      imageLoaded: this.imageLoaded,
      imageSrc: this.imageSrc
    });
    
    // Define easing functions
    this.easingFunctions = {
      linear: t => t,
      'ease-in': t => t * t,
      'ease-out': t => t * (2 - t),
      'ease-in-out': t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
      'cubic-in': t => t * t * t,
      'cubic-out': t => (--t) * t * t + 1,
      'cubic-in-out': t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
      'quartic-in': t => t * t * t * t,
      'quartic-out': t => 1 - (--t) * t * t * t,
      'quartic-in-out': t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
      'sinusoidal-in': t => 1 - Math.cos((t * Math.PI) / 2),
      'sinusoidal-out': t => Math.sin((t * Math.PI) / 2),
      'sinusoidal-in-out': t => -(Math.cos(Math.PI * t) - 1) / 2,
      'bounce-out': t => {
        if (t < 1 / 2.75) return 7.5625 * t * t;
        if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      },
      'elastic-out': t => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
      }
    };
  },
  mounted() {
    console.log(`[${this.componentId}] Component mounted`, {
      src: this.src,
      lazySrc: this.lazySrc,
      loaderImageExists: !!this.$refs.loaderImage,
      loaderImageComplete: this.$refs.loaderImage?.complete,
      loaderImageNaturalHeight: this.$refs.loaderImage?.naturalHeight,
      imageLoaded: this.imageLoaded,
      imageSrc: this.imageSrc
    });
    
    // If lazySrc is provided, set up intersection observer for lazy loading
    if (this.lazySrc) {
      this.setupLazyLoading();
    } else if (this.src) {
      // If regular src is provided, load immediately
      this.actualSrc = this.src;
      
      // Check if image is already cached/loaded (for navigation back scenarios)
      this.$nextTick(() => {
        if (this.$refs.loaderImage && this.$refs.loaderImage.complete && this.$refs.loaderImage.naturalHeight !== 0) {
          console.log(`[${this.componentId}] AppearingImage: Image already cached, setting src and triggering animation immediately`);
          this.imageLoaded = true;
          this.imageSrc = this.actualSrc;
          
          console.log(`[${this.componentId}] Cached - imageSrc set to:`, this.imageSrc);
          
          this.$nextTick(() => {
            console.log(`[${this.componentId}] Cached - $nextTick, about to start animation`);
            this.startAppearingAnimation();
          });
        } else {
          console.log(`[${this.componentId}] Image not cached yet, waiting for @load event`);
        }
      });
    }
  },
  beforeUnmount() {
    console.log(`[${this.componentId}] Component beforeUnmount`, {
      imageLoaded: this.imageLoaded,
      imageSrc: this.imageSrc,
      isAnimating: this.isAnimating
    });
    
    // Cancel any ongoing animation
    this.isAnimating = false;
    
    // Disconnect intersection observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },
  watch: {
    imageSrc(newVal, oldVal) {
      console.log(`[${this.componentId}] imageSrc changed`, {
        oldValue: oldVal,
        newValue: newVal
      });
    },
    src(newVal, oldVal) {
      console.log(`[${this.componentId}] src prop changed`, {
        oldValue: oldVal,
        newValue: newVal
      });
    }
  }
}
</script>

<style scoped>
.appearing-image-container {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
}

/* Hidden loader image - only used to trigger load event */
.loader-image {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
    /* Force GPU acceleration in Safari */
  transform: translateZ(0);
  will-change: filter;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  perspective: 1000px;
  -webkit-perspective: 1000px;
}

.filtered-image {
  z-index: 10;
  mix-blend-mode: lighten;
}
</style>

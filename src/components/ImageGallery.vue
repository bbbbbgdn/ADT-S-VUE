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
      @mouseenter="handleMouseEnter" 
      @mouseleave="handleMouseLeave"
      :class="[{ 'manual-scroll': !enableHoverScroll }, { 'auto-scrolling': isHovering && enableHoverScroll }, { 'auto-scroll-active': isAutoScrolling }, { 'dragging': isDragging }]"
      @click="handleGalleryClick"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @selectstart="handleSelectStart"
      @scroll="handleScroll"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @wheel="handleWheel"
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

    <div 
      v-if="shouldShowTags" 
      class="gallery-tags" 
      @click.stop
      ref="galleryTags"
      @scroll="handleTagsScroll"
      @touchstart="handleTagsTouchStart"
      @touchend="handleTagsTouchEnd"
      @mouseenter="handleTagsMouseEnter"
      @mouseleave="handleTagsMouseLeave"
    >
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
    enableAutoScroll: { type: Boolean, default: false },
    autoScrollSpeed: { type: Number, default: 8 },
    autoScrollPauseOnHover: { type: Boolean, default: true },
    autoScrollPauseOnTouch: { type: Boolean, default: true },
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
      // Auto-scroll data
      autoScrollAnimationId: null,
      autoScrollPosition: 0,
      autoScrollFractionalPixels: 0, // Accumulate fractional pixels
      isAutoScrolling: false,
      isUserInteracting: false,
      lastUserInteractionTime: 0,
      userInteractionTimeout: null,
      lastScrollLeft: 0,
      scrollCheckInterval: null,
      wheelTimeout: null,
      // Tags scroll data
      tagsScrollTimeout: null,
      isTagsScrolling: false,
      tagsOriginalPosition: 0,
      tagsSpringAnimationId: null,
      lastScrollCheckTime: 0,
      scrollVelocity: 0,
      // Drag functionality data
      isDragging: false,
      dragStartX: 0,
      dragStartScrollLeft: 0,
      dragCurrentX: 0,
      dragThreshold: 5, // Minimum pixels to move before considering it a drag
      hasDragged: false, // Track if user has actually dragged
      shouldPreventClick: false, // Flag to prevent click after drag
    };
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    return { router, route };
  },
  methods: {
    handleGalleryClick(event) {
      console.log('Gallery click - isActive:', this.isActive, 'shouldPreventClick:', this.shouldPreventClick, 'hasDragged:', this.hasDragged);
      
      // SWAPPED BEHAVIOR:
      // For non-active galleries (like in Shows page), prevent navigation if dragged
      // For active galleries (like in ShowPage/ProjectPage), always allow navigation
      if (!this.isActive && (this.shouldPreventClick || this.hasDragged)) {
        console.log('Preventing navigation due to drag on non-active gallery');
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      
      console.log('Navigating to:', this.slug);
      // Navigate for active galleries or simple clicks on non-active galleries
      this.router.push(`/shows/${this.slug}`);
    },
    
    // Auto-scroll methods
    startAutoScroll() {
      if (this.isAutoScrolling) return;
      
      // Don't start auto-scroll for manual-scroll galleries
      if (!this.enableHoverScroll) return;
      
      const gallery = this.$refs.gallery;
      if (!gallery) return;
      
      this.isAutoScrolling = true;
      this.autoScrollPosition = gallery.scrollLeft;
      this.autoScrollFractionalPixels = 0; // Reset fractional pixels
      this.animateAutoScroll();
    },
    
    stopAutoScroll() {
      this.isAutoScrolling = false;
      if (this.autoScrollAnimationId) {
        cancelAnimationFrame(this.autoScrollAnimationId);
        this.autoScrollAnimationId = null;
      }
      // Keep the current scroll position when stopping
      this.autoScrollPosition = this.$refs.gallery?.scrollLeft || 0;
    },
    
    animateAutoScroll() {
      if (!this.isAutoScrolling) {
        this.autoScrollAnimationId = requestAnimationFrame(() => this.animateAutoScroll());
        return;
      }
      
      const gallery = this.$refs.gallery;
      if (!gallery) return;
      
      // Pause auto-scroll if user is interacting
      if (this.isUserInteracting) {
        this.autoScrollAnimationId = requestAnimationFrame(() => this.animateAutoScroll());
        return;
      }
      
      // Calculate max scroll position
      const maxScroll = gallery.scrollWidth - gallery.clientWidth;
      
      // Update position using autoScrollSpeed (pixels per second)
      // Accumulate fractional pixels for smooth movement
      this.autoScrollFractionalPixels += this.autoScrollSpeed / 60;
      
      // Only move by whole pixels when we have accumulated enough
      if (this.autoScrollFractionalPixels >= 1) {
        const wholePixels = Math.floor(this.autoScrollFractionalPixels);
        this.autoScrollPosition += wholePixels;
        this.autoScrollFractionalPixels -= wholePixels;
      }
      
      // Don't reset position when reaching the end - let it stay at the end
      if (this.autoScrollPosition >= maxScroll) {
        this.autoScrollPosition = maxScroll;
        // Stop auto-scroll when reaching the end
        this.stopAutoScroll();
        return;
      }
      
      // Use native scroll instead of transform, but only if not being manually scrolled
      // Add a small buffer to prevent conflicts with manual scrolling
      const currentScrollLeft = gallery.scrollLeft;
      const scrollDifference = Math.abs(currentScrollLeft - this.lastScrollLeft);
      
      if (scrollDifference < 0.5) { // Very small threshold to prevent conflicts
        gallery.scrollLeft = this.autoScrollPosition;
      } else {
        // Manual scrolling detected, update auto-scroll position to match
        this.autoScrollPosition = currentScrollLeft;
      }
      
      this.lastScrollLeft = gallery.scrollLeft;
      
      // Continue animation
      this.autoScrollAnimationId = requestAnimationFrame(() => this.animateAutoScroll());
    },
    
    handleUserInteraction() {
      this.isUserInteracting = true;
      this.lastUserInteractionTime = Date.now();
      
      // Resume auto-scroll after a delay if user stops interacting
      clearTimeout(this.userInteractionTimeout);
      this.userInteractionTimeout = setTimeout(() => {
        this.isUserInteracting = false;
      }, 1000); // 1 second delay for smoother experience
    },
    
    handleScroll() {
      const gallery = this.$refs.gallery;
      if (!gallery) return;
      
      // Detect if this is manual scrolling
      const currentScrollLeft = gallery.scrollLeft;
      const scrollDifference = Math.abs(currentScrollLeft - this.lastScrollLeft);
      
      if (scrollDifference > 5) { // Threshold to detect manual scrolling
        this.isUserInteracting = true;
        this.autoScrollPosition = currentScrollLeft;
      }
      
      this.lastScrollLeft = currentScrollLeft;
      
      // Clear existing timeout and set new one to detect when scrolling stops
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        // Check if scrolling has actually stopped (no inertia)
        this.checkScrollInertia();
      }, 300); // Slightly longer delay for better detection
    },
    
    handleTouchStart(event) {
      this.isUserInteracting = true;
      
      // For touch devices, we can also implement drag-like behavior
      // but for now, just pause auto-scroll
      if (this.isAutoScrolling) {
        this.stopAutoScroll();
      }
    },
    
    handleTouchMove(event) {
      this.isUserInteracting = true;
      
      // Update auto-scroll position to match current scroll
      const gallery = this.$refs.gallery;
      if (gallery) {
        this.autoScrollPosition = gallery.scrollLeft;
      }
    },
    
    handleWheel(event) {
      // Handle horizontal scrolling
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        this.isUserInteracting = true;
        this.autoScrollPosition = this.$refs.gallery?.scrollLeft || 0;
        // Resume auto-scroll after wheel interaction
        clearTimeout(this.wheelTimeout);
        this.wheelTimeout = setTimeout(() => {
          this.checkScrollInertia();
        }, 500);
      }
    },
    
    // Drag functionality methods
    handleMouseDown(event) {
      // Only start dragging on left mouse button
      if (event.button !== 0) return;
      
      const gallery = this.$refs.gallery;
      if (!gallery) return;
      
      console.log('Mouse down - starting drag');
      this.isDragging = true;
      this.isUserInteracting = true;
      this.hasDragged = false; // Reset drag flag
      this.shouldPreventClick = false; // Reset click prevention flag
      this.dragStartX = event.clientX;
      this.dragStartScrollLeft = gallery.scrollLeft;
      this.dragCurrentX = event.clientX;
      
      // Pause auto-scroll during dragging
      this.stopAutoScroll();
      
      // Prevent text selection during drag
      event.preventDefault();
    },
    
    handleMouseMove(event) {
      if (!this.isDragging) return;
      
      const gallery = this.$refs.gallery;
      if (!gallery) return;
      
      // Check if we've moved enough to consider it a drag
      const dragDistance = Math.abs(event.clientX - this.dragStartX);
      if (dragDistance > this.dragThreshold) {
        if (!this.hasDragged) {
          console.log('Drag threshold exceeded - setting flags');
          this.hasDragged = true;
          this.shouldPreventClick = true; // Set flag to prevent click
        }
      }
      
      // Move the gallery by the mouse movement
      const scrollDelta = this.dragStartX - event.clientX;
      gallery.scrollLeft = this.dragStartScrollLeft + scrollDelta;
      
      this.dragCurrentX = event.clientX;
      
      // Update auto-scroll position to match current scroll
      this.autoScrollPosition = gallery.scrollLeft;
    },
    
    handleMouseUp(event) {
      if (!this.isDragging) return;
      
      console.log('Mouse up - hasDragged:', this.hasDragged, 'shouldPreventClick:', this.shouldPreventClick);
      this.isDragging = false;
      this.isUserInteracting = false;
      
      // Simply resume auto-scroll after drag ends
      this.resumeAutoScrollAfterDrag();
      
      // Don't reset shouldPreventClick here - let it persist until next mouse down
      // This ensures click events are prevented after drag
    },
    
    handleSelectStart(event) {
      // Prevent text selection during drag
      if (this.isDragging) {
        event.preventDefault();
      }
    },
    

    
    resumeAutoScrollAfterDrag() {
      // Resume auto-scroll after a short delay only if enabled
      setTimeout(() => {
        if (!this.isDragging && this.isHovering && this.enableAutoScroll && this.enableHoverScroll) {
          this.startAutoScroll();
        }
      }, 200);
    },
    
    checkScrollInertia() {
      const gallery = this.$refs.gallery;
      if (!gallery || !this.isAutoScrolling) return;
      
      const currentTime = Date.now();
      const currentScrollLeft = gallery.scrollLeft;
      
      // Calculate scroll velocity
      if (this.lastScrollCheckTime > 0) {
        const timeDiff = currentTime - this.lastScrollCheckTime;
        const scrollDiff = currentScrollLeft - this.lastScrollLeft;
        this.scrollVelocity = scrollDiff / timeDiff; // pixels per millisecond
      }
      
      // Check if scrolling has truly stopped (velocity is very low)
      if (Math.abs(this.scrollVelocity) < 0.01) { // Very low velocity threshold
        // Add a small delay to ensure inertia is completely finished
        setTimeout(() => {
          this.isUserInteracting = false;
          this.autoScrollPosition = currentScrollLeft;
          this.scrollVelocity = 0;
        }, 100);
      } else {
        // Still scrolling, check again in a short time
        setTimeout(() => {
          this.checkScrollInertia();
        }, 50);
      }
      
      this.lastScrollCheckTime = currentTime;
      this.lastScrollLeft = currentScrollLeft;
    },
    
    handleMouseEnter() {
      this.isHovering = true;
      // Start auto-scroll on hover only if enabled
      if (this.enableHoverScroll) {
        this.startAutoScroll();
      }
    },
    
    handleMouseLeave() {
      this.isHovering = false;
      
      // If dragging, stop the drag
      if (this.isDragging) {
        this.isDragging = false;
        this.isUserInteracting = false;
        this.hasDragged = false; // Reset drag flag
        this.shouldPreventClick = false; // Reset click prevention flag
      }
      
      // Stop auto-scroll when not hovering
      this.stopAutoScroll();
    },
    
    customizeImageParams(options = {}) {
      let parsedHeight;
      
      // Handle calc() expressions by getting the computed style
      if (this.imageHeight.includes('calc(')) {
        // Get the actual computed height from the gallery container
        const galleryContainer = this.$refs.galleryContainer;
        if (galleryContainer) {
          const computedStyle = window.getComputedStyle(galleryContainer);
          parsedHeight = parseFloat(computedStyle.height);
        } else {
          // Fallback: try to parse calc() manually for common cases
          const calcMatch = this.imageHeight.match(/calc\(([^)]+)\)/);
          if (calcMatch) {
            const calcExpression = calcMatch[1];
            // Handle common calc expressions like "100vh - 97rem"
            if (calcExpression.includes('100vh') && calcExpression.includes('97rem')) {
              const vhHeight = window.innerHeight;
              const remValue = 97 * parseFloat(getComputedStyle(document.documentElement).fontSize);
              parsedHeight = vhHeight - remValue;
            } else {
              // Generic fallback
              parsedHeight = window.innerHeight * 0.8; // 80vh as fallback
            }
          } else {
            parsedHeight = window.innerHeight * 0.8; // 80vh as fallback
          }
        }
      } else if (this.imageHeight.includes('vh')) {
        const vhValue = parseFloat(this.imageHeight);
        parsedHeight = Math.round((vhValue / 100) * window.innerHeight);
      } else if (this.imageHeight.includes('rem')) {
        const baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        parsedHeight = parseFloat(this.imageHeight) * baseFontSize;
      } else {
        parsedHeight = parseInt(this.imageHeight) || 100;
      }
      
      // Width should always be 0 for adaptive aspect ratio
      const parsedWidth = 0;
      
      // Apply resolution ratio for high-DPI displays
      const scaledHeight = Math.round(parsedHeight * this.resolutionRatio);
      const scaledWidth = 0; // Keep width at 0 for adaptive aspect ratio
      
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
      
      // Force re-calculation of image parameters when dimensions change
      // This ensures images are requested at the correct height after resize
      this.$nextTick(() => {
        this.$forceUpdate();
      });
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
              
              // Check if gallery is in center of viewport
              this.checkIfInCenter();
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
    checkIfInCenter() {
      if (!this.$refs.galleryContainer) return;
      
      const rect = this.$refs.galleryContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Calculate center of viewport
      const viewportCenterY = viewportHeight / 2;
      const viewportCenterX = viewportWidth / 2;
      
      // Calculate center of gallery
      const galleryCenterY = rect.top + rect.height / 2;
      const galleryCenterX = rect.left + rect.width / 2;
      
      // Check if gallery is roughly in the center (within 20% of viewport)
      const centerThresholdY = viewportHeight * 0.2;
      const centerThresholdX = viewportWidth * 0.2;
      
      const isInCenterY = Math.abs(galleryCenterY - viewportCenterY) < centerThresholdY;
      const isInCenterX = Math.abs(galleryCenterX - viewportCenterX) < centerThresholdX;
      
      const isInCenter = isInCenterY && isInCenterX;
      
      // Emit event for parent components to react
      this.$emit('center-visibility-changed', isInCenter);
      
      return isInCenter;
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
    },
    
    // Public methods for external control
    startAutoScrollProgrammatically() {
      this.startAutoScroll();
    },
    
    stopAutoScrollProgrammatically() {
      this.stopAutoScroll();
    },
    
    pauseAutoScroll() {
      this.isUserInteracting = true;
    },
    
    resumeAutoScroll() {
      this.isUserInteracting = false;
    },
    
    isAutoScrollActive() {
      return this.isAutoScrolling && !this.isUserInteracting;
    },
    
    // Tags scroll methods
    handleTagsScroll() {
      console.log('Tags scroll event fired');
      const tagsElement = this.$refs.galleryTags;
      if (!tagsElement) {
        console.log('No tags element found');
        return;
      }
      
      console.log('Current scroll position:', tagsElement.scrollLeft);
      console.log('Max scroll:', tagsElement.scrollWidth - tagsElement.clientWidth);
      
      this.isTagsScrolling = true;
      
      // Clear existing timeout
      clearTimeout(this.tagsScrollTimeout);
      
      // Set timeout to detect when scrolling stops - increased to 1 second
      this.tagsScrollTimeout = setTimeout(() => {
        console.log('Scrolling stopped, triggering spring animation');
        this.isTagsScrolling = false;
        this.animateTagsSpringReturn();
      }, 1000); // Changed from 150ms to 1000ms (1 second)
    },
    
    handleTagsTouchStart() {
      this.isTagsScrolling = true;
    },
    
    handleTagsTouchEnd() {
      // Increased delay to allow for momentum scrolling and match the 1-second delay
      setTimeout(() => {
        this.isTagsScrolling = false;
        this.animateTagsSpringReturn();
      }, 1000); // Changed from 100ms to 1000ms (1 second)
    },
    
    handleTagsMouseEnter() {
      // Optional: pause spring animation on hover
    },
    
    handleTagsMouseLeave() {
      // Optional: resume spring animation when leaving
    },
    
    animateTagsSpringReturn() {
      console.log('animateTagsSpringReturn called');
      const tagsElement = this.$refs.galleryTags;
      if (!tagsElement) {
        console.log('No tags element in animateTagsSpringReturn');
        return;
      }
      
      const currentScrollLeft = tagsElement.scrollLeft;
      const maxScroll = tagsElement.scrollWidth - tagsElement.clientWidth;
      
      console.log('Current scroll left:', currentScrollLeft);
      console.log('Max scroll:', maxScroll);
      
      // Always animate back to 0
      const targetPosition = 0;
      console.log('Target position:', targetPosition);
      
      // Start spring animation
      this.startTagsSpringAnimation(currentScrollLeft, targetPosition);
    },
    
    startTagsSpringAnimation(startPosition, targetPosition) {
      if (this.tagsSpringAnimationId) {
        cancelAnimationFrame(this.tagsSpringAnimationId);
      }
      
      const tagsElement = this.$refs.galleryTags;
      if (!tagsElement) return;
      
      const startTime = performance.now();
      const duration = 600; // Animation duration in milliseconds
      const distance = targetPosition - startPosition;
      
      // Cubic ease-out
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easedProgress = easeOutCubic(progress);
        const currentPosition = startPosition + (distance * easedProgress);
        
        tagsElement.scrollLeft = currentPosition;
        
        if (progress < 1) {
          this.tagsSpringAnimationId = requestAnimationFrame(animate);
        } else {
          this.tagsSpringAnimationId = null;
        }
      };
      
      this.tagsSpringAnimationId = requestAnimationFrame(animate);
    },
    
    debugTagsElement() {
      const tagsElement = this.$refs.galleryTags;
      if (!tagsElement) {
        console.log('No gallery tags element found');
        return;
      }
      
      console.log('Gallery tags element found:', tagsElement);
      console.log('Scroll width:', tagsElement.scrollWidth);
      console.log('Client width:', tagsElement.clientWidth);
      console.log('Is scrollable:', tagsElement.scrollWidth > tagsElement.clientWidth);
      console.log('Current scroll left:', tagsElement.scrollLeft);
      console.log('Max scroll:', tagsElement.scrollWidth - tagsElement.clientWidth);
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
      // Enable auto-scroll for small galleries (like in Shows.vue)
      // Disable auto-scroll for big galleries (like main gallery in ShowPage.vue)
      
      // Check if this is a big gallery by looking at the image height
      // Big galleries typically use calc(100vh - 97rem) or similar large values
      if (this.imageHeight && this.imageHeight.includes('calc(100vh')) {
        return false; // Big gallery - no auto-scroll
      }
      
      // Check if repeatToFill is false (big galleries often have this set to false)
      if (this.repeatToFill === false) {
        return false; // Big gallery - no auto-scroll
      }
      
      // Small galleries (like in Shows.vue) should have auto-scroll
      return true;
    }
  },
  mounted() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
    
    // Setup intersection observer
    this.$nextTick(() => {
      this.setupIntersectionObserver();
      
      // Force a re-render after DOM is ready to ensure correct image dimensions
      this.$nextTick(() => {
        this.$forceUpdate();
        
        // Debug tags element
        this.$nextTick(() => {
          this.debugTagsElement();
        });
      });
    });
    
    // Start auto-scroll if enabled and hover scroll is enabled
    if (this.enableAutoScroll && this.enableHoverScroll) {
      this.$nextTick(() => {
        this.startAutoScroll();
      });
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
    
    // Clean up observer
    if (this.observer) {
      this.observer.disconnect();
    }
    
    // Clean up auto-scroll
    this.stopAutoScroll();
    if (this.userInteractionTimeout) {
      clearTimeout(this.userInteractionTimeout);
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    if (this.scrollCheckInterval) {
      clearInterval(this.scrollCheckInterval);
    }
    if (this.wheelTimeout) {
      clearTimeout(this.wheelTimeout);
    }
    if (this.tagsScrollTimeout) {
      clearTimeout(this.tagsScrollTimeout);
    }
    if (this.tagsSpringAnimationId) {
      cancelAnimationFrame(this.tagsSpringAnimationId);
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
    },
    enableAutoScroll(newValue) {
      if (newValue && this.enableHoverScroll) {
        this.$nextTick(() => {
          this.startAutoScroll();
        });
      } else {
        this.stopAutoScroll();
      }
    },
    autoScrollSpeed() {
      // Speed change will take effect on next animation frame
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

.gallery-container.clickable .gallery-item {
  cursor: pointer;
}

.gallery {
  display: flex;
  width: 100%;
  will-change: transform;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  /* Hide scrollbars for all browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  overflow: -moz-scrollbars-none; /* Firefox (older versions) */
}

/* Enhanced smooth scrolling for auto-scroll */
.gallery.auto-scroll-active {
  scroll-behavior: smooth;
  transition: all 0.12s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: scroll-left, transform;
}

/* Smooth transition for gallery items during auto-scroll */
.gallery.auto-scroll-active .gallery-item {
  transition: transform 0.1s ease-out;
}

.gallery::-webkit-scrollbar {
  display: none;
}

.gallery.auto-scrolling {
  transition: transform 0.35s ease-in-out;
}

.gallery.auto-scroll-active {
  transition: scroll-left 0.1s ease-out;
  will-change: scroll-left;
  scroll-behavior: smooth;
}

.gallery.auto-scroll-active:hover {
  transition: scroll-left 0.2s ease-out;
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

/* Drag functionality styles - with high specificity */
.gallery-container .gallery {
  cursor: grab !important;
}

.gallery-container .gallery.dragging {
  cursor: grabbing !important;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.gallery-container .gallery.dragging .gallery-image {
  pointer-events: none;
}

/* Ensure clickable galleries also use grab cursor */
.gallery-container.clickable .gallery {
  cursor: grab !important;
}

.gallery-container.clickable .gallery.dragging {
  cursor: grabbing !important;
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
  /* padding: 0 var(--space-lg) 0 0; */
  overflow-X: scroll;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  /* Hide scrollbars for all browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  overflow: -moz-scrollbars-none; /* Firefox (older versions) */
}

.gallery-tags::-webkit-scrollbar {
  display: none;
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
  /* Prevent image dragging */
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
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
  .gallery-tags {
    /* padding: 0 var(--space-lg) 0 0; */
  }
}

/* Also hide scrollbars on the gallery container */
.gallery-container::-webkit-scrollbar {
  display: none;
}
</style>

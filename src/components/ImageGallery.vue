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
      :class="[
        { 'manual-scroll': !enableHoverScroll },
        { 'auto-scrolling': isHovering && enableHoverScroll },
        { 'auto-scroll-active': isAutoScrolling },
        { 'dragging': isDragging },
        { 'smooth-transform': enableHoverScroll }
      ]"
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
      <!-- For seamless infinite loop animation -->
      <div
        v-if="enableHoverScroll"
        class="gallery-content"
        :style="seamlessContentStyle"
      >
        <div
          v-for="(image, index) in seamlessImagesWithPlaceholders"
          :key="`${image.url}-${index}-${image.cycle}`"
          class="gallery-item"
          :style="[galleryItemStyle, image.placeholderDimensions ? { width: image.placeholderDimensions.width + 'px' } : {}]"
        >
          <!-- Placeholder div to maintain aspect ratio and prevent layout jumps -->
          <div
            v-if="image.dimensions"
            class="image-placeholder"
            :style="{
              width: image.placeholderDimensions.width + 'px',
              height: image.placeholderDimensions.height + 'px',
              'aspect-ratio': image.dimensions.aspectRatio,
              '--aspect-ratio': image.dimensions.aspectRatio
            }"
          ></div>

          <img
            v-lazy-load="{
              url: image.url,
              index: index % processedImages.length,
              resetQueue: index === 0,
              threshold: 0.1,
              rootMargin: '750px',
              galleryId: internalGalleryId,
              preloadCount: preloadCount,
              isBigGallery: isBigGallery
            }"
            :alt="image.alt || 'Image'"
            :style="{
              ...imageStyle,
              'aspect-ratio': image.dimensions ? image.dimensions.aspectRatio : undefined
            }"
            :data-index="index % processedImages.length"
            :data-gallery-id="internalGalleryId"
            class="gallery-image"
            :class="{ 'batch-loading': isBatchLoading, 'image-revealed': loadedImages.has(index % processedImages.length) }"
            @load="onImageLoad(index % processedImages.length)"
            @error="onImageError(index % processedImages.length)"
          />
        </div>
      </div>

      <!-- Original layout for big galleries -->
      <div
        v-else
        v-for="(image, index) in imagesWithDimensions"
        :key="`${image.url}-${index}`"
        class="gallery-item"
        :style="galleryItemStyle"
      >
        <!-- Placeholder div to maintain aspect ratio and prevent layout jumps -->
        <div
          v-if="image.dimensions"
          class="image-placeholder"
          :style="{
            width: '100%',
            height: '100%',
            'aspect-ratio': image.dimensions.aspectRatio,
            '--aspect-ratio': image.dimensions.aspectRatio
          }"
        ></div>

        <img
          v-lazy-load="{
            url: image.url,
            index: index,
            resetQueue: index === 0,
            threshold: 0.1,
            rootMargin: '750px',
            galleryId: internalGalleryId,
            preloadCount: preloadCount,
            isBigGallery: isBigGallery
          }"
          :alt="image.alt || 'Image'"
          :style="{
            ...imageStyle,
            'aspect-ratio': image.dimensions ? image.dimensions.aspectRatio : undefined
          }"
          :data-index="index"
          :data-gallery-id="internalGalleryId"
          class="gallery-image"
          :class="{ 'batch-loading': isBatchLoading, 'image-revealed': loadedImages.has(index) }"
          @load="onImageLoad(index)"
          @error="onImageError(index)"
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
import { extractImageDimensions, calculatePlaceholderDimensions } from '../utils/imageDimensions';
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
    // When true, disables hover-based seamless animation and enables manual click-and-drag scrolling
    allowDrag: { type: Boolean, default: false },
    // When true, clicking navigates to next photo instead of navigating to show page
    enablePhotoNavigation: { type: Boolean, default: false },
    imageHeight: {
      type: String,
      default: '115rem' // 2x smaller than original 230rem for small galleries
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
    enableNavigation: { type: Boolean, default: true },
    speedRandomness: {
      type: Number,
      default: 0.3,
      validator: value => value >= 0 && value <= 1
    }, // 0.0 = no randomness, 1.0 = 100% randomness
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
      // Transform-based smooth animation for small galleries
      transformAnimationId: null,
      transformOffset: 0,
      transformSpeed: 0.05, // pixels per frame for smooth animation
      speedMultiplier: null, // Random speed multiplier for this gallery
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
      // Image loading state data
      loadedImages: new Set(), // Track which images have loaded
      isBatchLoading: false, // Whether we're in batch loading mode
      batchTimeout: null, // Timeout for batch loading
      // Navigation state data
      isNavigating: false, // Prevent multiple navigation clicks during animation

    };
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    return { router, route };
  },
  methods: {
    handleGalleryClick(event) {
      console.log('Gallery click - isActive:', this.isActive, 'shouldPreventClick:', this.shouldPreventClick, 'hasDragged:', this.hasDragged, 'enableNavigation:', this.enableNavigation, 'enablePhotoNavigation:', this.enablePhotoNavigation);

      // If photo navigation is enabled, handle photo navigation instead of page navigation
      if (this.enablePhotoNavigation) {
        // Prevent default navigation
        event.preventDefault();
        event.stopPropagation();

        // Check if we should prevent click due to drag or ongoing navigation
        if (this.shouldPreventClick || this.hasDragged) {
          console.log('Preventing photo navigation due to drag');
          return;
        }

        if (this.isNavigating) {
          console.log('Preventing photo navigation - animation in progress');
          return;
        }

        // Navigate to next photo
        this.navigateToNextPhoto();
        return;
      }

      // Original page navigation logic
      // If navigation is disabled, don't navigate
      if (!this.enableNavigation) {
        console.log('Navigation disabled for this gallery');
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // SWAPPED BEHAVIOR:
      // For non-active galleries (like in Shows page), prevent navigation if dragged
      // For active galleries (like in ShowPage/ProjectPage), always allow navigation
      if (!this.isActive && (this.shouldPreventClick || this.hasDragged)) {
        console.log('Preventing navigation due to drag on non-active gallery');
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // Only log and navigate if we're actually going to navigate
      console.log('Navigating to:', this.slug);
      this.router.push(`/shows/${this.slug}`);
    },

    // Navigate to next photo with cycling
    navigateToNextPhoto() {
      const gallery = this.$refs.gallery;
      if (!gallery || !this.processedImages.length || this.isNavigating) return;

      // Prevent multiple navigation clicks during animation
      this.isNavigating = true;

      // Get all gallery items to calculate their actual positions
      const galleryItems = gallery.querySelectorAll('.gallery-item');
      if (!galleryItems.length) {
        this.isNavigating = false;
        return;
      }

      const currentScrollLeft = gallery.scrollLeft;
      const viewportLeft = currentScrollLeft;
      const viewportRight = currentScrollLeft + gallery.clientWidth;

      // Find the item that intersects the left edge of the viewport
      let leftIntersectingItem = null;
      let overscrollAmount = 0;

      for (let i = 0; i < galleryItems.length; i++) {
        const item = galleryItems[i];
        const itemLeft = item.offsetLeft;
        const itemRight = itemLeft + item.offsetWidth;

        // Check if this item intersects the left edge of the viewport
        if (itemLeft < viewportLeft && itemRight > viewportLeft) {
          leftIntersectingItem = item;
          overscrollAmount = viewportLeft - itemLeft; // How much of the item is cut off on the left
          break;
        }
      }

      // If no item intersects the left edge, find the first item that's partially or fully visible
      if (!leftIntersectingItem) {
        for (let i = 0; i < galleryItems.length; i++) {
          const item = galleryItems[i];
          const itemLeft = item.offsetLeft;
          const itemRight = itemLeft + item.offsetWidth;

          if (itemRight > viewportLeft) {
            leftIntersectingItem = item;
            overscrollAmount = 0; // No overscroll if item starts at or after viewport left
            break;
          }
        }
      }

      // Fallback: use first item
      if (!leftIntersectingItem) {
        leftIntersectingItem = galleryItems[0];
        overscrollAmount = 0;
      }

      // Calculate the exact scroll distance to align the current photo's edge with viewport start
      const itemLeft = leftIntersectingItem.offsetLeft;
      const itemWidth = leftIntersectingItem.offsetWidth;
      const itemRight = itemLeft + itemWidth;

      // Scroll by (full width of current photo - overscroll amount)
      // This will fully reveal the current photo and align the next photo's left edge with viewport left edge
      const remainingWidth = itemWidth - overscrollAmount;
      let targetScrollLeft = currentScrollLeft + remainingWidth;

      // Handle cycling: if we're at or near the end, cycle back to beginning
      const maxScroll = gallery.scrollWidth - gallery.clientWidth;

      if (targetScrollLeft >= maxScroll) {
        // We're at or near the end, cycle back to beginning
        targetScrollLeft = 0;
      }

      // Use more precise scrolling method
      this.performPreciseScroll(gallery, targetScrollLeft);

      // Fallback: reset navigation flag after timeout in case animation fails
      setTimeout(() => {
        if (this.isNavigating) {
          console.warn('Navigation animation timeout - resetting flag');
          this.isNavigating = false;
        }
      }, 1000); // 1 second timeout

      console.log(`Precise navigation - Item at ${itemLeft}-${itemRight}, overscroll: ${overscrollAmount}px, scrolling to: ${targetScrollLeft} (current: ${currentScrollLeft})`);
    },

    // Perform precise scrolling with completion detection
    performPreciseScroll(gallery, targetScrollLeft) {
      const startScrollLeft = gallery.scrollLeft;
      const distance = targetScrollLeft - startScrollLeft;
      const duration = 150; // 300ms animation duration
      const startTime = performance.now();

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Use ease-out timing function for smooth animation
        const easeOutProgress = 1 - Math.pow(1 - progress, 0);
        const currentPosition = startScrollLeft + (distance * easeOutProgress);

        gallery.scrollLeft = currentPosition;

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          // Animation completed
          this.isNavigating = false;

          // Ensure we reached the exact target position
          if (Math.abs(gallery.scrollLeft - targetScrollLeft) > 1) {
            gallery.scrollLeft = targetScrollLeft;
          }
        }
      };

      requestAnimationFrame(animateScroll);
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

    // Smooth transform-based animation for small galleries
    startSmoothTransformAnimation() {
      if (this.transformAnimationId || !this.enableHoverScroll) {
        console.debug(`[ImageGallery] Not starting animation for ${this.internalGalleryId} - already running or disabled`);
        return;
      }

      console.debug(`[ImageGallery] Starting smooth transform animation for ${this.internalGalleryId}`);
      this.transformAnimationId = requestAnimationFrame(() => this.animateSmoothTransform());
    },

    stopSmoothTransformAnimation() {
      if (this.transformAnimationId) {
        cancelAnimationFrame(this.transformAnimationId);
        this.transformAnimationId = null;
      }
    },

    animateSmoothTransform() {
      // Stop animation if hovering or if hover scroll is disabled
      if (this.isHovering || !this.enableHoverScroll) {
        this.stopSmoothTransformAnimation();
        return;
      }

      // Update transform offset for smooth continuous movement with random speed
      this.transformOffset -= this.transformSpeed * this.randomSpeedMultiplier;

      // Reset position when we've moved by one full cycle of images
      if (this.processedImages.length > 0) {
        // Calculate the width of one full cycle of images (same logic as seamlessImages)
        let estimatedImageWidth;
        if (this.imageWidth === 'auto') {
          if (this.imageHeight) {
            const heightValue = parseFloat(this.imageHeight);
            estimatedImageWidth = heightValue * 1.5; // Assume 3:2 aspect ratio
          } else {
            estimatedImageWidth = 200; // fallback
          }
        } else {
          estimatedImageWidth = parseFloat(this.imageWidth) || 200;
        }

        const cycleWidth = this.processedImages.length * estimatedImageWidth;

        // Reset when we've moved by one full cycle to maintain seamless loop
        if (Math.abs(this.transformOffset) >= cycleWidth) {
          this.transformOffset = 0;
        }
      }

      // Continue animation
      this.transformAnimationId = requestAnimationFrame(() => this.animateSmoothTransform());
    },
    
    stopAutoScroll() {
      this.isAutoScrolling = false;
      if (this.autoScrollAnimationId) {
        cancelAnimationFrame(this.autoScrollAnimationId);
        this.autoScrollAnimationId = null;
      }
      // Keep the current scroll position when stopping
      this.autoScrollPosition = this.$refs.gallery?.scrollLeft || 0;

      // Also stop smooth transform animation
      this.stopSmoothTransformAnimation();
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
      // Only handle scroll events if manual scroll is enabled
      if (this.enableHoverScroll && !this.allowDrag) return;

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
      // Only handle touch events if manual scroll is enabled
      if (this.enableHoverScroll && !this.allowDrag) return;

      this.isUserInteracting = true;

      // For touch devices, we can also implement drag-like behavior
      // but for now, just pause auto-scroll
      if (this.isAutoScrolling) {
        this.stopAutoScroll();
      }
    },
    
    handleTouchMove(event) {
      // Only handle touch move events if manual scroll is enabled
      if (this.enableHoverScroll && !this.allowDrag) return;

      this.isUserInteracting = true;

      // Update auto-scroll position to match current scroll
      const gallery = this.$refs.gallery;
      if (gallery) {
        this.autoScrollPosition = gallery.scrollLeft;
      }
    },
    
    handleWheel(event) {
      // Only handle wheel events if manual scroll is enabled
      if (this.enableHoverScroll && !this.allowDrag) return;

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
      // Only allow dragging if manual scroll is enabled (when hover scroll is disabled or allowDrag is true)
      if (this.enableHoverScroll && !this.allowDrag) return;

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

      // Disable smooth scrolling and transitions during drag for precise feedback
      gallery.style.scrollBehavior = 'auto';
      gallery.style.transition = 'none';

      // Prevent text selection during drag
      event.preventDefault();
    },
    
    handleMouseMove(event) {
      // Only allow dragging if manual scroll is enabled
      if (this.enableHoverScroll && !this.allowDrag) return;
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
      // Only allow dragging if manual scroll is enabled
      if (this.enableHoverScroll && !this.allowDrag) return;
      if (!this.isDragging) return;

      console.log('Mouse up - hasDragged:', this.hasDragged, 'shouldPreventClick:', this.shouldPreventClick);

      const gallery = this.$refs.gallery;
      if (gallery) {
        // Restore smooth scrolling and transitions after drag
        gallery.style.scrollBehavior = '';
        gallery.style.transition = '';
      }

      this.isDragging = false;
      this.isUserInteracting = false;

      // Simply resume auto-scroll after drag ends
      this.resumeAutoScrollAfterDrag();

      // Don't reset shouldPreventClick here - let it persist until next mouse down
      // This ensures click events are prevented after drag
    },
    
    handleSelectStart(event) {
      // Only allow drag-related functionality if manual scroll is enabled
      if (this.enableHoverScroll && !this.allowDrag) return;

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
      // Stop smooth transform animation for small galleries on hover
      if (this.enableHoverScroll) {
        this.stopSmoothTransformAnimation();
      }
    },
    
    handleMouseLeave() {
      this.isHovering = false;

      // If dragging, stop the drag and restore smooth scrolling
      if (this.isDragging) {
        const gallery = this.$refs.gallery;
        if (gallery) {
          // Restore smooth scrolling and transitions after drag
          gallery.style.scrollBehavior = '';
          gallery.style.transition = '';
        }

        this.isDragging = false;
        this.isUserInteracting = false;
        this.hasDragged = false; // Reset drag flag
        this.shouldPreventClick = false; // Reset click prevention flag
      }

      // Start auto-scroll when not hovering
      if (this.enableHoverScroll) {
        this.startSmoothTransformAnimation();
      } else {
        this.startAutoScroll();
      }
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
              console.debug(`[ImageGallery] Gallery ${this.internalGalleryId} is now visible`);
              this.startImageLoading();

              // Start animation for small galleries when they become visible
              if (this.enableAutoScroll && this.enableHoverScroll && !this.isHovering) {
                console.debug(`[ImageGallery] Starting animation for visible gallery ${this.internalGalleryId}`);
                console.debug(`[ImageGallery] enableAutoScroll: ${this.enableAutoScroll}, enableHoverScroll: ${this.enableHoverScroll}, isHovering: ${this.isHovering}`);
                this.startSmoothTransformAnimation();
              } else {
                console.debug(`[ImageGallery] Gallery ${this.internalGalleryId} visible but not starting animation - enableAutoScroll: ${this.enableAutoScroll}, enableHoverScroll: ${this.enableHoverScroll}, isHovering: ${this.isHovering}`);
              }

              // Check if gallery is in center of viewport
              this.checkIfInCenter();
            } else {
              this.isGalleryVisible = false;
              console.debug(`[ImageGallery] Gallery ${this.internalGalleryId} is no longer visible`);

              // Stop animation for small galleries when they go out of view
              if (this.enableHoverScroll) {
                this.stopSmoothTransformAnimation();
              }
            }
          });
        },
        {
          rootMargin: '200px', // Reduced margin for better performance
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
      console.debug(`[ImageGallery] Starting image loading for gallery ${this.internalGalleryId}`);
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    
    // Simplified image loading check
    checkImageLoadingStatus() {
      const images = this.$refs.gallery?.querySelectorAll('img.gallery-image');
      if (!images || images.length === 0) {
        console.debug(`[ImageGallery] No images found in gallery ${this.internalGalleryId}`);
        return;
      }
      
      let loadedCount = 0;
      let errorCount = 0;
      let loadingCount = 0;
      
      images.forEach((img, index) => {
        if (img.classList.contains('image-loaded') && img.style.opacity === '1') {
          loadedCount++;
        } else if (img.classList.contains('image-error')) {
          errorCount++;
        } else if (img.classList.contains('image-loading')) {
          loadingCount++;
        }
      });
      
      console.debug(`[ImageGallery] Status - Loaded: ${loadedCount}, Errors: ${errorCount}, Loading: ${loadingCount}`);
      
      // Emit success if at least one image is loaded
      if (loadedCount > 0) {
        this.$emit('gallery-success');
      }
      
      // Emit error if all images failed and none are loading
      if (errorCount > 0 && loadingCount === 0 && loadedCount === 0) {
        this.$emit('gallery-error');
      }
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
    },
    
    // Image event handlers for debugging
    onImageLoad(index) {
      console.debug(`[ImageGallery] Image ${index} loaded successfully in gallery ${this.internalGalleryId}`);

      // Track loaded images for batch loading
      this.loadedImages.add(index);

      // Start batch loading mode
      this.startBatchLoading();

      // Check overall loading status after each image loads
      this.$nextTick(() => {
        this.checkImageLoadingStatus();
      });
    },
    
        onImageError(index) {
      console.error(`[ImageGallery] Image ${index} failed to load in gallery ${this.internalGalleryId}`);
      // Check overall loading status after each image error
      this.$nextTick(() => {
        this.checkImageLoadingStatus();
      });
    },

    // Batch loading methods to prevent content shift
    startBatchLoading() {
      if (this.isBatchLoading) return;

      this.isBatchLoading = true;

      // Clear any existing timeout
      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
      }

      // Set a timeout to reveal images in batches - shorter delay for immediate updates
      this.batchTimeout = setTimeout(() => {
        this.revealLoadedImages();
      }, 50); // Shorter delay for more responsive reveals

      // Fallback: if images don't reveal after 3 seconds, force reveal them
      setTimeout(() => {
        if (this.isBatchLoading && this.loadedImages.size > 0) {
          console.warn(`[ImageGallery] Force revealing images after timeout in gallery ${this.internalGalleryId}`);
          this.revealLoadedImages();
        }
      }, 3000);
    },

    revealLoadedImages() {
      if (!this.isBatchLoading) return;

      console.debug(`[ImageGallery] Revealing loaded images in strict left-to-right order in gallery ${this.internalGalleryId}`);

      // Handle different layouts differently
      if (this.enableHoverScroll) {
        // Seamless layout - reveal images across all cycles
        this.revealSeamlessImages();
      } else {
        // Original layout for big galleries
        this.revealOriginalImages();
      }
    },

    revealSeamlessImages() {
      // For seamless layout, we need to reveal images across all cycles
      const galleryImages = this.$refs.gallery?.querySelectorAll('img.gallery-image');
      if (!galleryImages) return;

      // Find the rightmost index where all images to the left are loaded
      let rightmostRevealedIndex = -1;
      const originalImageCount = this.processedImages.length;

      for (let originalIndex = 0; originalIndex < originalImageCount; originalIndex++) {
        if (this.loadedImages.has(originalIndex)) {
          // Check if all images to the left are also loaded
          let allLeftLoaded = true;
          for (let leftIndex = 0; leftIndex < originalIndex; leftIndex++) {
            if (!this.loadedImages.has(leftIndex)) {
              allLeftLoaded = false;
              break;
            }
          }

          if (allLeftLoaded) {
            // This image and all to its left are loaded, so reveal it in ALL cycles
            for (let i = 0; i < galleryImages.length; i++) {
              const img = galleryImages[i];
              const imgOriginalIndex = parseInt(img.dataset.index);

              if (imgOriginalIndex === originalIndex && !img.classList.contains('image-revealed')) {
                img.classList.remove('image-loading');
                img.classList.add('image-loaded', 'image-revealed');
                rightmostRevealedIndex = Math.max(rightmostRevealedIndex, originalIndex);
              }
            }
          }
        }
      }

      console.debug(`[ImageGallery] Revealed seamless images up to original index ${rightmostRevealedIndex}`);

      this.isBatchLoading = false;

      // Check if all images are loaded
      if (this.loadedImages.size >= originalImageCount) {
        console.debug(`[ImageGallery] All images loaded in gallery ${this.internalGalleryId}`);
        this.$emit('gallery-success');
      }
    },

    revealOriginalImages() {
      // Original logic for big galleries
      const galleryImages = this.$refs.gallery?.querySelectorAll('img.gallery-image');
      if (!galleryImages) return;

      // Find the rightmost index where all images to the left are loaded
      let rightmostRevealedIndex = -1;
      for (let index = 0; index < this.processedImages.length; index++) {
        if (this.loadedImages.has(index)) {
          // Check if all images to the left are also loaded
          let allLeftLoaded = true;
          for (let leftIndex = 0; leftIndex < index; leftIndex++) {
            if (!this.loadedImages.has(leftIndex)) {
              allLeftLoaded = false;
              break;
            }
          }

          if (allLeftLoaded) {
            // This image and all to its left are loaded, so reveal it
            const img = galleryImages[index];
            if (img && !img.classList.contains('image-revealed')) {
              img.classList.remove('image-loading');
              img.classList.add('image-loaded', 'image-revealed');
              rightmostRevealedIndex = index;
            }
          }
        }
      }

      console.debug(`[ImageGallery] Revealed original images up to index ${rightmostRevealedIndex}`);

      this.isBatchLoading = false;

      // Check if all images are loaded
      if (this.loadedImages.size >= this.processedImages.length) {
        console.debug(`[ImageGallery] All images loaded in gallery ${this.internalGalleryId}`);
        this.$emit('gallery-success');
      }
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
    },
    

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

    // Note: Transform is now applied to seamlessContentStyle instead

    seamlessImages() {
      if (!this.enableHoverScroll || !this.processedImages.length) {
        return [];
      }

      // Calculate how many cycles we need to fill the viewport
      // We need enough images to fill at least 3x the viewport width for seamless looping
      const viewportWidth = window.innerWidth;

      // Better image width estimation based on actual image dimensions
      let estimatedImageWidth;
      if (this.imageWidth === 'auto') {
        // For auto width, estimate based on aspect ratio and height
        if (this.imageHeight) {
          const heightValue = parseFloat(this.imageHeight);
          estimatedImageWidth = heightValue * 1.5; // Assume 3:2 aspect ratio
        } else {
          estimatedImageWidth = 200; // fallback
        }
      } else {
        estimatedImageWidth = parseFloat(this.imageWidth) || 200;
      }

      const imagesPerViewport = Math.ceil(viewportWidth / estimatedImageWidth);
      const totalCycles = Math.max(3, Math.ceil((imagesPerViewport * 3) / this.processedImages.length)); // At least 3 cycles

      const seamlessImages = [];
      for (let cycle = 0; cycle < totalCycles; cycle++) {
        this.processedImages.forEach((image, index) => {
          seamlessImages.push({
            ...image,
            cycle,
            originalIndex: index
          });
        });
      }

      return seamlessImages;
    },

    seamlessContentStyle() {
      if (!this.enableHoverScroll) {
        return {};
      }

      return {
        display: 'flex',
        transform: `translateX(${this.transformOffset}px)`,
        willChange: 'transform',
        width: 'fit-content' // Allow content to be wider than container
      };
    },
    enableHoverScroll() {
      // Enable auto-scroll for small galleries (like in Shows.vue)
      // Disable auto-scroll for big galleries (like main gallery in ShowPage.vue)
      
      // Explicit override to allow manual dragging even for small galleries
      if (this.allowDrag) {
        return false;
      }

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
    },
    
    isBigGallery() {
      // Determine if this is a big gallery based on the same logic as enableHoverScroll
      if (this.imageHeight && this.imageHeight.includes('calc(100vh')) {
        return true; // Big gallery
      }
      
      if (this.repeatToFill === false) {
        return true; // Big gallery
      }
      
      return false; // Small gallery
    },
    
    preloadCount() {
      // Detect Safari for simple preload adjustment
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      // Base preload count based on gallery size
      let baseCount = this.isBigGallery ? 1 : 2;
      
      // For Safari, increase preload count by 1 to ensure better loading
      if (isSafari) {
        baseCount += 1;
      }
      
      return baseCount;
    },

    // Generate consistent random speed multiplier for each gallery
    randomSpeedMultiplier() {
      if (this.speedMultiplier !== null) {
        return this.speedMultiplier;
      }

      // Create a simple hash from the gallery ID for consistent randomness
      let hash = 0;
      const str = this.internalGalleryId;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }

      // Convert hash to a random number between 0 and 1
      const randomValue = Math.abs(hash) / 2147483647;

      // Map to speed range based on speedRandomness prop
      // speedRandomness = 0.0: no variation (multiplier = 1.0)
      // speedRandomness = 0.3: 30% variation (0.7 to 1.3)
      // speedRandomness = 1.0: 100% variation (0.0 to 2.0)
      this.speedMultiplier = (1 - this.speedRandomness) + (randomValue * this.speedRandomness * 2);

      console.debug(`[ImageGallery] Gallery ${this.internalGalleryId} speed multiplier: ${this.speedMultiplier.toFixed(3)} (randomness: ${(this.speedRandomness * 100).toFixed(0)}%)`);
      return this.speedMultiplier;
    },

    // Extract dimensions from processed images for placeholder sizing
    imagesWithDimensions() {
      return this.processedImages.map(image => ({
        ...image,
        dimensions: extractImageDimensions(image.url)
      }));
    },

    // Calculate placeholder dimensions for seamless images
    seamlessImagesWithPlaceholders() {
      if (!this.enableHoverScroll || !this.seamlessImages.length) {
        return [];
      }

      return this.seamlessImages.map(image => {
        const originalImage = this.processedImages[image.originalIndex];
        const dimensions = originalImage ? extractImageDimensions(originalImage.url) : null;
        const placeholderDimensions = dimensions ?
          calculatePlaceholderDimensions(dimensions, this.imageHeight, this.imageWidth) :
          { width: 'auto', height: this.imageHeight };

        return {
          ...image,
          dimensions,
          placeholderDimensions
        };
      });
    }
  },
    mounted() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);

    // Initialize random speed multiplier for this gallery
    this.randomSpeedMultiplier; // Access computed property to initialize it

    // Start batch loading mode immediately
    this.isBatchLoading = true;

    // Setup intersection observer
    this.$nextTick(() => {
      this.setupIntersectionObserver();

      // Force a re-render after DOM is ready to ensure correct image dimensions
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    });

    // Note: Animation for small galleries now starts when they become visible (via intersection observer)
    // Start auto-scroll for big galleries (they use traditional scroll)
    if (this.enableAutoScroll && !this.enableHoverScroll) {
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

    // Clean up auto-scroll and smooth transform animation
    this.stopAutoScroll();
    this.stopSmoothTransformAnimation();
    if (this.userInteractionTimeout) {
      clearTimeout(this.userInteractionTimeout);
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
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

    // Clean up batch loading
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
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
          // Check image loading status when gallery becomes visible
          setTimeout(() => {
            this.checkImageLoadingStatus();
          }, 500);
        });
      }
    },
    enableAutoScroll(newValue) {
      if (newValue && this.enableHoverScroll) {
        // Start smooth transform animation for small galleries
        this.$nextTick(() => {
          this.startSmoothTransformAnimation();
        });
      } else if (newValue && !this.enableHoverScroll) {
        // Start traditional auto-scroll for big galleries
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

/* Smooth transform animation for small galleries */
.gallery.smooth-transform {
  overflow-x: hidden; /* Hide scrollbars for transform-based animation */
  cursor: default; /* Remove grab cursor for smooth animation */
  will-change: transform;
  transition: none; /* Disable transitions for smooth animation */
}

/* Gallery content container for seamless animation */
.gallery-content {
  display: flex;
  width: fit-content;
  will-change: transform;
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

.gallery-container .gallery.manual-scroll {
  cursor: ew-resize !important;
}

.gallery-container .gallery.dragging {
  cursor: grabbing !important;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.gallery-container .gallery.manual-scroll.dragging {
  cursor: ew-resize !important;
}

.gallery-container .gallery.dragging .gallery-image {
  pointer-events: none;
}

/* Disable transitions during dragging for precise feedback */
.gallery-container .gallery.dragging {
  scroll-behavior: auto !important;
  transition: none !important;
}

.gallery-container .gallery.dragging .gallery-item {
  transition: none !important;
}

/* Override auto-scroll classes during dragging */
.gallery-container .gallery.dragging.auto-scroll-active,
.gallery-container .gallery.dragging.auto-scrolling {
  transition: none !important;
}

/* Ensure clickable galleries also use appropriate cursor */
.gallery-container.clickable .gallery {
  cursor: grab !important;
}

.gallery-container.clickable .gallery.manual-scroll {
  cursor: ew-resize !important;
}

.gallery-container.clickable .gallery.dragging {
  cursor: grabbing !important;
}

.gallery-container.clickable .gallery.manual-scroll.dragging {
  cursor: ew-resize !important;
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

.manual-scroll .gallery-item:first-of-type {
  padding-left: var(--gallery-item-margin);
}

.manual-scroll.gallery-item:last-of-type {
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
  /* Initially hide all images completely to prevent any layout shifts */
  opacity: 0;
  visibility: hidden;
  /* Remove transition initially - will be added when revealing */
  /* Prevent image dragging */
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}

/* Placeholder to maintain aspect ratio and prevent layout jumps */
.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(248, 248, 248, 0.1); /* Subtle background to indicate loading */
  /* Use aspect-ratio property for modern browsers */
  aspect-ratio: var(--aspect-ratio, auto);
  /* Ensure the placeholder maintains space even when image is loading */
  opacity: 1;
  z-index: 0;
  /* Prevent any layout shifts */
  box-sizing: border-box;
}

.gallery-image.image-loading {
  opacity: 0;
}

.gallery-image.image-loaded {
  opacity: 1 !important;
  visibility: visible !important;
  transition: opacity 0.3s ease-in-out !important;
}

.gallery-image.image-error {
  opacity: 0.5;
  background-color: #f8f8f8;
  border: 1px dashed #ccc;
  visibility: visible; /* Error images should be visible */
}

/* Batch loading mode - prevent immediate reveal from lazy loading directive */
.gallery-image.batch-loading.image-loaded {
  opacity: 0 !important;
  visibility: hidden !important;
  transition: none !important;
}

/* Force hide all images during batch loading */
.gallery-container .gallery-item .gallery-image {
  opacity: 0 !important;
  visibility: hidden !important;
  transition: none !important;
}

/* Only show images when they're ready to be revealed */
.gallery-container .gallery-item .gallery-image.image-revealed {
  opacity: 1 !important;
  visibility: visible !important;
  transition: opacity 0.3s ease-in-out !important;
}

@media screen and (max-width: 768px) {
  .gallery {
    min-height: auto !important;
    height: auto !important;
  }
  .gallery-image {
    height: var(--mobile-gallery-height, 40vh) !important;
  }


  /* Override gallery height on mobile for all image galleries */
  .gallery-container {
    min-height: var(--mobile-gallery-height, 60svh) !important;
  }

  .gallery-container .gallery {
    min-height: var(--mobile-gallery-height, 60svh) !important;
  }

  .gallery-container .gallery-item {
    min-height: var(--mobile-gallery-height, 60svh) !important;
  }

  .gallery-container .gallery-image {
    min-height: var(--mobile-gallery-height, 60svh) !important;
  }
}

/* Also hide scrollbars on the gallery container */
.gallery-container::-webkit-scrollbar {
  display: none;
}
</style>

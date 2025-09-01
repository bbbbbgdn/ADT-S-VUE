import type { DirectiveBinding } from 'vue'

// Define interface for HTMLElement with cleanup function
interface HTMLElementWithCleanup extends HTMLElement {
  _cleanup?: () => void;
  _observer?: IntersectionObserver;
  _retryCount?: number;
  _maxRetries?: number;
  _isLoading?: boolean;
}

// Options for the lazy loading directive
interface LazyLoadOptions {
  url: string;
  index?: number;
  resetQueue?: boolean;
  threshold?: number; // Visibility threshold (0-1)
  rootMargin?: string; // Margin around the root
  background?: boolean; // Whether to set as background image
  preload?: boolean; // Whether to preload the image immediately
  preloadCount?: number; // Number of images to preload offscreen
  isBigGallery?: boolean; // Whether this is a big gallery
}

// Simplified per-gallery loading state
const galleryStates: Record<string, { loadedImages: Set<number>, failedImages: Set<number> }> = {};

function getGalleryState(galleryId: string) {
  if (!galleryStates[galleryId]) {
    galleryStates[galleryId] = { loadedImages: new Set<number>(), failedImages: new Set<number>() };
  }
  return galleryStates[galleryId];
}

// Function to determine if an image should be preloaded based on its index and preload count
function shouldPreloadImage(index: number, preloadCount: number, isBigGallery: boolean): boolean {
  // For big galleries, only preload the first image
  if (isBigGallery) {
    return index === 0;
  }
  
  // For small galleries, preload first few images
  return index < preloadCount;
}

// Check if Intersection Observer is supported
const hasIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window

export default {
  beforeMount(el: HTMLElementWithCleanup, binding: DirectiveBinding) {
    // Reset the gallery state if this is the first image in a new gallery
    if (binding.value && 
        typeof binding.value === 'object' && 
        binding.value.index === 0 && 
        binding.value.resetQueue &&
        !el.classList.contains('project-card-image') &&
        !el.classList.contains('project-card-background') &&
        !el.classList.contains('object-bg') &&
        !el.classList.contains('object-photo')) {
      const galleryId = binding.value.galleryId || 'default';
      console.debug(`[LazyLoad] beforeMount: Reset state for new gallery ${galleryId}`);
      galleryStates[galleryId] = { loadedImages: new Set<number>(), failedImages: new Set<number>() };
    }
  },
  
  mounted(el: HTMLElementWithCleanup, binding: DirectiveBinding) {
    // Parse binding value
    let options: LazyLoadOptions & { galleryId?: string };
    if (typeof binding.value === 'string') {
      options = {
        url: binding.value,
        index: parseInt(el.dataset.index || '0'),
        resetQueue: el.dataset.index === '0',
        galleryId: el.dataset.galleryId || 'default'
      }
    } else {
      options = binding.value as LazyLoadOptions & { galleryId?: string };
    }
    
    // Check if this is a ProjectCard or ObjectCard/ObjectPage image
    const isProjectCard = el.classList.contains('project-card-image') || el.classList.contains('project-card-background');
    const isObjectImage = el.classList.contains('object-bg') || el.classList.contains('object-photo');
    
    // Check if image is already loaded and visible - if so, don't reset it
    const isAlreadyLoaded = el.classList.contains('image-loaded') && el.style.opacity === '1';
    if (isAlreadyLoaded) {
      console.debug(`[LazyLoad] Image already loaded and visible, skipping reset: ${options.url}`);
      return;
    }
    
    // Add loading class and set initial state
    el.classList.add('image-loading')
    el.classList.remove('image-loaded', 'image-error')
    el.style.opacity = '0'
    el.style.transition = 'opacity 0.3s ease-in-out'
    
    // Initialize retry mechanism
    el._retryCount = 0;
    el._maxRetries = 2; // Reduced retries for better performance
    el._isLoading = false;
    
    // Function to reveal images immediately (simplified approach)
    function revealImage() {
      el.classList.remove('image-loading');
      el.classList.add('image-loaded');
      requestAnimationFrame(() => {
        el.style.opacity = '1';
      });
      
      // Emit custom events for ProjectCard components
      if (isProjectCard) {
        el.dispatchEvent(new CustomEvent('image-loaded'));
      }
    }
    
    // Function to load the image with simplified retry mechanism
    function loadImage() {
      // Prevent multiple loads of the same image
      if (el._isLoading || (el.classList.contains('image-loaded') && !el.classList.contains('image-error'))) {
        console.debug(`[LazyLoad] Image already loading or loaded, skipping: ${options.url}`);
        return;
      }
      
      el._isLoading = true;
      const galleryId = options.galleryId || 'default';
      console.debug(`[LazyLoad] Start loading: galleryId=${galleryId}, index=${options.index}, url=${options.url}, retry=${el._retryCount}, isProjectCard=${isProjectCard}`);
      
      const img = new Image()
      
      // Set timeout for image loading
      const loadTimeout = setTimeout(() => {
        console.warn(`[LazyLoad] Image load timeout: ${options.url}`);
        img.src = ''; // Cancel the load
        handleError();
      }, 15000); // 15 second timeout
      
      img.onload = () => {
        clearTimeout(loadTimeout);
        el._isLoading = false;
        console.debug(`[LazyLoad] Loaded: galleryId=${galleryId}, index=${options.index}, url=${options.url}, isProjectCard=${isProjectCard}`);
        
        if (options.background || el.tagName !== 'IMG') {
          el.style.backgroundImage = `url(${options.url})`
        } else {
          const imageElement = el as HTMLImageElement
          imageElement.src = options.url
        }
        
        // Handle ProjectCard and ObjectCard/ObjectPage images immediately
        if (isProjectCard || isObjectImage) {
          revealImage();
          // Disconnect observer after successful load
          if (el._observer) {
            el._observer.disconnect()
            el._observer = undefined
          }
          return;
        }
        
        // Handle gallery images - don't reveal immediately, let batch loading handle it
        if (typeof options.index === 'number') {
          const state = getGalleryState(galleryId);

          // Add to loaded images
          state.loadedImages.add(options.index)
          state.failedImages.delete(options.index)

          // Don't reveal image immediately - let ImageGallery component handle batch revealing
          // to ensure strict left-to-right order and prevent content jumps
          console.debug(`[LazyLoad] Gallery image loaded but not revealed yet: galleryId=${galleryId}, index=${options.index}`);

          // Set image source but keep it hidden (batch loading will reveal it)
          if (options.background || el.tagName !== 'IMG') {
            el.style.backgroundImage = `url(${options.url})`
          } else {
            const imageElement = el as HTMLImageElement
            imageElement.src = options.url
          }
        }
      }
      
      img.onerror = () => {
        clearTimeout(loadTimeout);
        el._isLoading = false;
        console.error(`[LazyLoad] Failed to load: galleryId=${galleryId}, index=${options.index}, url=${options.url}, retry=${el._retryCount}, isProjectCard=${isProjectCard}`)
        handleError();
      }
      
      function handleError() {
        // Increment retry count
        el._retryCount = (el._retryCount || 0) + 1;
        
        // Handle ProjectCard and ObjectCard/ObjectPage images with retry
        if (isProjectCard || isObjectImage) {
          if (el._retryCount < el._maxRetries) {
            console.debug(`[LazyLoad] Retrying ${isProjectCard ? 'ProjectCard' : (isObjectImage ? 'ObjectImage' : 'Unknown')}: ${el._retryCount}/${el._maxRetries}`);
            setTimeout(() => {
              loadImage();
            }, 1000 * el._retryCount); // Exponential backoff
            return;
          } else {
            // Max retries reached, show error state
            el.classList.remove('image-loading')
            el.classList.add('image-loaded', 'image-error')
            revealImage();
            // Emit error event for ProjectCard components only
            if (isProjectCard) {
              el.dispatchEvent(new CustomEvent('image-error'));
            }
            // Disconnect observer after max retries
            if (el._observer) {
              el._observer.disconnect()
              el._observer = undefined
            }
            return;
          }
        }
        
        // Handle gallery images with retry
        if (typeof options.index === 'number') {
          const state = getGalleryState(galleryId);

          if (el._retryCount < el._maxRetries) {
            console.debug(`[LazyLoad] Retrying gallery image: ${el._retryCount}/${el._maxRetries}`);
            setTimeout(() => {
              loadImage();
            }, 1000 * el._retryCount); // Exponential backoff
            return;
          } else {
            // Max retries reached, mark as failed
            el.classList.remove('image-loading')
            el.classList.add('image-loaded', 'image-error')
            state.failedImages.add(options.index)
            state.loadedImages.add(options.index) // Still add to loaded to unblock queue

            // Don't reveal error images immediately - let batch loading handle it
            console.debug(`[LazyLoad] Gallery image failed after retries: galleryId=${galleryId}, index=${options.index}`);

            // Set image source for error state but keep it hidden (batch loading will reveal it)
            if (options.background || el.tagName !== 'IMG') {
              el.style.backgroundImage = `url(${options.url})`
            } else {
              const imageElement = el as HTMLImageElement
              imageElement.src = options.url
            }

            // Don't disconnect observer - let it stay active for potential retries
          }
        }
      }
      
      // Start loading the image
      img.src = options.url
    }
    
    // If preload is true, load immediately without intersection observer
    if (options.preload) {
      console.debug(`[LazyLoad] Preload: galleryId=${options.galleryId || 'default'}, index=${options.index}, url=${options.url}, isProjectCard=${isProjectCard}`);
      loadImage()
      return
    }
    
    // Check if this image should be preloaded based on gallery size and index
    if (typeof options.index === 'number' && options.preloadCount && typeof options.isBigGallery === 'boolean') {
      if (shouldPreloadImage(options.index, options.preloadCount, options.isBigGallery)) {
        console.debug(`[LazyLoad] Offscreen preload: galleryId=${options.galleryId || 'default'}, index=${options.index}, url=${options.url}, isBigGallery=${options.isBigGallery}, preloadCount=${options.preloadCount}`);
        loadImage()
        return
      }
    }
    
    // For ProjectCard and ObjectCard/ObjectPage images, use simpler intersection observer logic
    if (isProjectCard || isObjectImage) {
      console.debug(`[LazyLoad] ${isProjectCard ? 'ProjectCard' : 'ObjectImage'}: galleryId=${options.galleryId || 'default'}, index=${options.index}, url=${options.url}`);
      if (hasIntersectionObserver) {
        const observerOptions = {
          root: null,
          rootMargin: options.rootMargin || '500px',
          threshold: options.threshold || 0.1
        }
        el._observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            console.debug(`[LazyLoad] ${isProjectCard ? 'ProjectCard' : 'ObjectImage'} IO load: url=${options.url}`);
            loadImage()
            // Disconnect observer after triggering load
            el._observer?.disconnect()
            el._observer = undefined
          }
        }, observerOptions)
        el._observer.observe(el)
        return
      } else {
        // Fallback: load immediately if Intersection Observer is not supported
        console.debug(`[LazyLoad] ${isProjectCard ? 'ProjectCard' : 'ObjectImage'} fallback load: url=${options.url}`);
        loadImage()
        return
      }
    }
    
    // For gallery images, use intersection observer
    if (typeof options.index === 'number') {
      const galleryId = options.galleryId || 'default';
      console.debug(`[LazyLoad] Gallery queued: galleryId=${galleryId}, index=${options.index}, url=${options.url}`);
      if (hasIntersectionObserver) {
        // Use different rootMargin based on gallery size
        let rootMargin = options.rootMargin || '500px';
        if (options.isBigGallery) {
          // For big galleries, use a smaller margin
          rootMargin = '300px';
        } else {
          // For small galleries, use a larger margin
          rootMargin = '700px';
        }
        
        const observerOptions = {
          root: null,
          rootMargin: rootMargin,
          threshold: options.threshold || 0.1
        }
        el._observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            console.debug(`[LazyLoad] Gallery IO load: galleryId=${galleryId}, url=${options.url}, isBigGallery=${options.isBigGallery}`);
            loadImage()
            // Disconnect observer after triggering load
            el._observer?.disconnect()
            el._observer = undefined
          }
        }, observerOptions)
        el._observer.observe(el)
        return
      } else {
        // Fallback: load immediately if Intersection Observer is not supported
        console.debug(`[LazyLoad] Gallery fallback load: galleryId=${galleryId}, url=${options.url}`);
        loadImage()
        return
      }
    }
    
    // Use Intersection Observer for lazy loading (default behavior for other elements)
    if (hasIntersectionObserver) {
      const observerOptions = {
        root: null,
        rootMargin: options.rootMargin || '300px',
        threshold: options.threshold || 0.1
      }
      el._observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          console.debug(`[LazyLoad] Default IO load: url=${options.url}`);
          loadImage()
          // Disconnect observer after triggering load
          el._observer?.disconnect()
          el._observer = undefined
        }
      }, observerOptions)
      el._observer.observe(el)
      return
    }
    // Fallback: load immediately if Intersection Observer is not supported
    console.debug(`[LazyLoad] Default fallback load: url=${options.url}`);
    loadImage()
  },
  
  unmounted(el: HTMLElementWithCleanup) {
    // Clean up when directive is unmounted
    if (el._cleanup) {
      el._cleanup()
    }
    if (el._observer) {
      el._observer.disconnect()
    }
  }
} 
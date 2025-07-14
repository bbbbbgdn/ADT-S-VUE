import type { DirectiveBinding } from 'vue'

// Define interface for HTMLElement with cleanup function
interface HTMLElementWithCleanup extends HTMLElement {
  _cleanup?: () => void;
  _observer?: IntersectionObserver;
  _retryCount?: number;
  _maxRetries?: number;
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

// Per-gallery loading queues (only for actual galleries, not ProjectCard)
const galleryQueues: Record<string, { revealedIndex: number, loadedImages: Set<number>, failedImages: Set<number> }> = {};

function getGalleryQueue(galleryId: string) {
  if (!galleryQueues[galleryId]) {
    galleryQueues[galleryId] = { revealedIndex: -1, loadedImages: new Set<number>(), failedImages: new Set<number>() };
  }
  return galleryQueues[galleryId];
}

// Function to determine if an image should be preloaded based on its index and preload count
function shouldPreloadImage(index: number, preloadCount: number, isBigGallery: boolean): boolean {
  // For big galleries, only preload the next image
  if (isBigGallery) {
    return index <= preloadCount;
  }
  
  // For small galleries, preload more images offscreen
  return index <= preloadCount;
}

// Check if Intersection Observer is supported
const hasIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window

export default {
  beforeMount(el: HTMLElementWithCleanup, binding: DirectiveBinding) {
    // Reset the queue if this is the first image in a new gallery (not ProjectCard)
    if (binding.value && 
        typeof binding.value === 'object' && 
        binding.value.index === 0 && 
        binding.value.resetQueue &&
        !el.classList.contains('project-card-image') &&
        !el.classList.contains('project-card-background')) {
      const galleryId = binding.value.galleryId || 'default';
      console.debug(`[LazyLoad] beforeMount: Reset queue for new gallery ${galleryId}`);
      galleryQueues[galleryId] = { revealedIndex: -1, loadedImages: new Set<number>(), failedImages: new Set<number>() };
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
    
    // Log preload strategy for gallery images
    if (typeof options.index === 'number' && options.preloadCount !== undefined) {
      const shouldPreload = shouldPreloadImage(options.index, options.preloadCount, options.isBigGallery || false);
      console.debug(`[LazyLoad] Image ${options.index} preload strategy: ${shouldPreload ? 'PRELOAD' : 'LAZY'} (gallery: ${options.isBigGallery ? 'big' : 'small'}, preloadCount: ${options.preloadCount})`);
    }
    
    // Check if this is a ProjectCard image
    const isProjectCard = el.classList.contains('project-card-image') || el.classList.contains('project-card-background');
    
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
    el.style.transition = 'opacity 0.2s ease-out'
    
    // Initialize retry mechanism
    el._retryCount = 0;
    el._maxRetries = 3;
    
    // Function to reveal images from left to right (only for galleries)
    function revealImages() {
      const galleryId = options.galleryId || 'default';
      const queue = getGalleryQueue(galleryId);
      
      // Fallback for single-image galleries
      if (queue.loadedImages.has(0) && queue.revealedIndex < 0) {
        const imgEl = document.querySelector(`[data-gallery-id='${galleryId}'][data-index='0'].gallery-image`);
        if (imgEl) {
          // Only reveal if not already visible to prevent hiding
          if (!imgEl.classList.contains('image-loaded') || (imgEl as HTMLElement).style.opacity !== '1') {
            imgEl.classList.remove('image-loading');
            imgEl.classList.add('image-loaded');
            requestAnimationFrame(() => {
              (imgEl as HTMLElement).style.opacity = '1';
            });
          }
        }
        queue.revealedIndex = 0;
        return;
      }
      
      // Try to reveal the next image in sequence
      let next = queue.revealedIndex + 1;
      let revealedCount = 0;
      
      // Reveal all consecutive loaded images
      while (queue.loadedImages.has(next)) {
        const imgEl = document.querySelector(`[data-gallery-id='${galleryId}'][data-index='${next}'].gallery-image`) as HTMLElement;
        if (imgEl) {
          // Enhanced check to prevent hiding already visible images
          const isAlreadyVisible = imgEl.classList.contains('image-loaded') && imgEl.style.opacity === '1';
          const isCurrentlyLoading = imgEl.classList.contains('image-loading');
          
          // Only reveal if not already visible and currently loading
          if (!isAlreadyVisible && isCurrentlyLoading) {
            imgEl.classList.remove('image-loading');
            imgEl.classList.add('image-loaded');
            requestAnimationFrame(() => {
              // Double-check that the image is still in the correct state before setting opacity
              if (imgEl.classList.contains('image-loaded') && !imgEl.classList.contains('image-loading')) {
                imgEl.style.opacity = '1';
              }
            });
          }
        }
        queue.revealedIndex = next;
        next++;
        revealedCount++;
      }
      
      // If we revealed any images, try to reveal more (in case there are gaps)
      if (revealedCount > 0) {
        // Check if there are any loaded images that should be revealed
        setTimeout(() => {
          revealImages();
        }, 50);
      }
    }
    
    // Function to reveal ProjectCard image immediately
    function revealProjectCard() {
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
    
    // Function to load the image with retry mechanism
    function loadImage() {
      // Prevent multiple loads of the same image
      if (el.classList.contains('image-loaded') && !el.classList.contains('image-error')) {
        console.debug(`[LazyLoad] Image already loaded, skipping: ${options.url}`);
        return;
      }
      
      const galleryId = options.galleryId || 'default';
      console.debug(`[LazyLoad] Start loading: galleryId=${galleryId}, index=${options.index}, url=${options.url}, retry=${el._retryCount}, isProjectCard=${isProjectCard}`);
      
      const img = new Image()
      img.src = options.url
      
      img.onload = () => {
        console.debug(`[LazyLoad] Loaded: galleryId=${galleryId}, index=${options.index}, url=${options.url}, isProjectCard=${isProjectCard}`);
        
        if (options.background || el.tagName !== 'IMG') {
          el.style.backgroundImage = `url(${options.url})`
        } else {
          const imageElement = el as HTMLImageElement
          imageElement.src = options.url
        }
        
        // Handle ProjectCard images immediately
        if (isProjectCard) {
          revealProjectCard();
          // Disconnect observer after successful load
          if (el._observer) {
            el._observer.disconnect()
            el._observer = undefined
          }
          return;
        }
        
        // Handle gallery images with queue system
        if (typeof options.index === 'number') {
          const queue = getGalleryQueue(galleryId);
          
          // Only add to queue if not already processed
          if (!queue.loadedImages.has(options.index)) {
            queue.loadedImages.add(options.index)
            // Remove from failed images if it was there
            queue.failedImages.delete(options.index)
            revealImages();
          }
          // Don't disconnect observer for gallery images - let it stay active
        }
      }
      
      img.onerror = () => {
        console.error(`[LazyLoad] Failed to load: galleryId=${galleryId}, index=${options.index}, url=${options.url}, retry=${el._retryCount}, isProjectCard=${isProjectCard}`)
        
        // Increment retry count
        el._retryCount = (el._retryCount || 0) + 1;
        
        // Handle ProjectCard images with retry
        if (isProjectCard) {
          if (el._retryCount < el._maxRetries) {
            console.debug(`[LazyLoad] Retrying ProjectCard: ${el._retryCount}/${el._maxRetries}`);
            setTimeout(() => {
              loadImage();
            }, 1000 * el._retryCount); // Exponential backoff
            return;
          } else {
            // Max retries reached, show error state
            el.classList.remove('image-loading')
            el.classList.add('image-loaded', 'image-error')
            revealProjectCard();
            // Emit error event for ProjectCard components
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
          const queue = getGalleryQueue(galleryId);
          
          if (el._retryCount < el._maxRetries) {
            console.debug(`[LazyLoad] Retrying gallery image: ${el._retryCount}/${el._maxRetries}`);
            setTimeout(() => {
              loadImage();
            }, 1000 * el._retryCount); // Exponential backoff
            return;
          } else {
            // Max retries reached, mark as failed but still add to queue
            el.classList.remove('image-loading')
            el.classList.add('image-loaded', 'image-error')
            queue.failedImages.add(options.index)
            queue.loadedImages.add(options.index) // Still add to loaded to unblock queue
            revealImages();
            // Don't disconnect observer - let it stay active for potential retries
          }
        }
      }
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
    
    // For ProjectCard images, use simpler intersection observer logic
    if (isProjectCard) {
      console.debug(`[LazyLoad] ProjectCard: galleryId=${options.galleryId || 'default'}, index=${options.index}, url=${options.url}`);
      if (hasIntersectionObserver) {
        const observerOptions = {
          root: null,
          rootMargin: options.rootMargin || '1000px',
          threshold: options.threshold || 0.1
        }
        el._observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            console.debug(`[LazyLoad] ProjectCard IO load: url=${options.url}`);
            loadImage()
            // Don't disconnect observer immediately - let retry mechanism handle it
          }
        }, observerOptions)
        el._observer.observe(el)
        return
      } else {
        // Fallback: load immediately if Intersection Observer is not supported
        console.debug(`[LazyLoad] ProjectCard fallback load: url=${options.url}`);
        loadImage()
        return
      }
    }
    
    // For gallery images (when index is provided), use queue system
    if (typeof options.index === 'number') {
      const galleryId = options.galleryId || 'default';
      console.debug(`[LazyLoad] Gallery queued: galleryId=${galleryId}, index=${options.index}, url=${options.url}`);
      if (hasIntersectionObserver) {
        // Use different rootMargin based on gallery size
        let rootMargin = options.rootMargin || '700px';
        if (options.isBigGallery) {
          // For big galleries, use a smaller margin since we preload fewer images
          rootMargin = '500px';
        } else {
          // For small galleries, use a larger margin to start loading earlier
          rootMargin = '1000px';
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
            // Don't disconnect observer for gallery images - keep it active for retries
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
        rootMargin: options.rootMargin || '500px',
        threshold: options.threshold || 0.1
      }
      el._observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          console.debug(`[LazyLoad] Default IO load: url=${options.url}`);
          loadImage()
          // Don't disconnect observer immediately - let retry mechanism handle it
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
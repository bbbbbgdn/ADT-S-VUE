import type { DirectiveBinding } from 'vue'

// Define interface for HTMLElement with cleanup function
interface HTMLElementWithCleanup extends HTMLElement {
  _cleanup?: () => void;
  _observer?: IntersectionObserver;
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
}

// Per-gallery loading queues
const galleryQueues: Record<string, { revealedIndex: number, loadedImages: Set<number> }> = {};

function getGalleryQueue(galleryId: string) {
  if (!galleryQueues[galleryId]) {
    galleryQueues[galleryId] = { revealedIndex: -1, loadedImages: new Set<number>() };
  }
  return galleryQueues[galleryId];
}

// Check if Intersection Observer is supported
const hasIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window

export default {
  beforeMount(el: HTMLElementWithCleanup, binding: DirectiveBinding) {
    // Reset the queue if this is the first image in a new gallery
    if (binding.value && 
        typeof binding.value === 'object' && 
        binding.value.index === 0 && 
        binding.value.resetQueue) {
      const galleryId = binding.value.galleryId || 'default';
      console.debug(`[LazyLoad] beforeMount: Reset queue for new gallery ${galleryId}`);
      galleryQueues[galleryId] = { revealedIndex: -1, loadedImages: new Set<number>() };
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
    const galleryId = options.galleryId || 'default';
    const queue = getGalleryQueue(galleryId);
    // Add loading class and set initial state
    el.classList.add('image-loading')
    el.classList.remove('image-loaded', 'image-error')
    el.style.opacity = '0'
    el.style.transition = 'opacity 0.3s ease-in-out'
    
    // Function to reveal images from left to right
    function revealImages() {
      // Fallback for single-image galleries (including ProjectCard)
      if (queue.loadedImages.has(0) && queue.revealedIndex < 0) {
        const imgEl = document.querySelector(
          `[data-gallery-id='${galleryId}'][data-index='0'].gallery-image, ` +
          `[data-gallery-id='${galleryId}'][data-index='0'].project-card-image, ` +
          `[data-gallery-id='${galleryId}'][data-index='0'].project-card-background`
        );
        if (imgEl) {
          imgEl.classList.remove('image-loading');
          imgEl.classList.add('image-loaded');
          requestAnimationFrame(() => {
            imgEl['style'].opacity = '1';
          });
        }
        queue.revealedIndex = 0;
        return;
      }
      let next = queue.revealedIndex + 1;
      while (queue.loadedImages.has(next)) {
        const imgEl = document.querySelector(`[data-gallery-id='${galleryId}'][data-index='${next}'].gallery-image`);
        if (imgEl) {
          imgEl.classList.remove('image-loading');
          imgEl.classList.add('image-loaded');
          requestAnimationFrame(() => {
            imgEl['style'].opacity = '1';
          });
        }
        queue.revealedIndex = next;
        next++;
      }
    }
    
    // Function to load the image
    function loadImage() {
      console.debug(`[LazyLoad] Start loading: galleryId=${galleryId}, index=${options.index}, url=${options.url}`);
      const img = new Image()
      img.src = options.url
      
      img.onload = () => {
        console.debug(`[LazyLoad] Loaded: galleryId=${galleryId}, index=${options.index}, url=${options.url}`);
        if (options.background || el.tagName !== 'IMG') {
          el.style.backgroundImage = `url(${options.url})`
        } else {
          const imageElement = el as HTMLImageElement
          imageElement.src = options.url
        }
        if (typeof options.index === 'number') {
          queue.loadedImages.add(options.index)
        }
        // Always call revealImages, even for single-image galleries
        revealImages();
      }
      
      img.onerror = () => {
        console.error(`[LazyLoad] Failed to load: galleryId=${galleryId}, index=${options.index}, url=${options.url}`)
        el.classList.remove('image-loading')
        el.classList.add('image-loaded', 'image-error')
        if (typeof options.index === 'number') {
          queue.loadedImages.add(options.index)
        }
        // Always call revealImages, even for single-image galleries
        revealImages();
      }
    }
    
    // If preload is true, load immediately without intersection observer
    if (options.preload) {
      console.debug(`[LazyLoad] Preload: galleryId=${galleryId}, index=${options.index}, url=${options.url}`);
      loadImage()
      return
    }
    
    // For gallery images (when index is provided), start loading as soon as observed
    if (typeof options.index === 'number') {
      console.debug(`[LazyLoad] Queued: galleryId=${galleryId}, index=${options.index}, url=${options.url}`);
      if (hasIntersectionObserver) {
        const observerOptions = {
          root: null,
          rootMargin: options.rootMargin || '700px', // Preload earlier
          threshold: options.threshold || 0.1
        }
        el._observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            console.debug(`[LazyLoad] IO load: galleryId=${galleryId}, url=${options.url}`);
            loadImage()
            // Disconnect observer after loading
            if (el._observer) {
              el._observer.disconnect()
              el._observer = undefined
            }
          }
        }, observerOptions)
        el._observer.observe(el)
        return
      } else {
        // Fallback: load immediately if Intersection Observer is not supported
        console.debug(`[LazyLoad] Fallback load: galleryId=${galleryId}, url=${options.url}`);
        loadImage()
        return
      }
    }
    
    // Use Intersection Observer for lazy loading (default behavior)
    if (hasIntersectionObserver) {
      const observerOptions = {
        root: null,
        rootMargin: options.rootMargin || '500px',
        threshold: options.threshold || 0.1
      }
      el._observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          console.debug(`[LazyLoad] IO load: galleryId=${galleryId}, url=${options.url}`);
          loadImage()
          // Disconnect observer after loading
          if (el._observer) {
            el._observer.disconnect()
            el._observer = undefined
          }
        }
      }, observerOptions)
      el._observer.observe(el)
      return
    }
    // Fallback: load immediately if Intersection Observer is not supported
    console.debug(`[LazyLoad] Fallback load: galleryId=${galleryId}, url=${options.url}`);
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